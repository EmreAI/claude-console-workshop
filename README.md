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

**Live site:** https://claude-console-workshop.vercel.app

## Option 1: in the browser, nothing to install

You only need a free GitHub account.

1. Open your file, e.g. `sections/section-3/section.html`, on GitHub.
2. Click the ✏️ pencil icon. GitHub asks to **fork** the repo (make your own copy). Say yes.
3. Make your edits, click **Commit changes…**, then **Propose changes**.
4. Click **Create pull request**. Use a title like "Section 3: added intro".
5. Elia reviews and merges it, and it's live within a minute.

To add images, go to your section folder on GitHub (in your fork) and click **Add file → Upload files**.

## Option 2: on your laptop (with git or Claude Code)

```bash
gh repo fork eliaheinzer/claude-console-workshop --clone
cd claude-console-workshop
```

1. Make a branch: `git checkout -b section-N-my-change`
2. Edit your files, then preview locally: `npm run dev` and open http://localhost:3000
3. Push and open a pull request:
   ```bash
   git add sections/section-N
   git commit -m "Section N: what you changed"
   git push -u origin HEAD
   gh pr create --fill
   ```
4. Elia merges it, and the live site updates within a minute.

Before your next change, sync your fork: `gh repo sync` and then `git pull`.

With Claude Code, you can also just open the folder and say "update my section N with …, then open a PR".
