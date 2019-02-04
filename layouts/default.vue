<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
      :width="200"
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      clipped-left
      fixed
      app
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-toolbar>


    <v-content>
      <div class="page-wrapper">
        <v-container fluid>
          <nuxt />
        </v-container>
      </div>
    </v-content>

    <v-footer
      height="auto"
      class="grey"
      inset
      style="border-top: 1px solid #ddd!important"
      app
    >
      <v-card
        flat
        tile
        class="flex"
      >
        <v-card-title>
          <div>
            <span class="caption">
              <span>&copy; 2019</span>
            </span>
          </div>
          <v-spacer />
        </v-card-title>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
    data() {
        return {
            title: 'CMS',
            drawer: true,
            fixed: false,
            items: [
                {
                    icon: 'apps',
                    title: 'Products',
                    to: '/'
                },
                {
                    icon: 'layers',
                    title: 'Catalog Group',
                    to: '/group'
                },
                {
                    icon: 'folder',
                    title: 'Catalogs',
                    to: '/catalog'
                },
                {
                    icon: 'category',
                    title: 'Categories',
                    to: '/category'
                }
            ]
        };
    }
};
</script>
