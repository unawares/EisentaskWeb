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
                :key="task.id"
                :id="taskPrefix + task.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="goals">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="goals">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="goals">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
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
              v-model="tasks.progress"
              :options="{group: 'tasks', scrollSensitivity: 160}"
              class="list"
              @add="onDragAdd"
              @update="onDragUpdate">
              <v-card
                v-for="task in tasks.progress"
                :key="task.id"
                :id="taskPrefix + task.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="progress">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="progress">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="progress">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
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
            v-model="tasks.activities"
            :options="{group: 'tasks', scrollSensitivity: 160}"
            class="list"
            @add="onDragAdd"
            @update="onDragUpdate">
              <v-card
                v-for="task in tasks.activities"
                :key="task.id"
                :id="taskPrefix + task.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="activities">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="activities">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="activities">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
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
              v-model="tasks.interruptions"
              :options="{group: 'tasks', scrollSensitivity: 160}"
              class="list"
              @add="onDragAdd"
              @update="onDragUpdate">
              <v-card
                v-for="task in tasks.interruptions"
                :key="task.id"
                :id="taskPrefix + task.id"
                class="task">
                <v-card-text class="task-text">
                  <span class="notranslate">{{ task.text }}</span>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat icon color="interruptions">
                    <v-icon class="notranslate">delete</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat icon color="interruptions">
                    <v-icon class="notranslate">edit</v-icon>
                  </v-btn>
                  <v-btn flat icon color="interruptions">
                    <v-icon class="notranslate">done</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-btn flat color="interruptions">New task</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import draggable from 'vuedraggable'
  import TaskActions from '@/utils/ActiveTasksActions'
  import Task from '@/models/Task'

  window.test = TaskActions
  window.Task = Task

  export default {
    delimiters: ['[[', ']]'],
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
          goals: [
            {
              id: 1,
              text: 'Hello Google 1'
            },
            {
              id: 2,
              text: 'Hello Google 2'
            },
            {
              id: 3,
              text: 'Hello Google 3'
            }
          ],
          progress: [],
          activities: [],
          interruptions: []
        }
      }
    },
    components: {
      draggable
    },
    methods: {
      getPriorityByString: function (priorityText) {
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
      onDragAdd: function (evt) {
        var taskId = parseInt(evt.item.id.substr(this.taskPrefix.length))
        var priority = this.getPriorityByString(evt.to.id)
        var newPosition = evt.newIndex
        console.log('ID: ' + taskId)
        console.log('PRIORITY: ' + priority)
        console.log('NEW_POSITION: ' + newPosition)
      },
      onDragUpdate: function (evt) {
        var taskId = parseInt(evt.item.id.substr(this.taskPrefix.length))
        var priority = this.getPriorityByString(evt.to.id)
        var newPosition = evt.newIndex
        console.log('ID: ' + taskId)
        console.log('PRIORITY: ' + priority)
        console.log('NEW_POSITION: ' + newPosition)
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
</style>
