<template>
  <div class="assignments" ref="assignments">
    <masonry
      :cols="{default: 4, 1000: 4, 900: 3, 800: 2, 560: 1}"
      :gutter="{default: '20px'}"
      >
      <div class="item" v-for="assignment in assignments" :key="assignment.id">
        <v-card>
          <v-card-actions class="actions-header" :class="assignment.colorClass">
            <v-btn v-if="assignment.archived" @click="onCancelClick(assignment)" icon small><v-icon color="white">cancel</v-icon></v-btn>
            <v-btn v-else @click="onArchiveClick(assignment)" icon small><v-icon color="white">folder</v-icon></v-btn>
            <v-btn v-if="!assignment.archived" @click="onEditClick(assignment)" icon small><v-icon color="white">edit</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="onDeleteClick(assignment)" icon small><v-icon color="white">delete</v-icon></v-btn>
          </v-card-actions>
          <v-card-media class="header" :class="assignment.colorClass">
            <v-container fill-height fluid>
              <v-layout fill-height>
                <v-flex class="card-header" xs12 align-end flexbox>
                  <span class="headline white--text">{{ assignment.name }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-media>
          <v-card-text primary-title>
            <div class="grey--text">{{ assignment.description }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn icon v-if="!assignment.archived" @click="onSettingsClick(assignment)"><v-icon :color="assignment.colorClass">settings</v-icon></v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click.native="assignment.show = !assignment.show">
              <v-icon :color="assignment.colorClass">{{ !assignment.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
            </v-btn>
          </v-card-actions>
          <v-slide-y-transition>
            <v-container v-show="assignment.show">
              <v-layout flexbox justify-center column>
                  <v-text-field
                    :color="assignment.colorClass"
                    label="Email"
                    v-model="assignment.email"
                    min="8"
                    :error="assignment.field.isError"
                    :rules="assignment.field.messages"
                    light
                  ></v-text-field>
                  <v-btn :loading="assignment.assign_loading" outline small :color="assignment.colorClass" @click="assignTo(assignment)">Assign</v-btn>
              </v-layout>
              <v-list dense subheader class="emails-list">
                <v-menu
                  top
                  v-for="email in assignment.displayEmails"
                  :key="email"
                  :close-on-content-click="false"
                  :value="(menu.assignment === assignment && menu.selectedEmail === email) && menu.isActive"
                >
                  <v-list-tile slot="activator" @click="onOpenEmailActionsClick(assignment, email)">
                    <v-list-tile-content>
                      <v-list-tile-title>{{ email }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-card>
                    <v-list dense>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ email }}</v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn icon @click="onCloseEmailActionsClick()">
                            <v-icon color="grey">close</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list dense>
                      <v-list-tile @click="removeUser(assignment, email)">
                        <v-list-tile-title>Remove Profile</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-card>
                </v-menu>
              </v-list>
              <v-layout v-if="nextLoadCount(assignment) > 0" flexbox justify-center column>
                <v-btn @click="loadNextEmails(assignment)" flat small color="grey" :loading="assignment.loading">load next {{ nextLoadCount(assignment) }}</v-btn>
              </v-layout>
            </v-container>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-card-actions v-if="user" ref="actions_view">
              <v-btn v-if="assignment.info" block small flat :color="assignment.colorClass" @click="goTo(assignment)">GO TO</v-btn>
              <v-btn v-else-if="!assignment.show || (assignment.show && !assignment.assign_loading)" block small flat color="grey" @click="assignToMe(assignment)" :loading="assignment.assign_loading">ASSIGN TO ME</v-btn>
            </v-card-actions>
          </v-slide-y-transition>
        </v-card>
      </div>
    </masonry>
    <v-btn
      class="add-assignment-button"
      v-if="type == 'active'"
      ref="button"
      dark
      color="blue"
      fab
      fixed
      right
      bottom
      @click="dialog = true"
    >
      <v-icon class="notranslate">add</v-icon>
    </v-btn>
    <v-dialog v-if="type == 'active'" v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Creating Assignment</v-card-title>
        <v-card-text>
          <v-text-field
            color="blue"
            ref="nameEditText"
            label="Name"
            :rules="[(v) => validateName(v) || 'Blank is not allowed and max is 200 characters']"
            :counter="200"
            clearable
            required
            v-model="name"
          ></v-text-field>
          <v-text-field
            color="blue"
            ref="descriptionEditText"
            label="Description"
            multi-line
            v-model="description"
          ></v-text-field>
          <span class="title">Label Color</span>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" color="blue" @click="closeDialog">Cancel</v-btn>
          <v-btn flat="flat" color="blue" @click="onCreateAssignment">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import simpleRequest from '@/utils/SimpleRequest'

  class Field {
    constructor () {
      this.messages = []
    }
    get isError () {
      return this.messages.length !== 0
    }
  }

  function getOpenedAssignmentUuids (assignments) {
    var uuids = []
    for (let assignment of assignments) {
      if (assignment.show) {
        uuids.push(assignment.uuid)
      }
    }
    return uuids
  }

  export default {
    name: 'AssignedTasks',
    props: [
      'showNotification',
      'type',
      'openSettings',
      'closeSettings'
    ],
    data () {
      return {
        assignments: [],
        user: undefined,
        userEventEmitter: this.$store.getters.userEventEmitter,
        menu: {
          assignment: undefined,
          isActive: false,
          selectedEmail: undefined
        },
        dialog: false,
        name: '',
        description: '',
        labelColor: 1
      }
    },
    mounted () {
      this.init()
    },
    updated () {
      if (!this.user) {
        this.user = this.$store.getters.user
      }
    },
    watch: {
      $route (to, from) {
        this.assignments = []
        this.init()
      }
    },
    methods: {
      refresh () {
        this.init(getOpenedAssignmentUuids(this.assignments))
      },
      init (openedAssignmentUuids) {
        setTimeout(() => {
          if (this.$refs.button) {
            this.$refs.button.$el.style.visibility = 'visible'
          }
        }, 700)
        var self = this
        simpleRequest('/api/assignments/private/').method('get').then((response) => {
          var assignments = []
          for (let assignment of response.data) {
            if (this.type === 'archived' && !assignment.archived) {
              continue
            } else if (this.type === 'active' && assignment.archived) {
              continue
            }
            Object.defineProperty(assignment, 'show', {
              get: function () {
                return this._show
              },
              set: function (v) {
                this.field.messages = []
                if (v) {
                  this.loading = true
                  simpleRequest('/api/assignments/private/' + this.uuid + '/get_assignment_profile_emails/').method('get').then((response) => {
                    this.emails = response.data.map((v) => {
                      return v.email
                    })
                    while (this.displayEmails.length > 0) {
                      this.displayEmails.pop()
                    }
                    for (let i = 0; i < this.count && i < this.emails.length; i++) {
                      this.displayEmails.push(this.emails[i])
                    }
                    this.loading = false
                    console.log(response)
                  }).catch((error) => {
                    self.showNotification('error')
                    console.log(error)
                  })
                } else {
                  this.loading = false
                }
                this._show = v
              }
            })
            Object.defineProperty(assignment, 'count', {
              get: function () {
                return this._count
              },
              set: function (v) {
                if (v > 0) {
                  while (this.displayEmails.length > 0) {
                    this.displayEmails.pop()
                  }
                  for (let i = 0; i < v && i < this.emails.length; i++) {
                    this.displayEmails.push(this.emails[i])
                  }
                  this._count = v
                } else {
                  this._count = 0
                }
              }
            })
            Object.defineProperty(assignment, 'email', {
              get: function () {
                return this._email
              },
              set: function (v) {
                this.field.messages = []
                this._email = v
              }
            })
            assignment.field = new Field()
            assignment.displayEmails = []
            assignment.emails = []
            assignment.loading = false
            assignment.count = 10
            assignment.assign_loading = false
            assignment.email = ''
            switch (assignment.label_color) {
              case 1:
                assignment.colorClass = 'goals'
                break
              case 2:
                assignment.colorClass = 'progress'
                break
              case 3:
                assignment.colorClass = 'activities'
                break
              case 4:
                assignment.colorClass = 'interruptions'
                break
            }
            assignment.show = openedAssignmentUuids && openedAssignmentUuids.indexOf(assignment.uuid) !== -1
            assignments.push(assignment)
          }
          self.assignments = assignments
          console.log(response)
        }).catch((error) => {
          this.showNotification('error')
          console.log(error)
        })
      },
      loadNextEmails (assignment) {
        assignment.count += this.nextLoadCount(assignment)
      },
      nextLoadCount (assignment) {
        if (assignment) {
          return Math.min(20, assignment.emails.length - assignment.count)
        } else {
          return 0
        }
      },
      assignToMe (assignment) {
        assignment.email = this.user.instance.email
        this.assignTo(assignment)
      },
      assignTo (assignment) {
        assignment.assign_loading = true
        var email = assignment.email
        assignment.email = ''
        simpleRequest('/api/assignments/protected/assign_to/', {
          uuid: assignment.uuid,
          email: email
        }).method('post').then((response) => {
          this.showNotification('showSuccessWithText', 'Assigned to ' + email)
          assignment.assign_loading = false
          if (assignment.emails.indexOf(email) === -1) {
            assignment.emails.unshift(email)
            assignment.count = assignment.count
          }
          /* THIS IS TO SOLVE SOME BUGS */
          simpleRequest('/api/assignments/private/').method('get').then((response) => {
            this.init(getOpenedAssignmentUuids(this.assignments))
            console.log(response)
          }).catch((error) => {
            this.init(getOpenedAssignmentUuids(this.assignments))
            console.log(error)
          })
          /* I DONT KNOW WHY */
          console.log(response)
        }).catch((error) => {
          if ('email' in error.response.data) {
            assignment.field.messages = error.response.data.email
          }
          this.showNotification('showWarningWithText', error.response.data.email[0])
          assignment.assign_loading = false
          console.log(error)
        })
      },
      goTo (assignment) {
        window.open('/web/assignments/' + assignment.uuid + '/' + encodeURIComponent(assignment.info.assignment_info) + '/active-tasks/', '_blank')
      },
      onArchiveClick (assignment) {
        simpleRequest('/api/assignments/private/' + assignment.uuid + '/archive_assignment_tasks/').method('post').then(() => {
          var index = this.assignments.indexOf(assignment)
          if (index !== -1 && this.type === 'active') {
            this.assignments.splice(index, 1)
          }
        }).catch(() => {
          this.showNotification('error')
        })
      },
      onCancelClick (assignment) {
        simpleRequest('/api/assignments/private/' + assignment.uuid + '/unarchive_assignment_tasks/').method('post').then((response) => {
          var index = this.assignments.indexOf(assignment)
          if (index !== -1 && this.type === 'archived') {
            this.assignments.splice(index, 1)
          }
          console.log(response)
        }).catch((error) => {
          this.showNotification('error')
          console.log(error)
        })
      },
      onEditClick (assignment) {
        this.$store.getters.draftAssignmentsEventEmitter.once('updated', (draftAssignments) => {
          var index = 0
          for (; index < draftAssignments.length && assignment.uuid !== draftAssignments[index].uuid; index++) { }
          if (index !== draftAssignments.length) {
            this.$router.push('/dashboard/draft-assignments/' + draftAssignments[index].id + '/')
          } else {
            simpleRequest('/api/assignments/private/' + assignment.uuid + '/get_assignment_tasks/').method('get').then((response) => {
              var onError = () => {
                this.showNotification('error')
                this.$store.getters.draftAssignmentEventEmitter.removeListener('created', onCreate)
              }
              var onCreate = () => {
                this.$store.getters.draftAssignmentEventEmitter.removeListener('error', onError)
                this.showNotification('showSuccessWithText', 'Created draft of the assignment for edit')
                this.$store.commit('getDraftAssignmentsFromProfileData')
                this.onEditClick(assignment)
              }
              this.$store.getters.draftAssignmentEventEmitter.removeAllListeners('created')
              this.$store.getters.draftAssignmentEventEmitter.removeAllListeners('error')
              this.$store.getters.draftAssignmentEventEmitter.once('error', onError)
              this.$store.getters.draftAssignmentEventEmitter.once('created', onCreate)
              this.$store.commit('createDraftAssignmentFromAssignment', [response.data])
            }).catch((error) => {
              console.log(error)
            })
          }
        })
        this.$store.commit('getDraftAssignmentsFromProfileData')
        console.log(assignment)
      },
      onDeleteClick (assignment) {
        simpleRequest('/api/assignments/private/' + assignment.uuid + '/delete_assignment_tasks/').method('delete').then((response) => {
          var index = this.assignments.indexOf(assignment)
          if (index !== -1) {
            this.assignments.splice(index, 1)
          }
          console.log(response)
        }).catch((error) => {
          this.showNotification('error')
          console.log(error)
        })
      },
      onSettingsClick (assignment) {
        var self = this
        this.openSettings('assignment-settings', {
          context: self,
          assignment: assignment,
          assignments: self.assignments,
          onUpdatedAssignment () {
            self.init(getOpenedAssignmentUuids(self.assignments))
          },
          onDeletedAssignment () {
            self.init(getOpenedAssignmentUuids(self.assignments))
          }
        })
      },
      removeUser (assignment, email) {
        simpleRequest('/api/assignments/protected/remove_assignment/', {
          uuid: assignment.uuid,
          email: email
        }).method('post').then((response) => {
          this.onCloseEmailActionsClick()
          this.showNotification('showSuccessWithText', 'Removed assignment from ' + email)
          let index = assignment.emails.indexOf(email)
          if (index !== -1) {
            assignment.emails.splice(index, 1)
            assignment.count = assignment.count
          }
          /* THIS IS TO SOLVE SOME BUGS */
          simpleRequest('/api/assignments/private/').method('get').then((response) => {
            this.init(getOpenedAssignmentUuids(this.assignments))
            console.log(response)
          }).catch((error) => {
            this.init(getOpenedAssignmentUuids(this.assignments))
            console.log(error)
          })
          /* I DONT KNOW WHY */
          console.log(response)
        }).catch((error) => {
          this.showNotification('error')
          console.log(error)
        })
      },
      onOpenEmailActionsClick (assignment, email) {
        this.menu.selectedEmail = email
        this.menu.assignment = assignment
        this.menu.isActive = true
      },
      onCloseEmailActionsClick () {
        this.menu.selectedEmail = undefined
        this.menu.assignment = undefined
        this.menu.isActive = false
      },
      validateName (value) {
        if (value && (value.length > 0 && value.length <= 200)) {
          return true
        } else {
          return false
        }
      },
      closeDialog () {
        this.dialog = false
        setTimeout(() => {
          if (!this.dialog) {
            if (this.$refs.nameEditText && this.$refs.descriptionEditText) {
              this.$refs.nameEditText.reset()
              this.$refs.descriptionEditText.reset()
            }
          }
        }, 400)
      },
      onCreateAssignment () {
        var name = this.name
        var description = this.description
        var labelColor = this.labelColor
        var onError = () => {
          this.showNotification('error')
          this.$store.getters.draftAssignmentEventEmitter.removeListener('created')
        }
        var onCreate = (draftAssignment) => {
          this.showNotification('showSuccessWithText', 'Created draft assignment for edit')
          this.$store.getters.draftAssignmentEventEmitter.removeListener('error', onError)
          this.closeDialog()
          this.$router.push('/dashboard/draft-assignments/' + draftAssignment.id + '/')
        }
        this.$store.getters.draftAssignmentEventEmitter.removeAllListeners('created')
        this.$store.getters.draftAssignmentEventEmitter.removeAllListeners('error')
        this.$store.getters.draftAssignmentEventEmitter.once('error', onError)
        this.$store.getters.draftAssignmentEventEmitter.once('created', onCreate)
        this.$store.commit('createDraftAssignment', [name, description, labelColor])
      }
    }
  }
</script>

<style lang="stylus">
  .assignments
    padding: 36px

  .card-header
    display: flex;
    align-items: flex-end;

  .item
    margin-bottom: 20px

  .emails-list
    position: relative
    .menu
      width: 100%

  .actions-header.goals
    background-color: #FF5742 !important
  .actions-header.progress
    background-color: #2185B7 !important
  .actions-header.activities
    background-color: #FFB532 !important
  .actions-header.interruptions
    background-color: #717171 !important
  
  .header.goals
    background-color: #F44336
  .header.progress
    background-color: #0C73AF
  .header.activities
    background-color: #FF9F1C
  .header.interruptions
    background-color: #616161
  
  .add-assignment-button
    visibility: hidden
</style>
