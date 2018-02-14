<template>
  <v-card class="task" :hover="isHoverable" ref="task">
    <v-card-text class="task-text" @click="onEditClick(task)">
      <span class="notranslate">{{ task.text }}</span>
    </v-card-text>
    <v-card-actions>
      <v-btn flat icon :color="color" @click="onDeleteClick(task)">
        <v-icon class="notranslate">delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn flat icon :color="color" @click="onDoneClick(task)">
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
      'onDeleteClick',
      'onEditClick',
      'onDoneClick',
      'color',
      'isDragging'
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
    }
  }
</script>

<style lang="stylus">
.task
  margin-top: 10px
  margin-bottom: 10px
  max-height: 1000px

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
