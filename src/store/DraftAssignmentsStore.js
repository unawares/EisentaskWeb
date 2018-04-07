import _ from 'underscore'
import EventEmitter from 'events'
import simpleRequest from '@/utils/SimpleRequest'

function setValue (obj, keyPath, value) {
  let lastKeyIndex = keyPath.length - 1
  for (var i = 0; i < lastKeyIndex; ++i) {
    let key = keyPath[i]
    if (!(key in obj && obj[key] instanceof Object)) {
      obj[key] = {}
    }
    obj = obj[key]
  }
  obj[keyPath[lastKeyIndex]] = value
}

function getValue (o, p) {
  return p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : undefined, o)
}

function getNewId () {
  var date = new Date()
  var components = [
    date.getYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  ]
  return components.join('')
}

class DraftAssignmentTask {
  constructor (pk, text, priority, action = 'create') {
    this.pk = pk
    this.text = text
    this.priority = priority
    this.action = action
  }
}

class DraftAssignment {
  constructor (id, name, description, labelColor, access = 2, tasks = [], uuid = null) {
    this.id = id
    this.name = name
    this.description = description
    this.labelColor = labelColor
    this.access = access
    this.tasks = tasks
    this.uuid = uuid
  }
}

class DraftAssignmentManager {
  constructor (draftAssignment, isNew = true) {
    this.draftAssignment = draftAssignment
    this.isNew = isNew
  }
  updateDraftAssignment (name, description, labelColor, access, tasks, uuid) {
    this.draftAssignment.name = name
    this.draftAssignment.description = description
    this.draftAssignment.labelColor = labelColor
    this.draftAssignment.access = access
    this.draftAssignment.tasks = tasks
    this.draftAssignment.uuid = uuid
    return this
  }
  addTask (text, priority) {
    if (getValue(this.draftAssignment, ['tasks']) === null) {
      setValue(this.draftAssignment, ['tasks'], [])
    }
    var tasks = getValue(this.draftAssignment, ['tasks'])
    tasks.unshift(
      new DraftAssignmentTask(null, text, priority)
    )
    return this
  }
  updateTask (index, text, priority) {
    if (getValue(this.draftAssignment, ['tasks']) === null) {
      setValue(this.draftAssignment, ['tasks'], [])
    }
    var tasks = getValue(this.draftAssignment, ['tasks'])
    if (index >= 0 && index <= tasks.length) {
      tasks[index].text = text
      tasks[index].priority = priority
      if (tasks[index].action === 'none') {
        tasks[index].action = 'update'
      }
    }
    return this
  }
  deleteTask (index) {
    if (getValue(this.draftAssignment, ['tasks']) === null) {
      setValue(this.draftAssignment, ['tasks'], [])
    }
    var tasks = getValue(this.draftAssignment, ['tasks'])
    if (index >= 0 && index <= tasks.length) {
      if (tasks[index].action === 'create') {
        tasks.splice(index, 1)
      } else {
        tasks[index].action = 'delete'
      }
    }
    return this
  }
  into (data) {
    var assignments = getValue(data, ['draft', 'assignments'])
    if (!(assignments instanceof Array)) {
      setValue(assignments, ['draft', 'assignments'], [])
    }
    if (this.isNew) {
      if (!(assignments instanceof Array)) {
        setValue(data, ['draft', 'assignments'], [])
      }
      assignments.unshift(this.draftAssignment)
    } else {
      if (!(assignments instanceof Array)) {
        setValue(data, ['draft', 'assignments'], [])
      }
      let index = 0
      for (;index < assignments.length && assignments[index].id !== this.draftAssignment.id; index++) {}
      if (index !== assignments.length) {
        assignments[index] = this.draftAssignment
      } else {
        assignments.unshift(this.draftAssignment)
      }
    }
    return this
  }
  setTasks (draftAssignmentTasks) {
    setValue(this.draftAssignment, ['tasks'], draftAssignmentTasks)
    return this
  }
  getDraftAssignment () {
    return this.draftAssignment
  }
}

class DraftAssignmentBuilder {
  static withDraftAssignment (draftAssignment) {
    return new DraftAssignmentManager(
      new DraftAssignment(
        draftAssignment.id,
        draftAssignment.name,
        draftAssignment.description,
        draftAssignment.labelColor,
        draftAssignment.access,
        draftAssignment.tasks,
        draftAssignment.uuid
      ),
      false
    )
  }
  static newDraftAssignment (name, description, labelColor, access = 2, tasks = [], uuid = null) {
    return new DraftAssignmentManager(
      new DraftAssignment(
        getNewId(),
        name,
        description,
        labelColor,
        access,
        tasks,
        uuid
      ),
      true
    )
  }
}

