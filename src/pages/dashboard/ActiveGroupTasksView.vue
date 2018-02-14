<template>
  <v-container>
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
          <v-layout>
            <draggable
              :id="PRIORITIES[1]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.goals"
              :no-transition-on-drag="true"
              @add="onDragAdd"
              @update="onDragUpdate"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <transition-group class="my-handle" :name="!isDragging? 'list-tasks' : null" :css="true">
                <active-task
                  v-for="task in tasks.goals"
                  :key="task.instance.id"
                  :task="task"
                  :color="'goals'"
                  :isDragging="isDragging">
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="goals">New task</v-btn>
          </v-card-actions>
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
          <v-layout>
            <draggable
              :id="PRIORITIES[2]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.progress"
              :no-transition-on-drag="true"
              @add="onDragAdd"
              @update="onDragUpdate"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <transition-group class="my-handle" :name="!isDragging? 'list-tasks' : null" :css="true">
                <active-task
                  v-for="task in tasks.progress"
                  :key="task.instance.id"
                  :task="task"
                  :color="'progress'"
                  :isDragging="isDragging">
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="progress">New task</v-btn>
          </v-card-actions>
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
          <v-layout>
            <draggable
              :id="PRIORITIES[3]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.activities"
              :no-transition-on-drag="true"
              @add="onDragAdd"
              @update="onDragUpdate"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <transition-group class="my-handle" :name="!isDragging? 'list-tasks' : null" :css="true">
                <active-task
                  v-for="task in tasks.activities"
                  :key="task.instance.id"
                  :task="task"
                  :color="'activities'"
                  :isDragging="isDragging">
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="activities">New task</v-btn>
          </v-card-actions>
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
          <v-layout>
            <draggable
              :id="PRIORITIES[4]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150}"
              :list="tasks.interruptions"
              :no-transition-on-drag="true"
              @add="onDragAdd"
              @update="onDragUpdate"
              @start="onDragStart"
              @end="onDragEnd"
              class="list">
              <transition-group class="my-handle" :name="!isDragging? 'list-tasks' : null" :css="true">
                <active-task
                  v-for="task in tasks.interruptions"
                  :key="task.instance.id"
                  :task="task"
                  :color="'interruptions'"
                  :isDragging="isDragging">
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="interruptions">New task</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <task-editor
        ref="taskEditor"
        style="visibility: hidden">
      </task-editor>
    </v-layout>
  </v-container>
</template>

