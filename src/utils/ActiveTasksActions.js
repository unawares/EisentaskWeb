import { RETRY, createQueueRequests } from './QueueRequests'
import Task from '@/models/Task'

var queueRequestsRetry = createQueueRequests(RETRY, {
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

// Get task from response
var getTaskFromResponse = function (response) {
  var task = {
    id: response.data.task.id,
    text: response.data.task.text,
    priority: response.data.task.priority,
    completed: response.data.task.completed,
    updated: response.data.task.updated,
    created: response.data.task.created
  }
  return task
}

class OnFailHelper {
  constructor () {
    this.statusCodes = []
    this.onCatchStatusCodes = () => {}
  }
}

var setActionsToFailHelper = function (onFailHelper) {
  return {
    onCatchStatusCodes: (statusCodes) => {
      onFailHelper.statusCodes = statusCodes
      return {
        do: (func) => {
          onFailHelper.onCatchStatusCodes = func
        }
      }
    }
  }
}

export default class ActiveTasksActions {
  static getActiveTasks (callback) {
    /*
      Get all active tasks
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      tasks: [],
      activeTasks: {}
    }
    queueRequestsRetry.push(
      'get', { getUrl () { return '/api/tasks/active/' } }
    ).onSuccess((response) => {
      for (let task of response.data.tasks) {
        var t = new Task()
        t.instance = getTaskFromResponse({
          data: {
            task: task
          }
        })
        res.tasks.push(t)
      }
      res.activeTasks = response.data.active_tasks
      callback(res)
      console.log(response)
    }).onError((error) => {
      if (error.response) {
        if (onFailHelper.statusCodes.indexOf(error.response.status) !== -1) {
          onFailHelper.onCatchStatusCodes(queueRequestsRetry)
        }
      }
      console.log(error)
    })
    queueRequestsRetry.start()
    return setActionsToFailHelper(onFailHelper)
  }

  static createTask (task, callback) {
    /*
      Create task
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      task,
      activeTasks: {}
    }
    queueRequestsRetry.push('post', { getUrl () { return '/api/tasks/active/' } }, {
      task: {
        text: task.text,
        priority: task.priority,
        completed: task.completed
      }
    }).onSuccess((response) => {
      res.task.instance = getTaskFromResponse(response)
      res.activeTasks = response.data.active_tasks
      callback(res)
      console.log(response)
    }).onError((error) => {
      if (error.response) {
        if (onFailHelper.statusCodes.indexOf(error.response.status) !== -1) {
          onFailHelper.onCatchStatusCodes(queueRequestsRetry)
        }
      }
      console.log(error)
    })
    queueRequestsRetry.start()
    return setActionsToFailHelper(onFailHelper)
  }

  static updateTask (task, callback) {
    /*
      Update task
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      task,
      activeTasks: {}
    }
    var data = {
      task: {
        text: task.text,
        priority: task.priority,
        completed: task.completed
      }
    }
    if (task.newPosition !== undefined) {
      data.new_position = task.newPosition
      delete task.newPosition
    }
    queueRequestsRetry.push(
      'put', { getUrl () { return '/api/tasks/active/' + task.instance.id + '/' } }, data
    ).onSuccess((response) => {
      res.task.instance = getTaskFromResponse(response)
      res.activeTasks = response.data.active_tasks
      callback(res)
      console.log(response)
    }).onError((error) => {
      if (error.response) {
        if (onFailHelper.statusCodes.indexOf(error.response.status) !== -1) {
          onFailHelper.onCatchStatusCodes(queueRequestsRetry)
        }
      }
      console.log(error)
    })
    queueRequestsRetry.start()
    return setActionsToFailHelper(onFailHelper)
  }

  static deleteTask (task, callback) {
    /*
      Delete task
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      task,
      activeTasks: {}
    }
    queueRequestsRetry.push(
      'delete', { getUrl () { return '/api/tasks/active/' + task.instance.id + '/' } }
    ).onSuccess((response) => {
      res.task.instance = getTaskFromResponse(response)
      res.activeTasks = response.data.active_tasks
      callback(res)
      console.log(response)
    }).onError((error) => {
      if (error.response) {
        if (onFailHelper.statusCodes.indexOf(error.response.status) !== -1) {
          onFailHelper.onCatchStatusCodes(queueRequestsRetry)
        }
      }
      console.log(error)
    })
    queueRequestsRetry.start()
    return setActionsToFailHelper(onFailHelper)
  }
}
