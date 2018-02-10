import { RETRY, createQueueRequests } from './QueueRequests'
import Group from '@/models/Group'

var queueRequestsRetry = createQueueRequests(RETRY, {
  xsrfHeaderName: 'X-CSRFTOKEN',
  xsrfCookieName: 'csrftoken'
})

// Get task from response
var getGroupFromResponse = function (response) {
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    isPublic: response.is_public,
    isJoiningAllowed: response.is_joining_allowed,
    image: response.image,
    created: response.created,
    updated: response.updated,
    admin: response.admin,
    memberCardId: response.memberCardId
  }
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

export default class MyGroupActions {
  static setOnFailureListener (func) {
    queueRequestsRetry.onFailure = func
  }

  static getMyGroups (callback) {
    /*
      Get all active tasks
    */
    var onFailHelper = new OnFailHelper()
    var res = {
      groups: []
    }
    queueRequestsRetry.push(
      'get', { getUrl () { return '/api/groups/my/member-cards/' } }
    ).onSuccess((response) => {
      for (let memberCard of response.data) {
        var g = new Group()
        g.instance = getGroupFromResponse({...memberCard.group, memberCardId: memberCard.id})
        res.groups.push(g)
      }
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
