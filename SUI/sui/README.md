# SUI (साई): Societal Innovation Interface

Smart India Hackathon prototype for Government of Jharkhand, Problem Statement 26043 (Department of Higher & Technical Education, Smart Education theme). Static HTML, CSS and JavaScript. No build step, no framework, no server required beyond a plain file host.

## What changed in this rebuild

The visual system was rebuilt from the ground up on techniques adapted from a set of React/GSAP/Three.js component references, reimplemented natively so the site stays a zero-build static deploy:

- **Thread-stitch hero.** A canvas needle stitches a dashed thread across the homepage hero on load, drawn from scratch, grounded in सूई (needle) as the literal brand mark rather than a generic particle effect.
- **Momentum-scroll showcase.** The four stakeholder benefit cards on the homepage flick and snap with real velocity, on wheel, drag, and touch.
- **Magnetic buttons.** The two hero CTAs and the footer CTAs gently follow the cursor and spring back on leave. Used only there, not sitewide.
- **Command palette.** Ctrl/Cmd+K opens a real quick-jump search across all 25 pages, from any page.
- **Role switcher.** The sidebar's plain "switch role" link is now a proper dropdown showing all four roles with icons and the current one highlighted.
- **Cinematic footer.** A giant low-opacity साई watermark and a quiet aurora glow, dialed down from the hero's version so it reads as a closing echo, not a second spotlight.

The palette is sampled directly from the SUI logo (cream ground, ink-brown text, olive green, navy, rust, gold) and is unchanged from before. What changed is execution discipline: no eyebrow label over every heading, no meta strings joined with middle dots, no arrow appended to every button, monospace reserved for actual data. One bold moment lives in the hero; dashboard interiors stay clean and functional, appropriate for a government tool.

## What this is

Four role-specific portals sharing one live demo case (Problem ID PS-JH-10482, a pothole report in Ranchi, Jharkhand) as it moves through 12 stages: reported, government-verified, competed for by three universities, evaluated, selected, validated, industry-funded, piloted, government-reviewed, certified, deployed, and citizen-confirmed.

- `index.html`: public entry point, thread-stitch hero, role selection, momentum-scroll stakeholder showcase, cinematic footer
- `citizen/`: report a problem, track it, confirm the fix, an animated progress ring, Hindi voice agent ("SUI Sahayak")
- `government/`: verification queue, AI-assist (advisory only) review, certification ladder, statewide analytics
- `university/`: challenge marketplace, solution builder with scored evaluation, an orbital project roadmap, impact ranking with a live scoreboard chart
- `industry/`: solutions marketplace, CSR commitment flow, CSR portfolio and funding charts, project tracking
- `shared/project-impact.html`: public-facing story page, no login needed

All four portals read and write the same state (`js/data.js`, `localStorage` key `sui_state_v3`), so an action taken in one role is immediately visible in the others. The site opens pre-filled by default: PS-JH-10482 already reported, verified, evaluated, and selected, so every dashboard shows real content immediately. Funding through citizen confirmation are still open to complete live. Use "Start from a blank slate" in any sidebar to demo the full lifecycle from a real citizen submission instead.

## Running it locally

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`.

## Deploying it

Drag the whole `sui/` folder onto Netlify Drop, or push it to a GitHub repo and enable GitHub Pages, or run `vercel deploy` from inside the folder. No build command, no environment variables, no backend. Set `index.html` as the entry file.

## Demo script

1. `index.html`. Note the live status line and the thread-stitch hero.
2. Try Ctrl/Cmd+K from anywhere to jump directly to a page.
3. Enter as Citizen, `problem-detail.html`, see the full history and the progress ring on the dashboard.
4. Enter as University, `project-control.html`, click through the orbital roadmap nodes.
5. Enter as Industry, commit CSR funding on `solution-detail.html`.
6. Back to University, start the pilot and submit evidence.
7. Enter as Government, `certification.html`, approve certification, then mark as deployed.
8. Back to Citizen, `problem-detail.html`, confirm the fix. Loop closes.
9. `shared/project-impact.html` shows the whole story to any visitor, no login needed.

## Known limitation

The Hindi voice agent ("SUI Sahayak") embeds Retell AI's orb widget in an iframe on the citizen dashboard. If Retell's `X-Frame-Options` blocks iframe embedding wherever this is deployed, the widget falls back to an "open in new tab" link automatically. This was not tested against a live network connection in the build sandbox.
