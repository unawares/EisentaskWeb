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
  static tasksDict = {}
  static group = undefined
  static onUpdated () {}
  static isDragging = false
  static isActive = false

  constructor (startURL) {
    this.startURL = startURL
    this.nextURL = this.startURL
    this.responsedURLS = []
    this.removed = false
    this.taskIds = []
    if (!ReactiveActiveGroupTasks.isActive) {
      ReactiveActiveGroupTasks.isActive = true
      ReactiveActiveGroupTasks.refresher()
    }
  }

  static setGroup (group) {
    ReactiveActiveGroupTasks.group = group
  }

  static getTasksDict () {
    return ReactiveActiveGroupTasks.tasksDict
  }

  static setOnUpdated (func) {
    ReactiveActiveGroupTasks.onUpdated = func
  }

  static setDragging (state) {
    ReactiveActiveGroupTasks.isDragging = state
  }

  getNext () {
    if (this.nextURL !== null) {
      simpleRequest(this.startURL).method('get').then((response) => {
        this.responsedURLS.push(this.nextURL)
        this.nextURL = response.data.next
        for (let task of response.data.results) {
          if (task.id in ReactiveActiveGroupTasks.tasksDict) {
            ReactiveActiveGroupTasks.tasksDict[task.id].override(getGroupTaskFromResponse(task))
          } else {
            var t = new GroupTask()
            t.instance = getGroupTaskFromResponse(task)
            ReactiveActiveGroupTasks.tasksDict[t.instance.id] = t
            this.taskIds.push(t.instance.id)
          }
        }
        ReactiveActiveGroupTasks.onUpdated()
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  destroy () {
    this.removed = true
    delete this.responsedURLS
    for (let taskId of this.taskIds) {
      delete ReactiveActiveGroupTasks.tasksDict[taskId]
    }
  }

  updater () {
    var index = 0
    var func = () => {
      return new Promise((resolve, reject) => {
        simpleRequest(this.responsedURLS[index]).method('get').then((response) => {
          for (let task of response.data.results) {
            if (task.id in ReactiveActiveGroupTasks.tasksDict) {
              ReactiveActiveGroupTasks.tasksDict[task.id].override(getGroupTaskFromResponse(task))
            } else {
              var t = new GroupTask()
              t.instance = getGroupTaskFromResponse(task)
              ReactiveActiveGroupTasks.tasksDict[t.instance.id] = t
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
      if (!this.removed) {
        setTimeout(() => {
          if (!ReactiveActiveGroupTasks.isDragging && !this.removed) {
            func().then(() => { f() }).catch(() => { f() })
          } else if (!this.removed) {
            f()
          }
        }, 10000)
      }
    }
    f()
  }

  static refresher () {
    var getIds = () => {
      var ids = []
      for (let key in ReactiveActiveGroupTasks.tasksDict) {
        if (ReactiveActiveGroupTasks.tasksDict.hasOwnProperty(key)) {
          if ('id' in ReactiveActiveGroupTasks.tasksDict[key].instance) {
            ids.push(ReactiveActiveGroupTasks.tasksDict[key].instance.id)
          }
        }
      }
      return ids
    }
    var func = () => {
      return new Promise((resolve, reject) => {
        var ids = getIds()
        simpleRequest('/api/group_tasks/active/groups/' + ReactiveActiveGroupTasks.group.instance.id + '/selection/tasks/', {
          ids: ids
        }).method('post').then((response) => {
          for (let task of response.data) {
            ReactiveActiveGroupTasks.tasksDict[task.id].override(getGroupTaskFromResponse(task))
            ids.splice(ids.indexOf(task.id), 1)
          }
          for (let id of ids) {
            delete ReactiveActiveGroupTasks.tasksDict[id]
          }
          ReactiveActiveGroupTasks.onUpdated()
          resolve(response)
          console.log(response)
        }).catch((error) => {
          reject(error)
          console.log(error)
        })
      })
    }
    var f = () => {
      if (ReactiveActiveGroupTasks.isActive) {
        setTimeout(() => {
          if (!ReactiveActiveGroupTasks.isDragging && ReactiveActiveGroupTasks.isActive) {
            func().then(() => { f() }).catch(() => { f() })
          } else if (ReactiveActiveGroupTasks.isActive) {
            f()
          }
        }, 5000)
      }
    }
    f()
  }
}
