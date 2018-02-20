<template>
  <div class="completed-tasks" ref="container">
    <v-layout row wrap justify-center>
      <v-flex xl4 lg6 md8 sm10 xs12>
        <v-menu
          lazy
          :close-on-content-click="false"
          v-model="menu"
          transition="scale-transition"
          offset-y
          full-width
          :nudge-right="40"
          max-width="290px"
          min-width="290px"
        >
          <v-text-field
            slot="activator"
            label="Date"
            v-model="formattedDate"
            prepend-icon="event"
            readonly
            dark
            class="notranslate"
          ></v-text-field>
          <v-date-picker
            color="primary"
            id="date-picker"
            light
            type="month"
            v-model="date"
            actions
            :allowed-dates="allowedDates"
            :date-format="date => new Date(date).toDateString()"
            :formatted-value.sync="formattedDate"
            no-title>
            <template slot-scope="{ save, cancel }">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                <v-btn flat color="primary" @click="save">OK</v-btn>
              </v-card-actions>
            </template>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <v-layout justify-center style="color: white">
      <v-flex xl4 lg6 md8 sm10 xs12>
        <div v-for="year in Object.keys(filteredTasks).sort().reverse()">
          <div v-for="month in Object.keys(filteredTasks[year]).sort().reverse()">
            <div v-for="day in Object.keys(filteredTasks[year][month]).sort().reverse()">
              <v-layout>
                <v-flex justify-start>
                  <h4 class="header">{{ day }} {{ month | getDisplayMonth }}</h4>
                </v-flex>
                <v-flex justify-end>
                  <h4
                    class="header"
                    style="text-align: right">{{ filteredTasks[year][month][day].length }}</h4>
                </v-flex>
              </v-layout>
              <hr/>
              <v-layout>
                <v-flex style="max-width: 100%">
                  <div
                    v-for="(task, index) in filteredTasks[year][month][day]"
                    class="task"
                    :class="'border-color-' + getGolorNameByPriority(task.priority)">
                    <v-layout>
                      <v-flex style="max-width: 100%">
                        <div class="task-text">
                          <span class="notranslate">{{ task.text }}</span>
                        </div>
                      </v-flex>
                    </v-layout>
                    <div class="text-xs-right">
                      <v-btn
                        :color="getGolorNameByPriority(task.priority)"
                        dark
                        flat
                        icon
                        @click="cancelTask(year, month, day, index)">
                        <v-icon class="notranslate">remove_circle_outline</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-flex>
              </v-layout>
              <br /><br /><br />
            </div>
          </div>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import Vue from 'vue'
  import _ from 'underscore'
  import simpleRequest from '@/utils/SimpleRequest'
  // import Notifications from '@/components/Notifications'
  import Group from '@/models/Group'

  function getWindow () {
    var w = window
    var d = document
    var e = d.documentElement
    var g = d.getElementsByTagName('body')[0]
    var x = w.innerWidth || e.clientWidth || g.clientWidth
    var y = w.innerHeight || e.clientHeight || g.clientHeight
    return {x, y}
  }

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

  Vue.filter('getDisplayMonth', (month) => {
    month = parseInt(month)
    switch (month) {
      case 1: return 'January'
      case 2: return 'February'
      case 3: return 'Murch'
      case 4: return 'April'
      case 5: return 'May'
      case 6: return 'June'
      case 7: return 'July'
      case 8: return 'August'
      case 9: return 'September'
      case 10: return 'October'
      case 11: return 'November'
      case 12: return 'December'
      default: return ''
    }
  })

  Vue.filter('toDateTimeFormat', (date) => {
    let dateObj = new Date(date)
    let str = dateObj.toUTCString()
    return str.substring(0, str.length - 4)
  })

  export default {
    props: [
      'addLoadingTag',
      'removeLoadingTag',
      'scrollEvent'
    ],
    data () {
      return {
        PRIORITIES: {
          1: 'goals',
          2: 'progress',
          3: 'activities',
          4: 'interruptions'
        },
        isStaff: false,
        group: undefined,
        user: this.$store.getters.user,
        isActive: false,
        date: null,
        allowedDates: [],
        formattedDate: null,
        filteredTasks: {},
        dates: [],
        selectedDates: [],
        menu: false,
        currentIndex: 0,
        tasks: [],
        requested: false
      }
    },
    mounted () {
      this.addLoadingTag('CompletedGroupTasksLoading')
      this.refreshData()
      this.synchronize().then(() => {
        this.getNextCompletedTasks().then(() => {
          this.currentIndex++
        })
      })
    },
    watch: {
      $route (to, from) {
        this.addLoadingTag('CompletedGroupTasksLoading')
        this.refreshData()
        this.synchronize().then(() => {
          this.getNextCompletedTasks().then(() => {
            this.currentIndex++
          })
        })
      },

      scrollEvent (evt) {
        let {y} = getWindow()
        if (document.body.clientHeight - document.body.scrollTop - y <= 500 && !this.requested) {
          this.requested = true
          this.getNextCompletedTasks().then(() => {
            this.currentIndex++
            this.requested = false
          }).catch(() => {
            this.requested = false
          })
        }
      },

      date () {
        var selectedDates = new Set()
        for (let date of this.dates) {
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          let stringDate = year + '-' + ((month > 9) ? month : '0' + month) + '-' + ((day > 9) ? day : '0' + day)
          selectedDates.add(stringDate)
        }
        this.selectedDates = Array.from(selectedDates)
        this.selectedDates.sort().reverse()
      },

      tasks: {
        handler () {
          this.filteredTasks = this.getFilteredTasks()
        },
        deep: true
      }
    },
    methods: {
      refresh () {
        this.addLoadingTag('CompletedGroupTasksLoading')
        this.refreshData()
        this.synchronize().then(() => {
          this.getNextCompletedTasks().then(() => {
            this.currentIndex++
          })
        })
      },

      finish () {
        this.isActive = true
        this.removeLoadingTag('CompletedGroupTasksLoading')
      },

      refreshData () {
        this.isActive = false
        this.currentIndex = 0
        this.tasks = []
      },

      getFilteredTasks () {
        var _filteredTasks = {}
        for (let i = 0; i < this.tasks.length; i++) {
          let year = (new Date(this.tasks[i].created)).getFullYear()
          let month = (new Date(this.tasks[i].created)).getMonth() + 1
          let day = (new Date(this.tasks[i].created)).getDate()
          if (!(year in _filteredTasks)) {
            _filteredTasks[year] = {}
            _filteredTasks[year][month] = {}
            _filteredTasks[year][month][day] = []
          } else if (!(month in _filteredTasks[year])) {
            _filteredTasks[year][month] = {}
            _filteredTasks[year][month][day] = []
          } else if (!(day in _filteredTasks[year][month])) {
            _filteredTasks[year][month][day] = []
          }
          _filteredTasks[year][month][day].push(this.tasks[i])
        }
        for (let year in _filteredTasks) {
          for (let month in _filteredTasks[year]) {
            for (let day in _filteredTasks[year][month]) {
              _filteredTasks[year][month][day] = _.sortBy(_filteredTasks[year][month][day], v => (new Date(v.created)).getTime())
              _filteredTasks[year][month][day].reverse()
            }
          }
        }
        return _filteredTasks
      },

      synchronize () {
        return new Promise((resolve, reject) => {
          this.getGroup(this.$router.history.current.params.id).then((group) => {
            this.group = group
            this.getAllowedDates().then((dates) => {
              var allowedDatesSet = new Set()
              this.dates = []
              for (let i = 0; i < dates.length; i++) {
                let date = new Date(dates[i])
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let stringDate = year + '-' + ((month > 9) ? month : '0' + month)
                this.dates.push(date)
                allowedDatesSet.add(stringDate)
              }
              if (!this.date) {
                var currentDate = new Date()
                let year = currentDate.getFullYear()
                let month = currentDate.getMonth() + 1
                this.date = year + '-' + ((month > 9) ? month : '0' + month)
                this.dates.push(currentDate)
                this.formattedDate = currentDate.toDateString()
              }
              this.allowedDates = Array.from(allowedDatesSet)
              this.finish()
              resolve()
            }).catch((error) => {
              console.log(error)
              this.refresh()
              reject()
            })
          }).catch((error) => {
            console.log(error)
            this.refresh()
            reject()
          })
        })
      },

      getGroup (id) {
        return new Promise((resolve, reject) => {
          simpleRequest('/api/groups/list/' + id + '/').method('get').then((response) => {
            var group = new Group()
            group.override(getGroupFromResponse(response.data))
            console.log(response)
            resolve(group)
          }).catch((error) => {
            reject(error)
          })
        })
      },

      getAllowedDates () {
        return new Promise((resolve, reject) => {
          simpleRequest('/api/group_tasks/completed/groups/' + this.group.instance.id + '/dates/').method('get').then((response) => {
            console.log(response)
            resolve(response.data)
          }).catch((error) => {
            reject(error)
          })
        })
      },

      getNextCompletedTasks () {
        return new Promise((resolve, reject) => {
          if (this.currentIndex < this.selectedDates.length) {
            var formattedDate = this.selectedDates[this.currentIndex]
            let [year, month, day] = formattedDate.split('-').map(v => parseInt(v))
            simpleRequest(`/api/group_tasks/completed/groups/${this.group.instance.id}/?year=${year}&month=${month}&day=${day}`).method('get').then((response) => {
              for (let task of response.data) {
                this.tasks.push(task)
              }
              console.log(response)
              resolve()
            }).catch((error) => {
              console.log(error)
              reject()
            })
          } else {
            reject()
          }
        })
      },

      getGolorNameByPriority (priority) {
        switch (priority) {
          case 1: return 'goals'
          case 2: return 'progress'
          case 3: return 'activities'
          case 4: return 'interruptions'
        }
      },

      cancelTask (year, month, day, index) {
        var task = this.filteredTasks[year][month][day][index]
        task.completed = false
        this.updatedTask(task)
        simpleRequest(`/api/group_tasks/completed/groups/${this.group.instance.id}/tasks/${task.id}/`).method('delete').then((response) => {
          console.log(response)
        }).catch((error) => {
          this.refresh()
          console.log(error)
        })
      },

      updatedTask (task) {
        if (!task.completed) {
          let index = this.tasks.indexOf(task)
          if (index !== -1) {
            this.tasks.splice(index, 1)
          }
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  $goals = #F44336
  $progress = #0C73AF
  $activities = #FF9F1C
  $interruptions = #616161
  $text-color = #333333

  .task
    max-width: 100%
    border-radius: 2px
    color: $text-color
    border-left-width: 10px
    border-left-style: solid
    padding-left: 20px
    margin: 20px 0
    background-color: white
    padding: 15px

    &.border-color-goals
      border-color: $goals

    &.border-color-progress
      border-color: $progress

    &.border-color-activities
      border-color: $activities

    &.border-color-interruptions
      border-color: $interruptions

    .task-text
      font-size: 20px
      overflow: hidden
      text-overflow: ellipsis
      white-space: pre-line

      > span
        overflow: hidden
        text-overflow: ellipsis
        white-space: pre-line


  .header
    font-weight: normal
    font-size: 30px
</style>
