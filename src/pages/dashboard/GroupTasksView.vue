<template>
  <router-view ref="view" :addLoadingTag="addLoadingTag" :removeLoadingTag="removeLoadingTag"></router-view>
</template>

<script>
export default {
  name: 'GroupTasks',
  props: [
    'addLoadingTag',
    'removeLoadingTag'
  ],
  data () {
    return {
    }
  },
  methods: {
    refresh () {
      this.$refs.view.refresh()
    }
  }
}
</script>

<style lang="stylus">
</style>
