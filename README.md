# harshakatkam.dev

Personal portfolio for Harshavardhan Katkam — Senior Backend Engineer.

A zero-build, dependency-free static site: plain HTML, CSS, and vanilla JavaScript.
The design is **warm editorial** — an expressive Fraunces display face over a warm
ivory/ink palette, a first-person voice, generous whitespace, and subtle motion.
No analytics, no third-party scripts, no remote assets. Everything (including the
one webfont) is served from this folder.

It is fully readable and navigable with JavaScript disabled. `main.js` is
enhancement-only (theme toggle, scroll-reveal animations, active-nav highlight).
The scroll-reveal hide state is gated on a `reveal-on` class that `main.js` adds
itself, so if the script is removed, blocked, or fails to run, blocks are never
hidden and all content stays visible.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The entire single-page site (content lives here). |
| `styles.css` | Design system: `@font-face`, tokens, layout, motion, light + dark themes. |
| `main.js` | Progressive enhancement only. If it is removed or fails to load, content stays visible (the reveal hide state is gated on a class only this script sets). |
| `favicon.svg` | Theme-aware, warm "HK" serif monogram. |
| `404.html` | On-brand not-found page. |
| `fonts/` | Self-hosted Fraunces (`fraunces.woff2`, `fraunces-italic.woff2`). |
| `CNAME` | Custom apex domain for GitHub Pages (`harshakatkam.dev`). |
| `.nojekyll` | Disables Jekyll processing on GitHub Pages. |
| `robots.txt` | Allows all crawlers; points to the sitemap. |
| `sitemap.xml` | Single-URL sitemap for the home page. |
| `og-image.png` | 1200x630 social share image. |

## Preview locally

No build step. Serve the folder over HTTP so relative paths, the SVG favicon, and
the self-hosted font resolve:

```
cd harshakatkam.dev
python3 -m http.server 8000
```

Then open http://localhost:8000/ . Opening `index.html` directly via `file://` also
works, but a local server matches production more closely (and the font loads cleanly).

## Design & tech notes

- **Palette.** Warm ivory background (`#FBF6EE`), near-black ink text (`#241C15`),
  a muted brown for secondary text, hairline `#E4DBCC`, and a single deep ink-blue
  accent (`#2A4B9B`) used sparingly for links and small marks. The dark theme is a
  warm near-black. All text pairs meet WCAG AA in both themes.
- **Type.** Display face is **Fraunces** (self-hosted, see below); body is the
  visitor's system sans-serif; a system monospace is used only for tiny meta such
  as dates. All the personality is carried by the Fraunces headings and the one
  italic flourish in the hero.
- **Themes.** Default follows `prefers-color-scheme`. A toggle in the top bar
  persists a choice in `localStorage`; a tiny inline script in `<head>` applies the
  stored theme before first paint so there is no flash of the wrong theme.
- **Motion.** All animation is gated behind a `.motion` class that the inline head
  script adds only when `prefers-reduced-motion` is *not* set. There is also a hard
  reduced-motion kill-switch in the CSS.
- **No comments** in any `.html` / `.css` / `.js` file by design — semantic markup,
  clear class names, and ARIA carry the intent instead.

## Self-hosted font (Fraunces) — how to swap it

The display face is loaded from `./fonts/` via two `@font-face` rules at the top of
`styles.css` — a variable **upright** file and a variable **italic** file:

```css
@font-face {
  font-family: "Fraunces";
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url("./fonts/fraunces.woff2") format("woff2");
}
@font-face {
  font-family: "Fraunces";
  font-style: italic;
  font-weight: 400 600;
  font-display: swap;
  src: url("./fonts/fraunces-italic.woff2") format("woff2");
}
```

Everything display-related uses the `--display` custom property, which falls back to
a serif if the font is missing:

```css
--display: "Fraunces", Georgia, "Times New Roman", serif;
```

To swap the display face:

1. Drop a new variable `.woff2` (and its italic, if you use one) into `fonts/`.
2. Point the `src: url("./fonts/…")` at the new file(s) and update the
   `font-weight` range to match the file's real axis.
3. Rename the `font-family` in both the `@font-face` rules **and** the `--display`
   token, keeping a serif fallback last.
