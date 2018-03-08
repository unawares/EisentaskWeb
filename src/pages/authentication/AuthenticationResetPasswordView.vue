<template>
  <v-container>
    <v-layout justify-center align-center style="min-height: 100%">
      <v-flex xs9 sm8 md7 lg6 xl5>
        <v-card>
          <v-card-title primary-title>
            <h3 class="headline mb-0">Change Password</h3>
          </v-card-title>
          <v-card-text>
            <v-layout justify-center>
              <v-flex xs11>
                <v-text-field
                  color="blue"
                  label="New Password"
                  v-model="password1"
                  min="8"
                  :error="form.reset.password1.isError"
                  :rules="form.reset.password1.messages"
                  :append-icon="!passwordVisibility ? 'visibility' : 'visibility_off'"
                  :append-icon-cb="() => (passwordVisibility = !passwordVisibility)"
                  :type="!passwordVisibility ? 'password' : 'text'"
                  counter
                  light
                ></v-text-field>
                <v-text-field
                  color="blue"
                  label="Confirm Password"
                  v-model="password2"
                  min="8"
                  :error="form.reset.password2.isError"
                  :rules="form.reset.password2.messages"
                  type="password"
                  counter
                  light
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="blue" @click="onChangeClick">Change</v-btn>
            <v-btn flat color="grey" @click="onCancelClick">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
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

  export default {
    props: ['uid', 'token', 'showNotification'],
    name: 'AuthenticationResetPassword',
    data () {
      return {
        passwordVisibility: false,
        form: {
          reset: {
            password1: new Field(),
            password2: new Field()
          }
        },
        password1: '',
        password2: '',
        eventEmitter: this.$store.getters.userEventEmitter
      }
    },
    created () {
      simpleRequest('/api/auth/logout/').method('post')
    },
    watch: {
      password1 () {
        this.refreshNewPasswordField()
      },
      password2 () {
        this.refreshConfirmPasswordField()
      }
    },
    methods: {
      onChangeClick () {
        this.refreshNewPasswordField()
        this.refreshConfirmPasswordField()
        this.changePassword().then((data) => {
          this.showNotification('showSuccessWithText', 'The password has been changed')
          this.$router.push({ name: 'Authentication', params: { action: 'signin' } })
        }).catch((data) => {
          var error = false
          if ('new_password1' in data) {
            this.form.reset.password1.messages = data.new_password1
            error = true
          }
          if ('new_password2' in data) {
            this.form.reset.password2.messages = data.new_password2
            error = true
          }
          if ('uid' in data) {
            this.showNotification('showWarningWithText', 'Invalid uid, you could not change your password')
          }
          if (error) {
            this.showNotification('showWarningWithText', 'Invalid fields.')
          }
        })
      },
      onCancelClick () {
        this.$router.push({ name: 'Authentication', params: { action: 'signin' } })
      },
      changePassword () {
        return new Promise((resolve, reject) => {
          var _changePassword = () => {
            simpleRequest('/api/auth/password/reset/confirm/', {
              new_password1: this.password1,
              new_password2: this.password2,
              uid: this.uid,
              token: this.token
            }).method('post').then((response) => {
              resolve(response.data)
              console.log(response)
            }).catch((error) => {
              if (error.response) {
                reject(error.response.data)
              } else {
                this.showNotification('error')
              }
              console.log(error)
            })
          }
          _changePassword()
        })
      },
      refreshNewPasswordField () {
        if (this.form.reset.password1.isError) {
          this.form.reset.password1.messages = []
        }
      },
      refreshConfirmPasswordField () {
        if (this.form.reset.password2.isError) {
          this.form.reset.password2.messages = []
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>

