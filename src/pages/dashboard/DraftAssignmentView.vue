<template>
  <v-container>
    <v-container class="actions-container">
      <div class="actions-background"></div>
      <div class="actions-view">
        <v-btn flat color="blue" @click="onSaveDraftAssignment">Make assignment</v-btn>
        <v-spacer></v-spacer>
        <v-btn flat color="amber" @click="onSettingsClick">settings</v-btn>
      </div>
    </v-container>
    <v-layout row justify-center wrap>
      <v-flex xs12 sm6 md3 lg3 xl3 class="list-of-tasks">
        <v-card light>
          <v-card color="goals" flat tile>
            <v-card-title class="text-center">
              <div class="list-header-content white-text">
                <div class="list-headline">GOALS</div>
                <span class="list-description">Important and urgent</span>
              </div>
            </v-card-title>
          </v-card>
          <v-card color="goals_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewGoalClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[1]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.goals"
              :no-transition-on-drag="true"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <active-task
                class="my-handle"
                v-for="task in tasks.goals"
                :key="keys.get(task)"
                :task="task"
                :color="'goals'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onMouseEnter="onMouseEnter"
                @onMouseLeave="onMouseLeave"
                :actions="['edit', 'delete']"
                :isMouseOver="isMouseOverInstanceId === keys.get(task)"
                :isStaff="true">
                <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
              </active-task>
            </draggable>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md3 lg3 xl3 class="list-of-tasks">
        <v-card light>
          <v-card color="progress" flat tile>
            <v-card-title class="text-center">
              <div class="list-header-content white-text">
                <div class="list-headline">PROGRESS</div>
                <span class="list-description">Important and not urgent</span>
              </div>
            </v-card-title>
          </v-card>
          <v-card color="progress_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewProgressClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[2]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.progress"
              :no-transition-on-drag="true"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <active-task
                class="my-handle"
                v-for="task in tasks.progress"
                :key="keys.get(task)"
                :task="task"
                :color="'progress'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onMouseEnter="onMouseEnter"
                @onMouseLeave="onMouseLeave"
                :actions="['edit', 'delete']"
                :isMouseOver="isMouseOverInstanceId === keys.get(task)"
                :isStaff="true">
                <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
              </active-task>
            </draggable>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md3 lg3 xl3 class="list-of-tasks">
        <v-card light>
          <v-card color="activities" flat tile>
            <v-card-title class="text-center">
              <div class="list-header-content white-text">
                <div class="list-headline">ACTIVITIES</div>
                <span class="list-description">Not important and urgent</span>
              </div>
            </v-card-title>
          </v-card>
          <v-card color="activities_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewActivityClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[3]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.activities"
              :no-transition-on-drag="true"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <active-task
                class="my-handle"
                v-for="task in tasks.activities"
                :key="keys.get(task)"
                :task="task"
                :color="'activities'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onMouseEnter="onMouseEnter"
                @onMouseLeave="onMouseLeave"
                :actions="['edit', 'delete']"
                :isMouseOver="isMouseOverInstanceId === keys.get(task)"
                :isStaff="true">
                <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
              </active-task>
            </draggable>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md3 lg3 xl3 class="list-of-tasks">
        <v-card light>
          <v-card color="interruptions" flat tile>
            <v-card-title class="text-center">
              <div class="list-header-content white-text">
                <div class="list-headline">INTERRUPTIONS</div>
                <span class="list-description">Not important and not urgent</span>
              </div>
            </v-card-title>
          </v-card>
          <v-card color="interruptions_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewInterruptionClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[4]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.interruptions"
              :no-transition-on-drag="true"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <active-task
                class="my-handle"
                v-for="task in tasks.interruptions"
                :key="keys.get(task)"
                :task="task"
                :color="'interruptions'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onMouseEnter="onMouseEnter"
                @onMouseLeave="onMouseLeave"
                :actions="['edit', 'delete']"
                :isMouseOver="isMouseOverInstanceId === keys.get(task)"
                :isStaff="true">
                <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
              </active-task>
            </draggable>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <task-editor
      ref="taskEditor"
      style="visibility: hidden"
      @updateTask="onUpdateTask"
      @createTask="onCreateTask"
      :isStaff="true">
    </task-editor>
  </v-container>
