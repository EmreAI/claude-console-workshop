# FRANK × Nova SBE challenge: team site

One page, one section per team member. Every merged pull request goes live at **https://claude-console-workshop.vercel.app**.

The page builds its top index automatically from each section's `<h2>` and its `Owner: Name.` line, so you never edit the index yourself.

## The one rule

**Only edit files inside your own folder** (`sections/<your-folder>/`). That way nobody overwrites anyone else's work and there are no merge conflicts.

```
sections/<your-folder>/
  section.html   ← your content (just the inside of your section, no <html> or <body>)
  style.css      ← your styles; start every rule with #<your-folder>
  assets/        ← your images or demo files (create this folder if you need it)
```

To show a file from `assets/`, use `src="<your-folder>/assets/photo.jpg"`. Sections appear in folder-name order. `sections/section-8` (Emre) is a full example with an embedded demo.

`shared/` (hero, footer, base styles) and `build.js` belong to everyone, so agree as a team before changing them.

## Add your section in the browser (nothing to install)

You only need a free GitHub account.

1. Open `sections/_template/section.html` on GitHub and copy its contents.
2. Go to the `sections` folder, click **Add file → Create new file**, and type `your-name/section.html` as the name. GitHub offers to **fork** the repo (make your own copy). Say yes.
3. Paste, set your title and `Owner: Your Name.`, add your content, then click **Propose changes**.
4. Click **Create pull request**. Elia reviews and merges it, and it's live within a minute.

To add images, open your folder in your fork and click **Add file → Upload files**.

## Or on your laptop (git or Claude Code)

```bash
gh repo fork eliaheinzer/claude-console-workshop --clone
cd claude-console-workshop
cp -r sections/_template sections/your-name
npm run dev   # preview at http://localhost:3000
```

Then push and open a pull request:

```bash
git checkout -b your-name-section
git add sections/your-name
git commit -m "Add your-name's section"
git push -u origin HEAD
gh pr create --fill
```

Before your next change, sync your fork: `gh repo sync` and then `git pull`.

With Claude Code, you can also open the folder and say "add my section about … and open a PR".
