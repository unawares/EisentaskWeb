<template>
  <div class="completed-tasks">
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
        <div v-for="year in sortedDateKeys(Object.keys(filteredTasks))" :key="year">
          <div v-for="month in sortedDateKeys(Object.keys(filteredTasks[year]))" :key="year + '-' + month">
            <div v-for="day in sortedDateKeys(Object.keys(filteredTasks[year][month]))" :key="year + '-' + month + '-' + day">
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
                    :class="'border-color-' + getGolorNameByPriority(task.priority)"
                    :key="task.id">
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
                      <v-btn
                        :color="getGolorNameByPriority(task.priority)"
                        dark
                        flat
                        icon
                        @click="deleteTask(year, month, day, index)">
                        <v-icon class="notranslate">delete</v-icon>
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

  // Quick sort
  var quickSort = (() => {
    var swap = (arr, i, j) => {
      var temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
    var partition = (arr, pivot, left, right) => {
      var pivotValue = pivot
      var partitionIndex = left
      for (var i = left; i < right; i++) {
        let date1 = new Date(arr[i].updated)
        let date2 = new Date(arr[pivotValue].updated)
        if (date1 > date2) {
          swap(arr, i, partitionIndex)
          partitionIndex++
        } else {
          continue
        }
      }
      swap(arr, right, partitionIndex)
      return partitionIndex
    }
    var _quickSort = (arr, left, right) => {
      var pivot, partitionIndex
      if (left < right) {
        pivot = right
        partitionIndex = partition(arr, pivot, left, right)
        // sort left and right
        quickSort(arr, left, partitionIndex - 1)
        quickSort(arr, partitionIndex + 1, right)
      }
      return arr
    }
    return _quickSort
  })()

  Vue.filter('getDisplayMonth', (month) => {
    switch (month) {
      case '01': return 'January'
      case '02': return 'February'
      case '03': return 'March'
      case '04': return 'April'
      case '05': return 'May'
      case '06': return 'June'
      case '07': return 'July'
      case '08': return 'August'
      case '09': return 'September'
      case '10': return 'October'
      case '11': return 'November'
      case '12': return 'December'
      default: return ''
    }
  })

  Vue.filter('toDateTimeFormat', (date) => {
    let dateObj = new Date(date)
    let str = dateObj.toUTCString()
    return str.substring(0, str.length - 4)
  })

  export default {
    name: 'CompletedTasks',
    props: [
      'addLoadingTag',
      'removeLoadingTag'
    ],
    data () {
      return {
        account: this.$store.getters.getAccount,
        date: null,
        menu: false,
        modal: false,
        allowedDates: [],
        tasks: [],
        formattedDate: null,
        filteredTasks: {},
        activeTasksEventEmitter: this.$store.getters.activeTasksEventEmitter,
        completedTasksEventEmitter: this.$store.getters.completedTasksEventEmitter,
        completedTasksActiveRequests: this.$store.getters.completedTasksActiveRequests
      }
    },
    mounted () {
      this.removeLoadingTag('TasksLoading')
      this.removeLoadingTag('CompletedTasksLoading')
      this.activeTasksEventEmitter.removeAllListeners('updated', () => {})
      this.completedTasksEventEmitter.removeAllListeners('updated', () => {})
      this.completedTasksEventEmitter.on('updated', () => {
        this.removeLoadingTag('CompletedTasksLoading')
        var tasks = this.$store.getters.completedTasks
        var allowedDatesSet = new Set()
        for (let i = 0; i < tasks.length; i++) {
          let date = new Date(tasks[i].updated)
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let stringDate = year + '-' + ((month > 9) ? month : '0' + month)
          allowedDatesSet.add(stringDate)
        }
        {
          let thisDate = new Date()
          let year = thisDate.getFullYear()
          let month = thisDate.getMonth() + 1
          let stringDate = year + '-' + ((month > 9) ? month : '0' + month)
          allowedDatesSet.add(stringDate)
        }
        this.allowedDates = Array.from(allowedDatesSet)
        this.tasks = tasks
        if (!this.date) {
          var currentDate = new Date()
          let year = currentDate.getFullYear()
          let month = currentDate.getMonth() + 1
          this.date = year + '-' + ((month > 9) ? month : '0' + month)
          this.formattedDate = currentDate.toDateString()
        }
        this.filteredTasks = this.getFilteredTasks()
      })
      this.refreshAndGetCompletedTasks()
    },
    beforeDestroy () {
      this.completedTasksEventEmitter.removeListener('updated', () => {})
      this.removeLoadingTag('CompletedTasksLoading')
    },
    watch: {
      date  () {
        this.filteredTasks = this.getFilteredTasks()
      },

      completedTasksActiveRequests: {
        handler () {
          if (this.completedTasksActiveRequests.count > 0) {
            this.addLoadingTag('CompletedTasksLoading')
          }
        },
        deep: true
      }
    },
    methods: {
      refresh () {
        this.refreshAndGetCompletedTasks()
      },

      refreshAndGetCompletedTasks () {
        this.$store.commit('refreshCompletedTasks')
        setTimeout(() => {
          this.$store.commit('getCompletedTasks')
        })
      },

      getFilteredTasks () {
        var _filteredTasks = {}
        var fTasks = this.filterTheTasks()
        for (let i = 0; i < fTasks.length; i++) {
          let year = (new Date(fTasks[i].updated)).getFullYear()
          let month = (new Date(fTasks[i].updated)).getMonth() + 1
          let day = (new Date(fTasks[i].updated)).getDate()
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
          _filteredTasks[year][month][day].push(fTasks[i])
        }
        for (let year in _filteredTasks) {
          for (let month in _filteredTasks[year]) {
            for (let day in _filteredTasks[year][month]) {
              quickSort(_filteredTasks[year][month][day],
                0, _filteredTasks[year][month][day].length - 1)
            }
          }
        }
        return _filteredTasks
      },

      filterTheTasks () {
        if (this.date) {
          return this.tasks.filter((value) => {
            return value.updated.substr(0, 7) === this.date
          })
        } else {
          return {}
        }
      },

      deleteTask (year, month, day, index) {
        var task = this.filteredTasks[year][month][day][index]
        this.deletedTask(task, { year, month, day, index })
        this.$store.commit('deleteCompletedTask', task)
      },

      cancelTask (year, month, day, index) {
        var task = this.filteredTasks[year][month][day][index]
        task.completed = false
        this.updatedTask(task, { year, month, day, index })
        this.$store.commit('updateCompletedTask', task)
      },

      getGolorNameByPriority (priority) {
        switch (priority) {
          case 1: return 'goals'
          case 2: return 'progress'
          case 3: return 'activities'
          case 4: return 'interruptions'
        }
      },

      updatedTask (task, { year, month, day, index }) {
        if (!task.completed) {
          this.filteredTasks[year][month][day].splice(index, 1)
        }
      },

      deletedTask (task, { year, month, day, index }) {
        this.filteredTasks[year][month][day].splice(index, 1)
      },

      sortedDateKeys (keys) {
        return _.sortBy(keys, key => parseInt(key)).reverse()
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
