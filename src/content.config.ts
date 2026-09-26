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

export const collections = { blog };
