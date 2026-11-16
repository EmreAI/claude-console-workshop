# FRANK Expansion Engine

Product site and live app: **https://claude-console-workshop.vercel.app**

| URL | What it is |
|---|---|
| `/` | Product page |
| `/demo` | The Expansion Engine app (link this on the slide) |
| `/radar` | The FRANK Radar map with the AI account manager |

## Where things live

```
shared/template.html                      product page markup
shared/base.css                           product page styles
shared/assets/                            screenshots used on the page
sections/section-8/assets/expansion-engine.html   the Expansion Engine app  → /demo
sections/section-9/assets/radar.html              the Radar app             → /radar
build.js                                  builds everything into dist/
```

Preview locally with `npm run dev` (http://localhost:3000). Vercel runs `node build.js` on every push to `main`.

## Making changes

Fork, edit, open a pull request, and it goes live once merged. Check open pull requests first, so two people don't rework the same file at once.

If you change either app, re-take the product screenshots in `shared/assets/` so the page matches.
