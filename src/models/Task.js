/*
  1) Task has original state which must be constant
  2) Other fields may be changed
  3) Task actions works with its fields and original state
     Update action:
            Gets fields and makes request to the server to change its values
            Responsed task assigns to original, then other fields take values from it
     Create action:
            Get fields and makes request to the server to create a task
            Responsed task assigns to original, then other fields take values from it

*/

export default class Task {
  get instance () {
    return this.instance
  }

  set instance (instance) {
    this.original = instance
    this.text = instance.text
    this.priority = instance.priority
    this.completed = instance.completed
  }
}