export default {
  state: {
    draftAssignmentsEventEmitter: new EventEmitter(),
    draftAssignments: undefined,
    draftAssignmentEventEmitter: new EventEmitter()
  },

  actions: {
  },

  mutations: {
    getDraftAssignmentsFromProfileData (state) {
      state.draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      state.draftAssignmentsEventEmitter.emit('updated', state.draftAssignments)
    },
    createDraftAssignment (state, [name, description, labelColor]) {
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var res = DraftAssignmentBuilder
                  .newDraftAssignment(name, description, labelColor)
                  .into(profileData)
                  .getDraftAssignment()
      this.getters.profileDataEventEmitter.once('updated', () => {
        state.draftAssignmentEventEmitter.emit('created', res)
      })
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    createDraftAssignmentFromAssignment (state, [assignment]) {
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var tasks = assignment.assignment_tasks
      var orders = assignment.orders
      tasks = _.sortBy(tasks, task => orders[task.id.toString()])
      var draftAssignmentTasks = []
      for (let task of tasks) {
        draftAssignmentTasks.push(new DraftAssignmentTask(
          task.id,
          task.text,
          task.priority,
          'none'
        ))
      }
      var res = DraftAssignmentBuilder
                  .newDraftAssignment(
                    assignment.assignment.name,
                    assignment.assignment.description,
                    assignment.assignment.label_color,
                    assignment.assignment.access,
                    draftAssignmentTasks,
                    assignment.assignment.uuid
                  )
                  .into(profileData)
                  .getDraftAssignment()
      this.getters.profileDataEventEmitter.once('updated', () => {
        state.draftAssignmentEventEmitter.emit('created', res)
      })
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    updateDraftAssignment (state, [id, name, description, labelColor, access, tasks, uuid]) {
      // Get draft assignment
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var draftAssignment = null
      if (draftAssignments instanceof Array) {
        for (let assignment of draftAssignments) {
          if (assignment.id === id) {
            draftAssignment = assignment
            break
          }
        }
      }
      // Do something
      if (draftAssignment !== null) {
        var res = DraftAssignmentBuilder
                    .withDraftAssignment(draftAssignment)
                    .updateDraftAssignment(
                      name,
                      description,
                      labelColor,
                      access || draftAssignment.access,
                      tasks || draftAssignment.tasks,
                      uuid || draftAssignment.uuid
                    ).into(profileData)
                    .getDraftAssignment()
        this.getters.profileDataEventEmitter.once('updated', () => {
          state.draftAssignmentEventEmitter.emit('updated', res)
        })
      }
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    deleteDraftAssignment (state, [id]) {
      // Get draft assignment
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      if (draftAssignments instanceof Array) {
        for (let index = 0; index < draftAssignments.length; index++) {
          if (draftAssignments[index].id === id) {
            this.getters.profileDataEventEmitter.once('updated', () => {
              state.draftAssignmentEventEmitter.emit('deleted', draftAssignments[index])
            })
            draftAssignments.splice(index, 1)
            break
          }
        }
      }
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    createAssignedTask (state, [id /* Draft Assignment id */, text, priority]) {
      // Get draft assignment
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var draftAssignment = null
      if (draftAssignments instanceof Array) {
        for (let assignment of draftAssignments) {
          if (assignment.id === id) {
            draftAssignment = assignment
            break
          }
        }
      }
      // Do something
      if (draftAssignment !== null) {
        DraftAssignmentBuilder
          .withDraftAssignment(draftAssignment)
          .addTask(text, priority)
          .into(profileData)
      }
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    updateAssignedTask (state, [id, index, text, priority]) {
      // Get draft assignment
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var draftAssignment = null
      if (draftAssignments instanceof Array) {
        for (let assignment of draftAssignments) {
          if (assignment.id === id) {
            draftAssignment = assignment
            break
          }
        }
      }
      // Do something
      if (draftAssignment !== null) {
        DraftAssignmentBuilder
          .withDraftAssignment(draftAssignment)
          .updateTask(index, text, priority)
          .into(profileData)
      }
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    deleteAssignedTask (state, [id, index]) {
      // Get draft assignment
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var draftAssignment = null
      if (draftAssignments instanceof Array) {
        for (let assignment of draftAssignments) {
          if (assignment.id === id) {
            draftAssignment = assignment
            break
          }
        }
      }
      // Do something
      if (draftAssignment !== null) {
        DraftAssignmentBuilder
          .withDraftAssignment(draftAssignment)
          .deleteTask(index)
          .into(profileData)
      }
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    setDraftAssignedTasks (state, [id, tasks]) {
      // Get draft assignment
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var draftAssignment = null
      if (draftAssignments instanceof Array) {
        for (let assignment of draftAssignments) {
          if (assignment.id === id) {
            draftAssignment = assignment
            break
          }
        }
      }
      // Do something
      if (draftAssignment !== null) {
        DraftAssignmentBuilder
          .withDraftAssignment(draftAssignment)
          .setTasks(tasks)
          .into(profileData)
      }
      state.draftAssignmentEventEmitter.emit('beforePost')
      this.commit('updateProfileData', profileData)
    },
    saveDraftAssigment (state, [id]) {
      // Get draft assignment
      var profileData = this.getters.getProfileData
      var draftAssignments = getValue(state.profileData, ['draft', 'assignments'])
      if (!(draftAssignments instanceof Array)) {
        setValue(profileData, ['draft', 'assignments'], [])
      }
      var draftAssignment = null
      if (draftAssignments instanceof Array) {
        for (let assignment of draftAssignments) {
          if (assignment.id === id) {
            draftAssignment = assignment
            break
          }
        }
      }
      if (draftAssignment !== null) {
        state.draftAssignmentEventEmitter.emit('beforePost')
        if (draftAssignment.uuid) {
          simpleRequest('/api/assignments/private/' + draftAssignment.uuid + '/').method('get').then((response) => {
            simpleRequest('/api/assignments/private/' + draftAssignment.uuid + '/update_assignment_tasks/', {
              name: draftAssignment.name,
              description: draftAssignment.description,
              label_color: draftAssignment.labelColor,
              access: draftAssignment.access,
              tasks: draftAssignment.tasks
            }).method('put').then((response) => {
              var draftAssignmentTasks = []
              for (let task of response.data.assignment_tasks) {
                draftAssignmentTasks.push(new DraftAssignmentTask(
                  task.id,
                  task.text,
                  task.priority,
                  'none'
                ))
              }
              var res = DraftAssignmentBuilder
                          .withDraftAssignment(draftAssignment)
                          .setTasks(draftAssignmentTasks)
                          .into(profileData)
                          .getDraftAssignment()
              this.getters.profileDataEventEmitter.once('updated', () => {
                state.draftAssignmentEventEmitter.emit('updated', res)
              })
              this.commit('updateProfileData', profileData)
              console.log(response)
            }).catch((error) => {
              console.log(error.response.data)
              this.getters.draftAssignmentEventEmitter.emit('error')
              console.log(error)
            })
            console.log(response)
          }).catch((error) => {
            if (error.response.status === 404) {
              var draftAssignmentTasks = []
              for (let task of draftAssignment.tasks) {
                if (task.action === 'delete') {
                  continue
                }
                draftAssignmentTasks.push(new DraftAssignmentTask(
                  null,
                  task.text,
                  task.priority,
                  'create'
                ))
              }
              simpleRequest('/api/assignments/private/create_assignment_tasks/', {
                name: draftAssignment.name,
                description: draftAssignment.description,
                label_color: draftAssignment.labelColor,
                access: draftAssignment.access,
                tasks: draftAssignmentTasks
              }).method('post').then((response) => {
                var draftAssignmentTasks = []
                for (let task of response.data.assignment_tasks) {
                  draftAssignmentTasks.push(new DraftAssignmentTask(
                    task.id,
                    task.text,
                    task.priority,
                    'none'
                  ))
                }
                var res = DraftAssignmentBuilder
                            .withDraftAssignment(draftAssignment)
                            .updateDraftAssignment(
                              response.data.assignment.name,
                              response.data.assignment.description,
                              response.data.assignment.label_color,
                              response.data.assignment.access,
                              draftAssignmentTasks,
                              response.data.assignment.uuid
                            ).into(profileData)
                            .getDraftAssignment()
                this.getters.profileDataEventEmitter.once('updated', () => {
                  state.draftAssignmentEventEmitter.emit('created', res)
                })
                this.commit('updateProfileData', profileData)
                console.log(response)
              }).catch((error) => {
                this.getters.draftAssignmentEventEmitter.emit('error')
                console.log(error)
              })
            } else {
              this.getters.draftAssignmentEventEmitter.emit('error')
            }
            console.log(error)
          })
        } else {
          var draftAssignmentTasks = []
          for (let task of draftAssignment.tasks) {
            if (task.action === 'delete') {
              continue
            }
            draftAssignmentTasks.push(new DraftAssignmentTask(
              null,
              task.text,
              task.priority,
              'create'
            ))
          }
          simpleRequest('/api/assignments/private/create_assignment_tasks/', {
            name: draftAssignment.name,
            description: draftAssignment.description,
            label_color: draftAssignment.labelColor,
            access: draftAssignment.access,
            tasks: draftAssignmentTasks
          }).method('post').then((response) => {
            var draftAssignmentTasks = []
            for (let task of response.data.assignment_tasks) {
              draftAssignmentTasks.push(new DraftAssignmentTask(
                task.id,
                task.text,
                task.priority,
                'none'
              ))
            }
            var res = DraftAssignmentBuilder
                        .withDraftAssignment(draftAssignment)
                        .updateDraftAssignment(
                          response.data.assignment.name,
                          response.data.assignment.description,
                          response.data.assignment.label_color,
                          response.data.assignment.access,
                          draftAssignmentTasks,
                          response.data.assignment.uuid
                        ).into(profileData)
                        .getDraftAssignment()
            this.getters.profileDataEventEmitter.once('updated', () => {
              state.draftAssignmentEventEmitter.emit('created', res)
            })
            this.commit('updateProfileData', profileData)
            console.log(response)
          }).catch((error) => {
            this.getters.draftAssignmentEventEmitter.emit('error')
            console.log(error)
          })
        }
      }
    }
  },

  getters: {
    draftAssignmentsEventEmitter (state) {
      return state.draftAssignmentsEventEmitter
    },
    draftAssignments (state) {
      return state.draftAssignments
    },
    draftAssignmentEventEmitter (state) {
      return state.draftAssignmentEventEmitter
    }
  }
}
