import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import type { APIContext } from "astro"

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )
  return rss({
    title: "Vida en Turra",
    description: "Noticias y publicaciones de la asociación y de Turra de Alba.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.date),
      link: `${import.meta.env.BASE_URL}blog/${post.id}/`,
      categories: [post.data.category],
    })),
    customData: "<language>es-es</language>",
  })
}
