export default class User {
  get instance () {
    return this.original
  }

  set instance (instance) {
    this.original = instance
    this.username = instance.username
  }
}
