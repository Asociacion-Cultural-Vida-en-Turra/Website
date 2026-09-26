# Website

Public website for Asociación Cultural y Medioambiental "Vida en Turra".

## Requirements

- Node.js `v22.12.0` or higher.

## Installation

Run the following command to install the project dependencies:

```sh
npm install
```

## Running the project

Run the following commands from the project's root folder:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Adding posts

Create a `.md` file in `src/content/blog/` using a lowercase filename with
hyphens between words, for example `village-festival.md`:

```markdown
---
title: "Village festival"
category: "Activities"
date: "2026-09-26"
description: "How we celebrated our village festival."
coverLines: ["A village", "celebrates."]
tone: "sage"
---

Write the article content here.
```

### Post metadata

Define metadata in the YAML frontmatter between the opening `---` lines.
The collection schema in `src/content.config.ts` validates these fields:

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | Yes | — | Post title. Must not be empty after trimming whitespace. |
| `category` | String | Yes | — | Category used to generate filters. Must not be empty after trimming whitespace; `Todas` is reserved for the filter that shows all posts. |
| `date` | String | Yes | — | Valid calendar date in `YYYY-MM-DD` format, written in quotes. Used for chronological sorting and the displayed date. |
| `description` | String | Yes | — | Summary displayed on the card. Must not be empty after trimming whitespace. |
| `image` | String (local image path) | No | None | Path relative to the Markdown file. Astro resolves the image for optimization. Takes priority over the text cover. |
| `imageAlt` | String | No | `""` | Alternative text describing the image. Leave empty only for decorative images. |
| `coverLines` | Array of strings | No | `[]` | Text cover content when no image is provided. Each item appears on a separate line. |
| `tone` | String: `"sage"` or `"cream"` | No | `"sage"` | Background color variant for the text cover. Has no effect when an image is provided. |

The cover can use `coverLines` and `tone`, or a local image:

```yaml
image: "../../assets/fotoIglesia.jpg"
imageAlt: "Church in Turra de Alba"
```

The image takes priority over the text cover. Describe the photo in
`imageAlt`; leave it empty only if the image is decorative.

The section loads all posts, sorts them from newest to oldest, and generates
filters from their categories. `Todas` (Spanish for "All") is reserved for the
filter that shows all posts. You do not need to modify the components or write
`dateLabel` or `href`: they are calculated automatically. The filename determines
the link, for example `/blog/village-festival/`.

Run `npm run build` to validate the content. Publishing changes to the static
site requires rebuilding and deploying it.

Individual article pages and the `/blog/` listing are still pending. For now,
this collection supplies the homepage cards.
