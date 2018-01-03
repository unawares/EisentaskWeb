export default class Task {
  get instance () {
    return this.instance
  }

  set instance (instance) {
    this.original = instance
    this.text = instance.text
    this.priority = instance.priority
    this.completed = instance.completed
    this.position = instance.position
  }
}
