const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const tmpDir = path.join(process.env.TEMP, 'chrome_physical_all_' + Date.now());
  fs.mkdirSync(tmpDir, { recursive: true });

  const port = 9344;
  const proc = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${tmpDir}`,
    '--window-size=1366,768',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank'
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      const tabs = await res.json();
      const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (pageTab) {
        wsUrl = pageTab.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {}
  }

  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const p = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) p.reject(data.error);
      else p.resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  await send('Page.navigate', { url: 'file:///C:/Users/vinay/Desktop/DE/index.html' });
  await new Promise(r => setTimeout(r, 1500));

  async function clickAt(x, y) {
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: Math.round(x), y: Math.round(y), button: 'left', clickCount: 1 });
    await new Promise(r => setTimeout(r, 50));
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: Math.round(x), y: Math.round(y), button: 'left', clickCount: 1 });
    await new Promise(r => setTimeout(r, 150));
  }

  const tests = [];

  // Helper to get element center
  async function getCenter(selector) {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${selector}');
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2, visible: r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.bottom > 0 };
      })()`,
      returnByValue: true
    });
    return res.result.value;
  }

  // 1. Click SW7
  const sw7Pos = await getCenter('.rocker-btn[data-sw-index="7"]');
  if (sw7Pos && sw7Pos.visible) {
    const valBefore = (await send('Runtime.evaluate', { expression: `window.app.engine.switches[7]` })).result.value;
    await clickAt(sw7Pos.x, sw7Pos.y);
    const valAfter = (await send('Runtime.evaluate', { expression: `window.app.engine.switches[7]` })).result.value;
    tests.push({ name: 'SW7 Toggle', before: valBefore, after: valAfter, passed: valBefore !== valAfter });
  } else {
    tests.push({ name: 'SW7 Toggle', error: 'NOT_VISIBLE_OR_NOT_FOUND', pos: sw7Pos });
  }

  // 2. Click Main Power
  const pwrPos = await getCenter('#btn-master-power');
  if (pwrPos && pwrPos.visible) {
    const activeBefore = (await send('Runtime.evaluate', { expression: `document.getElementById('btn-master-power').classList.contains('active')` })).result.value;
    await clickAt(pwrPos.x, pwrPos.y);
    const activeAfter = (await send('Runtime.evaluate', { expression: `document.getElementById('btn-master-power').classList.contains('active')` })).result.value;
    tests.push({ name: 'Main Power Toggle', before: activeBefore, after: activeAfter, passed: activeBefore !== activeAfter });
  } else {
    tests.push({ name: 'Main Power Toggle', error: 'NOT_VISIBLE', pos: pwrPos });
  }

  // 3. Click Eject on Socket 1
  const ejectPos = await getCenter('.btn-eject-ic[data-socket-id="0"]');
  if (ejectPos && ejectPos.visible) {
    const hasICBefore = (await send('Runtime.evaluate', { expression: `!!window.app.engine.sockets[0].ic` })).result.value;
    await clickAt(ejectPos.x, ejectPos.y);
    const hasICAfter = (await send('Runtime.evaluate', { expression: `!!window.app.engine.sockets[0].ic` })).result.value;
    tests.push({ name: 'Eject IC Socket 0', before: hasICBefore, after: hasICAfter, passed: hasICBefore && !hasICAfter });
  } else {
    tests.push({ name: 'Eject IC Socket 0', error: 'NOT_VISIBLE', pos: ejectPos });
  }

  // 4. Click + Insert IC on Socket 1 (now empty)
  const insertPos = await getCenter('.btn-insert-ic[data-socket-id="0"]');
  if (insertPos && insertPos.visible) {
    await clickAt(insertPos.x, insertPos.y);
    const modalVisible = (await send('Runtime.evaluate', { expression: `document.getElementById('ic-picker-modal').classList.contains('visible')` })).result.value;
    tests.push({ name: 'Insert IC Modal Open', passed: modalVisible });

    // Click Close IC Picker
    const closeICPos = await getCenter('#btn-close-ic-picker');
    await clickAt(closeICPos.x, closeICPos.y);
    const modalClosed = (await send('Runtime.evaluate', { expression: `!document.getElementById('ic-picker-modal').classList.contains('visible')` })).result.value;
    tests.push({ name: 'Close IC Picker', passed: modalClosed });
  } else {
    tests.push({ name: 'Insert IC', error: 'NOT_VISIBLE', pos: insertPos });
  }

  // 5. Click Lab Guide
  const guidePos = await getCenter('#btn-open-guide');
  if (guidePos && guidePos.visible) {
    await clickAt(guidePos.x, guidePos.y);
    const guideVisible = (await send('Runtime.evaluate', { expression: `document.getElementById('lab-guide-modal').classList.contains('visible')` })).result.value;
    tests.push({ name: 'Open Lab Guide', passed: guideVisible });

    const closeGuidePos = await getCenter('#btn-close-guide');
    await clickAt(closeGuidePos.x, closeGuidePos.y);
    const guideClosed = (await send('Runtime.evaluate', { expression: `!document.getElementById('lab-guide-modal').classList.contains('visible')` })).result.value;
    tests.push({ name: 'Close Lab Guide', passed: guideClosed });
  }

  // 6. Click Lab Manual to open sidebar
  const manualPos = await getCenter('#btn-toggle-manual');
  if (manualPos && manualPos.visible) {
    await clickAt(manualPos.x, manualPos.y);
    const sidebarOpen = (await send('Runtime.evaluate', { expression: `!document.body.classList.contains('sidebar-collapsed')` })).result.value;
    tests.push({ name: 'Toggle Lab Manual Open', passed: sidebarOpen });
  }

  // 7. Click Load Reference Circuit inside sidebar
  const loadRefPos = await getCenter('#btn-load-reference');
  if (loadRefPos && loadRefPos.visible) {
    await clickAt(loadRefPos.x, loadRefPos.y);
    const wiresCount = (await send('Runtime.evaluate', { expression: `window.app.engine.wires.length` })).result.value;
    tests.push({ name: 'Load Reference Circuit', wiresCount, passed: wiresCount > 0 });
  } else {
    tests.push({ name: 'Load Reference Circuit', error: 'NOT_VISIBLE', pos: loadRefPos });
  }

  // 8. Click Verify Circuit inside sidebar
  const verifyPos = await getCenter('#btn-verify-circuit');
  if (verifyPos && verifyPos.visible) {
    await clickAt(verifyPos.x, verifyPos.y);
    const verifyModalOpen = (await send('Runtime.evaluate', { expression: `document.getElementById('verification-modal').classList.contains('visible')` })).result.value;
    tests.push({ name: 'Verify Circuit Modal Open', passed: verifyModalOpen });

    const closeVerifyPos = await getCenter('#btn-close-verification');
    await clickAt(closeVerifyPos.x, closeVerifyPos.y);
    const verifyModalClosed = (await send('Runtime.evaluate', { expression: `!document.getElementById('verification-modal').classList.contains('visible')` })).result.value;
    tests.push({ name: 'Close Verification Modal', passed: verifyModalClosed });
  } else {
    tests.push({ name: 'Verify Circuit', error: 'NOT_VISIBLE', pos: verifyPos });
  }

  // 9. Click Reset Board in top nav
  const resetPos = await getCenter('#btn-reset-board');
  if (resetPos && resetPos.visible) {
    await clickAt(resetPos.x, resetPos.y);
    const wiresAfter = (await send('Runtime.evaluate', { expression: `window.app.engine.wires.length` })).result.value;
    tests.push({ name: 'Reset Board', wiresAfter, passed: wiresAfter === 0 });
  }

  console.log('=== PHYSICAL CLICK TEST RESULTS ===');
  console.log(JSON.stringify(tests, null, 2));

  ws.close();
  proc.kill();
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch (e) {}
}

main().catch(console.error);
