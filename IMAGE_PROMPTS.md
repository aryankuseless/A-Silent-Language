# Background image prompts (Gemini / Nano Banana)

The animated teacher is drawn by the website and stands on the **right**, and the slide text sits on the **left**. So each background is a **Renaissance-painting scene with no people in it**, like an empty stage behind the presenter.

**How to save:** ask for **16:9**, save as `.jpg` with the exact filename, put it in the `images` folder, and refresh the page (Cmd+Shift+R). A missing image just shows the coloured gradient.

> Generate them all in **one Gemini chat** and start each new one with *"Same style as the previous image:"* so the 10 pictures match.

**Paste this at the start of every prompt:**
```
Museum-quality Italian Renaissance oil painting, rich chiaroscuro, warm varnished glaze, visible canvas texture, cinematic lighting. Wide 16:9 landscape. An empty scene with NO people or figures in it. Calm and slightly dark overall so white text and a cartoon character on top stay readable; the lower-right area is an open floor or ground. No text, no letters, no watermark.
```

| Slide | Save as | Then add |
|---|---|---|
| 1 Title | `images/s01-bg.jpg` | `A candlelit marble hall with heavy crimson velvet curtains and a distant arched window at twilight.` |
| 2 Wordless | `images/s02-bg.jpg` | `A soft cloudy sky above tall cypress trees, like the background of Michelangelo's Creation of Adam, with a faint golden glow in the centre.` |
| 3 Kinesics | `images/s03-bg.jpg` | `A warm scholar's study with tall bookshelves, a brass globe and a chalk slate on an easel, lit by a single window.` |
| 4 Paralanguage | `images/s04-bg.jpg` | `A moonlit cathedral nave with tall stained-glass windows in deep blue and teal, and faint rings of light rippling through the air.` |
| 5 Proxemics | `images/s05-bg.jpg` | `A sunlit Renaissance piazza with marble arches in deep perspective, with warm sand and olive tones.` |
| 6 Chronemics | `images/s06-bg.jpg` | `An elegant study at golden hour with a large brass hourglass and an ornate clock on a carved wooden desk.` |
| 7 Culture | `images/s07-bg.jpg` | `A cartographer's room with antique world maps on the walls and an illuminated globe, in deep green and gold candlelight.` |
| 8 Incongruence | `images/s08-bg.jpg` | `A moody empty ballroom in deep crimson, with Venetian carnival masks hanging on the walls and flickering candles.` |
| 9 Blueprint | `images/s09-bg.jpg` | `A calm dusk seascape with a pale gold and violet sky and dark teal water, with gentle waves.` |
| 10 Thank You | `images/s10-bg.jpg` | `A grand golden hall with a painted cloud ceiling, warm window light and floating dust in the light beams.` |

**If a result needs fixing, tell Gemini:**
- *"Remove all people and figures."*
- *"Make it darker and calmer."*
- *"Remove any text or letters."*
