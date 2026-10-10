# Gallery

Each album is defined in a JSON file inside `src/content/gallery/`.
Use lowercase filenames without spaces or accents, with words separated by hyphens:
`rincones-del-pueblo.json` will have the identifier `rincones-del-pueblo`.
Albums appear on `/Website/galeria/`, each with a single preview image.
Clicking an album opens its photos on the same page, in the order
defined by `photos`.

## Example

A json file example is shown bellow:

```json
{
  "title": "Corners of the village",
  "description": "A collection of photographs of Turra de Alba.",
  "cover": "../../assets/fotoIglesia.jpg",
  "coverAlt": "View of the church in Turra de Alba",
  "photos": [
    {
      "image": "../../assets/fotoIglesia.jpg",
      "alt": "View of the church in Turra de Alba",
      "caption": "The village church."
    }
  ]
}
```

Add it to src/content/gallery to add a new collection.

## Fields

| Field | Requirement |
| --- | --- |
| `title` | Required, non-empty title. |
| `description` | Required, non-empty description. |
| `cover` | Path to an existing local image for the cover. |
| `coverAlt` | Required, non-empty accessible description of the cover. |
| `photos` | Required list of photos, in the order they will appear in the gallery; can be `[]` for an empty album. |
| `photos[].image` | Path to an existing local image. |
| `photos[].alt` | Required, non-empty accessible description of the photo. |
| `photos[].caption` | Optional photo caption. |

Image paths are relative to the JSON file. Store photos
in `src/assets/`, for example in `src/assets/gallery/rincones-del-pueblo/`,
and reference each file from the JSON using
`../../assets/gallery/rincones-del-pueblo/nombre.jpg`.
