<template>
  <v-layout>
    <v-container>
      <v-btn
        v-if="isStaff"
        ref="button"
        dark
        color="goals"
        fab
        fixed
        right
        bottom
        @click="openEditor"
      >
          <v-icon class="notranslate">edit</v-icon>
      </v-btn>
    </v-container>
    <v-navigation-drawer
      ref="taskEditor"
      class="task-editor scrollbar-hidden"
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
          <v-icon class="notranslate">dashboard</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container>
        <v-layout row justify-center>
          <v-flex xs11>
            <div v-if="session === 'form'">
              <div class="text-field">
                <v-text-field
                  ref="taskEditText"
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
                  <v-icon dark class="notranslate">info_outline</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>GOALS</v-list-tile-title>
                  <v-list-tile-sub-title>Important & Urgent</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="setPriority(2)" class="priority-item">
                <v-list-tile-action>
                  <v-icon dark class="notranslate">alarm_on</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>PROGRESS</v-list-tile-title>
                  <v-list-tile-sub-title>Important & Not Urgent</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="setPriority(3)" class="priority-item">
                <v-list-tile-action>
                  <v-icon dark class="notranslate">update</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>ACTIVITIES</v-list-tile-title>
                  <v-list-tile-sub-title>Not Important & Urgent</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile @click="setPriority(4)" class="priority-item">
                <v-list-tile-action>
                  <v-icon dark class="notranslate">schedule</v-icon>
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
  import GroupTask from '@/models/GroupTask'

  var previousId = (function () {
    var id = -1
    return () => {
      return id--
    }
  })()

  export default {
    name: 'TaskEditor',
    props: [
      'isStaff'
    ],
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
    watch: {
      priority: function (value) {
        value = parseInt(value)
        switch (value) {
          case 1:
            this.priorityClass = 'goals'
            break
          case 2:
            this.priorityClass = 'progress'
            break
          case 3:
            this.priorityClass = 'activities'
            break
          case 4:
            this.priorityClass = 'interruptions'
            break
        }
        return value
      },

      drawer: function (value) {
        if (value) {
          this.$emit('opened')
          this.$refs.taskEditor.$el.style.visibility = 'visible'
        } else {
          this.$emit('closed')
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
        this.task = task
        this.priority = task.priority
        setTimeout(() => {
          this.$refs.taskEditText.focus()
          this.text = task.text
        }, 100)
      },

      // Create task
      createTask: function () {
        if (this.text && !(/^\s*$/.test(this.text))) {
          var task = new GroupTask()
          task.instance = {
            id: previousId(),
            completed: false,
            priority: this.priority,
            text: this.text
          }
          this.$emit('createActiveGroupTask', task)
        }
      },

      // Refresh
      refresh: function () {
        this.task = undefined
        this.text = ''
        this.session = 'form'
      },

      // Update task
      updateTask: function () {
        if (this.text && !(/^\s*$/.test(this.text))) {
          this.task.text = this.text
          this.task.priority = this.priority
          this.$emit('updateActiveGroupTask', this.task)
        }
        this.refresh()
      },

      setPriority: function (priority) {
        this.priority = parseInt(priority)
        this.session = 'form'
      },

      // Call to close the editor
      closeEditor: function () {
        this.drawer = false
      },

      // Call to open the editor
      openEditor: function () {
        this.refresh()
        this.drawer = true
        setTimeout(() => {
          this.$refs.taskEditText.focus()
        }, 100)
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
