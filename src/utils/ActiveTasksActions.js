import QueueRequests from './QueueRequests'
import Task from '@/models/Task'

const queueRequests = new QueueRequests({
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

queueRequests.method = queueRequests.RETRY

// Get task from response
var getTaskFromResponse = function (response) {
  var task = {
    id: response.data.task.id,
    text: response.data.task.text,
    priority: response.data.task.priority,
    completed: response.data.task.completed
  }
  return task
}

export default class ActiveTasksActions {
  static getActiveTasks (callback) {
    /*
      Get all active tasks
    */
    var res = {
      tasks: [],
      activeTasks: {}
    }
    queueRequests.push('get', '/api/tasks/active/').onSuccess((response) => {
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
      console.log(error)
    })
    queueRequests.start()
  }

  static createTask (task, callback) {
    /*
      Create task
    */
    var res = {
      task,
      activeTasks: {}
    }
    queueRequests.push('post', '/api/tasks/active/', {
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
      console.log(error)
    })
    queueRequests.start()
  }

  static updateTask (task, callback) {
    /*
      Update task
    */
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
    }
    queueRequests.push('put', '/api/tasks/active/' + task.original.id + '/', data).onSuccess((response) => {
      res.task.instance = getTaskFromResponse(response)
      res.activeTasks = response.data.active_tasks
      callback(res)
      console.log(response)
    }).onError((error) => {
      console.log(error)
    })
    queueRequests.start()
  }

  static deleteTask (task, callback) {
    /*
      Delete task
    */
    var res = {
      task,
      activeTasks: {}
    }
    queueRequests.push('delete', '/api/tasks/active/' + task.original.id + '/').onSuccess((response) => {
      res.task.instance = getTaskFromResponse(response)
      res.activeTasks = response.data.active_tasks
      callback(res)
      console.log(response)
    }).onError((error) => {
      console.log(error)
    })
    queueRequests.start()
  }
}
