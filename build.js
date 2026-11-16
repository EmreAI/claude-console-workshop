// Combines every folder in sections/ into one page at dist/index.html.
// No dependencies: run with `node build.js`. Vercel runs this on every push.
const fs = require("fs");
const path = require("path");

const root = __dirname;
const sectionsDir = path.join(root, "sections");
const outDir = path.join(root, "dist");

const sections = fs
  .readdirSync(sectionsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");

const nav = sections
  .map((name) => `<a href="#${name}">${name.replace("section-", "")}</a>`)
  .join("\n      ");

const body = sections
  .map((name) => {
    const html = read(path.join(sectionsDir, name, "section.html"));
    return `<section id="${name}" class="team-section">\n${html}\n</section>`;
  })
  .join("\n\n");

const styles = sections
  .map((name) => `/* ---- ${name} ---- */\n${read(path.join(sectionsDir, name, "style.css"))}`)
  .join("\n\n");

const template = read(path.join(root, "shared", "template.html"));
const page = template
  // Function replacements so "$" in anyone's content is kept as-is
  .replace("{{SHARED_CSS}}", () => read(path.join(root, "shared", "base.css")))
  .replace("{{SECTION_CSS}}", () => styles)
  .replace("{{NAV}}", () => nav)
  .replace("{{SECTIONS}}", () => body);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "index.html"), page);

// Copy each section's assets/ folder (images etc.) to dist/<section>/assets/
for (const name of sections) {
  const assets = path.join(sectionsDir, name, "assets");
  if (fs.existsSync(assets)) {
    fs.cpSync(assets, path.join(outDir, name, "assets"), { recursive: true });
  }
}

console.log(`Built dist/index.html from ${sections.length} sections: ${sections.join(", ")}`);
