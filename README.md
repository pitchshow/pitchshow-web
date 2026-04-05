# PitchShow — Official Website

Marketing site for [pitchshow.ai](https://pitchshow.ai) — hosted on **Cloudflare Pages**.

---

## Structure

```
pitchshow-web/
├── index.html              # Homepage (V2 nav + M3 features + bento grid + try-it-now)
├── pricing.html            # Pricing page
├── docs.html               # Documentation hub
├── blog.html               # Blog index
├── blog-*.html             # Individual blog posts
├── get-started.html        # Get Started guide
├── styles.html             # Slide Styles catalog
├── community.html          # Community page
├── enterprise.html         # Enterprise page
├── support.html            # Support page
├── privacy.html            # Privacy policy
├── style.css               # Main design system (~1000 lines)
├── page.css                # Secondary pages shared styles
├── app.js                  # Shared JS (FAQ accordion, nav scroll, etc.)
├── page.js                 # Secondary pages JS
├── vendor/                 # Third-party: GSAP, Lucide
├── logos/                  # Exported brand assets (SVG)
├── __preview__/            # Internal design previews (not linked from nav)
│   └── pitchshow-logo-v4.html   # Mascot & logo design reference
└── _archive/               # Old design iterations (not deployed logic)
```

---

## Deploy

```bash
# From pitchshow/ repo root
npx wrangler pages deploy pitchshow-web --project-name pitchshow
```

Cloudflare Pages project: **pitchshow** → `pitchshow.ai`

---

## Design System

**Colors** (CSS variables in `style.css`):
- `--p400 / --p300` — violet accent (`#a78bfa` / `#c4b5fd`)
- `--bg / --bg2 / --bg3` — layered dark backgrounds
- `--tx / --tx2 / --tx3` — text hierarchy
- `--bd / --bd2` — border intensities

**Fonts**: Space Grotesk (headings) + JetBrains Mono (code/data)

**Mascot**: Peach character v4 — see `__preview__/pitchshow-logo-v4.html` for full expression set and brand guidelines.

---

## Key Pages

| Page | Purpose |
|---|---|
| `index.html` | Main homepage with V2 floating nav, M3 dual-column features, bento why-grid, and try-it-now CTA |
| `pricing.html` | Free / Pro $12/mo / Team $49/mo + Enterprise CTA |
| `get-started.html` | Desktop BYOK setup guide + MCP integration |
| `styles.html` | 9 visual style catalog (Tech Sci-fi, Business Corp, Minimal...) |
| `blog-vibe-mode.html` | "Vibe Mode: Click Anything, Change Everything" |
| `blog-presentations-are-theater.html` | "Presentations Are Theater" |
| `blog-open-source.html` | Open source announcement |

---

## Mobile

Fully responsive. Key breakpoints: `960px` (tablet), `768px` (hamburger nav), `480px` (single column).
Mobile nav: hamburger button → slide-down overlay with all links.

---

## Adding Content

**New blog post**: copy any `blog-*.html`, update title/content, add link to `blog.html`.

**New preview**: drop HTML into `__preview__/` — accessible at `pitchshow.ai/__preview__/filename.html`, not linked from nav.
