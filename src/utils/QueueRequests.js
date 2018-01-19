import axios from 'axios'

export const IGNORE = 'ignore'  // If fail, then ignore
export const BREAK = 'break'  // If fail, then break
export const CLEAN = 'clean'  // If fail, then break and clean rest requests
export const RETRY = 'retry'  // If fail, then try again

var retryInterval = 20

class QueueRequests {
  constructor (options) {
    // Prepare
    this.axios = axios.create(options)
    this.requests = []
    this.isLoading = false

    // Set default settings
    this.method = IGNORE
    this.retryInterval = retryInterval
    this.onFailure = () => {}
  }

  push (method, dynamicUrl, data = {}) {
    var request = {
      method,
      dynamicUrl,
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

  clear () {
    this.requests = []
    this.isLoading = false
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
          url: request.dynamicUrl.getUrl(),
          data: request.data
        }).then((response) => {
          this.retryInterval = retryInterval
          request.onSuccess(response)
          func()  // Call it again, to make recursive
        }).catch((error) => {
          switch (this.method) {
            case IGNORE:
              setTimeout(func, this.retryInterval)
              break
            case BREAK:  // Break logic
              this.isLoading = false
              this.requests.unshift(request)
              break
            case CLEAN:  // Clean logic
              this.isLoading = false
              this.requests = []
              break
            case RETRY:  // Retry logic
              this.requests.unshift(request)
              setTimeout(func, this.retryInterval)
              break
          }
          request.onError(error)
          this.onFailure(error, this)
        })
      } else {
        this.isLoading = false
      }
    }
    func()  // Initial call
  }
}

export function createQueueRequests (method, headers) {
  var queueRequests = new QueueRequests(headers)
  queueRequests.method = method
  return queueRequests
}
