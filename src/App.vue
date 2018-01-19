<template>
  <v-app style="background-color: inherit">
    <v-navigation-drawer
      fixed
      :mini-variant="miniVariant"
      v-model="drawer"
      enable-resize-watcher
      app
      light >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <span class="notranslate">{{ username }}</span>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
      <v-list light class="pt-0">
        <v-divider></v-divider>
        <v-list-tile
          router
          :to="item.to"
          :key="i"
          v-for="(item, i) in items" >
          <v-list-tile-action>
            <v-icon v-html="item.icon" class="notranslate"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark fixed app class="app-toolbar">
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="notranslate"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-btn icon @click="refresh">
        <v-icon class="notranslate">cached</v-icon>
      </v-btn>
      <v-btn icon href="/web/accounts/logout/">
        <v-icon class="notranslate">exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view ref="view"></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-content>
    <notifications></notifications>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import Vuetify from 'vuetify'
  import Notifications from '@/components/Notifications'

  Vue.use(Vuetify, {
    theme: {
      goals: '#F44336',
      progress: '#0C73AF',
      activities: '#FF9F1C',
      interruptions: '#616161'
    }
  })

  export default {
    data () {
      return {
        username: 'unknown',
        drawer: false,
        items: [
          { icon: 'info_outline', title: 'Active Tasks', to: '/active-tasks' },
          { icon: 'done', title: 'Completed Tasks', to: '/completed-tasks' }
        ],
        miniVariant: false,
        title: 'Eisentask',
        profileNotifier: this.$store.getters.profileNotifier
      }
    },
    mounted () {
      this.$store.commit('getUser')
      var pageWidth = document.getElementsByTagName('body')[0].offsetWidth
      if (pageWidth > 1264) {
        this.drawer = true  // When the width is wide then open drawer
      }
      document.body.style.overflow = 'auto'  // To fix bug within safari
    },
    watch: {
      profileNotifier: {
        handler () {
          let user = this.$store.getters.user
          this.username = user.username
        },
        deep: true
      }
    },
    methods: {
      refresh () {
        this.$refs.view.refresh()  // Must be implemented
      }
    },
    components: {
      Notifications
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
