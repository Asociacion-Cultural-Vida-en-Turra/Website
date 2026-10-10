# Gallery

Each album is defined in a JSON file inside `src/content/gallery/`.
Use lowercase filenames without spaces or accents, with words separated by hyphens:
`rincones-del-pueblo.json` will have the identifier `rincones-del-pueblo`.
Albums appear on `/Website/galeria/`, each with a single preview image.
Clicking an album opens its photos and videos on the same page, in the order
defined by `items`.

## Example

A JSON file example is shown below:

```json
{
  "title": "Corners of the village",
  "description": "A collection of photographs of Turra de Alba.",
  "cover": "../../assets/fotoIglesia.jpg",
  "coverAlt": "View of the church in Turra de Alba",
  "items": [
    {
      "type": "image",
      "image": "../../assets/fotoIglesia.jpg",
      "alt": "View of the church in Turra de Alba",
      "caption": "The village church."
    },
    {
      "type": "video",
      "src": "videos/village-tour.mp4",
      "poster": "../../assets/fotoIglesia.jpg",
      "title": "A tour of the village",
      "caption": "Walking through Turra de Alba."
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
| `items` | Required ordered list of images and videos; can be `[]` for an empty album. |
| `items[].type` | Required: `"image"` or `"video"`. |
| `items[].image` | Required for images: path to an existing local image. |
| `items[].alt` | Required for images: non-empty alternative text. |
| `items[].src` | Required for videos: local `videos/` path or supported HTTPS URL. |
| `items[].poster` | Optional for videos: existing local image used as the poster and thumbnail. Defaults to the album cover. |
| `items[].title` | Required for videos: non-empty descriptive title. |
| `items[].caption` | Optional caption, displayed as plain text. |

Image paths are relative to the JSON file. Store photos
in `src/assets/`, for example in `src/assets/gallery/rincones-del-pueblo/`,
and reference each file from the JSON using
`../../assets/gallery/rincones-del-pueblo/nombre.jpg`.


## Videos

For local videos, place files in `public/videos/` and use paths such as
`videos/village-tour.mp4` in `src` item field.

For videos uploaded to the repository, make sure the referenced file exists in `public/videos/`. MP4, WebM and OGV formats are supported.

For hosted videos, use an HTTPS YouTube or Vimeo URL, or a direct HTTPS URL
ending in `.mp4`, `.webm` or `.ogv`. The video's provider must allow embedding.
For example, replace the example's `src` with
`https://www.youtube.com/watch?v=YOUR_VIDEO_ID`.
