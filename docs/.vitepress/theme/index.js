import DefaultTheme from "vitepress/theme"
import "element-plus/dist/index.css"
import ImagesVue from '../../components/Images.vue'

export default {
  ...DefaultTheme,
  enhanceApp: async ({ app, router, siteData, isServer }) => {
    // app is the Vue 3 app instance from `createApp()`. router is VitePress'
    // custom router. `siteData`` is a `ref`` of current site-level metadata.
    // import("element-plus").then((module) => {
    //   console.log('module是啥', module)
    //   app.use(module)
    // })
    app.component('ImagesVue', ImagesVue)
  },
}
