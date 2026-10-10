import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    category: z.string().trim().min(1).refine((value) => value !== "Todas", {
      message: '"Todas" es una categoría reservada para el filtro de publicaciones.',
    }),
    date: z.iso.date(),
    description: z.string().trim().min(1),
    image: image().optional(),
    imageAlt: z.string().default(""),
    coverLines: z.array(z.string()).default([]),
    tone: z.enum(["sage", "cream"]).default("sage"),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: "./src/content/gallery", pattern: "*.json" }),
  schema: ({ image }) => z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    cover: image(),
    coverAlt: z.string().trim().min(1),
    items: z.array(z.discriminatedUnion("type", [
      z.object({
        type: z.literal("image"),
        image: image(),
        alt: z.string().trim().min(1),
        caption: z.string().trim().optional(),
      }),
      z.object({
        type: z.literal("video"),
        src: z.string().trim().min(1).refine((value) => {
          if (/^videos\/(?!.*(?:\.\.|[?#\\]))[^\s]+\.(mp4|webm|ogv)$/i.test(value)) return true;
          try {
            const url = new URL(value);
            return url.protocol === "https:" && (
              ["youtube.com", "www.youtube.com", "youtu.be", "vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)
              || /\.(mp4|webm|ogv)$/i.test(url.pathname)
            );
          } catch {
            return false;
          }
        }, { message: "Use a videos/ path to an MP4, WebM or OGV file, or an HTTPS video, YouTube or Vimeo URL." }),
        poster: image().optional(),
        title: z.string().trim().min(1),
        caption: z.string().trim().optional(),
      }),
    ])),
  }),
});

export const collections = { blog, gallery };
