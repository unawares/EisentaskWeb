export default class Group {
  get instance () {
    return this.original
  }

  set instance (instance) {
    this.original = instance
    this.title = this.title || instance.title
    this.description = this.description || instance.description
    this.isPublic = this.isPublic || instance.isPublic
    this.isJoiningAllowed = this.isJoiningAllowed || instance.isJoiningAllowed
    this.image = this.image || instance.image
    this.created = this.created || instance.created
    this.updated = this.updated || instance.updated
    this.admin = this.admin || instance.admin
  }
}
