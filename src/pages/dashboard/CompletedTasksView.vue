<template>
  <div class="completed-tasks">
    <v-container>
    <v-layout row wrap>
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
    <div v-for="year in sortedDateKeys(Object.keys(filteredTasks))" :key="year">
      <div v-for="month in sortedDateKeys(Object.keys(filteredTasks[year]))" :key="year + '-' + month">
        <div v-for="day in sortedDateKeys(Object.keys(filteredTasks[year][month]))" :key="year + '-' + month + '-' + day">
          <h4 class="header">{{ day }} {{ month | getDisplayMonth }}</h4>
          <masonry
            :cols="{default: 4, 1000: 4, 900: 3, 800: 2, 560: 1}"
            :gutter="{default: '20px'}"
            >
            <v-card
              class="task"
              :class="getGolorNameByPriority(task.priority)"
              v-for="(task, index)
              in filteredTasks[year][month][day]"
              :key="task.id">
              <v-card-text class="m-card-text">
                <span class="text">
                  <span v-html="filterWithUrls(task.text)" class="notranslate"></span>
                </span>
              </v-card-text>
              <v-card-actions class="m-card-actions">
                <v-btn
                  color="white"
                  light
                  flat
                  icon
                  @click="deleteTask(year, month, day, index)">
                  <v-icon class="notranslate">delete</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="white"
                  light
                  flat
                  icon
                  @click="cancelTask(year, month, day, index)">
                  <v-icon class="notranslate">remove_circle_outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </masonry>
          <br /><br /><br />
        </div>
      </div>
    </div>
    </v-container>
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
        this.addLoadingTag('CompletedTasksLoading')
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
      },

      filterWithUrls (text) {
        text = text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
        var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g
        return text.replace(regex, (match, a, b) => {
          var url = match
          if (!url.match(/^[a-zA-Z]+:\/\//)) {
            url = '//' + url
          }
          return '<a target="_blank" class="m-link" href="' + url + '">' + match + '</a>'
        })
      }
    }
  }
</script>

<style lang="stylus">
  .m-link
    text-decoration: none
    color: #E8F967 !important
    &:visited
      color: #E8F967 !important
    &:hover
      opacity: 0.8
</style>

<style lang="stylus" scoped>
  .task
    margin-bottom: 20px
    .m-card-text
      color: white
      .text
        max-width: 100%
        display: inline-block
        overflow: hidden
        text-overflow: ellipsis
        white-space: pre-line
    &.goals
      .m-card-text
        background-color: #F44336
      .m-card-actions
        background-color: #FF5742
    &.progress
      .m-card-text
        background-color: #0C73AF
      .m-card-actions
        background-color: #2185B7
    &.activities
      .m-card-text
        background-color: #FF9F1C
      .m-card-actions
        background-color: #FFB532
    &.interruptions
      .m-card-text
        background-color: #616161
      .m-card-actions
        background-color: #717171
  .header
    color: white
    font-weight: normal
    font-size: 30px
    line-height: 2
</style>
