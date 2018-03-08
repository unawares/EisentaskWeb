<template>
  <div class="group-settings">
    <v-container fluid>
      <v-layout justify-center>
        <v-flex>
          <header class="header">
            <span class="text">Group Settings</span>
            <v-spacer></v-spacer>
            <v-btn flat icon @click="closeGroupSettings">
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
                <li class="item" @click="selected = 'members'" :class="{active: selected === 'members'}">Members</li>
              </ul>
            </v-flex>
          </v-layout>
        </v-container>
      </div>
      <div class="main-view scrollbar">
        <v-container v-if="selected === 'main'" class="group-main-settings-view">
          <v-layout justify-start>
            <v-flex xs12 sm12 md10 lg9 xl8>
              <span class="group-settings-header">Main</span>
              <v-text-field
                color="blue"
                label="Tittle"
                v-model="title"
                :disabled="!isAdmin"
              ></v-text-field>
              <v-text-field
                color="blue"
                label="Description"
                v-model="description"
                multi-line
                rows="7"
                :disabled="!isAdmin"
              ></v-text-field>
              <div class="group-settings-actions">
                <v-btn flat light color="red" @click="clickDeleteGroupSettings" :disabled="!isAdmin">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn flat light color="blue" @click="clickResetGroupSettings" :disabled="!isAdmin">Reset</v-btn>
                <v-btn flat light color="blue" @click="clickSaveGroupSettings" :disabled="!isAdmin">Save</v-btn>
              </div>
              <div v-if="!isAdmin" class="group-settings-actions justify-center margin-top">
                <v-btn outline dark color="red" @click="clickLeaveGroupSettings">Leave</v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container v-if="selected === 'members'" class="group-members-settings-view">
          <v-layout justify-start>
            <v-flex xs12 sm12 md10 lg9 xl8>
              <v-list two-line>
                <v-list-tile v-if="isAdmin">
                  <v-list-tile-content style="margin-right: 16px">
                    <v-text-field
                      color="blue"
                      label="Username or email"
                      v-model="usernameOrEmail"
                    ></v-text-field>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn flat color="blue" @click="addMemberToTheGroup">ADD</v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list-tile v-for="(memberCard, index) in groupMemberCards.memberCards" :key="memberCard.id">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ memberCard.owner.username }}</v-list-tile-title>
                    <v-list-tile-sub-title>
                      <span v-if="memberCard.owner.id === memberCard.group.admin" style="color: #f44336">Admin</span>
                      <span v-else-if="memberCard.is_staff" style="color: #3e82ef">Staff</span>
                      <span v-else>Member</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action v-if="hasAccessToActions(memberCard)">
                    <v-menu
                      :close-on-content-click="false"
                      :nudge-width="200"
                      v-model="memberCard.menu"
                    >
                      <v-btn flat icon light slot="activator" color="grey">
                        <v-icon class="notranslate">more_vert</v-icon>
                      </v-btn>
                      <v-card>
                        <v-list>
                          <v-list-tile>
                            <v-list-tile-content>
                              <v-list-tile-title>{{ memberCard.owner.username }}</v-list-tile-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                              <v-btn icon @click.native="memberCard.menu = false">
                                <v-icon color="grey">close</v-icon>
                              </v-btn>
                            </v-list-tile-action>
                          </v-list-tile>
                        </v-list>
                        <v-divider></v-divider>
                        <v-list>
                          <v-list-tile
                            v-if="memberCard.is_staff"
                            @click="removeMemberStaff(index)">
                            <v-list-tile-title>Remove staff</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile
                            v-else
                            @click="makeMemberStaff(index)">
                            <v-list-tile-title>Make staff</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="giveAdminPrivilegesToMember(index)">
                            <v-list-tile-title>Give admin privileges</v-list-tile-title>
                          </v-list-tile>
                          <v-list-tile @click="removeMember(index)">
                            <v-list-tile-title>Remove</v-list-tile-title>
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

  var getGroupFromResponse = function (response) {
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      isPublic: response.is_public,
      isJoiningAllowed: response.is_joining_allowed,
      image: response.image,
      created: response.created,
      updated: response.updated,
      admin: response.admin,
      memberCardId: response.memberCardId
    }
  }

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
        group: undefined,
        selected: undefined,
        isPublic: false,
        isJoiningAllowed: false,
        title: '',
        description: '',
        isAdmin: false,
        groupMemberCards: {
          count: 0,
          memberCards: [],
          next: undefined,
          begin: undefined,
          loading: false
        },
        usernameOrEmail: ''
      }
    },
    mounted () {
      this.group = this.kwargs.group
      this.selected = 'main'
      setTimeout(() => {
        this.init()
        this.getNextGroupMemberCards()
      }, 200)
      this.getGroup()
    },
    watch: {
      scrollEvent (event) {
        if (event.target.children[0].offsetHeight - event.target.offsetHeight - event.target.scrollTop < 1000) {
          this.getNextGroupMemberCards()
        }
      }
    },
    methods: {
      init () {
        if (this.$store.getters.user.instance.pk === this.group.instance.admin) {
          this.isAdmin = true
        } else {
          this.isAdmin = false
        }
        this.title = this.group.title
        this.description = this.group.description
        this.isPublic = this.group.isPublic
        this.isJoiningAllowed = this.group.isJoiningAllowed
        this.groupMemberCards.begin = '/api/groups/list/' + this.group.instance.id + '/member-cards/'
        this.groupMemberCards.next = this.groupMemberCards.begin
      },
      getGroup () {
        simpleRequest('/api/groups/list/' + this.group.instance.id + '/').method('get').then((response) => {
          let memberCardId = this.group.instance.memberCardId
          this.group.override(getGroupFromResponse({...response.data, memberCardId: memberCardId}))
          console.log(response)
        }).catch((error) => {
          if (error.response && error.response.status === 404) {
            this.showNotification('showWarningWithText', 'You don\'t have access to the group')
            setTimeout(() => {
              this.closeGroupSettings()
              this.$store.commit('getMyGroups')
            }, 1000)
          } else {
            this.showNotification('error')
          }
          console.log(error)
        })
      },
      getNextGroupMemberCards () {
        if (this.groupMemberCards.loading || !this.groupMemberCards.next) {
          return
        }
        this.groupMemberCards.loading = true
        simpleRequest(this.groupMemberCards.next).method('get').then((response) => {
          for (let memberCard of response.data.results) {
            memberCard.menu = false
            this.groupMemberCards.memberCards.push(memberCard)
          }
          this.groupMemberCards.next = response.data.next
          this.groupMemberCards.count = response.data.count
          this.groupMemberCards.loading = false
          console.log(response)
        }).catch((error) => {
          this.groupMemberCards.loading = false
          console.log(error)
        })
      },
      closeGroupSettings () {
        this.$emit('onClickCloseAction')
      },
      clickResetGroupSettings () {
        this.init()
      },
      clickSaveGroupSettings () {
        simpleRequest('/api/groups/my/list/' + this.group.instance.id + '/', {
          title: this.title,
          description: this.description,
          is_public: this.isPublic,
          is_joining_allowed: this.isJoiningAllowed
        }).method('put').then((response) => {
          this.group.instance = getGroupFromResponse(response.data)
          this.showNotification('showWarningWithText', 'Group settings has been changed.')
          this.$store.commit('getMyGroups')
          this.closeGroupSettings()
          console.log(response)
        }).catch((error) => {
          this.showNotification('error')
          console.log(error)
        })
      },
      clickDeleteGroupSettings () {
        if (confirm('Are you going to delete this group: ' + this.group.title)) {
          simpleRequest('/api/groups/my/list/' + this.group.instance.id + '/').method('delete').then((response) => {
            this.$store.commit('getMyGroups')
            this.closeGroupSettings()
            console.log(response)
          }).catch((error) => {
            this.showNotification('error')
            console.log(error)
          })
        }
      },
      clickLeaveGroupSettings () {
        if (confirm('Are you going to leave this group: ' + this.group.title)) {
          simpleRequest('/api/groups/my/member-cards/' + this.group.instance.memberCardId + '/remove/').method('delete').then((response) => {
            this.$store.commit('getMyGroups')
            this.closeGroupSettings()
            console.log(response)
          }).catch((error) => {
            this.showNotification('error')
            console.log(error)
          })
        }
      },
      hasAccessToActions (memberCard) {
        if (memberCard.owner.id === memberCard.group.admin) {
          return false
        } else if (this.isAdmin) {
          return true
        } else {
          return false
        }
      },
      addMemberToTheGroup () {
        if (this.isAdmin && this.usernameOrEmail.length > 0) {
          simpleRequest('/api/groups/my/list/' + this.group.instance.id + '/add/', {
            username_or_email: this.usernameOrEmail
          }).method('post').then((response) => {
            this.groupMemberCards.memberCards.unshift(response.data)
            console.log(response)
          }).catch((error) => {
            this.showNotification('showWarningWithText', error.response.data.detail)
            console.log(error)
          })
          this.usernameOrEmail = ''
        }
      },
      removeMember (index) {
        var memberCard = this.groupMemberCards.memberCards[index]
        if (this.isAdmin) {
          simpleRequest('/api/groups/my/list/' + this.group.instance.id + '/remove/', {
            username_or_email: memberCard.owner.username
          }).method('post').then((response) => {
            this.groupMemberCards.memberCards.splice(index, 1)
            console.log(response)
          }).catch((error) => {
            this.showNotification('error')
            console.log(error)
          })
        }
        memberCard.menu = false
      },
      makeMemberStaff (index) {
        var memberCard = this.groupMemberCards.memberCards[index]
        if (this.isAdmin) {
          simpleRequest('/api/groups/my/list/' + this.group.instance.id + '/make_staff/', {
            username_or_email: memberCard.owner.username
          }).method('post').then((response) => {
            memberCard.is_staff = true
            console.log(response)
          }).catch((error) => {
            this.showNotification('error')
            console.log(error)
          })
        }
        memberCard.menu = false
      },
      removeMemberStaff (index) {
        var memberCard = this.groupMemberCards.memberCards[index]
        if (this.isAdmin) {
          simpleRequest('/api/groups/my/list/' + this.group.instance.id + '/remove_staff/', {
            username_or_email: memberCard.owner.username
          }).method('post').then((response) => {
            memberCard.is_staff = false
            console.log(response)
          }).catch((error) => {
            this.showNotification('error')
            console.log(error)
          })
        }
        memberCard.menu = false
      },
      giveAdminPrivilegesToMember (index) {
        var memberCard = this.groupMemberCards.memberCards[index]
        if (this.isAdmin && confirm('Confrim to give privileges to user ' + memberCard.owner.username + '. You will lost your admin priviliges')) {
          simpleRequest('/api/groups/my/list/' + this.group.instance.id + '/make_admin/', {
            username_or_email: memberCard.owner.username
          }).method('post').then((response) => {
            let memberCardId = this.group.instance.memberCardId
            this.group.override(getGroupFromResponse({...response.data.group, memberCardId: memberCardId}))
            this.init()
            this.groupMemberCards.memberCards = []
            this.groupMemberCards.next = this.groupMemberCards.begin
            this.getNextGroupMemberCards()
            console.log(response)
          }).catch((error) => {
            this.showNotification('error')
            console.log(error)
          })
        }
        memberCard.menu = false
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .group-settings
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

  .group-main-settings-view
    .group-settings-header
      font-size: 30px
    .group-settings-actions
      display: flex
      align-items: center
      &.justify-center
        justify-items: center
      &.margin-top
        margin-top: 20px

</style>
