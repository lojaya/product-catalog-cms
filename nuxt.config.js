const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const pkg = require('./package');


module.exports = {
    mode: 'spa',

    /*
  ** Headers of the page
  */
    head: {
        title: pkg.name,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
            }
        ]
    },

    /*
  ** Customize the progress-bar color
  */
    loading: {
        color: '#42A5CC'
    },

    loadingIndicator: {
        name: 'circle',
        color: '#fa923f'
    },

    /*
  ** Global CSS
  */
    css: [
        '~/assets/style/app.styl',
        '~/assets/styles.scss'
    ],

    /*
  ** Plugins to load before mounting the App
  */
    plugins: [
        '@/plugins/vuetify',
        '@/plugins/vuefire',
        '@/plugins/vendor'
    ],

    /*
  ** Nuxt.js modules
  */
    modules: [
    // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        ['nuxt-validate', {
            lang: 'en'
        }]
    ],
    /*
  ** Axios module configuration
  */
    axios: {
    // See https://github.com/nuxt-community/axios-module#options
    },

    /*
  ** Build configuration
  */
    build: {
        transpile: ['vuetify/lib'],
        plugins: [new VuetifyLoaderPlugin()],
        loaders: {
            stylus: {
                import: ['~assets/style/variables.styl']
            }
        },

        /*
    ** You can extend webpack config here
    */
        extend(config, ctx) {

        }
    }
};
