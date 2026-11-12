import { defineConfig, fontProviders } from "astro/config"
import pagefind from "astro-pagefind"
import sitemap from "@astrojs/sitemap"
import { SITE_URL, BASE_PATH } from "./site.config.mjs"
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Lora",
      cssVariable: "--font-heading",
      weights: [
        400, // Body text
        600, // Interface labels and reading blocks
        900, // Titles, headings
      ],
      styles: ["normal"],
      fallbacks: ["Georgia", "serif"]
    },
    {
      provider: fontProviders.google(),
      name: "DM Sans",
      cssVariable: "--font-body",
      weights: [
        400, // Body text
        600, // Interface labels and reading blocks
        900, // Titles, headings
      ],
      styles: ["normal"],
      fallbacks: ["Arial", "sans-serif"]
    }
  ],
  integrations: [
    pagefind(),
    sitemap()
  ],
})
