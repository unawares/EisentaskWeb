<template>
  <div class="assignment-settings">
    <v-container fluid>
      <v-layout justify-center>
        <v-flex>
          <header class="header">
            <span class="headline">Assignment Settings</span>
            <v-spacer></v-spacer>
            <v-btn flat icon @click="closeAssignmentSettings">
              <v-icon class="notranslate">close</v-icon>
            </v-btn>
          </header>
        </v-flex>
      </v-layout>
    </v-container>
    <div class="content">
      <div class="menu-view scrollbar">
        <v-container fluid>
          <v-layout justify-start>
            <v-flex>
              <ul class="menu">
                <li class="item" @click="selected = 'main'" :class="{active: selected === 'main'}">Main</li>
              </ul>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
      <div class="main-view scrollbar">
        <v-container v-if="selected === 'main'">
          <v-layout justify-start>
            <v-flex xs12 sm12 md10 lg9 xl8>
              <div class="settings-content">
                <span class="headline">Main</span>
              </div>
              <v-divider></v-divider>
              <div class="settings-content">
                <v-text-field
                  color="blue"
                  label="Tittle"
                  v-model="name"
                ></v-text-field>
                <v-text-field
                  color="blue"
                  label="Description"
                  v-model="description"
                  multi-line
                  rows="7"
                ></v-text-field>
              </div>
              <div class="settings-content">
                <span class="headline">Access</span>
              </div>
              <v-divider></v-divider>
              <div class="settings-content">
                <v-radio-group v-model="access">
                  <v-radio
                    color="blue"
                    label="Private"
                    :value="1"
                  ></v-radio>
                  <v-radio
                    color="blue"
                    label="Protected"
                    :value="2"
                  ></v-radio>
                </v-radio-group>
              </div>
              <div class="settings-content">
                <span class="headline">Label Color</span>
              </div>
              <v-divider></v-divider>
              <div class="settings-content">
                <v-radio-group v-model="labelColor">
                  <v-radio
                    color="goals"
                    label="Goals"
                    :value="1"
                  ></v-radio>
                  <v-radio
                    color="progress"
                    label="Progress"
                    :value="2"
                  ></v-radio>
                  <v-radio
                    color="activities"
                    label="Activities"
                    :value="3"
                  ></v-radio>
                  <v-radio
                    color="interruptions"
                    label="Interruptions"
                    :value="4"
                  ></v-radio>
                </v-radio-group>
              </div>
              <div class="settings-content">
                <div class="assignment-settings-actions">
                  <v-btn flat light color="red" @click="deleteAssignment">Delete Draft</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat light color="blue" @click="updateAssignment">Save</v-btn>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GroupSettings',
    props: [
      'section',
      'kwargs',
      'scrollEvent',
      'showNotification'
    ],
    data () {
      return {
        selected: undefined,
        assignment: undefined,
        name: '',
        description: '',
        access: 0,
        labelColor: 0
      }
    },
    mounted () {
      window.test = this
      this.assignment = this.kwargs.assignment
      this.selected = 'main'
    },
    watch: {
      assignment: {
        handler (obj) {
          this.setAssignment(obj)
        },
        deep: true
      }
    },
    methods: {
      refresh () {
        this.assignment = this.kwargs.assignment
      },
      setAssignment (obj) {
        this.name = obj.name
        this.description = obj.description
        this.access = obj.access
        this.labelColor = obj.labelColor
      },
      closeAssignmentSettings () {
        this.$emit('onClickCloseAction')
      },
      updateAssignment () {
        var onUpdated = () => {
          this.$store.getters.draftAssignmentEventEmitter.removeListener('error', onError)
          this.closeAssignmentSettings()
          this.kwargs.onUpdatedAssignment(this.assignment)
        }
        var onError = () => {
          this.$store.getters.draftAssignmentEventEmitter.removeListener('updated', onUpdated)
          this.closeAssignmentSettings()
        }
        this.$store.getters.draftAssignmentEventEmitter.on('updated', onUpdated)
        this.$store.getters.draftAssignmentEventEmitter.on('error', onError)
        this.$store.commit('updateDraftAssignment', [
          this.assignment.id,
          this.name,
          this.description,
          this.labelColor,
          this.access
        ])
      },
      resetAssignment () {
        this.setAssignment(this.assignment)
      },
      deleteAssignment () {
        var onDeleted = () => {
          this.$store.getters.draftAssignmentEventEmitter.removeListener('error', onError)
          this.closeAssignmentSettings()
          this.kwargs.onDeletedAssignment(this.assignment)
        }
        var onError = () => {
          this.$store.getters.draftAssignmentEventEmitter.removeListener('deleted', onDeleted)
          this.closeAssignmentSettings()
        }
        this.$store.getters.draftAssignmentEventEmitter.on('deleted', onDeleted)
        this.$store.getters.draftAssignmentEventEmitter.on('error', onError)
        this.$store.commit('deleteDraftAssignment', [this.assignment.id])
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .assignment-settings
    margin: auto
    max-width: 1100px
    width: 90%
    .header
      display: flex
      height: 64px
      align-items: center
      .text
        font-size: 20px
    .content
      width: 100%
      display: flex
      flex-wrap: wrap
      > div:not(.vertical-line)
        overflow: auto
      .vertical-line
        width: 1px
        background-color: gray
      .menu-view
        flex-grow: 1
        width: 270px
        .menu
          list-style: none
          .item
            font-size: 16px
            cursor: pointer
            padding-top: 3px
            padding-bottom: 3px
            &.active
              color: #3e82ef
            &:hover
              opacity: 0.8
      .main-view
        width: 500px
        flex-grow: 100
    .main-view
      .assignment-settings-actions
        display: flex
        flex-wrap: wrap
    .settings-content
      padding-top: 16px
      padding-bottom: 16px
</style>
