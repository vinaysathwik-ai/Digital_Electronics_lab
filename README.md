# Digital Electronics Virtual Trainer Kit (Experiments 1–5 & Bonus 6)

An interactive, browser-based digital electronics laboratory replicating a physical IC trainer kit (based on SRM University AP ECE 211 / CSE 207 Digital Electronics Lab manual and IIT Guwahati Virtual Labs).

##  Features
- **Realistic Hardware Trainer Kit**: Dual +5V (Vcc) and GND distribution rails, 8 DIP rocker switches with live indicators, 8 active-high ruby LED logic monitors, and 4 dual-in-line DIP sockets supporting 14-pin and 16-pin ICs.
- **Physical Patch Cord Wiring**: Magnetic proximity snapping (40px hit tolerance), Bézier wire drape, and click-to-connect / drag-to-connect support.
- **14 Authentic ICs**: Appendix-I compliant 7408, 7432, 7404, 7400, 7402 (inverted pinout), 7486, 74266, 7410, 7411, 74153, 74139, 74138, 74148, and 7485.
- **Automated Verification Engine**: Full electrical safety enforcement (power rails, short-circuit, and floating input detection) and exhaustive truth-table vector simulation.
- **Curriculum Observation Book**: Slide-out drawer with aim, theory, circuit diagrams, pinouts, procedures, and interactive truth tables.
- **Deployment Ready**: Zero-build vanilla HTML5, CSS3, and JavaScript — works instantly as a static web service on **Render**, Vercel, Netlify, or GitHub Pages.

##  Deployment on Render
1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** > **Static Site**.
3. Connect your repository: `https://github.com/vinaysathwik-ai/Digital_Electronics_lab.git`.
4. Configure settings:
   - **Name**: `digital-electronics-lab`
   - **Branch**: `main`
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `.` (or `./`)
5. Click **Create Static Site**. Your lab kit will be live in seconds!

##  Local Testing
You can run this project locally using Python's built-in HTTP server or any static server:
```bash
# Using Python
python -m http.server 8080

# Using Node.js npx
npx serve .
```
Open `http://localhost:8080` in your web browser.

To run automated engine verification tests:
```bash
node test_engine.js
```
