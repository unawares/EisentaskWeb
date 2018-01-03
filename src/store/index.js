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
      orders: undefined
    }
  },

  actions: {
  },

  mutations: {
    getActiveTasks (state) {
      var callback = (res) => {
        state.activeTasks.tasks = res.tasks
        state.activeTasks.orders = res.activeTasks
        state.activeTasksNotifier.updates++
      }
      ActiveTasksActions.getActiveTasks(callback)
    },

    createTask (state, task) {
      var callback = (res) => {
        state.activeTasks.tasks.push(res.task)
        state.activeTasks.orders = res.activeTasks
        state.activeTasksNotifier.updates++
      }
      ActiveTasksActions.createTask(task, callback)
    },

    updateTask (state, task) {
      var callback = (res) => {
        state.activeTasks.orders = res.activeTasks
        state.activeTasksNotifier.updates++
      }
      var id = task.original.id
      if (task.completed) {
        state.activeTasks.tasks = state.activeTasks.tasks.filter((task) => {
          return task.original.id !== id
        })
      }
      ActiveTasksActions.updateTask(task, callback)
    },

    deleteTask (state, task) {
      var callback = (res) => {
        state.activeTasks.orders = res.activeTasks
        state.activeTasksNotifier.updates++
      }
      var id = task.original.id
      state.activeTasks.tasks = state.activeTasks.tasks.filter((task) => {
        return task.original.id !== id
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
