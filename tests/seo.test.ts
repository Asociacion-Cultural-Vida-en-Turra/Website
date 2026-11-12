import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

import { BASE_PATH, SITE_URL } from "../site.config.mjs";

/**
 * SEO checks against a real production build.
 *
 * Nothing here lists pages by hand: they are discovered from the build output,
 * so new pages and posts are covered automatically. The public URL comes from
 * site.config.mjs, the same file astro.config.mjs uses.
 */

const SITE = `${SITE_URL}${BASE_PATH}/`;
const BLOG_POST_PATH = /^blog\/[^/]+\/$/;

let buildDir = "";
let pages: string[] = []; // e.g. "", "blog/", "blog/some-post/"
let posts: string[] = []; // the subset of pages that are blog posts

// --- helpers -----------------------------------------------------------------

const readFile = (file: string) => readFileSync(join(buildDir, file), "utf8");
const readPage = (page: string) => readFile(`${page}index.html`);

function jsonLdBlocks(html: string): Record<string, unknown>[] {
  const blocks = html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
  return [...blocks].map(([, json]) => JSON.parse(json));
}

function findPages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile() && entry.name === "index.html")
    .map((entry) => join(entry.parentPath, entry.name).slice(dir.length + 1, -"index.html".length))
    .filter((page) => !page.startsWith("pagefind/"))
    .sort();
}

function buildSite(): string {
  // Astro moves assets with rename(), which fails across devices, so the build
  // goes inside the repo (node_modules is git-ignored) instead of the OS temp dir.
  const cacheDir = join(process.cwd(), "node_modules", ".cache");
  mkdirSync(cacheDir, { recursive: true });
  const outDir = mkdtempSync(join(cacheDir, "seo-build-"));
  execFileSync("npx", ["astro", "build", "--outDir", outDir], { stdio: "pipe" });
  return outDir;
}

/** Runs `check` for every page, naming the page in any failure. */
function forEach(list: string[], check: (html: string, page: string) => void) {
  for (const page of list) {
    try {
      check(readPage(page), page);
    } catch (error) {
      throw new Error(`/${page}: ${(error as Error).message}`, { cause: error });
    }
  }
}

// --- setup -------------------------------------------------------------------

before(() => {
  buildDir = buildSite();
  pages = findPages(buildDir);
  posts = pages.filter((page) => BLOG_POST_PATH.test(page));
});

after(() => rmSync(buildDir, { recursive: true, force: true }));

// --- tests -------------------------------------------------------------------

test("the build produces the home page, the blog index and at least one post", () => {
  assert.ok(pages.includes(""), "missing home page");
  assert.ok(pages.includes("blog/"), "missing blog index");
  assert.ok(posts.length > 0, "no blog posts found");
});

describe("every page", () => {
  test("has an absolute canonical URL matching its own path", () => {
    forEach(pages, (html, page) => {
      assert.ok(html.includes(`<link rel="canonical" href="${SITE}${page}">`), "wrong or missing canonical");
    });
  });

  test("is indexable (no robots meta tag)", () => {
    forEach(pages, (html) => assert.doesNotMatch(html, /name="robots"/));
  });

  test("has a title, a description and Open Graph tags", () => {
    forEach(pages, (html) => {
      assert.match(html, /<title>[^<]+<\/title>/);
      assert.match(html, /<meta name="description" content="[^"]+">/);
      assert.match(html, /<meta property="og:title" content="[^"]+">/);
      assert.match(html, /<meta property="og:image" content="https:\/\/[^"]+">/);
    });
  });

  test("is listed in the sitemap", () => {
    const sitemap = readFile("sitemap-0.xml");
    for (const page of pages) {
      assert.ok(sitemap.includes(`<loc>${SITE}${page}</loc>`), `/${page} is missing from the sitemap`);
    }
  });
});

test("the home page describes the organization and the website in JSON-LD", () => {
  const types = jsonLdBlocks(readPage("")).map((block) => block["@type"]);
  assert.deepEqual(types, ["Organization", "WebSite"]);
});

test("the gallery page describes every album in JSON-LD", () => {
  const [collection] = jsonLdBlocks(readPage("galeria/"));
  const albums = collection.hasPart as { "@type": string; name: string; image: string }[];
  assert.equal(collection["@type"], "CollectionPage");
  assert.ok(albums.length > 0, "no albums listed");
  for (const album of albums) {
    assert.equal(album["@type"], "ImageGallery");
    assert.ok(album.name && album.image.startsWith("https://"), `incomplete album ${album.name}`);
  }
});

describe("every blog post", () => {
  test("is marked as an article with its publication date", () => {
    forEach(posts, (html) => {
      assert.match(html, /<meta property="og:type" content="article">/);
      assert.match(html, /<meta property="article:published_time" content="\d{4}-\d{2}-\d{2}">/);
    });
  });

  test("has BlogPosting and BreadcrumbList JSON-LD", () => {
    forEach(posts, (html, page) => {
      const [post, breadcrumbs] = jsonLdBlocks(html);
      assert.equal(post["@type"], "BlogPosting");
      assert.equal(post.mainEntityOfPage, `${SITE}${page}`);
      assert.equal(breadcrumbs["@type"], "BreadcrumbList");
    });
  });

  test("is listed in the RSS feed", () => {
    const rss = readFile("rss.xml");
    for (const post of posts) assert.ok(rss.includes(post), `/${post} is missing from the RSS feed`);
  });
});

test("robots.txt points to the sitemap index", () => {
  assert.ok(readFile("robots.txt").includes(`Sitemap: ${SITE}sitemap-index.xml`));
});

test("the RSS feed declares its language", () => {
  assert.ok(readFile("rss.xml").includes("<language>es-es</language>"));
});
