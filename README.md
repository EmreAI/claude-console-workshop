# Claude Console Workshop

One website, seven sections, one owner per section. Every push to `main` goes live on Vercel automatically.

## Who owns what

| Section | Owner |
|---|---|
| section-1 | |
| section-2 | |
| section-3 | |
| section-4 | |
| section-5 | |
| section-6 | |
| section-7 | |

Write your name next to your section in this table.

## The one rule

**Only edit files inside your own folder** (`sections/section-N/`). That way nobody overwrites anyone else's work and there are no merge conflicts.

```
sections/section-N/
  section.html   ← your content (just the inside of your section, no <html> or <body>)
  style.css      ← your styles; start every rule with #section-N
  assets/        ← your images (create this folder if you need it)
```

To show an image from `assets/`, use `<img src="section-N/assets/photo.jpg">`.

`shared/` (page header, footer, base styles) belongs to everyone, so agree as a team before changing it.

## Getting started (once)

```bash
git clone https://github.com/eliaheinzer/claude-console-workshop.git
cd claude-console-workshop
```

## Your workflow

1. Get the latest version: `git pull`
2. Make a branch: `git checkout -b section-N-my-change`
3. Edit your files, then preview locally: `npm run dev` and open http://localhost:3000
4. Save and push:
   ```bash
   git add sections/section-N
   git commit -m "Section N: what you changed"
   git push -u origin HEAD
   ```
5. Open a pull request on GitHub. Vercel posts a **preview link** on it so everyone can see your change before it's live.
6. Merge it, and the live site updates within a minute.

You can also do all of this in Claude Code: open the folder and say "update my section N with …, then open a PR".
