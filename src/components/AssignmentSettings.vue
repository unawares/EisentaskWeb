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
                <li class="item" @click="selected = 'users'" :class="{active: selected === 'users'}">Users</li>
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
                <v-radio-group v-model="label_color">
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
                  <v-btn flat light color="red" @click="deleteAssignment">Delete</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn flat light color="blue" @click="resetAssignment">Reset</v-btn>
                  <v-btn flat light color="blue" @click="updateAssignment">Save</v-btn>
                </div>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container v-if="selected === 'users'">
          <v-layout justify-start>
            <v-flex xs12 sm12 md10 lg9 xl8>
              <v-list two-line>
                <v-list-tile>
                  <v-list-tile-content style="margin-right: 16px">
                    <v-text-field
                      color="blue"
                      label="Email"
                      v-model="assignment.email"
                      min="8"
                      :error="assignment.field.isError"
                      :rules="assignment.field.messages"
                    ></v-text-field>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn flat color="blue" @click="assignToEmail">ADD</v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-for="email in emails" :key="email">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ email }}</v-list-tile-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-menu
                      :close-on-content-click="false"
                      :nudge-width="200"
                      v-model="menus[email]"
                    >
                      <v-btn flat icon light slot="activator" color="grey">
                        <v-icon class="notranslate">more_vert</v-icon>
                      </v-btn>
                      <v-card>
                        <v-list>
                          <v-list-tile>
                            <v-list-tile-content>
                              <v-list-tile-title>{{ email }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn icon @click.native="menus[email] = false">
                                <v-icon color="grey">close</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                          </v-list-tile>
                        </v-list>
                        <v-divider></v-divider>
                        <v-list>
                          <v-list-tile
                            @click="removeUser(email)">
                            <v-list-tile-title>Remove user</v-list-tile-title>
                          </v-list-tile>
                        </v-list>
                      </v-card>
                    </v-menu>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
  import simpleRequest from '@/utils/SimpleRequest'

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
        label_color: 0,
        menus: {},
        emails: []
      }
    },
    mounted () {
      this.assignment = this.kwargs.assignment
      this.selected = 'main'
      this.getAssignedEmails()
    },
    watch: {
      selected (value) {
        if (value === 'users') {
          this.assignment.field.messages = []
        }
      },
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
        this.getAssignedEmails()
      },
      setAssignment (obj) {
        this.name = obj.name
        this.description = obj.description
        this.access = obj.access
        this.label_color = obj.label_color
        this.emails = []
        for (let email of obj.emails) {
          this.emails.push(email)
        }
      },
      closeAssignmentSettings () {
        this.$emit('onClickCloseAction')
      },
      updateAssignment () {
        simpleRequest('/api/assignments/private/' + this.assignment.uuid + '/update_assignment_tasks/', {
          name: this.name,
          description: this.description,
          access: this.access,
          label_color: this.label_color
        }).method('put').then((response) => {
          this.assignment.name = response.data.assignment.name
          this.assignment.description = response.data.assignment.description
          this.showNotification('showSuccessWithText', 'The assignment has been updated')
          this.closeAssignmentSettings()
          this.kwargs.onUpdatedAssignment(this.assignment)
        }).catch((error) => {
          setTimeout(() => {
            this.closeAssignmentSettings()
          }, 2000)
          console.log(error)
        })
      },
      resetAssignment () {
        this.setAssignment(this.assignment)
      },
      deleteAssignment () {
        simpleRequest('/api/assignments/private/' + this.assignment.uuid + '/delete_assignment_tasks/').method('delete').then(() => {
          var index = this.kwargs.assignments.indexOf(this.assignment)
          if (index !== -1) {
            this.kwargs.assignments.splice(index, 1)
          }
          this.showNotification('showSuccessWithText', 'Assignment deleted successfully')
          this.closeAssignmentSettings()
          this.kwargs.onDeletedAssignment(this.assignment)
        }).catch(() => {
          setTimeout(() => {
            this.closeAssignmentSettings()
          }, 2000)
          this.showNotification('error')
        })
      },
      assignToEmail () {
        this.kwargs.context.assignTo(this.assignment)
        this.emails.unshift(this.email)
        this.email = ''
        this.getAssignedEmails()
        this.assignment
      },
      removeUser (email) {
        this.kwargs.context.removeUser(this.assignment, email)
        let index = this.emails.indexOf(email)
        if (index !== -1) {
          this.emails.splice(index, 1)
        }
        this.getAssignedEmails()
      },
      getAssignedEmails () {
        var self = this
        simpleRequest('/api/assignments/private/' + this.assignment.uuid + '/get_assignment_profile_emails/').method('get').then((response) => {
          this.assignment.emails = response.data.map((v) => {
            return v.email
          })
          while (this.assignment.displayEmails.length > 0) {
            this.assignment.displayEmails.pop()
          }
          for (let i = 0; i < this.assignment.count && i < this.assignment.emails.length; i++) {
            this.assignment.displayEmails.push(this.assignment.emails[i])
          }
          console.log(response)
        }).catch((error) => {
          setTimeout(() => {
            this.closeAssignmentSettings()
          }, 2000)
          self.showNotification('error')
          console.log(error)
        })
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
    .settings-content
      padding-top: 16px
      padding-bottom: 16px
</style>