</template>

<script>
  import _ from 'underscore'
  import Draggable from 'vuedraggable'
  import TaskEditor from '@/components/TaskEditor'
  import ActiveTask from '@/components/ActiveTask'

  var getNextIndex = (function () {
    var index = 0
    return () => {
      return ++index
    }
  })()

  export default {
    props: [
      'addLoadingTag',
      'removeLoadingTag',
      'id',
      'showNotification',
      'openSettings',
      'closeSettings'
    ],
    data () {
      return {
        PRIORITIES: {
          1: 'goals',
          2: 'progress',
          3: 'activities',
          4: 'interruptions'
        },
        tasks: {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        },
        arrayOfTasks: [],
        isDragging: false,
        isMouseOverInstanceId: undefined,
        keys: new Map(),
        draftAssignment: undefined
      }
    },
    mounted () {
      this.init()
      setTimeout(() => {
        if (this.$refs.taskEditor) {
          this.$refs.taskEditor.$el.style.visibility = 'visible'
        }
      }, 700)
    },
    components: {
      Draggable,
      ActiveTask,
      TaskEditor
    },
    watch: {
      $route (to, from) {
        this.refresh()
      },
      arrayOfTasks (values) {
        this.clearTasks()
        this.keys = new Map()
        for (let task of values) {
          this.keys.set(task, getNextIndex())
          if (task.action !== 'delete') {
            switch (task.priority) {
              case 1:
                this.tasks.goals.push(task)
                break
              case 2:
                this.tasks.progress.push(task)
                break
              case 3:
                this.tasks.activities.push(task)
                break
              case 4:
                this.tasks.interruptions.push(task)
                break
            }
          }
        }
      }
    },

    beforeDestroy () {
      this.$store.getters.draftAssignmentsEventEmitter.removeListener('updated', this.draftAssignmentsListener)
      this.removeLoadingTag('DraftAssignmentLoading')
    },

    methods: {
      refresh () {
        this.init()
      },

      init () {
        this.removeLoadingTag('DraftAssignmentLoading')
        this.addLoadingTag('DraftAssignmentLoading')
        this.$store.getters.draftAssignmentsEventEmitter.removeListener('updated', this.draftAssignmentsListener)
        this.$store.commit('getProfileData')
        this.$store.getters.draftAssignmentsEventEmitter.on('updated', this.draftAssignmentsListener)
      },

      draftAssignmentsListener (draftAssignments) {
        if (!this.synchronize(draftAssignments)) {
          this.error()
        } else {
          this.removeLoadingTag('DraftAssignmentLoading')
        }
      },

      error () {
        this.$store.getters.draftAssignmentsEventEmitter.removeListener('updated', this.draftAssignmentsListener)
        var a = () => {
          this.$router.replace('/dashboard/assigned-tasks/active/', () => {}, () => {
            setTimeout(a, 100)
          })
        }
        a()
      },

      synchronize (draftAssignments) {
        var index = 0
        for (; index < draftAssignments.length && draftAssignments[index].id !== this.id; index++) {}
        if (index !== draftAssignments.length) {
          this.setDraftAssignment(draftAssignments[index])
          return true
        } else {
          return false
        }
      },

      setDraftAssignment (draftAssignment) {
        this.draftAssignment = draftAssignment
        this.arrayOfTasks = draftAssignment.tasks
      },

      clearTasks () {
        this.tasks = {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        }
      },

      getPriorityByString (priorityText) {
        switch (priorityText) {
          case this.PRIORITIES[1]:
            return 1
          case this.PRIORITIES[2]:
            return 2
          case this.PRIORITIES[3]:
            return 3
          case this.PRIORITIES[4]:
            return 4
        }
        return -1
      },

      onDragStart () {
        this.isDragging = true
      },

      onDragEnd () {
        this.isDragging = false
        this.syncTasks()
      },

      filterWithUrls (text) {
        text = text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
        var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g
        return text.replace(regex, (match, a, b) => {
          var url = match
          if (!url.match(/^[a-zA-Z]+:\/\//)) {
            url = '//' + url
          }
          return '<a target="_blank" class="task-text-link" href="' + url + '" onclick="window.linkClicked = true">' + match + '</a>'
        })
      },

      onMouseEnter (task) {
        this.isMouseOverInstanceId = this.keys.get(task)
      },

      onMouseLeave (task) {
        this.isMouseOverInstanceId = undefined
      },

      createTask (text, priority) {
        this.$store.getters.draftAssignmentsEventEmitter.once('updated', (draftAssignments) => {
          if (!this.synchronize(draftAssignments)) {
            this.error()
          }
        })
        this.$store.commit('createAssignedTask', [this.draftAssignment.id, text, priority])
      },

      updateTask (task, text, priority) {
        var index = this.arrayOfTasks.indexOf(task)
        if (index !== -1) {
          this.$store.getters.draftAssignmentsEventEmitter.once('updated', (draftAssignments) => {
            if (!this.synchronize(draftAssignments)) {
              this.error()
            }
          })
          this.$store.commit('updateAssignedTask', [this.draftAssignment.id, index, text, priority])
        } else {
          this.refresh()
        }
      },

      onCreateTask (task) {
        this.createTask(task.text, task.priority)
      },

      onUpdateTask (task) {
        this.updateTask(task.ref, task.text, task.priority)
      },

      deleteTask (task) {
        var index = this.arrayOfTasks.indexOf(task)
        if (index !== -1) {
          this.$store.getters.draftAssignmentsEventEmitter.once('updated', (draftAssignments) => {
            if (!this.synchronize(draftAssignments)) {
              this.error()
            }
          })
          this.$store.commit('deleteAssignedTask', [this.draftAssignment.id, index])
        } else {
          this.refresh()
        }
      },

      syncTasks (task) {
        var a = new Map()
        var arr = []
        for (let i = 0; i < this.tasks.goals.length; i++) {
          if (this.tasks.goals[i].priority !== 1 && this.tasks.goals[i].action !== 'create') {
            this.tasks.goals[i].action = 'update'
          }
          a.set(this.tasks.goals[i], i + 1)
          this.tasks.goals[i].priority = 1
          arr.push(this.tasks.goals[i])
        }
        for (let i = 0; i < this.tasks.progress.length; i++) {
          if (this.tasks.progress[i].priority !== 2 && this.tasks.progress[i].action !== 'create') {
            this.tasks.progress[i].action = 'update'
          }
          a.set(this.tasks.progress[i], i + 1)
          this.tasks.progress[i].priority = 2
          arr.push(this.tasks.progress[i])
        }
        for (let i = 0; i < this.tasks.activities.length; i++) {
          if (this.tasks.activities[i].priority !== 3 && this.tasks.activities[i].action !== 'create') {
            this.tasks.activities[i].action = 'update'
          }
          a.set(this.tasks.activities[i], i + 1)
          this.tasks.activities[i].priority = 3
          arr.push(this.tasks.activities[i])
        }
        for (let i = 0; i < this.tasks.interruptions.length; i++) {
          if (this.tasks.interruptions[i].priority !== 4 && this.tasks.interruptions[i].action !== 'create') {
            this.tasks.interruptions[i].action = 'update'
          }
          a.set(this.tasks.interruptions[i], i + 1)
          this.tasks.interruptions[i].priority = 4
          arr.push(this.tasks.interruptions[i])
        }
        arr = _.sortBy(arr, (v) => { return a.get(v) })
        this.$store.commit(
          'setDraftAssignedTasks',
          [this.draftAssignment.id, [...arr, ...this.arrayOfTasks.filter(v => v.action === 'delete')]])
      },

      onDeleteClick (task) {
        this.deleteTask(task)
      },

      onEditClick (task) {
        var t = JSON.parse(JSON.stringify(task))
        t.ref = task
        if (window.linkClicked) {
          window.linkClicked = false
        } else {
          this.$refs.taskEditor.openEditor()
          this.$refs.taskEditor.setTaskInstance(t)
        }
      },

      onSaveDraftAssignment () {
        if ((this.tasks.goals.length + this.tasks.progress.length + this.tasks.activities.length + this.tasks.interruptions.length) > 0) {
          var onError = () => {
            this.showNotification('error')
            this.$store.getters.draftAssignmentEventEmitter.removeListener('created', onCreate)
            this.$store.getters.draftAssignmentEventEmitter.removeListener('updated', onUpdate)
          }
          var onUpdate = () => {
            this.showNotification('showSuccessWithText', 'The assignment has been saved')
            this.$router.push('/dashboard/assigned-tasks/active/')
            this.$store.getters.draftAssignmentEventEmitter.removeListener('created', onCreate)
            this.$store.getters.draftAssignmentEventEmitter.removeListener('error', onError)
          }
          var onCreate = () => {
            onUpdate()
            this.$store.getters.draftAssignmentEventEmitter.removeListener('error', onError)
            this.$store.getters.draftAssignmentEventEmitter.removeListener('updated', onUpdate)
          }
          this.$store.getters.draftAssignmentEventEmitter.removeAllListeners('created')
          this.$store.getters.draftAssignmentEventEmitter.removeAllListeners('updated')
          this.$store.getters.draftAssignmentEventEmitter.removeAllListeners('error')
          this.$store.getters.draftAssignmentEventEmitter.once('error', onError)
          this.$store.getters.draftAssignmentEventEmitter.once('created', onCreate)
          this.$store.getters.draftAssignmentEventEmitter.once('updated', onUpdate)
          this.$store.commit('saveDraftAssigment', [this.draftAssignment.id])
        } else {
          this.showNotification('showWarningWithText', 'You have not written tasks')
        }
      },

      onNewGoalClick () {
        this.$refs.taskEditor.openEditor()
        this.$refs.taskEditor.setPriority(1)
      },

      onNewProgressClick () {
        this.$refs.taskEditor.openEditor()
        this.$refs.taskEditor.setPriority(2)
      },

      onNewActivityClick () {
        this.$refs.taskEditor.openEditor()
        this.$refs.taskEditor.setPriority(3)
      },

      onNewInterruptionClick () {
        this.$refs.taskEditor.openEditor()
        this.$refs.taskEditor.setPriority(4)
      },

      onSettingsClick () {
        var self = this
        this.openSettings('draft-assignment-settings', {
          context: this,
          assignment: this.draftAssignment,
          onUpdatedAssignment () {
            self.refresh()
          },
          onDeletedAssignment () {
            self.refresh()
          }
        })
      }
    }
    /*
    beforeRouteUpdate (to, from, next) {
      if (this.$refs.groupTaskEditor.isActive()) {
        this.$refs.groupTaskEditor.closeEditor()
        next(false)
      } else {
        next()
      }
    }
    */
  }
</script>

<style lang="stylus">
  .task-text-link
    text-decoration: none
    &:hover
      color: #F2215D
</style>


<style lang="stylus" scoped>
  vendor(prop, args)
    -webkit-{prop} args
    -moz-{prop} args
    {prop} args

  box-shadow()
    vendor('box-shadow', arguments)

  transition()
    vendor('transition', arguments)

  $goals = #F44336
  $progress = #0C73AF
  $activities = #FF9F1C
  $interruptions = #616161
  
  .list-of-tasks
    padding: 10px

    .list
      min-height: 160px
      padding: 16px
      width: 100%
      margin-bottom: 16px

      &#goals
        .sortable-ghost
          background-color: $goals

      &#progress
        .sortable-ghost
          background-color: $progress

      &#activities
        .sortable-ghost
          background-color: $activities

      &#interruptions
        .sortable-ghost
          background-color: $interruptions

    .list-header-content
      width: 100%


  .white-text
    color: white


  .list-headline
    font-size: 18px


  .list-description
    font-size: 12px


  .text-center
    text-align: center
  

  .actions-container
    position: relative
    margin-top: 20px
    margin-bottom: 20px

  .actions-background
    border-radius: 3px
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    background-color: white
    opacity: 0.1

  .actions-view
    top: 0
    bottom: 0
    left: 0
    right: 0
    display: flex
</style>
