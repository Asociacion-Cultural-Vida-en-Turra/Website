import { defineConfig, fontProviders } from "astro/config"

export default defineConfig({
  site: "https://asociacion-cultural-vida-en-turra.github.io",
  base: "/Website",
  trailingSlash: "always",
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
  ]
})
