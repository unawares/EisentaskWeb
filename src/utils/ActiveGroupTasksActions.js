import { RETRY, createQueueRequests } from './QueueRequests'
import Task from '@/models/Task'

var queueRequestsRetry = createQueueRequests(RETRY, {
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

// Get task from response
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
  static setOnFailureListener (func) {
    queueRequestsRetry.onFailure = func
  }

  static createTask (task, callback) {
    /*
      Create task
    */
    var onFailHelper = new OnFailHelper()
    return setActionsToFailHelper(onFailHelper)
  }

  static updateTask (task, callback) {
    /*
      Update task
    */
    var onFailHelper = new OnFailHelper()
    return setActionsToFailHelper(onFailHelper)
  }

  static deleteTask (task, callback) {
    /*
      Delete task
    */
    var onFailHelper = new OnFailHelper()
    return setActionsToFailHelper(onFailHelper)
  }
}
