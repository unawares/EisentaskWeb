<template>
  <v-card class="task" :hover="isHoverable && isStaff" ref="task">
    <v-card-text class="task-text" @click="onEditClick">
      <slot name="text"></slot>
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="isStaff" flat icon :color="color" @click="onDeleteClick">
        <v-icon class="notranslate">delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat icon :color="color" @click="onDoneClick">
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
        isHoverable: true
      }
    },
    props: [
      'task',
      'color',
      'isDragging',
      'isStaff'
    ],
    watch: {
      isDragging (value) {
        if (!this.$el.classList.contains('sortable-ghost')) {
          if (value) {
            this.isHoverable = false
          } else {
            this.isHoverable = true
          }
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
