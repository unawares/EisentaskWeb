import axios from 'axios'

export default class QueueRequests {
  constructor (options) {
    this.BREAK = 'break'
    this.CLEAN = 'clean'
    this.RETRY = 'retry'

    this.axios = axios.create(options)
    this.requests = []
    this.isLoading = false
    this.method = this.BREAK
    this.retryInterval = 500
    this.onFailure = () => {}
  }

  push (method, url, data = {}) {
    var request = {
      method,
      url,
      data,
      onSuccess: () => {},
      onError: () => {}
    }
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
    this.requests.push(request)
    return actions
  }

  popNextRequest () {
    return (this.requests.length > 0) ? this.requests.shift() : null
  }

  start () {
    if (this.isLoading) return
    var func = () => {
      var request = this.popNextRequest()
      if (request) {
        this.isLoading = true
        this.axios({
          method: request.method,
          url: request.url,
          data: request.data
        }).then((response) => {
          request.onSuccess(response)
          func()
        }).catch((error) => {
          console.log(error)
          switch (this.method) {
            case this.BREAK:
              this.isLoading = false
              this.requests.unshift(request)
              break
            case this.CLEAN:
              this.isLoading = false
              this.requests = []
              break
            case this.RETRY:
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
    func()
  }
}
