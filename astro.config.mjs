// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
//
// Mixed rendering:
//   - Pages stay prerendered (static HTML) by default.
//   - Routes that opt in with `export const prerender = false`
//     (e.g. `src/pages/api/partner-inquiry.ts`) run as Vercel
//     serverless functions. The Vercel adapter is what makes those
//     on-demand routes possible while leaving static pages on the CDN.
export default defineConfig({
  site: 'https://holterservice.eu',
  trailingSlash: 'never',
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  devToolbar: {
    enabled: false,
  },
});
