import { IGNORE, createQueueRequests } from './QueueRequests'

var queueRequests = createQueueRequests(IGNORE, {
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

queueRequests.retryInterval = 1000

export default function (url, data) {
  return {
    method (requestMethod) {
      return new Promise(function (resolve, reject) {
        queueRequests.push(
          requestMethod,
          { getUrl () { return url } },
          data
        ).onSuccess((response) => {
          resolve(response)
        }).onError((error) => {
          reject(error)
        })
        queueRequests.start()
      })
    }
  }
}
