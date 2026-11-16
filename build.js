// Combines every folder in sections/ into one page at dist/index.html.
// No dependencies: run with `node build.js`. Vercel runs this on every push.
const fs = require("fs");
const path = require("path");

const REPO = "https://github.com/eliaheinzer/claude-console-workshop";
const root = __dirname;
const sectionsDir = path.join(root, "sections");
const outDir = path.join(root, "dist");

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const text = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const pad = (n) => String(n).padStart(2, "0");

const sections = fs
  .readdirSync(sectionsDir, { withFileTypes: true })
  // Folders starting with _ (like _template) are not shown
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  .map((name) => {
    const html = read(path.join(sectionsDir, name, "section.html"));
    const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const owner = html.match(/Owner:\s*([^.<\n]+)/i);
    return {
      name,
      html,
      title: h2 ? text(h2[1]) : name,
      owner: owner ? text(owner[1]) : "",
      css: read(path.join(sectionsDir, name, "style.css")),
    };
  })
  // Skip anything still holding the template's starter text
  .filter((s) => s.html.trim() && !/Your section title|\(your name\)/i.test(s.html));

const claimed = sections;
const addUrl = `${REPO}/tree/main/sections/_template`;

const index =
  sections
    .map(
      (s, i) => `<li class="index-row" style="--i:${i}">
          <span class="index-num">${pad(i + 1)}</span>
          <a class="index-title" href="#${s.name}">${esc(s.title)}</a>
          <span class="index-owner">${esc(s.owner)}</span>
        </li>`
    )
    .join("\n") +
  `\n<li class="index-row is-add" style="--i:${sections.length}">
          <span class="index-num">${pad(sections.length + 1)}</span>
          <a class="index-title" href="${addUrl}">Add your section</a>
          <span class="index-owner">Copy the template folder on GitHub</span>
        </li>`;

const body = sections
  .map(
    (s, i) => `<section id="${s.name}" class="team-section">
  <aside class="rail" aria-hidden="true">
    <span class="rail-num">${pad(i + 1)}</span>
    <span class="rail-owner">${esc(s.owner)}</span>
  </aside>
  <div class="section-body">
${s.html}
  </div>
</section>`
  )
  .join("\n\n");

const styles = sections.map((s) => `/* ---- ${s.name} ---- */\n${s.css}`).join("\n\n");

const template = read(path.join(root, "shared", "template.html"));
// Function replacements so "$" in anyone's content is kept as-is
const page = template
  .replace("{{SHARED_CSS}}", () => read(path.join(root, "shared", "base.css")))
  .replace("{{SECTION_CSS}}", () => styles)
  .replace("{{INDEX}}", () => index)
  .replace("{{SECTIONS}}", () => body)
  .replace(/{{REPO}}/g, () => REPO)
  .replace(/{{CLAIMED}}/g, () => String(claimed.length))
  .replace(/{{TOTAL}}/g, () => String(sections.length));

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "index.html"), page);

// Copy each section's assets/ folder (images etc.) to dist/<section>/assets/
for (const s of sections) {
  const assets = path.join(sectionsDir, s.name, "assets");
  if (fs.existsSync(assets)) {
    fs.cpSync(assets, path.join(outDir, s.name, "assets"), { recursive: true });
  }
}

console.log(
  `Built dist/index.html: ${claimed.length} of ${sections.length} sections claimed (${claimed
    .map((s) => s.name)
    .join(", ") || "none"})`
);
