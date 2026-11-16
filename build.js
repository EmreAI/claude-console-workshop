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

const addUrl = `${REPO}/tree/main/sections/_template`;

// Top nav: one link per team section, by its title
const nav = sections.map((s) => `<a href="#${s.name}">${esc(s.title)}</a>`).join("\n          ");

// Team list for the closing section, one row per owner
const team =
  sections
    .filter((s) => s.owner)
    .map((s) => `<li><span class="team-name">${esc(s.owner)}</span><a href="#${s.name}">${esc(s.title)}</a></li>`)
    .join("\n") +
  `\n<li class="team-add"><span class="team-name">You?</span><a href="${addUrl}">Add your part to this page</a></li>`;

// FRANK's client base from the brief: about 140 owner-led agencies, about 10 large broker groups
const dots =
  '<span class="dot"></span>'.repeat(140) + '<span class="dot is-large"></span>'.repeat(10);

const body = sections
  .map(
    (s) => `<section id="${s.name}" class="team-section">
  <div class="wrap section-body">
${s.html}
  ${s.owner ? `<p class="byline">Built by ${esc(s.owner)}</p>` : ""}
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
  .replace("{{NAV}}", () => nav)
  .replace("{{TEAM}}", () => team)
  .replace("{{DOTS}}", () => dots)
  .replace("{{SECTIONS}}", () => body)
  .replace(/{{REPO}}/g, () => REPO)
  .replace(/{{FIRST}}/g, () => (sections[0] ? sections[0].name : "team"));

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

// Each part of the product gets its own clean URL (the links for the hand-in slide)
const APPS = {
  demo: "section-8/assets/expansion-engine.html", // /demo  — the Expansion Engine
  radar: "section-9/assets/radar.html", // /radar — the FRANK Radar map
};
for (const [route, file] of Object.entries(APPS)) {
  const src = path.join(sectionsDir, file);
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.join(outDir, route), { recursive: true });
  fs.copyFileSync(src, path.join(outDir, route, "index.html"));
}

// Shared images (hero screenshot etc.)
const sharedAssets = path.join(root, "shared", "assets");
if (fs.existsSync(sharedAssets)) fs.cpSync(sharedAssets, path.join(outDir, "assets"), { recursive: true });

console.log(`Built dist/index.html with ${sections.length} team section(s): ${sections.map((s) => s.name).join(", ")}`);
