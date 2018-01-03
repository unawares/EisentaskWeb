import QueueRequests from './QueueRequests'
import Task from '@/models/Task'

const queueRequests = new QueueRequests({
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

queueRequests.method = queueRequests.RETRY

var getTaskFromResponse = function (response) {
  var task = {
    id: response.data.task.id,
    text: response.data.task.text,
    priority: response.data.task.priority,
    completed: response.data.task.completed
  }
  if (!task.completed) {
    switch (task.priority) {
      case 1:
        task.position = response.data.active_tasks.goals.indexOf(task.id)
        break
      case 2:
        task.position = response.data.active_tasks.progress.indexOf(task.id)
        break
      case 3:
        task.position = response.data.active_tasks.activities.indexOf(task.id)
        break
      case 4:
        task.position = response.data.active_tasks.interruptions.indexOf(task.id)
        break
    }
  } else {
    task.position = -1
  }
  return task
}

export default class ActiveTasksActions {
  static getActiveTasks () {
    var tasks = []
    queueRequests.push('get', '/api/tasks/active/').onSuccess((response) => {
      for (let task of response.data.tasks) {
        var t = new Task()
        t.instance = getTaskFromResponse({
          data: {
            task: task,
            active_tasks: response.data.active_tasks
          }
        })
        tasks.push(t)
      }
      console.log(response)
    }).onError((error) => {
      console.log(error)
    })
    queueRequests.start()
    return tasks
  }

  static createTask (task) {
    queueRequests.push('post', '/api/tasks/active/', {
      task: {
        text: task.text,
        priority: task.priority,
        completed: task.completed
      }
    }).onSuccess((response) => {
      task.instance = getTaskFromResponse(response)
      console.log(response)
    }).onError((error) => {
      console.log(error)
    })
    queueRequests.start()
    return task
  }

  static updateTask (task) {
    queueRequests.push('put', '/api/tasks/active/' + task.original.id + '/', {
      task: {
        text: task.text,
        priority: task.priority,
        completed: task.completed,
        new_position: task.position
      }
    }).onSuccess((response) => {
      task.instance = getTaskFromResponse(response)
      console.log(response)
    }).onError((error) => {
      console.log(error)
    })
    queueRequests.start()
    return task
  }

  static deleteTask (task) {
    queueRequests.push('delete', '/api/tasks/active/' + task.original.id + '/').onSuccess((response) => {
      console.log(response)
    }).onError((error) => {
      console.log(error)
    })
    queueRequests.start()
    return task
  }
}
