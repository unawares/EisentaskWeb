<template>
  <v-layout>
    <v-container>
      <v-btn
        ref="button"
        dark
        color="goals"
        fab
        fixed
        right
        bottom
        @click="openEditor"
      >
          <v-icon color="">edit</v-icon>
      </v-btn>
    </v-container>
    <v-navigation-drawer
      ref="taskEditor"
      class="task-editor"
      absolute
      temporary
      fixed
      v-model="drawer"
      light
      right
      width="450"
    >
      <v-toolbar dark :class="priorityClass" style="padding: 0 15px">
        <v-toolbar-title>
          <span v-if="priority === 1">
            GOALS
          </span>
          <span v-if="priority === 2">
            PROGRESS
          </span>
          <span v-if="priority === 3">
            ACTIVITIES
          </span>
          <span v-if="priority === 4">
            INTERRUPTIONS
          </span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="session = 'priority'">
          <v-icon>dashboard</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-layout row justify-center>
          <v-flex xs11>
            <div v-if="session === 'form'">
              <div class="text-field">
                <v-text-field
                  label="Task"
                  multi-line
                  auto-grow
                  light
                  v-model="text"
                  rows="1"
                ></v-text-field>
                <v-layout row justify-end>
                  <v-flex xs3>
                    <v-btn flat light @click="closeEditor">Cancel</v-btn>
                  </v-flex>
                  <v-flex xs3 v-if="!task">
                    <v-btn flat light @click="createTask">Create</v-btn>
                  </v-flex>
                  <v-flex xs3 v-else>
                    <v-btn flat light @click="updateTask">Update</v-btn>
                  </v-flex>
                </v-layout>
              </div>
            </div>
            <v-list
              v-if="session === 'priority'"
              light
            >
              <v-list-tile @click="setPriority(1)" class="priority-item">
                <v-list-tile-action>
                  <v-icon dark>info_outline</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>GOALS</v-list-tile-title>
                  <v-list-tile-sub-title>Important & Urgent</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="setPriority(2)" class="priority-item">
                <v-list-tile-action>
                  <v-icon dark>alarm_on</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>PROGRESS</v-list-tile-title>
                  <v-list-tile-sub-title>Important & Not Urgent</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="setPriority(3)" class="priority-item">
                <v-list-tile-action>
                  <v-icon dark>update</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>ACTIVITIES</v-list-tile-title>
                  <v-list-tile-sub-title>Not Important & Urgent</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="setPriority(4)" class="priority-item">
                <v-list-tile-action>
                  <v-icon dark>schedule</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>INTERRUPTIONS</v-list-tile-title>
                  <v-list-tile-sub-title>Not Important & Not Urgent</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-navigation-drawer>
  </v-layout>
</template>


<script>
  import Task from '@/models/Task'

  var self = {}

  export default {
    name: 'TaskEditor',
    data () {
      return {
        drawer: false,
        task: undefined,
        session: 'form',
        text: '',
        priority: 1,
        priorityClass: 'goals',
        refreshIntervalId: undefined
      }
    },
    mounted: function () {
      self.obj = this
    },
    watch: {
      priority: function (value) {
        value = parseInt(value)
        switch (value) {
          case 1:
            self.obj.priorityClass = 'goals'
            break
          case 2:
            self.obj.priorityClass = 'progress'
            break
          case 3:
            self.obj.priorityClass = 'activities'
            break
          case 4:
            self.obj.priorityClass = 'interruptions'
            break
        }
        return value
      },

      drawer: function (value) {
        if (value) {
          this.$refs.taskEditor.$el.style.visibility = 'visible'
        } else {
          setTimeout(() => {
            if (!this.drawer) {
              this.$refs.taskEditor.$el.style.visibility = 'hidden'
            }
          }, 1000)
        }
      }
    },
    methods: {
      // Set instance
      setTaskInstance: function (task) {
        self.obj.task = task
        self.obj.priority = task.priority
        self.obj.text = task.text
      },

      // Create task
      createTask: function () {
        if (self.obj.text && !(/^\s*$/.test(self.obj.text))) {
          var task = new Task()
          task.completed = false
          task.priority = self.obj.priority
          task.text = self.obj.text
          this.$store.commit('createActiveTask', task)
        }
        self.obj.closeEditor()
      },

      // Refresh
      refresh: function () {
        self.obj.task = undefined
        self.obj.text = ''
        self.obj.session = 'form'
      },

      // Update task
      updateTask: function () {
        if (self.obj.text && !(/^\s*$/.test(self.obj.text))) {
          self.obj.task.completed = false
          self.obj.task.priority = self.obj.priority
          self.obj.task.text = self.obj.text
          this.$store.commit('updateActiveTask', self.obj.task)
        }
        self.obj.closeEditor()
        self.obj.refresh()
      },

      setPriority: function (priority) {
        self.obj.priority = parseInt(priority)
        self.obj.session = 'form'
      },

      // Call to close the editor
      closeEditor: function () {
        self.obj.drawer = false
      },

      // Call to open the editor
      openEditor: function () {
        self.obj.refresh()
        self.obj.drawer = true
      }
    }
  }
</script>


<style scoped>
  .task-editor {
    visibility: hidden;
  }


  .priority-item {
    margin: 15px;
  }


  .goals {
    background-color: #E71D36 !important;
  }


  .progress {
    background-color: #0C73AF !important;
  }


  .activities {
    background-color: #FF9F1C !important;
  }


  .interruptions {
    background-color: #616161 !important;
  }
</style>
