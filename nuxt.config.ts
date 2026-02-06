// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: true},
  modules: ['@nuxt/image'],
  css: ['~/assets/css/app.css', 'bootstrap/dist/css/bootstrap.min.css'],
  runtimeConfig: {
    shopifyDomain: process.env.SHOPIFY_DOMAIN,
    shopifyToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
  },
});
