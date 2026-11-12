# Deployment

The site is configured for:

https://asociacion-cultural-vida-en-turra.github.io/Website/

`astro.config.mjs` sets `site`, `base: "/Website"` and `trailingSlash: "always"`.
Internal links use `import.meta.env.BASE_URL`, which includes the trailing slash.
Use the same pattern for new links:

```astro
<a href={import.meta.env.BASE_URL}>Home</a>
<a href={`${import.meta.env.BASE_URL}blog/`}>Blog</a>
<a href={`${import.meta.env.BASE_URL}#contacto`}>Contact</a>
```

The local development and preview URL also includes `/Website/`, for example
`http://localhost:4321/Website/`.

For a custom domain, update `site`, change `base` to `/`, and configure the domain
and DNS in GitHub Pages. Links using `BASE_URL` will adapt automatically.
See the [official Astro deployment guide](https://docs.astro.build/en/guides/deploy/github/).
