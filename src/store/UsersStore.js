import EventEmitter from 'events'
import userActions from '@/utils/UserActions'
import User from '@/models/User'
import setDefaultOnFailure from '@/utils/SetDefaultOnFailure'
import router from '@/router/index'
import simpleRequest from '@/utils/SimpleRequest'

setDefaultOnFailure(userActions)

export default {
  state: {
    user: new User(),
    eventEmitter: new EventEmitter(),
    userActiveRequestsCount: 0,
    called: false
  },

  actions: {
  },

  mutations: {
    getUser (state) {
      if (state.called) {
        return
      }
      state.called = true
      state.userActiveRequestsCount++
      var callback = (res) => {
        state.userActiveRequestsCount--
        state.user = res.user
        if (state.userActiveRequestsCount === 0) {
          state.eventEmitter.emit('updated')
        }
        state.called = false
      }
      userActions.getUser(callback, state.user).onCatchStatusCodes([401]).do((queueRequests) => {
        queueRequests.clear()
        this.commit('refreshUser')
        simpleRequest('/api/auth/logout/').method('post')
        router.replace({ name: 'Authentication', params: { action: 'signin' } })
        state.called = false
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
