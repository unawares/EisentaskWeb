import Vue from 'vue'
import Vuex from 'vuex'
import ActiveTasksActions from '@/utils/ActiveTasksActions'
import CompletedTasksActions from '@/utils/CompletedTasksActions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeTasksNotifier: {
      updates: 0
    },
    activeTasks: {
      tasks: [],
      orders: {
        goals: [],
        progress: [],
        activities: [],
        interruptions: []
      },
      activeRequests: 0
    },
    completedTasksNotifier: {
      updates: 0
    },
    completedTasks: {
      tasks: [],
      activeRequests: 0
    }
  },

  actions: {
  },

  mutations: {
    getActiveTasks (state) {
      state.activeTasks.activeRequests++
      var callback = (res) => {
        state.activeTasks.activeRequests--
        state.activeTasks.tasks = res.tasks
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasks.activeRequests === 0) {
          state.activeTasksNotifier.updates++
        }
      }
      ActiveTasksActions.getActiveTasks(callback)
    },

    createActiveTask (state, task) {
      state.activeTasks.activeRequests++
      var callback = (res) => {
        state.activeTasks.activeRequests--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasks.activeRequests === 0) {
          state.activeTasksNotifier.updates++
        }
      }
      state.activeTasks.tasks.push(task)
      ActiveTasksActions.createTask(task, callback)
    },

    updateActiveTask (state, task) {
      state.activeTasks.activeRequests++
      var callback = (res) => {
        state.activeTasks.activeRequests--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasks.activeRequests === 0) {
          state.activeTasksNotifier.updates++
        }
      }
      var id = task.instance.id
      if (task.completed) {
        state.activeTasks.tasks = state.activeTasks.tasks.filter((task) => {
          return task.instance.id !== id
        })
      }
      ActiveTasksActions.updateTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        state.activeTasks.tasks = []
        state.activeTasks.orders = {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        }
        state.activeTasks.activeRequests = 0
        this.commit('getActiveTasks')
      })
    },

    deleteActiveTask (state, task) {
      state.activeTasks.activeRequests++
      var callback = (res) => {
        state.activeTasks.activeRequests--
        state.activeTasks.orders = res.activeTasks
        if (state.activeTasks.activeRequests === 0) {
          state.activeTasksNotifier.updates++
        }
      }
      var id = task.instance.id
      state.activeTasks.tasks = state.activeTasks.tasks.filter((task) => {
        return task.instance.id !== id
      })
      ActiveTasksActions.deleteTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        state.activeTasks.tasks = []
        state.activeTasks.orders = {
          goals: [],
          progress: [],
          activities: [],
          interruptions: []
        }
        state.activeTasks.activeRequests = 0
        this.commit('getActiveTasks')
      })
    },

    getCompletedTasks (state) {
      state.completedTasks.activeRequests++
      var callback = (res) => {
        state.completedTasks.activeRequests--
        state.completedTasks.tasks = res.tasks
        if (state.completedTasks.activeRequests === 0) {
          state.completedTasksNotifier.updates++
        }
      }
      CompletedTasksActions.getCompletedTasks(callback)
    },

    updateCompletedTask (state, task) {
      state.completedTasks.activeRequests++
      var callback = (res) => {
        state.completedTasks.activeRequests--
        if (state.completedTasks.activeRequests === 0) {
          state.completedTasksNotifier.updates++
        }
      }
      var id = task.instance.id
      if (!task.completed) {
        state.completedTasks.tasks = state.completedTasks.tasks.filter((task) => {
          return task.instance.id !== id
        })
      }
      CompletedTasksActions.updateTask(task, callback)
    },

    deleteCompletedTask (state, task) {
      state.completedTasks.activeRequests++
      var callback = (res) => {
        state.completedTasks.activeRequests--
        if (state.completedTasks.activeRequests === 0) {
          state.completedTasksNotifier.updates++
        }
      }
      var id = task.instance.id
      state.completedTasks.tasks = state.completedTasks.tasks.filter((task) => {
        return task.instance.id !== id
      })
      CompletedTasksActions.deleteTask(task, callback)
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

    completedTasks (state) {
      return state.completedTasks.tasks
    },

    completedTasksNotifier (state) {
      return state.completedTasksNotifier
    }
  }
})
