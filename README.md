# The Silent Language

A website-style presentation on **non-verbal communication** for a Communication Skills class (8 speakers, about 15 minutes). It has animated slide transitions and an animated 2D presenter character who acts out each point.

## Run it

Open `index.html` in a browser. Nothing needs to be installed.

To publish it online with **GitHub Pages**: go to *Settings → Pages* in the repository, choose *Deploy from a branch*, then pick `main` and the `/ (root)` folder. The site appears at `https://<your-username>.github.io/<repo-name>/`.

## Presenting

| Key | Action |
|---|---|
| → / Space / scroll / clicker | Next step or next slide |
| ← | Back |
| 1–9, 0 | Jump to a slide |
| F | Fullscreen |
| M | Slide menu |

Each click first reveals the next point on a slide, and the character acts it out; then the next click moves to the next slide.

## Files

| File | What it is |
|---|---|
| `index.html` | All slides, styles, transitions and controls |
| `teacher.js` | The animated presenter character and what it does on each slide |
| `images/` | Optional background paintings (`s01-bg.jpg` … `s10-bg.jpg`) |
| `IMAGE_PROMPTS.md` | Prompts for generating those backgrounds |

Team names for the last slide are set in the `TEAM` list near the top of the script in `index.html`.

Fonts load from Google Fonts, so open the deck once with internet on the presenting laptop.
