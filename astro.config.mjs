import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import auth from 'auth-astro';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://signal-scout.com',
  integrations: [
    react(),
    tailwind(),
    auth(),
    sitemap()
  ],
});
