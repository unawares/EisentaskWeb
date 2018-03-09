import EventEmitter from 'events'
import completedTasksActions from '@/utils/CompletedTasksActions'
import setDefaultOnFailure from '@/utils/SetDefaultOnFailure'

setDefaultOnFailure(completedTasksActions)

export default {
  state: {
    completedTasksEventEmitter: new EventEmitter(),
    completedTasksActiveRequests: {
      count: 0
    },
    completedTasks: {
      tasks: [],
      activeRequests: 0
    }
  },

  actions: {
  },

  mutations: {
    getCompletedTasks (state) {
      state.completedTasksActiveRequests.count++
      var callback = (res) => {
        state.completedTasksActiveRequests.count--
        state.completedTasks.tasks = res.tasks
        if (state.completedTasksActiveRequests.count === 0) {
          state.completedTasksEventEmitter.emit('updated')
        }
      }
      completedTasksActions.getCompletedTasks(callback).onCatchStatusCodes().do((queueRequests) => {
        this.commit('getUser')
        queueRequests.clear()
        this.commit('refreshCompletedTasks')
      })
    },

    updateCompletedTask (state, task) {
      state.completedTasksActiveRequests.count++
      var callback = (res) => {
        state.completedTasksActiveRequests.count--
        if (state.completedTasksActiveRequests.count === 0) {
          state.completedTasksEventEmitter.emit('updated')
        }
      }
      var id = task.instance.id
      if (!task.completed) {
        state.completedTasks.tasks = state.completedTasks.tasks.filter((task) => {
          return task.instance.id !== id
        })
      }
      completedTasksActions.updateTask(task, callback).onCatchStatusCodes().do((queueRequests) => {
        this.commit('getUser')
        queueRequests.clear()
        this.commit('refreshCompletedTasks')
        this.commit('getCompletedTasks')
      })
    },

    deleteCompletedTask (state, task) {
      state.completedTasksActiveRequests.count++
      var callback = (res) => {
        state.completedTasksActiveRequests.count--
        if (state.completedTasksActiveRequests.count === 0) {
          state.completedTasksEventEmitter.emit('updated')
        }
      }
      var id = task.instance.id
      state.completedTasks.tasks = state.completedTasks.tasks.filter((task) => {
        return task.instance.id !== id
      })
      completedTasksActions.deleteTask(task, callback).onCatchStatusCodes().do((queueRequests) => {
        this.commit('getUser')
        queueRequests.clear()
        this.commit('refreshCompletedTasks')
        this.commit('getCompletedTasks')
      })
    },

    refreshCompletedTasks (state) {
      state.completedTasks.tasks = []
      state.completedTasksActiveRequests.count = 0
    }
  },

  getters: {
    completedTasks (state) {
      return state.completedTasks.tasks
    },

    completedTasksEventEmitter (state) {
      return state.completedTasksEventEmitter
    },

    completedTasksActiveRequests (state) {
      return state.completedTasksActiveRequests
    }
  }
}
