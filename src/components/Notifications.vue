<template>
  <div class="snackbars">
    <div class="dashboard-snackbars">
      <v-snackbar
        v-for="(value, key) in snackbars"
        :timeout="value.timeout"
        :color="value.color"
        :key="key"
        v-model="value.visible"
      >
        <span class="snackbar-text">{{ value.text }}</span>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
  var self = {}

  export default {
    data () {
      return {
        snackbars: {
          successWithText: {
            text: '',
            timeout: 2500,
            color: 'blue',
            visible: false
          },
          warningWithText: {
            text: '',
            timeout: 2500,
            color: 'warning',
            visible: false
          },
          error: {
            text: 'Something went wrong',
            timeout: 1500,
            color: 'error',
            visible: false
          },
          success: {
            text: 'Successful',
            timeout: 1500,
            color: 'blue',
            visible: false
          }
        }
      }
    },
    mounted: function () {
      self.obj = this
    },
    methods: {
      error (visible = true) {
        self.obj.snackbars.error.visible = true
      },

      success (visible = true) {
        self.obj.snackbars.success.visible = true
      },

      showWarningWithText (text) {
        self.obj.snackbars.warningWithText.text = text
        self.obj.snackbars.warningWithText.visible = true
      },

      showSuccessWithText (text) {
        self.obj.snackbars.successWithText.text = text
        self.obj.snackbars.successWithText.visible = true
      },

      clear () {
        for (let snackbar in self.obj.snackbars) {
          self.obj.snackbars[snackbar].visible = false
        }
      }
    }
  }
</script>

<style scoped>
  .snackbar-text {
    text-align: center;
    width: 100%;
    font-size: 15px;
  }
</style>
