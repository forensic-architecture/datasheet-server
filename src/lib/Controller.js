import copy from '../copy/en'

/**
 * Controller
 *
 */
class Controller {
  constructor (fetchers) {
    this.fetchers = fetchers
  }

  _sheetExists (sheet) {
    return (Object.keys(this.fetchers).indexOf(sheet) >= 0)
  }

  blueprints () {
    return Object.keys(this.fetchers).map(
      sheet => this.fetchers[sheet].blueprints
    ).reduce((acc, curr) => acc.concat(curr))
  }

  update () {
    return Promise.all(
      Object.keys(this.fetchers).map(sheet => {
        return this.fetchers[sheet].update()
      })
    ).then(results => {
      if (results.every(r => r)) {
        return copy.success.update
      } else {
        throw new Error(copy.errors.update)
      }
    })
  }

  retrieve (sheet, tab, resource) {
    if (this._sheetExists(sheet)) {
      const fetcher = this.fetchers[sheet]
      return fetcher.retrieve(tab, resource)
    } else {
      return Promise.reject(new Error(copy.errors.noResource(sheet)))
    }
  }

  retrieveFrag (sheet, tab, resource, frag) {
    if (this._sheetExists(sheet)) {
      const fetcher = this.fetchers[sheet]
      return fetcher.retrieveFrag(tab, resource, frag)
    } else {
      return Promise.reject(new Error(copy.errors.noResource(sheet)))
    }
  }
}

export default Controller