<script>
  import _ from 'underscore'
  import Draggable from 'vuedraggable'
  import TaskEditor from '@/components/TaskEditor'
  import ActiveTask from '@/components/ActiveTask'
  import simpleRequest from '@/utils/SimpleRequest'
  import Notifications from '@/components/Notifications'
  import Group from '@/models/Group'
  import ReactiveActiveGroupTasks from '@/utils/ReactiveActiveGroupTasks'

  var getGroupFromResponse = function (response) {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      isPublic: response.is_public,
      isJoiningAllowed: response.is_joining_allowed,
      image: response.image,
      created: response.created,
      updated: response.updated,
      admin: response.admin,
      memberCardId: response.memberCardId
    }
  }

  /*
  var getGroupTaskFromResponse = function (response) {
    var task = {
      id: response.id,
      text: response.text,
      priority: response.priority,
      updated: response.updated,
      created: response.created,
      order: response.order
    }
    return task
  }
  */

  export default {
    props: [
      'addLoadingTag',
      'removeLoadingTag'
    ],
    data () {
      return {
        PRIORITIES: {
          1: 'goals',
          2: 'progress',
          3: 'activities',
          4: 'interruptions'
        },
        isDragging: false,
        group: undefined,
        tasks: {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        },
        reactiveActiveTasks: {
          goals: undefined,
          progress: undefined,
          activities: undefined,
          interruptions: undefined
        },
        tasksDict: undefined,
        lastDragEnd: new Date()
      }
    },
    mounted () {
      this.getGroup(this.$router.history.current.params.id)
      window.test = ReactiveActiveGroupTasks
      setTimeout(() => {
        if (this.$refs.taskEditor) {
          this.$refs.taskEditor.$el.style.visibility = 'visible'
        }
      }, 700)
    },
    watch: {
      $route (to, from) {
        this.destroy()
        this.getGroup(this.$router.history.current.params.id)
      }
    },
    beforeDestroy () {
      this.destroy()
    },
    methods: {
      destroy () {
        if (this.reactiveActiveTasks.goals) {
          this.reactiveActiveTasks.goals.destroy()
          delete this.reactiveActiveTasks.goals
        }
        if (this.reactiveActiveTasks.progress) {
          this.reactiveActiveTasks.progress.destroy()
          delete this.reactiveActiveTasks.progress
        }
        if (this.reactiveActiveTasks.activities) {
          this.reactiveActiveTasks.activities.destroy()
          delete this.reactiveActiveTasks.activities
        }
        if (this.reactiveActiveTasks.interruptions) {
          this.reactiveActiveTasks.interruptions.destroy()
          delete this.reactiveActiveTasks.interruptions
        }
      },

      clearTasks () {
        this.tasks = {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        }
      },

      setReactiveActiveGroupTasksPriorityGoals () {
        this.reactiveActiveTasks.goals = new ReactiveActiveGroupTasks('/api/group_tasks/active/priority/1/groups/' + this.group.instance.id + '/')
        this.reactiveActiveTasks.goals.getNext()
        this.reactiveActiveTasks.goals.updater()
      },

      setReactiveActiveGroupTasksPriorityProgress () {
        this.reactiveActiveTasks.progress = new ReactiveActiveGroupTasks('/api/group_tasks/active/priority/2/groups/' + this.group.instance.id + '/')
        this.reactiveActiveTasks.progress.getNext()
        this.reactiveActiveTasks.progress.updater()
      },

      setReactiveActiveGroupTasksPriorityActivities () {
        this.reactiveActiveTasks.activities = new ReactiveActiveGroupTasks('/api/group_tasks/active/priority/3/groups/' + this.group.instance.id + '/')
        this.reactiveActiveTasks.activities.getNext()
        this.reactiveActiveTasks.activities.updater()
      },

      setReactiveActiveGroupTasksPriorityInterruptions () {
        this.reactiveActiveTasks.interruptions = new ReactiveActiveGroupTasks('/api/group_tasks/active/priority/4/groups/' + this.group.instance.id + '/')
        this.reactiveActiveTasks.interruptions.getNext()
        this.reactiveActiveTasks.interruptions.updater()
      },

      getActiveGroupTasks () {
        this.setReactiveActiveGroupTasksPriorityGoals()
        this.setReactiveActiveGroupTasksPriorityProgress()
        this.setReactiveActiveGroupTasksPriorityActivities()
        this.setReactiveActiveGroupTasksPriorityInterruptions()
        ReactiveActiveGroupTasks.setGroup(this.group)
        ReactiveActiveGroupTasks.setOnUpdated(() => {
          this.tasksDict = ReactiveActiveGroupTasks.getTasksDict()
          this.setTasks()
        })
        this.tasksDict = ReactiveActiveGroupTasks.getTasksDict()
      },

      setTasks () {
        this.clearTasks()
        var tasks = _.sortBy(_.values(this.tasksDict), t => t.order)
        for (let task of tasks) {
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
      },

      getGroup (id) {
        simpleRequest('/api/groups/list/' + id + '/').method('get').then((response) => {
          this.group = new Group()
          this.group.instance = getGroupFromResponse(response.data)
          this.getActiveGroupTasks()
        }).catch((error) => {
          Notifications.methods.error()
          console.log(error)
        })
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
      },

      onDragAdd (evt) {
        var priority = this.getPriorityByString(evt.to.parentElement.id)
        var newPosition = evt.newIndex
        var task
        var taskIdBefore
        var getTaskIdBefore = (arr, index) => {
          if (index === 0) return -1
          else {
            return arr[index - 1].instance.id
          }
        }
        switch (priority) {
          case 1:
            task = this.tasks.goals[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.goals, newPosition)
            break
          case 2:
            task = this.tasks.progress[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.progress, newPosition)
            break
          case 3:
            task = this.tasks.activities[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.activities, newPosition)
            break
          case 4:
            task = this.tasks.interruptions[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.interruptions, newPosition)
            break
        }
        var data = {}
        if (taskIdBefore !== -1) {
          data['task_id_before'] = taskIdBefore
        }
        data['new_priority'] = priority
        simpleRequest('/api/group_tasks/active/groups/48/task/orders/' + task.instance.id + '/', data).method('put').then((response) => {
          console.log(response)
        })
      },

      onDragUpdate (evt) {
        var priority = this.getPriorityByString(evt.to.parentElement.id)
        var newPosition = evt.newIndex
        var task
        var taskIdBefore
        var getTaskIdBefore = (arr, index) => {
          if (index === 0) return -1
          else {
            return arr[index - 1].instance.id
          }
        }
        switch (priority) {
          case 1:
            task = this.tasks.goals[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.goals, newPosition)
            break
          case 2:
            task = this.tasks.progress[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.progress, newPosition)
            break
          case 3:
            task = this.tasks.activities[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.activities, newPosition)
            break
          case 4:
            task = this.tasks.interruptions[newPosition]
            taskIdBefore = getTaskIdBefore(this.tasks.interruptions, newPosition)
            break
        }
        var data = {}
        if (taskIdBefore !== -1) {
          data['task_id_before'] = taskIdBefore
        }
        simpleRequest('/api/group_tasks/active/groups/48/task/orders/' + task.instance.id + '/', data).method('put').then((response) => {
          console.log(response)
        })
      },

      onDragStart () {
        this.isDragging = true
        ReactiveActiveGroupTasks.setDragging(true)
      },

      onDragEnd () {
        this.isDragging = false
        this.lastDragEnd = new Date()
        setTimeout(() => {
          if (!this.isDragging && ((new Date()).getTime() - this.lastDragEnd.getTime()) >= 500) {
            ReactiveActiveGroupTasks.setDragging(false)
          }
        }, 5000)
      }
    },
    components: {
      Draggable,
      ActiveTask,
      TaskEditor
    }
  }
</script>

<style scoped>
  .list-tasks-enter-active {
    overflow: hidden;
    transition: all 700ms ease;
  }

  .list-tasks-move {
    transition: transform 700ms;
  }

  .list-tasks-leave-active {
    overflow: hidden;
    transition: all 700ms ease;
  }

  .list-tasks-enter,
  .list-tasks-leave-to {
    transition: all 700ms ease;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }
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
      padding: 16px
      width: 100%

      > span
        display: block
        min-height: 120px

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
</style>
