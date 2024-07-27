# Takaneko

This template leverages [Remix SPA Mode](https://remix.run/docs/en/main/guides/spa-mode) to build your app as a Single-Page Application using [Client Data](https://remix.run/docs/en/main/guides/client-data) for all of your data loads and mutations.

## Technologies

- [Remix SPA Mode](https://remix.run/docs/en/main/guides/spa-mode)
- [Tailwind CSS](https://tailwindcss.com/)
- GitHub Pages

## Development

You can develop your SPA app just like you would a normal Remix app, via:

```shellscript
pnpm dev
```

## Production

When you are ready to build a production version of your app, `npm run build` will generate your assets and an `index.html` for the SPA.

```shellscript
pnpm build
```

### Preview

You can preview the build locally with [vite preview](https://vitejs.dev/guide/cli#vite-preview) to serve all routes via the single `index.html` file:

```shellscript
pnpm preview
```

> [!IMPORTANT]
>
> `vite preview` is not designed for use as a production server
