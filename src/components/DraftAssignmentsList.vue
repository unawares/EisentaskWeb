<template>
  <v-list v-if="draftAssignments.length > 0" subheader>
    <v-subheader>Draft Assignments</v-subheader>
    <v-list-tile
      v-for="draftAssignment in draftAssignments"
      :key="draftAssignment.id"
      :to="'/dashboard/draft-assignments/' + draftAssignment.id + '/'">
      <v-list-tile-avatar size="36px">
      </v-list-tile-avatar>
      <v-list-tile-content>
        <v-list-tile-title>{{ draftAssignment.name }}</v-list-tile-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon @click.prevent="onDeleteClick(draftAssignment)"><v-icon color="grey" v-html="'delete'" class="notranslate"></v-icon></v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
  export default {
    name: 'MyGroups',
    props: [
      'addLoadingTag',
      'removeLoadingTag',
      'showNotification'
    ],
    data () {
      return {
        draftAssignments: []
      }
    },
    mounted () {
      this.init()
    },
    beforeDestroy () {
      this.$store.getters.draftAssignmentsEventEmitter.removeListener('updated', this.draftAssignmentsEventListener)
    },
    methods: {
      init () {
        this.$store.commit('getProfileData')
        this.$store.getters.draftAssignmentsEventEmitter.on('updated', this.draftAssignmentsEventListener)
      },

      draftAssignmentsEventListener (draftAssignments) {
        this.draftAssignments = draftAssignments
      },

      onDeleteClick (draftAssignment) {
        this.$store.commit('deleteDraftAssignment', [draftAssignment.id])
      },

      refresh () {
        this.init()
      }
    }
  }
</script>
