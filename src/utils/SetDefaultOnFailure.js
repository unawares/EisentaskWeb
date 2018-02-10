var onFailure = function (error, queueRequests) {
  var timeToWait = 1000
  if (error.response) {
    switch (error.response.status) {
      case 401:
        queueRequests.clear()
        window.location = '/web/accounts/login'
        break
      default:
        queueRequests.retryInterval = timeToWait
    }
  } else {
    queueRequests.retryInterval = timeToWait
  }
}

export default function (actions) {
  actions.setOnFailureListener(onFailure)
}
