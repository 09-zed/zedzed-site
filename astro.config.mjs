import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zed-zed.com',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'always' },
});
