export default class GroupTask {
  get instance () {
    return this.original
  }

  set instance (instance) {
    this.original = instance
    this.text = this.text || instance.text
    this.priority = this.priority || instance.priority
    this.updated = this.updated || instance.updated
    this.created = this.created || instance.created
    this.order = this.order || instance.order
  }

  override (instance) {
    this.original = instance
    this.text = instance.text
    this.priority = instance.priority
    this.updated = instance.updated
    this.created = instance.created
    this.order = instance.order
  }
}
