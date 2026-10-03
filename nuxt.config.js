const environment = {
  development: { api: 'http://localhost:4000/api' },
  production: { api: process.env.API_BASE_URL || 'http://localhost:4000/api' }
}

export default {
  target: 'static',
  // This app is a session-only learning tool behind localStorage-based
  // identification (no login) — there is nothing to gain from SSR/SEO, and
  // SSR here actively breaks hydration (server never sees localStorage, so
  // the server-rendered "guest" markup permanently mismatches the client's
  // real session state on first paint). Plain SPA avoids that mismatch.
  ssr: false,
  // Nuxt2's default "page" transition has no matching CSS defined anywhere in
  // this app, which leaves the outgoing page stuck in page-leave-active
  // forever (Vue never gets a transitionend to resolve it) — every route
  // change updates the URL/$route but the old page's DOM never gets swapped
  // out. Disabling it outright avoids that; a real transition can be added
  // later with matching CSS if desired.
  pageTransition: { name: 'none', css: false },

  head: {
    titleTemplate: '%s - Java Learn',
    title: 'Java Learn - เรียน Java แบบลงมือเขียนโค้ดจริง',
    htmlAttrs: {
      lang: 'th'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'เว็บเรียนภาษา Java แบบ interactive เขียนโค้ดและรันดูผลลัพธ์ได้ทันที มี 3 ระดับ ง่าย กลาง ยาก' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&family=Sarabun:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
      }
    ]
  },

  css: [
    'codemirror/lib/codemirror.css',
    '~/assets/css/main.css',
    '~/assets/css/lesson.css'
  ],

  plugins: [
    { src: '~/plugins/axios.js' },
    { src: '~/plugins/notiflix.js', mode: 'client' },
    { src: '~/plugins/hydrate-session.js', mode: 'client' }
  ],

  components: true,

  buildModules: [
    '@nuxtjs/vuetify'
  ],

  modules: [
    '@nuxtjs/axios',
    'vue-sweetalert2/nuxt'
  ],

  axios: {
    baseURL: environment[process.env.NODE_ENV] ? environment[process.env.NODE_ENV].api : environment.development.api
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        // Coffee + Java-logo palette: burnt orange (steam/cup), Java blue, espresso brown
        light: {
          primary: '#B85400',
          secondary: '#456E8C',
          accent: '#F89820',
          info: '#456E8C',
          warning: '#D98B00',
          error: '#B3261E',
          success: '#3B7D3F'
        }
      }
    }
  },

  build: {
  }
}
