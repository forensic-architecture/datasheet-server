import copy from '../copy/en'

/**
 * Controller
 *
 */
class Controller {
  constructor (fetchers) {
    this.fetchers = fetchers
  }

  sourceExists (source) {
    return (Object.keys(this.fetchers).indexOf(source) >= 0)
  }

  blueprints () {
    return Object.keys(this.fetchers).map(
      source => this.fetchers[source].blueprints
    )
  }

  update () {
    return Promise.all(
      Object.keys(this.fetchers).map(source => {
        return this.fetchers[source].update()
      })
    ).then(results => {
      if (results.every(r => r)) {
        return copy.success.update
      } else {
        throw new Error(copy.errors.update)
      }
    })
  }

  retrieve (source, tab, resource) {
    if (this.sourceExists(source)) {
      const fetcher = this.fetchers[source]
      return fetcher.retrieve(tab, resource)
    } else {
      return Promise.reject(new Error(copy.errors.noResource(source)))
    }
  }

  retrieveFrag (source, tab, resource, frag) {
    if (this.sourceExists(source)) {
      const fetcher = this.fetchers[source]
      return fetcher.retrieveFrag(tab, resource, frag)
    } else {
      return Promise.reject(new Error(copy.errors.noResource(source)))
    }
  }
}

export default Controller
