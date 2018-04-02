import EventEmitter from 'events'
import simpleRequest from '../utils/SimpleRequest'
// import simpleRequest from '@/utils/SimpleRequest'

export default {
  state: {
    profileDataEventEmitter: new EventEmitter(),
    profileData: undefined
  },

  actions: {
  },

  mutations: {
    getProfileData (state) {
      simpleRequest('/api/profiles/me/').method('get').then((response) => {
        state.profileData = response.data.data
        state.profileDataEventEmitter.emit('updated', state.profileData)
        this.commit('getDraftAssignmentsFromProfileData')
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    },
    updateProfileData (state, data) {
      simpleRequest('/api/profiles/me/', {
        data: data
      }).method('post').then((response) => {
        state.profileData = response.data.data
        state.profileDataEventEmitter.emit('updated', state.profileData)
        this.commit('getDraftAssignmentsFromProfileData')
        console.log(response)
      }).catch((error) => {
        console.log(error)
      })
    }
  },

  getters: {
    profileDataEventEmitter (state) {
      return state.profileDataEventEmitter
    },
    getProfileData (state) {
      return state.profileData
    }
  }
}
