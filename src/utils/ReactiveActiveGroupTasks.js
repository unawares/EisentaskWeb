import simpleRequest from '@/utils/SimpleRequest'
import GroupTask from '@/models/GroupTask'

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

export default class ReactiveActiveGroupTasks {
  constructor (group) {
    this.group = group
    this.init()
  }

  init () {
    this.tasksDict = {}
    this.onUpdated = () => {}
    this.isPaused = false
    this.isActive = false
    this.responsedURLS = []
    this.updaterIsActive = false
    this.refresherIsActive = false
    this.taskIds = []
    let startGoalsURL = '/api/group_tasks/active/priority/' + 1 + '/groups/' + this.group.instance.id + '/'
    let startProgressURL = '/api/group_tasks/active/priority/' + 2 + '/groups/' + this.group.instance.id + '/'
    let startActivitiesURL = '/api/group_tasks/active/priority/' + 3 + '/groups/' + this.group.instance.id + '/'
    let startInterruptionsURL = '/api/group_tasks/active/priority/' + 4 + '/groups/' + this.group.instance.id + '/'
    this.urls = {
      goals: {
        start: startGoalsURL,
        next: startGoalsURL
      },
      progress: {
        start: startProgressURL,
        next: startProgressURL
      },
      activities: {
        start: startActivitiesURL,
        next: startActivitiesURL
      },
      interruptions: {
        start: startInterruptionsURL,
        next: startInterruptionsURL
      }
    }
  }

  getTasksDict () {
    return this.tasksDict
  }

  setOnUpdated (func) {
    this.onUpdated = func
  }

  addTask (task) {
    if (!(task.id in this.tasksDict)) {
      this.tasksDict[task.instance.id] = task
      this.taskIds.push(task.instance.id)
    }
  }

  removeTask (task) {
    if (task.instance.id in this.tasksDict) {
      delete this.tasksDict[task.instance.id]
    }
    let index = this.taskIds.indexOf(task.instance.id)
    if (index !== -1) {
      this.taskIds.splice(index, 1)
    }
  }

  getNext (priority) {
    return new Promise((resolve, reject) => {
      var url
      switch (priority) {
        case 1:
          url = this.urls.goals
          break
        case 2:
          url = this.urls.progress
          break
        case 3:
          url = this.urls.activities
          break
        case 4:
          url = this.urls.interruptions
          break
      }
      if (url.next !== null) {
        simpleRequest(url.next).method('get').then((response) => {
          this.responsedURLS.push(url.next)
          url.next = response.data.next
          for (let task of response.data.results) {
            if (task.id in this.tasksDict) {
              this.tasksDict[task.id].override(getGroupTaskFromResponse(task))
            } else {
              var t = new GroupTask()
              t.instance = getGroupTaskFromResponse(task)
              this.tasksDict[t.instance.id] = t
              this.taskIds.push(t.instance.id)
            }
          }
          this.onUpdated()
          console.log(response)
          resolve()
        }).catch((error) => {
          console.log(error)
          reject()
        })
      }
    })
  }

  stopActions () {
    this.updaterIsActive = false
    this.refresherIsActive = false
  }

  pauseActions () {
    this.isPaused = true
  }

  continueActions () {
    this.isPaused = false
  }

  updater () {
    if (this.updaterIsActive) {
      return
    }
    this.updaterIsActive = true
    var index = 0
    var func = () => {
      return new Promise((resolve, reject) => {
        simpleRequest(this.responsedURLS[index]).method('get').then((response) => {
          for (let task of response.data.results) {
            if (task.id in this.tasksDict) {
              this.tasksDict[task.id].override(getGroupTaskFromResponse(task))
            } else {
              var t = new GroupTask()
              t.instance = getGroupTaskFromResponse(task)
              this.tasksDict[t.instance.id] = t
              this.taskIds.push(t.instance.id)
            }
          }
          ++index
          if (index >= this.responsedURLS.length) {
            index = 0
          }
          resolve(response)
          console.log(response)
        }).catch((error) => {
          reject(error)
          console.log(error)
        })
      })
    }
    var f = () => {
      if (this.updaterIsActive) {
        setTimeout(() => {
          if (!this.isPaused && this.updaterIsActive) {
            func().then(() => { f() }).catch(() => { f() })
          } else if (this.updaterIsActive) {
            f()
          }
        }, 5000)
      }
    }
    f()
  }

  refresher () {
    if (this.refresherIsActive) {
      return
    }
    this.refresherIsActive = true
    var getIds = () => {
      var ids = []
      for (let key in this.tasksDict) {
        if (this.tasksDict.hasOwnProperty(key)) {
          if ('id' in this.tasksDict[key].instance) {
            ids.push(this.tasksDict[key].instance.id)
          }
        }
      }
      return ids
    }
    var func = () => {
      return new Promise((resolve, reject) => {
        var ids = getIds()
        if (ids.length > 0) {
          simpleRequest('/api/group_tasks/active/groups/' + this.group.instance.id + '/selection/tasks/', {
            ids: ids
          }).method('post').then((response) => {
            for (let task of response.data) {
              this.tasksDict[task.id].override(getGroupTaskFromResponse(task))
              ids.splice(ids.indexOf(task.id), 1)
            }
            for (let id of ids) {
              delete this.tasksDict[id]
              let index = this.taskIds.indexOf(id)
              if (index !== -1) {
                this.taskIds.splice(index, 1)
              }
            }
            this.onUpdated()
            resolve(response)
            console.log(response)
          }).catch((error) => {
            reject(error)
            console.log(error)
          })
        } else {
          reject()
        }
      })
    }
    var f = () => {
      if (this.refresherIsActive) {
        setTimeout(() => {
          if (!this.isPaused && this.refresherIsActive) {
            func().then(() => { f() }).catch(() => { f() })
          } else if (this.refresherIsActive) {
            f()
          }
        }, 2500)
      }
    }
    f()
  }
}
