# Authors

Create a `.json` file in `src/content/authors/` for each author. Use a lowercase filename with hyphens between words; the filename without `.json` is the ID referenced by blog posts.

## Example

```json
{
  "name": "María García",
  "bio": "Vecina de Turra de Alba.",
  "image": "../../assets/authors/maria-garcia.jpg",
  "imageAlt": "Retrato de María García"
}
```

## Fields

| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | String | Yes | — | Author's display name. Must not be empty after trimming whitespace. |
| `bio` | String | No | None | Short author biography. |
| `image` | String (local image path) | No | None | Path relative to the JSON file. Astro resolves the image for optimization. |
| `imageAlt` | String | No | `""` | Alternative text describing the author's image. Leave empty only when the image is decorative. |

## Referencing an author

Set the `author` field in a blog post's frontmatter to the profile ID:

```yaml
author: "maria-garcia"
```

The field is optional, so articles can remain without an author. Astro validates that each referenced ID exists in this collection.
