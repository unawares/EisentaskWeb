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
        {{ value.text }}
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
        synchronized: {
          text: 'Synchronized',
          timeout: 1500,
          color: 'success',
          visible: false
        },

        synchronization: {
          text: 'Synchronization...',
          timeout: 9999,
          color: 'info',
          visible: false
        },

        error: {
          text: 'Something went wrong',
          timeout: 1500,
          color: 'error',
          visible: false
        }
      }
    }
  },
  mounted: function () {
    self.obj = this
  },
  methods: {
    synchronized (visible = true) {
      self.obj.snackbars.synchronized.visible = visible
    },

    synchronization (visible = true) {
      self.obj.snackbars.synchronization.visible = visible
    },

    error (visible = true) {
      self.obj.snackbars.error.visible = visible
    }
  }
}
</script>
