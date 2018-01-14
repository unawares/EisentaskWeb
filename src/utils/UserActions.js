import { RETRY, createQueueRequests } from './QueueRequests'

var queueRequestsRetry = createQueueRequests(RETRY, {
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

// Get task from response
var getUserFromResponse = function (response) {
  var user = {
    pk: response.data.pk,
    username: response.data.username,
    email: response.data.email
  }
  return user
}

class OnFailHelper {
  constructor () {
    this.statusCodes = []
    this.onCatchStatusCodes = () => {}
  }
}

var setActionsToFailHelper = function (onFailHelper) {
  return {
    onCatchStatusCodes: (statusCodes) => {
      onFailHelper.statusCodes = statusCodes
      return {
        do: (func) => {
          onFailHelper.onCatchStatusCodes = func
        }
      }
    }
  }
}

export default class UserActions {
  static getUser (callback, user) {
    /*
      Get all active tasks
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      user
    }
    queueRequestsRetry.push(
      'get', { getUrl () { return '/api/auth/user/' } }
    ).onSuccess((response) => {
      res.user.instance = getUserFromResponse(response)
      callback(res)
      console.log(response)
    }).onError((error) => {
      if (error.response) {
        if (onFailHelper.statusCodes.indexOf(error.response.status) !== -1) {
          onFailHelper.onCatchStatusCodes(queueRequestsRetry)
        }
      }
      console.log(error)
    })
    queueRequestsRetry.start()
    return setActionsToFailHelper(onFailHelper)
  }
}
