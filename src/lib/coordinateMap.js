export class coordinateMap {
  constructor(initialHexes) {
    this.length = 0
    this.$private = []
    this.$private$flat = []
    if (initialHexes && initialHexes.length) {
      this.push(...initialHexes)
    }
  }

  forEach(fn) {
    this.$private.forEach(x => x.forEach(y => y && fn(y)))
  }

  get(hex) {
    return this.$private[hex.x] && this.$private[hex.x][hex.y]
  }

  has(hex) {
    return !!(this.$private[hex.x] && this.$private[hex.x][hex.y])
  }

  push(...hexes) {
    hexes.forEach(hex => {
      this.$private[hex.x] = this.$private[hex.x] || []
      this.$private[hex.x][hex.y] = hex
      this.$private$flat.push(hex)
      ++this.length
    })
  }

  splice(i) {
    const spliced = this.$private$flat.splice(i, 1)[0]
    this.$private[spliced.x][spliced.y] = null
    --this.length
  }
}
