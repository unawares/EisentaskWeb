<template>
  <v-app style="background-color: inherit; overflow: hidden">
    <router-view :showNotification="showNotification"></router-view>
    <notifications ref="notifications"></notifications>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import Vuetify from 'vuetify'
  import Notifications from '@/components/Notifications'

  function isFunction (functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  }

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
      }
    },
    methods: {
      showNotification (name, ...args) {
        if (name in this.$refs.notifications && isFunction(this.$refs.notifications[name])) {
          this.$refs.notifications[name](...args)
        }
      }
    },
    components: {
      Notifications
    }
  }
</script>

<style lang="stylus">
  .scrollbar
    &::-webkit-scrollbar-track
      background: rgba(0, 0, 0, 0.2)
    &::-webkit-scrollbar
    	width: 0px
    &::-webkit-scrollbar-thumb
    	background-color: #aaa
  .scrollbar-hidden
    &::-webkit-scrollbar
      display: none
</style>

<style lang="stylus">
  @require '../node_modules/vuetify/src/stylus/main.styl'
  @require '../node_modules/vuetify/src/stylus/settings/_colors.styl'

  $background-color := #263238

  #app
    background-color: inherit

  body
    overflow-y: scroll
    background-color: $background-color
</style>
