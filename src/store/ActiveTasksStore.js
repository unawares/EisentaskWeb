import activeTasksActions from '@/utils/ActiveTasksActions'
import setDefaultOnFailure from '@/utils/SetDefaultOnFailure'

setDefaultOnFailure(activeTasksActions)

export default {
  state: {
    activeTasksNotifier: {
      updates: 0
    },
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
          state.activeTasksNotifier.updates++
        }
      }
      activeTasksActions.getActiveTasks(callback)
    },

    createActiveTask (state, task) {
      state.activeTasksActiveRequests.count++
      var callback = (res) => {
        state.activeTasksActiveRequests.count--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasksActiveRequests.count === 0) {
          state.activeTasksNotifier.updates++
        }
      }
      state.activeTasks.tasks.push(task)
      activeTasksActions.createTask(task, callback)
    },

    updateActiveTask (state, task) {
      state.activeTasksActiveRequests.count++
      var callback = (res) => {
        state.activeTasksActiveRequests.count--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasksActiveRequests.count === 0) {
          state.activeTasksNotifier.updates++
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
          state.activeTasksNotifier.updates++
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
      state.activeTasksNotifier.updates = 0
    }
  },

  getters: {
    activeTasks (state) {
      return state.activeTasks.tasks
    },

    activeTasksOrders (state) {
      return state.activeTasks.orders
    },

    activeTasksNotifier (state) {
      return state.activeTasksNotifier
    },

    activeTasksActiveRequests (state) {
      return state.activeTasksActiveRequests
    }
  }
}
