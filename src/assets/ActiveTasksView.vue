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
              v-model="tasks.goals"
              :options="{group: 'tasks', scrollSensitivity: 160}"
              class="list"
              @add="onDragAdd"
              @update="onDragUpdate">
              <v-card
                v-for="task in tasks.goals"
                :key="task.instance.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="goals" @click="onDeleteClick(task)">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="goals" @click="onEditClick(task)">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="goals" @click="onDoneClick(task)">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="goals" @click="onNewGoalClick">New task</v-btn>
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
              v-model="tasks.progress"
              :options="{group: 'tasks', scrollSensitivity: 160}"
              class="list"
              @add="onDragAdd"
              @update="onDragUpdate">
              <v-card
                v-for="task in tasks.progress"
                :key="task.instance.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="progress" @click="onDeleteClick(task)">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="progress" @click="onEditClick(task)">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="progress" @click="onDoneClick(task)">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="progress" @click="onNewProgressClick">New task</v-btn>
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
            v-model="tasks.activities"
            :options="{group: 'tasks', scrollSensitivity: 160}"
            class="list"
            @add="onDragAdd"
            @update="onDragUpdate">
              <v-card
                v-for="task in tasks.activities"
                :key="task.instance.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="activities" @click="onDeleteClick(task)">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="activities" @click="onEditClick(task)">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="activities" @click="onDoneClick(task)">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="activities" @click="onNewActivityClick">New task</v-btn>
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
              v-model="tasks.interruptions"
              :options="{group: 'tasks', scrollSensitivity: 160}"
              class="list"
              @add="onDragAdd"
              @update="onDragUpdate">
              <v-card
                v-for="task in tasks.interruptions"
                :key="task.instance.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="interruptions" @click="onDeleteClick(task)">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="interruptions" @click="onEditClick(task)">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="interruptions" @click="onDoneClick(task)">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="interruptions" @click="onNewInterruptionClick">New task</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <task-editor ref="taskEditor" class="task-editor"></task-editor>
    </v-layout>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import TaskEditor from '@/components/TaskEditor'

  export default {
    data () {
      return {
        PRIORITIES: {
          1: 'goals',
          2: 'progress',
          3: 'activities',
          4: 'interruptions'
        },
        taskPrefix: 'task_',
        tasks: {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        },
        activeTasksNotifier: this.$store.getters.activeTasksNotifier
      }
    },
    mounted () {
      this.$store.commit('getActiveTasks')
      setTimeout(() => {
        if (this.$refs.taskEditor) {
          this.$refs.taskEditor.$el.style.visibility = 'visible'
        }
      }, 500)
    },
    watch: {
      activeTasksNotifier: {
        handler () {
          this.setActiveTasks()
        },
        deep: true
      }
    },
    components: {
      draggable,
      TaskEditor
    },
    methods: {
      clearTasks () {
        this.tasks = {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        }
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
            this.$store.commit('getActiveTasks')
            return
          }
        }
        for (let pk of orders.progress) {
          let task = tasksMap.get(pk)
          if (task) {
            this.tasks.progress.push(tasksMap.get(pk))
          } else {
            this.$store.commit('getActiveTasks')
            return
          }
        }
        for (let pk of orders.activities) {
          let task = tasksMap.get(pk)
          if (task) {
            this.tasks.activities.push(tasksMap.get(pk))
          } else {
            this.$store.commit('getActiveTasks')
            return
          }
        }
        for (let pk of orders.interruptions) {
          let task = tasksMap.get(pk)
          if (task) {
            this.tasks.interruptions.push(tasksMap.get(pk))
          } else {
            this.$store.commit('getActiveTasks')
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
        var newIndex = evt.newIndex
        var newPriority = this.getPriorityByString(evt.to.id)
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
        this.$store.commit('updateActiveTask', task)
      },

      onDragUpdate (evt) {
        var newIndex = evt.newIndex
        var newPriority = this.getPriorityByString(evt.to.id)
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
        this.$store.commit('updateActiveTask', task)
      },

      onEditClick (task) {
        TaskEditor.methods.openEditor()
        TaskEditor.methods.setTaskInstance(task)
      },

      onDeleteClick (task) {
        this.$store.commit('deleteActiveTask', task)
      },

      onDoneClick (task) {
        task.completed = true
        this.$store.commit('updateActiveTask', task)
      },

      onNewGoalClick () {
        TaskEditor.methods.openEditor()
        TaskEditor.methods.setPriority(1)
      },

      onNewProgressClick () {
        TaskEditor.methods.openEditor()
        TaskEditor.methods.setPriority(2)
      },

      onNewActivityClick () {
        TaskEditor.methods.openEditor()
        TaskEditor.methods.setPriority(3)
      },

      onNewInterruptionClick () {
        TaskEditor.methods.openEditor()
        TaskEditor.methods.setPriority(4)
      }
    }
  }
</script>

<style lang="stylus">
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

      .task
        margin-top: 10px
        margin-bottom: 10px
        cursor: grab

        .task-text
          overflow: hidden
          text-overflow: ellipsis
          white-space: pre-line

      .sortable-ghost
        opacity: 0.3
        box-shadow 0 0 0

        > *
          visibility: hidden

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


  .task-editor
    visibility: hidden
    transition: 300ms all ease
</style>
