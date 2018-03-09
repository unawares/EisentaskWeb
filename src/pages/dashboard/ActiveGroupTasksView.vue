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
          <v-card v-if="isStaff" color="goals_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewGoalClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[1]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150, disabled: !isStaff}"
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
                  :isDragging="isDragging"
                  @onDeleteClick="onDeleteClick"
                  @onEditClick="onEditClick"
                  @onDoneClick="onDoneClick"
                  :isStaff="isStaff">
                  <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading.goals"
              v-if="!!reactiveActiveTasks && reactiveActiveTasks.hasNext(1) && !activeTasksLoading"
              flat
              color="goals"
              @click="loadNextTasks(1)">
              Load tasks
            </v-btn>
            <v-spacer></v-spacer>
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
          <v-card v-if="isStaff" color="progress_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewProgressClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[2]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150, disabled: !isStaff}"
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
                  :isDragging="isDragging"
                  @onDeleteClick="onDeleteClick"
                  @onEditClick="onEditClick"
                  @onDoneClick="onDoneClick"
                  :isStaff="isStaff">
                  <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading.progress"
              v-if="!!reactiveActiveTasks && reactiveActiveTasks.hasNext(2) && !activeTasksLoading"
              flat
              color="progress"
              @click="loadNextTasks(2)">
              Load tasks
            </v-btn>
            <v-spacer></v-spacer>
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
          <v-card v-if="isStaff" color="activities_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewActivityClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[3]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150, disabled: !isStaff}"
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
                  :isDragging="isDragging"
                  @onDeleteClick="onDeleteClick"
                  @onEditClick="onEditClick"
                  @onDoneClick="onDoneClick"
                  :isStaff="isStaff">
                  <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading.activities"
              v-if="!!reactiveActiveTasks && reactiveActiveTasks.hasNext(3) && !activeTasksLoading"
              flat
              color="activities"
              @click="loadNextTasks(3)">
              Load tasks
            </v-btn>
            <v-spacer></v-spacer>
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
          <v-card v-if="isStaff" color="interruptions_sub" dark flat tile>
            <v-card-actions>
              <v-btn small block flat @click="onNewInterruptionClick">New Task</v-btn>
            </v-card-actions>
          </v-card>
          <v-layout>
            <draggable
              :id="PRIORITIES[4]"
              :options="{group: 'tasks', handle: '.my-handle', scrollSensitivity: 160, animation: 150, disabled: !isStaff}"
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
                  :isDragging="isDragging"
                  @onDeleteClick="onDeleteClick"
                  @onEditClick="onEditClick"
                  @onDoneClick="onDoneClick"
                  :isStaff="isStaff">
                  <span v-html="filterWithUrls(task.text)" slot="text" class="notranslate"></span>
                </active-task>
              </transition-group>
            </draggable>
          </v-layout>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="loading.interruptions"
              v-if="!!reactiveActiveTasks && reactiveActiveTasks.hasNext(4) && !activeTasksLoading"
              flat color="interruptions"
              @click="loadNextTasks(4)">
              Load tasks
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-flex>
      <group-task-editor
        ref="groupTaskEditor"
        style="visibility: hidden"
        @updateActiveGroupTask="updateActiveGroupTask"
        @createActiveGroupTask="createActiveGroupTask"
        @opened="openedGroupTaskEditor"
        @closed="closedGroupTaskEditor"
        :isStaff="isStaff">
      </group-task-editor>
    </v-layout>
  </v-container>
</template>

