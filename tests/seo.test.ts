import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

import { SITE_URL, BASE_PATH } from "../site.config.mjs";

// Single source of truth: the URL comes from the Astro config, not a copy here.
const SITE = `${SITE_URL}${BASE_PATH}/`;
let out = "";
let pages: string[] = [];
let posts: string[] = [];

const read = (path: string) => readFileSync(join(out, path), "utf8");
const jsonLd = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));

// Pages are discovered from the build output, so new pages and posts are covered without editing this file.
const discoverPages = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((e) => e.isFile() && e.name === "index.html")
    .map((e) => join(e.parentPath, e.name).slice(dir.length + 1, -"index.html".length))
    .filter((path) => !path.startsWith("pagefind/"))
    .sort();

before(() => {
  // Astro moves assets with rename(), which fails across devices, so build inside the repo (node_modules is git-ignored).
  const base = join(process.cwd(), "node_modules", ".cache");
  mkdirSync(base, { recursive: true });
  out = mkdtempSync(join(base, "seo-build-"));
  execFileSync("npx", ["astro", "build", "--outDir", out], { stdio: "pipe" });
  pages = discoverPages(out);
  posts = pages.filter((path) => /^blog\/[^/]+\/$/.test(path));
});

after(() => rmSync(out, { recursive: true, force: true }));

test("the build produces the home page, the blog index and at least one post", () => {
  assert.ok(pages.includes(""));
  assert.ok(pages.includes("blog/"));
  assert.ok(posts.length > 0);
});

test("every page declares an absolute canonical URL matching its own path", () => {
  for (const path of pages) {
    assert.match(read(`${path}index.html`), new RegExp(`<link rel="canonical" href="${SITE}${path}">`), path);
  }
});

test("pages are indexable: no noindex robots meta anywhere", () => {
  for (const path of pages) {
    assert.doesNotMatch(read(`${path}index.html`), /name="robots"/, path);
  }
});

test("every page has a title, a description and Open Graph tags", () => {
  for (const path of pages) {
    const html = read(`${path}index.html`);
    assert.match(html, /<title>[^<]+<\/title>/, path);
    assert.match(html, /<meta name="description" content="[^"]+">/, path);
    assert.match(html, /<meta property="og:title" content="[^"]+">/, path);
    assert.match(html, /<meta property="og:image" content="https:\/\/[^"]+">/, path);
  }
});

test("home page has Organization and WebSite JSON-LD", () => {
  assert.deepEqual(jsonLd(read("index.html")).map((d) => d["@type"]), ["Organization", "WebSite"]);
});

test("every blog post exposes article Open Graph data and valid BlogPosting JSON-LD", () => {
  for (const path of posts) {
    const html = read(`${path}index.html`);
    assert.match(html, /<meta property="og:type" content="article">/, path);
    assert.match(html, /<meta property="article:published_time" content="\d{4}-\d{2}-\d{2}">/, path);
    const [post, breadcrumbs] = jsonLd(html);
    assert.equal(post["@type"], "BlogPosting", path);
    assert.equal(post.mainEntityOfPage, `${SITE}${path}`, path);
    assert.equal(breadcrumbs["@type"], "BreadcrumbList", path);
  }
});

test("sitemap lists every built page and robots.txt points to it", () => {
  const sitemap = read("sitemap-0.xml");
  for (const path of pages) {
    assert.ok(sitemap.includes(`<loc>${SITE}${path}</loc>`), `missing ${path}`);
  }
  assert.match(read("robots.txt"), new RegExp(`Sitemap: ${SITE}sitemap-index\\.xml`));
});

test("RSS feed lists every blog post", () => {
  const rss = read("rss.xml");
  for (const path of posts) assert.ok(rss.includes(path), `missing ${path}`);
  assert.match(rss, /<language>es-es<\/language>/);
});
