<template>
  <v-app light id="app">
    <v-navigation-drawer
      fixed
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          exact
        >
          <v-list-tile-action>
            <v-icon light v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app :clipped-left="clipped" class="app-toolbar">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" dark></v-toolbar-side-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        clipped: false,
        drawer: true,
        items: [
          { icon: 'web', title: 'HEADPAGE' },
          { icon: 'info_outline', title: 'Active Tasks' },
          { icon: 'done', title: 'Completed Tasks' }
        ],
        miniVariant: false,
        title: 'Eisentask'
      }
    },
    mounted: function () {
      document.body.style.overflow = 'auto' // To fix bug within safari
    }
  }
</script>

<style lang="stylus">
  @require '../node_modules/vuetify/src/stylus/main.styl'
  @require '../node_modules/vuetify/src/stylus/settings/_colors.styl'

  $background-color := #263238
  $toolbar-color := #455A64

  #app
    background-color: inherit

  .app-toolbar
    background-color: $toolbar-color !important

  body
    background-color: $background-color
</style>
