<template>
  <router-view
    ref="view"
    :addLoadingTag="addLoadingTag"
    :removeLoadingTag="removeLoadingTag"
    :scrollEvent="scrollEvent"
    :showNotification="showNotification">
  </router-view>
</template>

<script>
export default {
  name: 'GroupTasks',
  props: [
    'addLoadingTag',
    'removeLoadingTag',
    'showNotification'
  ],
  data () {
    return {
      scrollEvent: undefined
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    refresh () {
      this.$refs.view.refresh()
    },
    handleScroll (evt) {
      this.scrollEvent = evt
    }
  }
}
</script>

<style lang="stylus">
</style>
