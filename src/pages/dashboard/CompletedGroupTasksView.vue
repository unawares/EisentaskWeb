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
  import simpleRequest from '@/utils/SimpleRequest'
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
      case 3: return 'March'
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
      'scrollEvent',
      'id'
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
        requested: false,
        isSynchronizing: false
      }
    },
    mounted () {
      this.addLoadingTag('CompletedGroupTasksLoading' + this.id)
      this.refreshData()
      this.synchronize().then(() => {
        this.init()
      })
    },
    beforeDestroy () {
      this.removeLoadingTag('CompletedGroupTasksLoading' + this.id)
    },
    watch: {
      $route (to, from) {
        this.addLoadingTag('CompletedGroupTasksLoading' + this.id)
        this.refreshData()
        this.synchronize().then(() => {
          this.synchronizeSelectedDates()
          this.init()
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
        this.refreshData()
        this.synchronizeSelectedDates()
        this.init()
      },

      tasks: {
        handler () {
          this.filteredTasks = this.getFilteredTasks()
        },
        deep: true
      }
    },
    methods: {
      init () {
        var count = 10
        var f = () => {
          this.requested = true
          return new Promise((resolve, reject) => {
            this.getNextCompletedTasks().then(() => {
              count--
              this.currentIndex++
              this.requested = false
              if (count > 0) {
                f()
              } else {
                this.isSynchronizing = false
              }
              resolve()
            }).catch(() => {
              this.requested = false
              this.isSynchronizing = false
            })
          })
        }
        if (!this.isSynchronizing) {
          this.isSynchronizing = true
          f()
        }
      },

      refresh () {
        this.addLoadingTag('CompletedGroupTasksLoading' + this.id)
        this.refreshData()
        this.synchronize().then(() => {
          this.getNextCompletedTasks().then(() => {
            this.currentIndex++
          })
        })
      },

      finish () {
        this.isActive = true
        this.removeLoadingTag('CompletedGroupTasksLoading' + this.id)
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
              _filteredTasks[year][month][day] = _.sortBy(_filteredTasks[year][month][day], v => (new Date(v.created)).getTime()).reverse()
            }
          }
        }
        return _filteredTasks
      },

      synchronizeSelectedDates () {
        var selectedDates = new Set()
        for (let date of this.dates) {
          let year = date.getFullYear()
          let month = date.getMonth() + 1
          let day = date.getDate()
          let stringDate = year + '-' + ((month > 9) ? month : '0' + month) + '-' + ((day > 9) ? day : '0' + day)
          if (this.date === stringDate.substr(0, this.date.length)) {
            selectedDates.add(stringDate)
          }
        }
        this.selectedDates = Array.from(selectedDates)
        this.selectedDates.sort().reverse()
        console.log(this.selectedDates)
      },

      synchronize () {
        return new Promise((resolve, reject) => {
          this.getGroup(this.id).then((group) => {
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
              var currentDate = new Date()
              let year = currentDate.getFullYear()
              let month = currentDate.getMonth() + 1
              this.date = year + '-' + ((month > 9) ? month : '0' + month)
              this.dates.push(currentDate)
              this.formattedDate = currentDate.toDateString()
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
    color: #E8F967
    &:visited
      color: #E8F967
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