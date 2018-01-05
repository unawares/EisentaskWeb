import Vue from 'vue'
import Vuex from 'vuex'
import ActiveTasksActions from '@/utils/ActiveTasksActions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeTasksNotifier: {
      updates: 0
    },
    activeTasks: {
      tasks: [],
      orders: undefined,
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

    createTask (state, task) {
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

    updateTask (state, task) {
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
      ActiveTasksActions.updateTask(task, callback)
    },

    deleteTask (state, task) {
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
      ActiveTasksActions.deleteTask(task, callback)
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
    }
  }
})
