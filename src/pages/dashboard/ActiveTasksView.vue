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
              <active-task
                class="my-handle"
                v-for="task in tasks.goals"
                :key="task.instance.id"
                :task="task"
                :color="'goals'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onDoneClick="onDoneClick"
                :isStaff="true">
                <span slot="text" class="notranslate">{{ task.text }}</span>
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
              <active-task
                class="my-handle"
                v-for="task in tasks.progress"
                :key="task.instance.id"
                :task="task"
                :color="'progress'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onDoneClick="onDoneClick"
                :isStaff="true">
                <span slot="text" class="notranslate">{{ task.text }}</span>
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
              <active-task
                class="my-handle"
                v-for="task in tasks.activities"
                :key="task.instance.id"
                :task="task"
                :color="'activities'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onDoneClick="onDoneClick"
                :isStaff="true">
                <span slot="text" class="notranslate">{{ task.text }}</span>
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
              <active-task
                class="my-handle"
                v-for="task in tasks.interruptions"
                :key="task.instance.id"
                :task="task"
                :color="'interruptions'"
                :isDragging="isDragging"
                @onDeleteClick="onDeleteClick"
                @onEditClick="onEditClick"
                @onDoneClick="onDoneClick"
                :isStaff="true">
                <span slot="text" class="notranslate">{{ task.text }}</span>
              </active-task>
            </draggable>
          </v-layout>
        </v-card>
      </v-flex>
      <task-editor
        ref="taskEditor"
        style="visibility: hidden"
        @updateTask="updateTask"
        @createTask="createTask"
        :isStaff="true">
      </task-editor>
    </v-layout>
  </v-container>
</template>

<script>
  import Draggable from 'vuedraggable'
  import TaskEditor from '@/components/TaskEditor'
  import ActiveTask from '@/components/ActiveTask'

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
        tasks: {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        },
        completedTasksNotifier: this.$store.getters.completedTasksNotifier,
        activeTasksNotifier: this.$store.getters.activeTasksNotifier,
        activeTasksActiveRequests: this.$store.getters.activeTasksActiveRequests,
        isDragging: false
      }
    },
    mounted () {
      this.refreshAndGetActiveTasks()
      setTimeout(() => {
        if (this.$refs.taskEditor) {
          this.$refs.taskEditor.$el.style.visibility = 'visible'
        }
      }, 700)
    },
    watch: {
      completedTasksNotifier: {
        handler () {
          this.refresh()
        },
        deep: true
      },

      activeTasksNotifier: {
        handler () {
          this.setActiveTasks()
        },
        deep: true
      },

      activeTasksActiveRequests: {
        handler () {
          if (this.activeTasksActiveRequests.count > 0) {
            this.addLoadingTag('TasksLoading')
          } else if (this.activeTasksNotifier.updates > 0) {
            this.removeLoadingTag('TasksLoading')
          }
        },
        deep: true
      }
    },
    components: {
      Draggable,
      ActiveTask,
      TaskEditor
    },
    methods: {
      refresh () {
        this.refreshAndGetActiveTasks()
      },

      clearTasks () {
        this.tasks = {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        }
      },

      refreshAndGetActiveTasks () {
        this.$store.commit('refreshActiveTasks')
        setTimeout(() => {
          this.$store.commit('getActiveTasks')
        })
      },

      setActiveTasks () {
        var tasks = this.$store.getters.activeTasks
        var orders = this.$store.getters.activeTasksOrders
        var tasksMap = new Map(tasks.map((task) => [task.instance.id, task]))
        this.clearTasks()
        for (let pk of orders.goals) {
          let task = tasksMap.get(pk)
          if (task) {
            this.tasks.goals.push(task)
          } else {
            this.refreshAndGetActiveTasks()
            return
          }
        }
        for (let pk of orders.progress) {
          let task = tasksMap.get(pk)
          if (task) {
            this.tasks.progress.push(tasksMap.get(pk))
          } else {
            this.refreshAndGetActiveTasks()
            return
          }
        }
        for (let pk of orders.activities) {
          let task = tasksMap.get(pk)
          if (task) {
            this.tasks.activities.push(tasksMap.get(pk))
          } else {
            this.refreshAndGetActiveTasks()
            return
          }
        }
        for (let pk of orders.interruptions) {
          let task = tasksMap.get(pk)
          if (task) {
            this.tasks.interruptions.push(tasksMap.get(pk))
          } else {
            this.refreshAndGetActiveTasks()
            return
          }
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

      onDragAdd (evt) {
        var newPriority = this.getPriorityByString(evt.to.id)
        var newIndex = evt.newIndex
        var task
        switch (newPriority) {
          case 1:
            task = this.tasks.goals[newIndex]
            break
          case 2:
            task = this.tasks.progress[newIndex]
            break
          case 3:
            task = this.tasks.activities[newIndex]
            break
          case 4:
            task = this.tasks.interruptions[newIndex]
            break
        }
        task.priority = newPriority
        task.newPosition = newIndex
        this.updatedTask(task)
        this.$store.commit('updateActiveTask', task)
      },

      onDragUpdate (evt) {
        var newPriority = this.getPriorityByString(evt.to.id)
        var newIndex = evt.newIndex
        var task
        switch (newPriority) {
          case 1:
            task = this.tasks.goals[newIndex]
            break
          case 2:
            task = this.tasks.progress[newIndex]
            break
          case 3:
            task = this.tasks.activities[newIndex]
            break
          case 4:
            task = this.tasks.interruptions[newIndex]
            break
        }
        task.priority = newPriority
        task.newPosition = newIndex
        this.updatedTask(task)
        this.$store.commit('updateActiveTask', task)
      },

      onDragStart () {
        this.isDragging = true
      },

      onDragEnd () {
        this.isDragging = false
      },

      createTask (task) {
        this.$store.commit('createActiveTask', task)
        this.createdTask(task)
      },

      updateTask (task) {
        this.$store.commit('updateActiveTask', task)
        this.updatedTask(task)
      },

      createdTask (task) {
        if (!task.completed) {
          switch (task.priority) {
            case 1:
              this.tasks.goals.unshift(task)
              break
            case 2:
              this.tasks.progress.unshift(task)
              break
            case 3:
              this.tasks.activities.unshift(task)
              break
            case 4:
              this.tasks.interruptions.unshift(task)
              break
          }
        }
      },

      updatedTask (task) {
        if (task.completed) {
          for (let priority in this.tasks) {
            let index = this.tasks[priority].findIndex((t) => {
              return task.instance.id === t.instance.id
            })
            if (index !== -1) {
              this.tasks[priority].splice(index, 1)
              break
            }
          }
        }
      },

      deletedTask (task) {
        for (let priority in this.tasks) {
          let index = this.tasks[priority].findIndex((t) => {
            return task.instance.id === t.instance.id
          })
          if (index !== -1) {
            this.tasks[priority].splice(index, 1)
            break
          }
        }
      },

      onEditClick (task) {
        this.$refs.taskEditor.openEditor()
        this.$refs.taskEditor.setTaskInstance(task)
      },

      onDeleteClick (task) {
        this.deletedTask(task)
        this.$store.commit('deleteActiveTask', task)
      },

      onDoneClick (task) {
        task.completed = true
        this.updatedTask(task)
        this.$store.commit('updateActiveTask', task)
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
      }
    }
  }
</script>

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
</style>
