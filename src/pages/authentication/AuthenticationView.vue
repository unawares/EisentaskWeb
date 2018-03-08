<template>
  <div id="authentication">
    <div id="auth-form">
      <div class="logo-on-form">
        <a>
          <img src="/static/assets/logo.svg">
        </a>
      </div>
      <ul class="auth-tabs">
        <li class="auth-tab-item" :class="[action === 'signin' ? 'selected-tab' : '']" @click="refreshFields">
          <router-link :to="{ name: 'Authentication', params: { action: 'signin' } }" class="router-box">
            <span class="auth-tab-item-text">
              SIGN IN
            </span>
          </router-link>
        </li>
        <li class="auth-tab-item" :class="[action === 'signup' ? 'selected-tab' : '']" @click="refreshFields">
          <router-link :to="{ name: 'Authentication', params: { action: 'signup' } }" class="router-box">
            <span class="auth-tab-item-text">
              SIGN UP
            </span>
          </router-link>
        </li>
      </ul>
      <div class="form-content">
        <div v-if="action === 'signin'">
          <v-text-field
            color="blue"
            prepend-icon="account_circle"
            label="Username or Email"
            v-model="usernameOrEmail"
            :error="form.signin.usernameOrEmail.isError"
            :rules="form.signin.usernameOrEmail.messages"
            clearable
            counter
            dark
          ></v-text-field>
          <v-text-field
            color="blue"
            prepend-icon="vpn_key"
            label="Password"
            v-model="password"
            min="8"
            :error="form.signin.password.isError"
            :rules="form.signin.password.messages"
            :append-icon="!passwordVisibility ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (passwordVisibility = !passwordVisibility)"
            :type="!passwordVisibility ? 'password' : 'text'"
            counter
            dark
          ></v-text-field>
          <div class="auth-button-outline">
            <a @click="authenticate" v-if="!loading">SIGN IN</a>
            <v-progress-circular v-else indeterminate v-bind:size="50" color="amber"></v-progress-circular>
          </div>
          <div class="auth-message auth-forgot-text">
            <a @click="resetClicked">Forgot your password?</a>
          </div>
        </div>
        <div v-if="action === 'signup'">
          <v-text-field
            color="blue"
            prepend-icon="account_circle"
            label="Username"
            v-model="username"
            :error="form.signup.username.isError"
            :rules="form.signup.username.messages"
            clearable
            counter
            dark
          ></v-text-field>
          <v-text-field
            color="blue"
            prepend-icon="vpn_key"
            label="Password"
            v-model="password"
            min="8"
            :error="form.signup.password.isError"
            :rules="form.signup.password.messages"
            :append-icon="!passwordVisibility ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (passwordVisibility = !passwordVisibility)"
            :type="!passwordVisibility ? 'password' : 'text'"
            counter
            dark
          ></v-text-field>
          <v-text-field
            color="blue"
            prepend-icon="mail"
            label="Email"
            v-model="email"
            :error="form.signup.email.isError"
            :rules="form.signup.email.messages"
            clearable
            dark
          ></v-text-field>
          <div class="auth-button-outline">
            <a @click="register" v-if="!loading">SIGN UP</a>
            <v-progress-circular v-else indeterminate v-bind:size="50" color="amber"></v-progress-circular>
          </div>
        </div>
      </div>
      <v-bottom-sheet
        inset
        lazy
        v-model="resetBottomSheet">
        <v-card tile>
          <v-progress-linear color="amber" height="5" class="my-0" :indeterminate="resetLoading"></v-progress-linear>
          <v-list>
            <v-subheader>Reset Password</v-subheader>
            <v-container>
              <v-layout justify-center align-center>
                <v-flex xs12 sm11 md10 lg9 xl8>
                  <v-text-field
                    color="blue"
                    prepend-icon="mail"
                    label="Email"
                    v-model="email"
                    :error="form.reset.email.isError"
                    :rules="form.reset.email.messages"
                    clearable
                  ></v-text-field>
                  <v-layout>
                    <v-spacer></v-spacer>
                    <v-btn flat color="grey" @click.native="resetBottomSheet = false">CANCEL</v-btn>
                    <v-btn flat color="blue" @click="reset" :disabled="resetLoading">RESET</v-btn>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-list>
        </v-card>
      </v-bottom-sheet>
    </div>
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

var validateEmail = function (email) {
  var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  return re.test(String(email).toLowerCase())
}