<script>
  import _ from 'underscore'
  import Draggable from 'vuedraggable'
  import GroupTaskEditor from '@/components/GroupTaskEditor'
  import ActiveTask from '@/components/ActiveTask'
  import simpleRequest from '@/utils/SimpleRequest'
  import Group from '@/models/Group'
  import ReactiveActiveGroupTasks from '@/utils/ReactiveActiveGroupTasks'

  var getWindow = function () {
    var w = window
    var d = document
    var e = d.documentElement
    var g = d.getElementsByTagName('body')[0]
    var x = w.innerWidth || e.clientWidth || g.clientWidth
    var y = w.innerHeight || e.clientHeight || g.clientHeight
    return {x, y}
  }

  function getOffset (el) {
    var e = el.getBoundingClientRect()
    return {
      left: e.left + window.scrollX,
      top: e.top + window.scrollY
    }
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

  export default {
    props: [
      'addLoadingTag',
      'removeLoadingTag',
      'scrollEvent',
      'showNotification'
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
        isDragging: false,
        group: undefined,
        tasks: {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        },
        reactiveActiveTasks: undefined,
        tasksDict: undefined,
        lastActionEnd: new Date(),
        lastDragEnd: new Date(),
        animationStartTime: new Date(),
        force: true,
        user: this.$store.getters.user,
        requested: {
          goals: false,
          progress: false,
          activities: false,
          interruptions: false
        },
        updated: 0,
        activeTasksLoading: true,
        loading: {
          goals: false,
          progress: false,
          activities: false,
          interruptions: false
        }
      }
    },
    mounted () {
      this.addLoadingTag('ActiveGroupTasksLoading')
      this.getGroupAndTasks(this.$router.history.current.params.id)
      setTimeout(() => {
        if (this.$refs.groupTaskEditor) {
          this.$refs.groupTaskEditor.$el.style.visibility = 'visible'
        }
      }, 700)
    },
    watch: {
      $route (to, from) {
        this.updated++
        this.addLoadingTag('ActiveGroupTasksLoading')
        this.destroy()
        this.clearTasks()
        this.getGroupAndTasks(this.$router.history.current.params.id)
      },

      scrollEvent (evt) {
        var goals = document.getElementById('goals')
        var progress = document.getElementById('progress')
        var activities = document.getElementById('activities')
        var interruptions = document.getElementById('interruptions')
        if ((
          goals.parentNode.parentNode.parentNode.offsetTop +
          progress.parentNode.parentNode.parentNode.offsetTop +
          activities.parentNode.parentNode.parentNode.offsetTop +
          interruptions.parentNode.parentNode.parentNode.offsetTop
        ) / 4 === goals.parentNode.parentNode.parentNode.offsetTop) {
          var func = (el, priority, id) => {
            let {y} = getWindow()
            let {top} = getOffset(el)
            let yPosition = top + el.offsetHeight - (document.body.scrollTop + y)
            if (yPosition < 500 && !this.requested[id]) {
              this.reactiveActiveTasks.getNext(priority).then(() => {
                this.requested[id] = false
              }).catch(() => {
                this.requested[id] = false
              })
            }
          }
          if (this.reactiveActiveTasks) {
            func(goals, 1, 'goals')
            func(progress, 2, 'progress')
            func(activities, 3, 'activities')
            func(interruptions, 4, 'interruptions')
          }
        }
      }
    },
    beforeDestroy () {
      this.updated++
      this.destroy()
    },
    methods: {
      refresh () {
        this.updated++
        this.addLoadingTag('ActiveGroupTasksLoading')
        this.destroy()
        this.clearTasks()
        this.getGroupAndTasks(this.$router.history.current.params.id)
      },

      continueActions (quickly = false) {
        if (quickly) {
          this.reactiveActiveTasks.continueActions()
          this.lastActionEnd = new Date()
        } else {
          var time = this.lastActionEnd
          var f = () => {
            setTimeout(() => {
              if ((new Date().getTime() - this.lastActionEnd.getTime()) >= 1000) {
                this.reactiveActiveTasks.continueActions()
                this.lastActionEnd = new Date()
              } else if (time.getTime() === this.lastActionEnd.getTime()) {
                f()
              }
            }, 1500)
          }
          f()
        }
      },

      pauseActions (quickly = false) {
        if (quickly) {
          this.reactiveActiveTasks.pauseActions()
          this.lastActionEnd = new Date()
        } else {
          var time = this.lastActionEnd
          var f = () => {
            setTimeout(() => {
              if ((new Date().getTime() - this.lastActionEnd.getTime()) >= 1000) {
                this.reactiveActiveTasks.pauseActions()
                this.lastActionEnd = new Date()
              } else if (time.getTime() === this.lastActionEnd.getTime()) {
                f()
              }
            }, 1500)
          }
          f()
        }
      },

      destroy () {
        this.activeTasksLoading = true
        if (this.reactiveActiveTasks) {
          this.reactiveActiveTasks.stopActions()
        }
        this.loading.goals = false
        this.loading.progress = false
        this.loading.activities = false
        this.loading.interruptions = false
      },

      clearTasks () {
        this.tasks = {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        }
      },

      getActiveGroupTasks () {
        this.reactiveActiveTasks.getNext(1).then(() => {
          this.reactiveActiveTasks.getNext(2).then(() => {
            this.reactiveActiveTasks.getNext(3).then(() => {
              this.reactiveActiveTasks.getNext(4).then(() => {
                this.reactiveActiveTasks.setOnUpdated(() => {
                  this.setTasks()
                })
                this.reactiveActiveTasks.onUpdated()
                this.reactiveActiveTasks.updater()
                this.reactiveActiveTasks.refresher()
                setTimeout(() => {
                  this.activeTasksLoading = false
                  this.force = false
                  this.removeLoadingTag('ActiveGroupTasksLoading')
                }, 500)
              }).catch(() => {
                this.refresh()
              })
            }).catch(() => {
              this.refresh()
            })
          }).catch(() => {
            this.refresh()
          })
        }).catch(() => {
          this.refresh()
        })
      },

      setTasks () {
        var time = this.animationStartTime
        var f = () => {
          if ((new Date()).getTime() - this.animationStartTime.getTime() >= 800 || this.force) {
            this.tasksDict = this.reactiveActiveTasks.getTasksDict()
            this.animationStartTime = new Date()
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
          } else {
            setTimeout(() => {
              if (time.getTime() === this.animationStartTime.getTime()) {
                f()
              }
            }, 100)
          }
        }
        f()
      },

      getGroupAndTasks (id) {
        var currentUpdate = this.updated
        simpleRequest('/api/groups/list/' + id + '/').method('get').then((response) => {
          var group = response.data
          this.group = new Group()
          this.group.override(getGroupFromResponse(group))
          simpleRequest('/api/groups/my/member-cards/').method('get').then((response) => {
            for (let data of response.data) {
              if (data.group.id === group.id) {
                this.group.override(getGroupFromResponse({...group, memberCardId: data.id}))
                this.isStaff = data.is_staff
                if (currentUpdate === this.updated) {
                  if (this.reactiveActiveTasks) {
                    this.reactiveActiveTasks.stopActions()
                  }
                  this.reactiveActiveTasks = new ReactiveActiveGroupTasks(this.group)
                  this.getActiveGroupTasks()
                }
                break
              }
            }
          }).catch((error) => {
            this.showNotification('error')
            console.log(error)
          })
        }).catch((error) => {
          this.showNotification('error')
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
        simpleRequest('/api/group_tasks/active/groups/' + this.group.instance.id + '/task/orders/' + task.instance.id + '/', data).method('put').then((response) => {
          task.override(getGroupTaskFromResponse(response.data))
          console.log(response)
        }).catch((error) => {
          this.refresh()
          console.log(error)
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
        simpleRequest('/api/group_tasks/active/groups/' + this.group.instance.id + '/task/orders/' + task.instance.id + '/', data).method('put').then((response) => {
          task.override(getGroupTaskFromResponse(response.data))
          console.log(response)
        }).catch((error) => {
          this.refresh()
          console.log(error)
        })
      },

      onDragStart () {
        this.isDragging = true
        this.pauseActions(true)
      },

      onDragEnd () {
        this.isDragging = false
        this.lastDragEnd = new Date()
        setTimeout(() => {
          if (!this.isDragging && ((new Date()).getTime() - this.lastDragEnd.getTime()) >= 500) {
            this.continueActions()
          }
        }, 1000)
      },

      createActiveGroupTask (task) {
        this.pauseActions(true)
        simpleRequest('/api/group_tasks/active/groups/' + this.group.instance.id + '/tasks/', {
          text: task.text,
          priority: task.priority
        }).method('post').then((response) => {
          this.$refs.groupTaskEditor.closeEditor()
          task.override(getGroupTaskFromResponse(response.data))
          switch (task.priority) {
            case 1:
              task.order = (this.tasks.goals.length > 0) ? this.tasks.goals[0].order - 1 : 0
              break
            case 2:
              task.order = (this.tasks.progress.length > 0) ? this.tasks.progress[0].order - 1 : 0
              break
            case 3:
              task.order = (this.tasks.activities.length > 0) ? this.tasks.activities[0].order - 1 : 0
              break
            case 4:
              task.order = (this.tasks.interruptions.length > 0) ? this.tasks.interruptions[0].order - 1 : 0
              break
          }
          this.reactiveActiveTasks.addTask(task)
          this.reactiveActiveTasks.onUpdated()
          this.continueActions()
          console.log(response)
        }).catch((error) => {
          this.refresh()
          console.log(error)
        })
      },

      updateActiveGroupTask (task) {
        this.pauseActions(true)
        simpleRequest('/api/group_tasks/active/groups/' + this.group.instance.id + '/tasks/' + task.instance.id + '/', {
          text: task.text,
          priority: task.priority,
          order: task.order
        }).method('put').then((response) => {
          this.$refs.groupTaskEditor.closeEditor()
          task.override(getGroupTaskFromResponse(response.data))
          this.continueActions()
          console.log(response)
        }).catch((error) => {
          this.refresh()
          console.log(error)
        })
      },

      onEditClick (task) {
        if (window.linkClicked) {
          window.linkClicked = false
        } else {
          this.$refs.groupTaskEditor.openEditor()
          this.$refs.groupTaskEditor.setTaskInstance(task)
        }
      },

      onDoneClick (task) {
        this.pauseActions(true)
        simpleRequest('/api/group_tasks/active/groups/' + this.group.instance.id + '/tasks/' + task.instance.id + '/complete/').method('post').then((response) => {
          this.reactiveActiveTasks.removeTask(task)
          this.reactiveActiveTasks.onUpdated()
          this.continueActions()
          console.log(response)
        }).catch((error) => {
          this.refresh()
          console.log(error)
        })
      },

      onDeleteClick (task) {
        this.pauseActions(true)
        simpleRequest('/api/group_tasks/active/groups/' + this.group.instance.id + '/tasks/' + task.instance.id + '/').method('delete').then((response) => {
          this.reactiveActiveTasks.removeTask(task)
          this.reactiveActiveTasks.onUpdated()
          this.continueActions()
          console.log(response)
        }).catch((error) => {
          this.refresh()
          console.log(error)
        })
      },

      loadNextTasks (priority) {
        if (this.getLoadingState(priority)) return
        this.setLoadingState(parseInt(priority), true)
        setTimeout(() => {
          this.reactiveActiveTasks.getNext(parseInt(priority)).then(() => {
            this.setLoadingState(parseInt(priority), false)
          })
        }, 500)
      },

      filterWithUrls (text) {
        text = text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
        var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(www\.)?[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g
        return text.replace(regex, (match, a, b) => {
          var url = match
          if (!url.match(/^[a-zA-Z]+:\/\//)) {
            url = '//' + url
          }
          return '<a target="_blank" class="task-text-link" href="' + url + '" onclick="window.linkClicked = true">' + match + '</a>'
        })
      },

      setLoadingState (priority, state) {
        switch (priority) {
          case 1:
            this.loading.goals = state
            break
          case 2:
            this.loading.progress = state
            break
          case 3:
            this.loading.activities = state
            break
          case 4:
            this.loading.interruptions = state
            break
        }
      },

      getLoadingState (priority) {
        switch (priority) {
          case 1:
            return this.loading.goals
          case 2:
            return this.loading.progress
          case 3:
            return this.loading.activities
          case 4:
            return this.loading.interruptions
        }
      },

      openedGroupTaskEditor () {
        this.pauseActions(true)
      },

      closedGroupTaskEditor () {
        this.continueActions(true)
      },

      onNewGoalClick () {
        this.$refs.groupTaskEditor.openEditor()
        this.$refs.groupTaskEditor.setPriority(1)
      },

      onNewProgressClick () {
        this.$refs.groupTaskEditor.openEditor()
        this.$refs.groupTaskEditor.setPriority(2)
      },

      onNewActivityClick () {
        this.$refs.groupTaskEditor.openEditor()
        this.$refs.groupTaskEditor.setPriority(3)
      },

      onNewInterruptionClick () {
        this.$refs.groupTaskEditor.openEditor()
        this.$refs.groupTaskEditor.setPriority(4)
      }
    },
    components: {
      Draggable,
      ActiveTask,
      GroupTaskEditor
    }
  }
</script>

<style scoped>
  .list-tasks-enter-active {
    overflow: hidden;
    transition: all 500ms ease;
  }

  .list-tasks-move {
    transition: transform 500ms;
  }

  .list-tasks-leave-active {
    overflow: hidden;
    transition: all 500ms ease;
  }

  .list-tasks-enter,
  .list-tasks-leave-to {
    transition: all 500ms ease;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }
</style>

<style lang="stylus">
  .task-text-link
    text-decoration: none
    &:hover
      color: #F2215D
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
      margin-bottom: 16px

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
