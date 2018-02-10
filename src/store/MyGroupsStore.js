import myGroupActions from '@/utils/MyGroupActions'
import setDefaultOnFailure from '@/utils/SetDefaultOnFailure'

setDefaultOnFailure(myGroupActions)

export default {
  state: {
    groups: []
  },

  actions: {
  },

  mutations: {
    getMyGroups (state) {
      var callback = (res) => {
        state.groups.splice(0, state.groups.length, ...res.groups)
      }
      myGroupActions.getMyGroups(callback)
    },

    refreshMyGroups (state) {
      state.groups.splice(0, state.groups.length)
    }

    /*
    createMyGroup (state, task) {
      state.myGroupsActiveRequests.count++
      var callback = (res) => {
        state.myGroupsActiveRequests.count--
        if (state.myGroupsActiveRequests.count === 0) {
          state.myGroupsNotifier.updates++
        }
      }
      state.myGroups.groups.push(task)
      myGroupActions.createTask(task, callback)
    },

    updateMyGroup (state, task) {
      state.myGroupsActiveRequests.count++
      var callback = (res) => {
        state.myGroupsActiveRequests.count--
        if (state.myGroupsActiveRequests.count === 0) {
          state.myGroupsNotifier.updates++
        }
      }
      var id = task.instance.id
      if (task.completed) {
        state.myGroups.groups = state.myGroups.groups.filter((task) => {
          return task.instance.id !== id
        })
      }
      myGroupActions.updateTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshmyGroups')
        this.commit('getMyGroups')
      })
    },

    deleteMyGroup (state, task) {
      state.myGroupsActiveRequests.count++
      var callback = (res) => {
        state.myGroupsActiveRequests.count--
        if (state.myGroupsActiveRequests.count === 0) {
          state.myGroupsNotifier.updates++
        }
      }
      var id = task.instance.id
      state.myGroups.groups = state.myGroups.groups.filter((task) => {
        return task.instance.id !== id
      })
      myGroupActions.deleteTask(task, callback).onCatchStatusCodes([404]).do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshmyGroups')
        this.commit('getMyGroups')
      })
    },
    */
  },

  getters: {
    myGroups (state) {
      return state.groups
    }
  }
}
