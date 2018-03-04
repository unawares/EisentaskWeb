import EventEmitter from 'events'
import userActions from '@/utils/UserActions'
import User from '@/models/User'
import setDefaultOnFailure from '@/utils/SetDefaultOnFailure'

setDefaultOnFailure(userActions)

export default {
  state: {
    user: new User(),
    eventEmitter: new EventEmitter(),
    userActiveRequestsCount: 0
  },

  actions: {
  },

  mutations: {
    getUser (state) {
      state.userActiveRequestsCount++
      var callback = (res) => {
        state.userActiveRequestsCount--
        state.user = res.user
        if (state.userActiveRequestsCount === 0) {
          state.eventEmitter.emit('updated')
        }
      }
      userActions.getUser(callback, state.user).onCatchStatusCodes().do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshUser')
      })
    },

    refreshUser (state) {
      state.user = new User()
      state.userActiveRequestsCount = 0
    }
  },

  getters: {
    user (state) {
      return state.user
    },

    userEventEmitter (state) {
      return state.eventEmitter
    }
  }
}
