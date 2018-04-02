import Vue from 'vue'
import Vuex from 'vuex'
import ActiveTasksStore from './ActiveTasksStore'
import CompletedTasksStore from './CompletedTasksStore'
import UsersStore from './UsersStore'
import MyGroupsStore from './MyGroupsStore'
import ProfilesStore from './ProfilesStore'
import DraftAssignmentsStore from './DraftAssignmentsStore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ...ActiveTasksStore.state,
    ...CompletedTasksStore.state,
    ...UsersStore.state,
    ...MyGroupsStore.state,
    ...ProfilesStore.state,
    ...DraftAssignmentsStore.state
  },

  actions: {
    ...ActiveTasksStore.actions,
    ...CompletedTasksStore.actions,
    ...UsersStore.actions,
    ...MyGroupsStore.actions,
    ...ProfilesStore.actions,
    ...DraftAssignmentsStore.actions
  },

  mutations: {
    ...ActiveTasksStore.mutations,
    ...CompletedTasksStore.mutations,
    ...UsersStore.mutations,
    ...MyGroupsStore.mutations,
    ...ProfilesStore.mutations,
    ...DraftAssignmentsStore.mutations
  },

  getters: {
    ...ActiveTasksStore.getters,
    ...CompletedTasksStore.getters,
    ...UsersStore.getters,
    ...MyGroupsStore.getters,
    ...ProfilesStore.getters,
    ...DraftAssignmentsStore.getters
  }
})
