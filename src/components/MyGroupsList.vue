<template>
  <v-list subheader>
    <v-subheader>Groups</v-subheader>
    <v-list-tile @click="dialog = true">
      <v-list-tile-action>
        <v-icon v-html="'add'" class="notranslate"></v-icon>
      </v-list-tile-action>
      <v-list-tile-content>
        <v-list-tile-title>Add Group</v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-list-group v-for="group in groups" :key="group.id">
      <v-list-tile slot="item">
        <v-list-tile-avatar size="36px">
          <img v-if="group.image" :src="group.image">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{ group.title }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>keyboard_arrow_down</v-icon>
        </v-list-tile-action>
      </v-list-tile>
      <v-list-tile :to="{ name: 'ActiveGroupTasks', params: { id: group.instance.id } }">
        <v-list-tile-content>
          <v-list-tile-title>Active Tasks</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile  :to="{ name: 'CompletedGroupTasks', params: { id: group.instance.id } }">
        <v-list-tile-content>
          <v-list-tile-title>Completed Tasks</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="onClickGroupSettings(group)">
        <v-list-tile-content>
          <v-list-tile-title>Settings</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list-group>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Creating Group</v-card-title>
        <v-card-text>
          <v-text-field
            color="blue"
            ref="titleEditText"
            label="Title"
            :rules="[(v) => validateTitle(v) || 'Blank is not allowed and max is 30 characters']"
            :counter="30"
            clearable
            required
            v-model="title"
          ></v-text-field>
          <v-text-field
            color="blue"
            ref="descriptionEditText"
            label="Description"
            multi-line
            v-model="description"
          ></v-text-field>
          <span class="title">Label Color</span>
          <v-radio-group v-model="flow">
            <v-radio
              color="blue"
              label="One task for each"
              :value="1"
            ></v-radio>
            <v-radio
              color="blue"
              label="One task for all"
              :value="2"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" color="blue" @click="closeDialog">Cancel</v-btn>
          <v-btn flat="flat" color="blue" @click="onCreateClick">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
  import simpleRequest from '@/utils/SimpleRequest'

  export default {
    name: 'MyGroups',
    props: [
      'addLoadingTag',
      'removeLoadingTag',
      'showNotification'
    ],
    data () {
      return {
        groups: this.$store.getters.myGroups,
        dialog: false,
        title: '',
        description: '',
        isPublic: false,
        isJoiningAllowed: false,
        flow: 1
      }
    },
    mounted () {
      this.refreshAndGetMyGroups()
    },
    methods: {
      refresh () {
        this.refreshAndGetMyGroups()
      },

      refreshAndGetMyGroups () {
        this.$store.commit('refreshMyGroups')
        setTimeout(() => {
          this.$store.commit('getMyGroups')
        })
      },

      getMyGroups () {
        setTimeout(() => {
          this.$store.commit('getMyGroups')
        })
      },

      validateTitle (value) {
        if (value && (value.length > 0 && value.length < 30)) {
          return true
        } else {
          return false
        }
      },

      onCreateClick () {
        if (this.validateTitle(this.title)) {
          simpleRequest('/api/groups/my/list/', {
            title: this.title,
            description: this.description || '',
            is_public: this.isPublic,
            is_joining_allowed: this.isJoiningAllowed,
            flow: this.flow
          }).method('post').then((response) => {
            this.closeDialog()
            this.getMyGroups()
            console.log(response)
          }).catch((error) => {
            this.showNotification('error')
            console.log(error.response)
          })
        }
      },

      closeDialog () {
        this.dialog = false
        setTimeout(() => {
          if (!this.dialog) {
            this.$refs.titleEditText.reset()
            this.$refs.descriptionEditText.reset()
            this.isPublic = false
            this.isJoiningAllowed = false
          }
        }, 400)
      },

      updatedGroup (group, response) {
        group.instance = response.data
        this.getMyGroups()
      },

      deletedGroup (group, response) {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].instance.id === group.instance.id) {
            this.groups.splice(i, 1)
            break
          }
        }
        this.getMyGroups()
      },

      onClickGroupSettings (group) {
        this.$emit('onClickGroupSettings', 'group-settings', { group })
      }
    }
  }
</script>
