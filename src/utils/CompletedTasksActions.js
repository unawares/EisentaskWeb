import { RETRY, createQueueRequests } from './QueueRequests'
import Task from '@/models/Task'

var queueRequestsRetry = createQueueRequests(RETRY, {
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

// Get task from response
var getTaskFromResponse = function (response) {
  var task = {
    id: response.id,
    text: response.text,
    priority: response.priority,
    completed: response.completed,
    updated: response.updated,
    created: response.created
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

export default class CompletedTasksActions {
  static getCompletedTasks (callback) {
    /*
      Get all active tasks
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      tasks: []
    }
    queueRequestsRetry.push(
      'get', '/api/tasks/completed/'
    ).onSuccess((response) => {
      for (let task of response.data) {
        var t = new Task()
        t.instance = getTaskFromResponse(task)
        res.tasks.push(t)
      }
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
    console.log(task)
    /*
      Update task
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      task
    }
    var data = {
      text: task.text,
      priority: task.priority,
      completed: task.completed
    }
    queueRequestsRetry.push(
      'put', '/api/tasks/completed/' + task.instance.id + '/', data
    ).onSuccess((response) => {
      res.task.instance = getTaskFromResponse(response)
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
      task
    }
    queueRequestsRetry.push(
      'delete', '/api/tasks/completed/' + task.instance.id + '/'
    ).onSuccess((response) => {
      res.task.instance = getTaskFromResponse(response)
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
