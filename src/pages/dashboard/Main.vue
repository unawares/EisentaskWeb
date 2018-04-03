<template>
  <div class="dashboard" ref="dashboard">
    <div ref="main">
      <v-navigation-drawer
        class="scrollbar-hidden"
        v-if="navigationDrawer"
        fixed
        :mini-variant="miniVariant"
        v-model="drawer"
        enable-resize-watcher
        app
        light>
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
          <v-divider></v-divider>
          <v-list-tile router to="/dashboard/assigned-tasks/active" >
            <v-list-tile-action>
              <v-icon class="notranslate">assignment</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Assigned Tasks</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile router to="/dashboard/assigned-tasks/archived" >
            <v-list-tile-action>
              <v-icon class="notranslate">folder</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Archived Tasks</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <draft-assignments-list></draft-assignments-list>
        <v-divider></v-divider>
        <my-groups-list
          ref="groupsList"
          :addLoadingTag="addLoadingTag"
          :removeLoadingTag="removeLoadingTag"
          :showNotification="showNotification"
          @onClickGroupSettings="onClickGroupSettings">
        </my-groups-list>
      </v-navigation-drawer>
      <v-toolbar dark fixed app class="app-toolbar">
        <v-toolbar-side-icon
          v-if="navigationDrawer"
          @click.stop="drawer = !drawer"
          class="notranslate">
        </v-toolbar-side-icon>
        <v-spacer></v-spacer>
        <v-btn icon @click="refresh" :class="{rotating: loading}">
          <v-icon class="notranslate">cached</v-icon>
        </v-btn>
        <v-btn icon @click="logout">
          <v-icon class="notranslate">exit_to_app</v-icon>
        </v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <v-slide-y-transition mode="out-in">
            <router-view
              ref="view"
              :openSettings="openSettings"
              :closeSettings="closeSettings"
              :addLoadingTag="addLoadingTag"
              :removeLoadingTag="removeLoadingTag"
              :showNotification="showNotification">
            </router-view>
          </v-slide-y-transition>
        </v-container>
      </v-content>
    </div>
    <settings
      v-if="settings.visible"
      ref="settings"
      :section="settings.section"
      :kwargs="settings.kwargs"
      :showNotification="showNotification"
      @close="closeSettings">
    </settings>
  </div>
</template>

<script>
  import Overlayable from 'vuetify/src/mixins/overlayable'
  import MyGroupsList from '@/components/MyGroupsList'
  import DraftAssignmentsList from '@/components/DraftAssignmentsList'
  import Settings from '@/components/Settings'
  import simpleRequest from '@/utils/SimpleRequest'

  export default {
    name: 'Dashboard',
    mixins: [
      Overlayable
    ],
    props: [
      'showNotification'
    ],
    data () {
      return {
        navigationDrawer: false,
        username: 'unknown',
        loading: false,
        loadingTags: [],
        drawer: false,
        items: [
          { icon: 'info_outline', title: 'Active Tasks', to: '/dashboard/active-tasks' },
          { icon: 'done', title: 'Completed Tasks', to: '/dashboard/completed-tasks' }
        ],
        miniVariant: false,
        title: 'Eisentask',
        userEventEmitter: this.$store.getters.userEventEmitter,
        settings: {
          visible: false,
          section: undefined,
          kwargs: undefined
        },
        lastRefresh: new Date(),
        user: undefined
      }
    },
    created () {
      this.userEventEmitter.on('updated', () => {
        this.navigationDrawer = true
        let user = this.$store.getters.user
        this.username = user.username
        this.removeLoadingTag('UserLoading')
        this.user = user
        this.refresh()
      })
      setTimeout(() => {
        this.addLoadingTag('UserLoading')
        this.$store.commit('getUser')
      }, 200)
      window.test_for_tags = this.loadingTags
    },
    updated () {
      if (this.user) {
        this.$refs.dashboard.style.display = 'block'
      }
    },
    watch: {
      loadingTags (tags) {
        if (tags.length > 0) {
          this.loading = true
        } else {
          this.loading = false
        }
      },
      navigationDrawer (value) {
        setTimeout(() => {
          if (value) {
            var pageWidth = document.getElementsByTagName('body')[0].offsetWidth
            if (pageWidth > 1264) {
              this.drawer = true  // When the width is wide then open drawer
            }
          }
        }, 50)
      }
    },
    methods: {
      refresh () {
        if ((new Date()).getTime() - this.lastRefresh.getTime() > 2000) {
          this.lastRefresh = new Date()
          this.$store.commit('getUser')
          this.$refs.view.refresh()  // Must be implemented
          if (this.$refs.groupsList) {
            this.$refs.groupsList.refresh()
          }
        }
      },
      addLoadingTag (tag) {
        setTimeout(() => {
          if (this.loadingTags.indexOf(tag) === -1) {
            this.loadingTags.push(tag)
          }
        })
      },
      removeLoadingTag (tag) {
        setTimeout(() => {
          let index = this.loadingTags.indexOf(tag)
          if (index !== -1) {
            this.loadingTags.splice(index, 1)
          }
        }, 700)
      },
      openSettings (section, kwargs) {
        this.settings.section = section
        this.settings.kwargs = kwargs
        this.hideScroll()
        this.settings.visible = true
        setTimeout(() => {
          if (this.$refs.settings) {
            this.$refs.settings.$el.classList.add('visible')
          }
          setTimeout(() => {
            this.$refs.main.style.visibility = 'hidden'
          }, 200)
        }, 200)
      },
      closeSettings () {
        this.$refs.main.style.visibility = 'visible'
        setTimeout(() => {
          this.showScroll()
          if (this.$refs.settings) {
            this.$refs.settings.$el.classList.remove('visible')
          }
          setTimeout(() => {
            this.settings.visible = false
            this.settings.kwargs = undefined
            this.settings.section = undefined
          }, 500)
        }, 200)
      },
      onClickGroupSettings (section, kwargs) {
        this.openSettings(section, kwargs)
      },
      logout () {
        simpleRequest('/api/auth/logout/').method('post').then(() => {
          this.showNotification('showWarningWithText', 'You have logged out')
          this.$router.replace({ name: 'Authentication', params: { action: 'signin' } })
        })
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (this.settings.visible) {
        this.closeSettings()
        next(false)
      } else {
        this.$refs.dashboard.style.display = 'block'
        next()
      }
    },
    components: {
      MyGroupsList,
      DraftAssignmentsList,
      Settings
    }
  }
</script>

<style lang="stylus" scoped>
  $toolbar-color := #455A64

  .app-toolbar
    background-color: $toolbar-color !important

  .dashboard
    position: relative
    display: none
</style>

<style scoped>
  @-webkit-keyframes rotating /* Safari and Chrome */ {
    from {
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(-360deg);
      -o-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }

  @keyframes rotating {
    from {
      -ms-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -webkit-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -ms-transform: rotate(-360deg);
      -moz-transform: rotate(-360deg);
      -webkit-transform: rotate(-360deg);
      -o-transform: rotate(-360deg);
      transform: rotate(-360deg);
    }
  }

  .rotating {
    -webkit-animation: rotating 700ms linear infinite;
    -moz-animation: rotating 700ms linear infinite;
    -ms-animation: rotating 700ms linear infinite;
    -o-animation: rotating 700ms linear infinite;
    animation: rotating 700ms linear infinite;
  }
</style>
