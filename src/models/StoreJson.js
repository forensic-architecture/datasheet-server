import fs from 'mz/fs'
import errors from '../lib/errors'

const STORAGE_DIRNAME = 'data'

function partsFromFilename (fname) {
  const body = fname.slice(0, -5)
  return body.split('__')
}

class StoreJson {
  index () {
    return Promise.resolve()
      .then(() => fs.readdir(STORAGE_DIRNAME))
      .then(files => files.filter(f => f.match(/.*\.json$/)))
      .then(jsons => jsons.map(partsFromFilename))
      .then(parts => parts.map(p => `${p[0]}/${p[1]}/${p[2]}`))
  }

  save (url, data) {
    const parts = url.split('/')
    return fs.writeFile(
      `${STORAGE_DIRNAME}/${parts[0]}__${parts[1]}__${parts[2]}.json`,
      JSON.stringify(data)
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
              throw errors.noFragment(parts)
            }
          } else {
            // Do a lookup if fragment is included to filter a relevant item
            const index = parseInt(parts[3])
            if (!isNaN(index) && index >= 0 && index < data.length) {
              return data.filter((vl, idx) => idx === index)[0]
            } else {
              throw errors.noFragment(parts)
            }
          }
        })
    } else {
      return Promise.reject(errors.noResource(parts))
    }
  }

  // TODO: add method to build blueprint from data sheet
}

export default StoreJson
