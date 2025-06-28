// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },
  nitro: {
    prerender: {
      routes: ["/"],
    },
  },
  compatibilityDate: "2024-11-01",
  ssr: false,
  devtools: { enabled: true },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData: '@use "@/assets/styles/_variables.scss" as *;'  <--- Bsp
          additionalData: '@use "~/assets/styles/_mixins.scss" as mix;',
        },
      },
    },
  },
});
