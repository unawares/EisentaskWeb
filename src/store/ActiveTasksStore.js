import EventEmitter from 'events'
import activeTasksActions from '@/utils/ActiveTasksActions'
import setDefaultOnFailure from '@/utils/SetDefaultOnFailure'

setDefaultOnFailure(activeTasksActions)

export default {
  state: {
    activeTasksEventEmitter: new EventEmitter(),
    activeTasksActiveRequests: {
      count: 0
    },
    activeTasks: {
      tasks: [],
      orders: {
        goals: [],
        progress: [],
        activities: [],
        interruptions: []
      }
    }
  },

  actions: {
  },

  mutations: {
    getActiveTasks (state) {
      state.activeTasksActiveRequests.count++
      var callback = (res) => {
        state.activeTasksActiveRequests.count--
        state.activeTasks.tasks = res.tasks
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasksActiveRequests.count === 0) {
          state.activeTasksEventEmitter.emit('updated')
        }
      }
      activeTasksActions.getActiveTasks(callback).onCatchStatusCodes().do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshActiveTasks')
      })
    },

    createActiveTask (state, task) {
      state.activeTasksActiveRequests.count++
      var callback = (res) => {
        state.activeTasksActiveRequests.count--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasksActiveRequests.count === 0) {
          state.activeTasksEventEmitter.emit('updated')
        }
      }
      state.activeTasks.tasks.push(task)
      activeTasksActions.createTask(task, callback).onCatchStatusCodes().do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshActiveTasks')
      })
    },

    updateActiveTask (state, task) {
      state.activeTasksActiveRequests.count++
      var callback = (res) => {
        state.activeTasksActiveRequests.count--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasksActiveRequests.count === 0) {
          state.activeTasksEventEmitter.emit('updated')
        }
      }
      var id = task.instance.id
      if (task.completed) {
        state.activeTasks.tasks = state.activeTasks.tasks.filter((task) => {
          return task.instance.id !== id
        })
      }
      activeTasksActions.updateTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshActiveTasks')
        this.commit('getActiveTasks')
      })
    },

    deleteActiveTask (state, task) {
      state.activeTasksActiveRequests.count++
      var callback = (res) => {
        state.activeTasksActiveRequests.count--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasksActiveRequests.count === 0) {
          state.activeTasksEventEmitter.emit('updated')
        }
      }
      var id = task.instance.id
      state.activeTasks.tasks = state.activeTasks.tasks.filter((task) => {
        return task.instance.id !== id
      })
      activeTasksActions.deleteTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshActiveTasks')
        this.commit('getActiveTasks')
      })
    },

    refreshActiveTasks (state) {
      state.activeTasks.tasks = []
      state.activeTasks.orders = {
        goals: [],
        progress: [],
        activities: [],
        interruptions: []
      }
      state.activeTasksActiveRequests.count = 0
    }
  },

  getters: {
    activeTasks (state) {
      return state.activeTasks.tasks
    },

    activeTasksOrders (state) {
      return state.activeTasks.orders
    },

    activeTasksEventEmitter (state) {
      return state.activeTasksEventEmitter
    },

    activeTasksActiveRequests (state) {
      return state.activeTasksActiveRequests
    }
  }
}
