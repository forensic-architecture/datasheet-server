import fs from 'mz/fs'
import { fmtSourceTitle } from '../lib/util'
import copy from '../copy/en'

const STORAGE_DIRNAME = 'temp'

class StoreJson {
  save (bp) {
    return Promise.all(
      Object.keys(bp.routes).map(route =>
        fs.writeFile(
          `${STORAGE_DIRNAME}/${fmtSourceTitle(
            bp.source.name
          )}__${fmtSourceTitle(bp.name)}__${route}.json`,
          JSON.stringify(bp.routes[route].data)
        )
      )
    )
  }

  load (url) {
    const parts = url.split('/')
    const fname = `${STORAGE_DIRNAME}/${parts[0]}__${parts[1]}__${
      parts[2]
    }.json`
    if (fs.existsSync(fname)) {
      return fs.readFile(fname, 'utf8')
        .then(data => JSON.parse(data))
        .then(data => {
          if (parts.length === 3) {
            // No lookup if the requested url doesn't have a fragment
            return data
          } else if (parts[2] === 'ids') {
            // Do a lookup if fragment is included to filter a relevant item
            // When the resource requested is 'ids'
            const id = parseInt(parts[3])
            if (!isNaN(id) && id >= 0 && id < data.length) {
              return data[id]
            } else {
              throw new Error(copy.errors.noFragment(parts))
            }
          } else {
            // Do a lookup if fragment is included to filter a relevant item
            const index = parseInt(parts[3])
            if (!isNaN(index) && index >= 0 && index < data.length) {
              console.log(data, index)
              return data.filter((vl, idx) => idx === index)[0]
            } else {
              throw new Error(copy.errors.noFragment(parts))
            }
          }
        })
    } else {
      return Promise.reject(new Error(copy.errors.noResource(parts)))
    }
  }

  // TODO: add method to build blueprint from data source
}

export default StoreJson
