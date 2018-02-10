import userActions from '@/utils/UserActions'
import User from '@/models/User'
import setDefaultOnFailure from '@/utils/SetDefaultOnFailure'

setDefaultOnFailure(userActions)

export default {
  state: {
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
      userActions.getUser(callback, state.profile.user)
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
    }
  }
}
