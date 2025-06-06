import copy from '../copy/en'
import { exportToFile } from '../lib/util'

/**
 * Controller class
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

  rebuildBlueprintsAsync () {
    Object.values(this.fetchers).forEach(t => t._buildBlueprintsAsync())
  }

  update () {
    const me = this
    return Promise.all(
      Object.keys(this.fetchers).map(sheet => {
        return this.fetchers[sheet].update()
      })
    ).then(results => {
      if (results.every(r => r)) {
        me.rebuildBlueprintsAsync()
        return copy.success.update
      } else {
        throw new Error(copy.errors.update)
      }
    })
  }

  // Controller function to retrieve all blueprints and export to user defined file location
  retrieveAll (fileDest) {
    if (!fileDest) return Promise.reject(new Error(copy.errors.export.fileMissing))

    const indexedData = {}
    const urls = []

    const bps = this.blueprints()
    return Promise.all(
      bps.map(bp => {
        const resource = Object.keys(bp.resources)[0]
        urls.push(bp.urls[0])
        return this.retrieve(bp.sheet.name, bp.name, resource)
      })
    ).then(async results => {
      if (results.every(res => res)) {
        urls.forEach((item, idx) => {
          indexedData[item] = results[idx]
        })
        try {
          const message = await exportToFile(fileDest, indexedData)
          return message
        } catch (e) {
          return Promise.reject(e)
        }
      } else {
        throw new Error(copy.errors.export.writeFailed)
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
