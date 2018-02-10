import Vue from 'vue'
import Vuex from 'vuex'
import ActiveTasksStore from './ActiveTasksStore'
import CompletedTasksStore from './CompletedTasksStore'
import UsersStore from './UsersStore'
import MyGroupsStore from './MyGroupsStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...ActiveTasksStore.state,
    ...CompletedTasksStore.state,
    ...UsersStore.state,
    ...MyGroupsStore.state
  },

  actions: {
    ...ActiveTasksStore.actions,
    ...CompletedTasksStore.actions,
    ...UsersStore.actions,
    ...MyGroupsStore.actions
  },

  mutations: {
    ...ActiveTasksStore.mutations,
    ...CompletedTasksStore.mutations,
    ...UsersStore.mutations,
    ...MyGroupsStore.mutations
  },

  getters: {
    ...ActiveTasksStore.getters,
    ...CompletedTasksStore.getters,
    ...UsersStore.getters,
    ...MyGroupsStore.getters
  }
})