4. Update the `<link rel="preload" href="./fonts/…">` in `index.html`'s `<head>` so
   the primary weight still preloads.

Keep the font self-hosted — no external font CDN — so the site has zero third-party
requests.

## Updating content

All copy lives in `index.html`. Each section has a stable `id` and an
`aria-labelledby` title — search for these anchors:

- **Hero** — `<section class="hero" id="top">`: the `.hero__title` headline (the one
  `<em>` is the italic flourish), the `.hero__intro` paragraph, and the `.hero__actions`
  links.
- **About** — `<section id="about">`, the `.prose` paragraphs.
- **Work** — `<section id="work">`, the `<ol class="entries">`. Each role is one
  `<li class="entry">` (dates, role, meta line, and `.entry__notes` bullets).
- **Selected work** — `<section id="selected">`, the `<ol class="selected">` of
  `.pick` items.
- **Stack** — `<section id="stack">`, the `<dl class="stack">` groups plus the
  `.creds` block (certification + education).
- **Contact** — `<section id="contact">`, the `.contact` block.

The top-bar nav links to `#about`, `#work`, and `#contact`. If you rename or add one
of those sections, update the matching `<a class="nav__link">` too. Any element with
a `data-reveal` attribute fades in on scroll (when motion is allowed); add the
attribute to opt a new block into that.

Theme colors, spacing scale (`--sp-1` … `--sp-5`), fonts, and layout widths are CSS
custom properties on `:root` at the top of `styles.css`. Reuse the spacing scale
rather than introducing arbitrary values.

## Adding the GitHub link later

GitHub is intentionally omitted for now (no invented handle). Two spots reference the
social profiles — update both when you have the real username:

1. **Contact section** in `index.html` — add a link alongside the existing LinkedIn
   one, mirroring its markup:

   ```html
   <p class="contact__links">
     <a class="link" href="https://github.com/YOUR_USERNAME" rel="me noopener">github.com/YOUR_USERNAME</a>
   </p>
   ```

2. **JSON-LD** `sameAs` array in the `<script type="application/ld+json">` block —
   add the profile URL:

   ```json
   "sameAs": [
     "https://www.linkedin.com/in/harshavardhankatkam",
     "https://github.com/YOUR_USERNAME"
   ]
   ```

Do not invent a handle — use your real personal GitHub username.

## Deploy — GitHub Pages on the `about` subdomain

This site is served at `about.harshakatkam.dev`. The apex, `harshakatkam.dev`, belongs to the
blog on Hashnode and must stay pointed there (decided 2026-10-05).

### Git identity (keep separate from work)

Publish this from your **personal** GitHub account — never a work/company account.
Before the first commit, set a **repo-local** identity so nothing here is attributed
to a work email:

```
cd harshakatkam.dev
git init
git config user.name "Harshavardhan Katkam"
git config user.email "<your-personal-email>"
```

Verify before every commit, especially if you have a global work identity configured:

```
git config user.email
```

It must print your **personal** email — **not** any Bluecopa/company email.
Do not use work credentials, work SSH keys, or a work `gh auth` login for this repo.

### Publish

1. Create a **new public repository** on your personal GitHub account.
2. Commit and push this folder to the `main` branch (root of the repo):

   ```
   git add .
   git commit -m "Publish portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. In the repo: **Settings → Pages**.
   - **Source:** Deploy from a branch.
   - **Branch:** `main`, folder `/ (root)`. Save.
4. Under **Custom domain**, enter `about.harshakatkam.dev` and save, **before** adding the
   DNS record below. (The `CNAME` file in this repo already sets this; GitHub will confirm it.)
5. Tick **Enforce HTTPS** once the certificate is issued (may take a few minutes).

### DNS records (at your domain registrar)

One `CNAME` record for the subdomain, pointing at your GitHub Pages host:

```
CNAME   about   harshavardhan17.github.io.
```

**Do not** add GitHub's apex `A` records (`185.199.108.153` and the rest), and do not touch
`www`: both belong to the blog on Hashnode, and changing them takes the blog offline.

DNS propagation plus certificate issuance can take from a few minutes up to a day.
Once live, `https://about.harshakatkam.dev/` serves this site. The blog stays at
`https://harshakatkam.dev/`.
