import Vue from 'vue'
import Vuex from 'vuex'
import ActiveTasksActions from '@/utils/ActiveTasksActions'
import CompletedTasksActions from '@/utils/CompletedTasksActions'
import UserActions from '@/utils/UserActions'
import User from '@/models/User'

var onFailure = function (error, queueRequests) {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        queueRequests.clear()
        window.location = '/web/accounts/login'
    }
  } else {
    queueRequests.retryInterval = 1000
  }
}

ActiveTasksActions.setOnFailureListener(onFailure)
CompletedTasksActions.setOnFailureListener(onFailure)
UserActions.setOnFailureListener(onFailure)

Vue.use(Vuex)

export default new Vuex.Store({
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
    },
    completedTasksNotifier: {
      updates: 0
    },
    completedTasksActiveRequests: {
      count: 0
    },
    completedTasks: {
      tasks: [],
      activeRequests: 0
    },
    profile: {
      user: new User()
    },
    profileNotifier: {
      updates: 0
    },
    profileActiveRequests: {
      count: 0
    }
  },

  actions: {
  },

  mutations: {
    getUser (state) {
      state.profileActiveRequests.count++
      var callback = (res) => {
        state.profileActiveRequests.count--
        state.profile.user = res.user
        if (state.profileActiveRequests.count === 0) {
          state.profileNotifier.updates++
        }
      }
      UserActions.getUser(callback, state.profile.user)
    },

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
      ActiveTasksActions.getActiveTasks(callback)
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
      ActiveTasksActions.createTask(task, callback)
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
      ActiveTasksActions.updateTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
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
      ActiveTasksActions.deleteTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshActiveTasks')
        this.commit('getActiveTasks')
      })
    },

    getCompletedTasks (state) {
      state.completedTasksActiveRequests.count++
      var callback = (res) => {
        state.completedTasksActiveRequests.count--
        state.completedTasks.tasks = res.tasks
        if (state.completedTasksActiveRequests.count === 0) {
          state.completedTasksNotifier.updates++
        }
      }
      CompletedTasksActions.getCompletedTasks(callback)
    },

    updateCompletedTask (state, task) {
      state.completedTasksActiveRequests.count++
      var callback = (res) => {
        state.completedTasksActiveRequests.count--
        if (state.completedTasksActiveRequests.count === 0) {
          state.completedTasksNotifier.updates++
        }
      }
      var id = task.instance.id
      if (!task.completed) {
        state.completedTasks.tasks = state.completedTasks.tasks.filter((task) => {
          return task.instance.id !== id
        })
      }
      CompletedTasksActions.updateTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
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
          state.completedTasksNotifier.updates++
        }
      }
      var id = task.instance.id
      state.completedTasks.tasks = state.completedTasks.tasks.filter((task) => {
        return task.instance.id !== id
      })
      CompletedTasksActions.deleteTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshCompletedTasks')
        this.commit('getCompletedTasks')
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
    },

    refreshCompletedTasks (state) {
      state.completedTasks.tasks = []
      state.completedTasksActiveRequests.count = 0
      state.completedTasksNotifier.updates = 0
    }
  },

  getters: {
    user (state) {
      return state.profile.user
    },

    profileNotifier (state) {
      return state.profileNotifier
    },

    profileActiveRequests (state) {
      return state.profileActiveRequests
    },

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
    },

    completedTasks (state) {
      return state.completedTasks.tasks
    },

    completedTasksNotifier (state) {
      return state.completedTasksNotifier
    },

    completedTasksActiveRequests (state) {
      return state.completedTasksActiveRequests
    }
  }
})
