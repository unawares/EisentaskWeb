<template>
  <div class="settings scrollbar" @scroll="handleScroll">
    <group-settings
      v-if="section === 'group-settings'"
      :section="section"
      :kwargs="kwargs"
      :scrollEvent="scrollEvent"
      @onClickCloseAction="onClickCloseAction">
    </group-settings>
  </div>
</template>

<script>
  import GroupSettings from '@/components/GroupSettings'

  export default {
    name: 'Settings',
    props: [
      'section',
      'kwargs'
    ],
    data () {
      return {
        scrollEvent: undefined
      }
    },
    methods: {
      onClickCloseAction () {
        this.$emit('close')
      },
      handleScroll (event) {
        this.scrollEvent = event
      }
    },
    components: {
      GroupSettings
    }
  }
</script>

<style lang="stylus" scoped>
  .settings
    transition: all ease 400ms
    z-index: 100
    position: fixed
    bottom: -100%
    left: 0
    height: 100%
    width: 100%
    background-color: white
    overflow: auto
    &.visible
      bottom: 0
</style>