export default {
  props: ['action', 'showNotification'],
  data () {
    return {
      resetBottomSheet: false,
      passwordVisibility: false,
      usernameOrEmail: '',
      username: '',
      password: '',
      email: '',
      loading: false,
      resetLoading: false,
      form: {
        signin: {
          usernameOrEmail: new Field(),
          password: new Field()
        },
        signup: {
          username: new Field(),
          password: new Field(),
          email: new Field()
        },
        reset: {
          email: new Field()
        }
      },
      eventEmitter: this.$store.getters.userEventEmitter
    }
  },
  created () {
    this.loading = false
    this.eventEmitter.on('updated', () => {
      this.$router.push({ name: 'ActiveTasks' })
    })
    this.$store.commit('getUser')
  },
  watch: {
    usernameOrEmail: function () {
      if (validateEmail(this.usernameOrEmail)) {
        this.email = this.usernameOrEmail
        if (this.action === 'signin') {
          this.username = ''
        }
      } else {
        this.username = this.usernameOrEmail
        if (this.action === 'signin') {
          this.email = ''
        }
      }
      this.refreshUsernameField()
    },
    password: function () {
      this.refreshPasswordField()
    },
    email: function () {
      this.refreshEmailField()
      this.refreshResetField()
      if (this.action === 'signup') {
        if (validateEmail(this.email) && (validateEmail(this.usernameOrEmail) || !this.usernameOrEmail)) {
          this.usernameOrEmail = this.email
        } else {
          this.usernameOrEmail = this.username
        }
      }
    },
    username: function () {
      this.refreshUsernameField()
      if (this.action === 'signup') {
        if (this.username.length === 0 && this.email.length > 0 && validateEmail(this.email)) {
          this.usernameOrEmail = this.email
        } else {
          this.usernameOrEmail = this.username
        }
      }
    }
  },
  methods: {
    refreshUsernameOrEmailField: function () {
      if (this.form.signin.usernameOrEmail.isError) {
        this.form.signin.usernameOrEmail.messages = []
      }
    },
    refreshUsernameField: function () {
      if (this.form.signup.username.isError) {
        this.form.signup.username.messages = []
      }
    },
    refreshPasswordField: function () {
      if (this.form.signin.password.isError) {
        this.form.signin.password.messages = []
      }
      if (this.form.signup.password.isError) {
        this.form.signup.password.messages = []
      }
    },
    refreshEmailField: function () {
      if (this.form.signup.email.isError) {
        this.form.signup.email.messages = []
      }
    },
    refreshResetField: function () {
      if (this.form.reset.email.isError) {
        this.form.reset.email.messages = []
      }
    },
    refreshFields: function () {
      this.refreshUsernameOrEmailField()
      this.refreshUsernameField()
      this.refreshPasswordField()
      this.refreshEmailField()
      this.refreshResetField()
    },
    refreshSignUpFields: function () {
      this.refreshUsernameField()
      this.refreshEmailField()
      this.refreshPasswordField()
    },
    refreshSignInFields: function () {
      this.refreshUsernameOrEmailField()
      this.refreshPasswordField()
    },
    authenticate: function () {
      this.refreshSignInFields()
      this.loading = true
      var _authenticate = () => {
        var error = false

        if (!this.usernameOrEmail && (error = true)) {
          this.form.signin.usernameOrEmail.messages = [
            'This field may not be blank'
          ]
        }
        if (!this.password && (error = true)) {
          this.form.signin.password.messages = [
            'This field may not be blank'
          ]
        }

        // Cancel if there is an error
        if (error) {
          this.showNotification('showWarningWithText', 'Invalid username or email.')
          this.loading = false
          return
        }
        var data = {
          password: this.password
        }
        if (validateEmail(this.usernameOrEmail)) {
          data.email = this.usernameOrEmail
        } else {
          data.username = this.usernameOrEmail
        }
        this.password = ''
        simpleRequest('/api/auth/login/', data).method('post').then((response) => {
          this.showNotification('showSuccessWithText', 'Welcome, ' + response.data.user.username)
          this.loading = false
          this.$router.push({ name: 'ActiveTasks' })
          console.log(response)
        }).catch((error) => {
          this.loading = false
          if (error.response.data) {
            console.log(error.response.data)
            if ('non_field_errors' in error.response.data) {
              this.showNotification('showWarningWithText', error.response.data.non_field_errors[0])
            }
            if ('username' in error.response.data) {
              this.form.signin.username.messages = error.response.data.username
            }
            if ('password' in error.response.data) {
              this.form.signin.password.messages = error.response.data.password
            }
          } else {
            this.showNotification('error')
          }
          console.log(error)
        })
      }
      setTimeout(_authenticate, 500)
    },
    register: function () {
      this.refreshSignUpFields()
      this.loading = true
      var _register = () => {
        var error = false

        if (!this.username && (error = true)) {
          this.form.signup.username.messages = [
            'This field may not be blank'
          ]
        }
        if (!validateEmail(this.email) && (error = true)) {
          this.form.signup.email.messages = [
            'Enter a valid email'
          ]
        }
        if (!this.password && (error = true)) {
          this.form.signup.password.messages = [
            'This field may not be blank'
          ]
        }

        // Cancel if there is an error
        if (error) {
          this.showNotification('showWarningWithText', 'Invalid fields.')
          this.loading = false
          return
        }

        simpleRequest('/api/auth/registration/', {
          username: this.username,
          email: this.email,
          password1: this.password,
          password2: this.password
        }).method('post').then((response) => {
          this.loading = false
          if ('detail' in response.data) {
            this.showNotification('showSuccessWithText', response.data.detail)
          }
          console.log(response)
        }).catch((error) => {
          this.loading = false
          if (error.response.data) {
            if ('username' in error.response.data) {
              this.form.signup.username.messages = error.response.data.username
            }
            if ('email' in error.response.data) {
              this.form.signup.email.messages = error.response.data.email
            }
            if ('password1' in error.response.data) {
              this.form.signup.password.messages = error.response.data.password1
            }
          } else {
            this.showNotification('error')
          }
          console.log(error)
        })
      }
      setTimeout(_register, 500)
    },
    reset: function () {
      this.refreshResetField()
      this.resetLoading = true
      var _reset = () => {
        var error = false
        if (!validateEmail(this.email) && (error = true)) {
          this.form.reset.email.messages = [
            'Enter a valid email'
          ]
        }
        if (error) {
          this.resetLoading = false
          return
        }
        simpleRequest('/api/auth/password/reset/', {
          email: this.email
        }).method('post').then((response) => {
          this.resetBottomSheet = false
          this.resetLoading = false
          if ('detail' in response.data) {
            this.showNotification('showSuccessWithText', response.data.detail)
          }
          this.email = ''
          console.log(response)
        }).catch((error) => {
          this.resetBottomSheet = false
          this.resetLoading = false
          this.showNotification('error')
          console.log(error)
        })
      }
      setTimeout(_reset, 500)
    },
    resetClicked: function () {
      this.resetBottomSheet = true
    }
  }
}
</script>

