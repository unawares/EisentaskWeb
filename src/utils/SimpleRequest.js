import { IGNORE, createQueueRequests } from './QueueRequests'

var queueRequests = createQueueRequests(IGNORE, {
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

export default function (url, data) {
  return {
    method (requestMethod) {
      return new Promise(function (resolve, reject) {
        queueRequests.push(
          requestMethod,
          { getUrl () { return url } },
          data
        ).onSuccess((response) => {
          console.log(JSON.stringify(response.data))
          resolve(response)
        }).onError((error) => {
          reject(error)
        })
        queueRequests.start()
      })
    }
  }
}
