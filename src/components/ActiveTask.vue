<template>
  <v-card
    class="task"
    :hover="isHoverable && isStaff && isMouseOverWrapper"
    ref="task"
    @click.native="() => { if (actions.indexOf('edit') !== -1) { onEditClick() } }"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave">
    <v-card-text class="task-text">
      <slot name="text"></slot>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="isStaff && actions.indexOf('delete') !== -1" flat icon :color="color" @click.stop="onDeleteClick">
        <v-icon class="notranslate">delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="actions.indexOf('complete') !== -1" flat icon :color="color" @click.stop="onDoneClick">
        <v-icon class="notranslate">done</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'ActiveTask',
    data () {
      return {
        isHoverable: true,
        isMouseOverWrapper: false
      }
    },
    props: {
      task: Object,
      color: String,
      isDragging: Boolean,
      isStaff: Boolean,
      isMouseOver: Boolean,
      actions: {
        type: Array,
        default: () => {
          return ['complete', 'edit', 'delete']
        }
      }
    },
    mounted () {
      this.isMouseOverWrapper = this.isMouseOver
    },
    watch: {
      isDragging (value) {
        if (!this.$el.classList.contains('sortable-ghost')) {
          if (value) {
            this.isHoverable = false
          } else {
            this.isHoverable = true
          }
        }
      },
      isMouseOver () {
        if (!this.isMouseOver) {
          setTimeout(() => {
            if (!this.isMouseOver) {
              this.isMouseOverWrapper = false
            } else {
              this.isMouseOverWrapper = true
            }
          }, 200)
        } else {
          this.isMouseOverWrapper = true
        }
      }
    },
    methods: {
      onEditClick () {
        this.$emit('onEditClick', this.task)
      },
      onDoneClick () {
        this.$emit('onDoneClick', this.task)
      },
      onDeleteClick () {
        this.$emit('onDeleteClick', this.task)
      },
      mouseEnter () {
        this.$emit('onMouseEnter', this.task)
      },
      mouseLeave () {
        this.$emit('onMouseLeave', this.task)
      }
    }
  }
</script>

<style lang="stylus">
.task
  margin-top: 10px
  margin-bottom: 10px
  max-height: 9999px

  .task-text
    overflow: hidden
    text-overflow: ellipsis
    white-space: pre-line

  &.sortable-ghost
    height: 0
    opacity: 0.3
    box-shadow 0 0 0

    *
      visibility: hidden !important
</style>