<style scoped>
#authentication {
  padding: 50px 50px 100px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#auth-form {
  width: 100%;
  max-width: 400px;
  height: 500px;
  position: relative;
  top: -30px;
}

.auth-tabs .router-box {
  display: inline-block;
  height: 100%;
  width: 100%;
  position: absolute;
}

.auth-tabs {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  height: 80px;
}

.auth-tabs > li {
  list-style-type: none;
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.auth-tabs > li:after {
  content: "";
  width: 100%;
  height: 100%;
  display: inline-block;
  position: absolute;
  background-color: #FFC107;
  top: 100%;
}

.auth-tabs > li.selected-tab:after {
  top: 0;
}

.auth-tabs > li.selected-tab .auth-tab-item-text,
.auth-tabs > li:hover .auth-tab-item-text {
  color: white;
}

.auth-tabs > li:after,
.auth-tabs > li .auth-tab-item-text {
  transition: all ease-out 0.3s;
}

.auth-tabs > li .auth-tab-item-text {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  color: #FFC107;
  font-size: 16px;
  transform: translate(-50%, -50%);
  text-decoration: none;
}

.form-content {
  padding-top: 30px;
}

.auth-button-outline {
  height: 80px;
  align-items: center;
  display: flex;
  justify-content: center;
  text-align: center;
}

.auth-button-outline > a {
  color: #FFC107;
  border: solid 2px #FFC107;
  text-decoration: none;
  padding: 8px 36px;
  font-size: 16px;
  margin:  10px;
  border-radius: 30px;
  transition: all ease-out 0.15s;
  cursor: pointer;
}

.auth-button-outline > a:hover {
  color: white;
  background-color: #FFC107;
}

.auth-forgot-text {
  text-align: center;
}

.action-auth-message {
  text-align: center;
  visibility: hidden;
}

.action-auth-message  > p {
  font-size: 16px;
}

auth-reset-success-message > p {
  color: #70EF53;
}

.auth-forgot-text > a {
  font-size: 18px;
  cursor: pointer;
  color: #F93E3E;
}

.logo-on-form {
  padding: 0 50px 20px;
  position: relative;
}

.text-center {
  text-align: center;
}

.reset-text {
  font-weight: 400;
  color: white;
  font-size: 20px;
}
</style>
