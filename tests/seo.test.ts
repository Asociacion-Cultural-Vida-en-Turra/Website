import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://asociacion-cultural-vida-en-turra.github.io/Website/";
const POST = "blog/los-mudejares-en-turra-de-alba/";
let out = "";

const read = (path: string) => readFileSync(join(out, path), "utf8");
const jsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));

before(() => {
  // Astro moves assets with rename(), which fails across devices, so build inside the repo (node_modules is git-ignored).
  const base = join(process.cwd(), "node_modules", ".cache");
  mkdirSync(base, { recursive: true });
  out = mkdtempSync(join(base, "seo-build-"));
  execFileSync("npx", ["astro", "build", "--outDir", out], { stdio: "pipe" });
});

after(() => rmSync(out, { recursive: true, force: true }));

test("every page declares an absolute canonical URL matching its own path", () => {
  for (const path of ["", "blog/", "galeria/", "participa/", "politica-de-privacidad/", POST]) {
    assert.match(read(`${path}index.html`), new RegExp(`<link rel="canonical" href="${SITE}${path}">`));
  }
});

test("pages are indexable: no noindex robots meta anywhere", () => {
  for (const path of ["", "blog/", "galeria/", "participa/", POST]) {
    assert.doesNotMatch(read(`${path}index.html`), /name="robots"/);
  }
});

test("home page has its own title without a duplicated suffix, plus Organization JSON-LD", () => {
  const html = read("index.html");
  assert.match(html, /<title>Asociación Cultural y Medioambiental Vida en Turra<\/title>/);
  const types = jsonLd(html).map((d) => d["@type"]);
  assert.deepEqual(types, ["Organization", "WebSite"]);
});

test("blog posts expose article Open Graph data and valid BlogPosting JSON-LD", () => {
  const html = read(`${POST}index.html`);
  assert.match(html, /<meta property="og:type" content="article">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/[^"]+\.jpg">/);
  assert.match(html, /<meta property="article:published_time" content="\d{4}-\d{2}-\d{2}">/);
  const [post, breadcrumbs] = jsonLd(html);
  assert.equal(post["@type"], "BlogPosting");
  assert.equal(post.mainEntityOfPage, `${SITE}${POST}`);
  assert.equal(breadcrumbs["@type"], "BreadcrumbList");
});

test("sitemap lists every page and robots.txt points to it", () => {
  const sitemap = read("sitemap-0.xml");
  for (const path of ["", "blog/", "galeria/", "participa/", POST]) {
    assert.ok(sitemap.includes(`<loc>${SITE}${path}</loc>`), `missing ${path}`);
  }
  assert.match(read("robots.txt"), new RegExp(`Sitemap: ${SITE}sitemap-index\\.xml`));
});

test("RSS feed lists blog posts", () => {
  const rss = read("rss.xml");
  assert.ok(rss.includes(`${POST}`));
  assert.match(rss, /<language>es-es<\/language>/);
});
