import axios from 'axios'

export default class QueueRequests {
  constructor (options) {
    // Constants for method type
    this.BREAK = 'break'  // If fail, then break
    this.CLEAN = 'clean'  // If fail, then break and clean rest requests
    this.RETRY = 'retry'  // If fail, then try again

    // Prepare
    this.axios = axios.create(options)
    this.requests = []
    this.isLoading = false

    // Set default settings
    this.method = this.BREAK
    this.retryInterval = 20
    this.onFailure = () => {}
  }

  push (method, url, data = {}) {
    var request = {
      method,
      url,
      data,
      onSuccess: () => {},  // Fucntion on success with a single request
      onError: () => {}  // Function on error with a single request
    }

    // To register custom functions
    var actions = {
      onSuccess: (func) => {
        request.onSuccess = func
        return actions
      },
      onError: (func) => {
        request.onError = func
        return actions
      }
    }

    // Register request
    this.requests.push(request)

    return actions
  }

  popNextRequest () {
    // Pop next request
    return (this.requests.length > 0) ? this.requests.shift() : null
  }

  start () {
    // Cancel if another is running
    if (this.isLoading) return

    // Create function to make ability to recursion calls
    var func = () => {
      var request = this.popNextRequest()  // Next request
      if (request) {  // If next exists
        this.isLoading = true  // Set to true to disable repeat call
        this.axios({
          method: request.method,
          url: request.url,
          data: request.data
        }).then((response) => {
          request.onSuccess(response)
          func()  // Call it again, to make recursive
        }).catch((error) => {
          console.log(error)
          switch (this.method) {
            case this.BREAK:  // Break logic
              this.isLoading = false
              this.requests.unshift(request)
              break
            case this.CLEAN:  // Clean logic
              this.isLoading = false
              this.requests = []
              break
            case this.RETRY:  // Retry logic
              this.requests.unshift(request)
              setTimeout(func, this.retryInterval)
              break
          }
          request.onError(error)
          this.onFailure(error)
        })
      } else {
        this.isLoading = false
      }
    }
    func()  // Initial call
  }
}
