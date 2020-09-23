import StoreJson from './models/StoreJson'
import fetchers from './lib/Fetcher'
import Controller from './lib/Controller'
import R from 'ramda'

const isntNull = n => n !== null
const filterNull = ls => R.filter(isntNull, ls)
const flattenfilterNull = ls => filterNull(R.flatten(ls))
let themFetchers

let config
try {
  config = require('./local.config.js').default
} catch (_) {
  config = require('./config.js').default
}

export default callback => {
  return Promise.resolve().then(() => {
    return Object.keys(config).map(fType => {
      // skip config attrs that don't have corresponding fetchers
      if (!(fType in fetchers)) return null
      const FFetcher = fetchers[fType]
      return config[fType].map(sheet => {
        const otherArgs = { ...sheet }
        delete otherArgs.name
        delete otherArgs.tabs
        return {
          name: sheet.name,
          fetcher: new FFetcher(new StoreJson(), sheet.name, sheet.tabs, ...Object.values(otherArgs))
        }
      })
    })
  })
    .then(res => {
      themFetchers = flattenfilterNull(res)
    })
    .then(() => Promise.all(themFetchers.map(f => f.fetcher.authenticate(process.env))))
    .then(fetchers => {
      const config = R.zipObj(themFetchers.map(f => f.name), fetchers)
      const controller = new Controller(config)
      callback(controller)
    })
    .catch(err => {
      console.log(err)
      console.log(
        `ERROR: the server couldn't connect to all of the sheets you provided. Ensure you have granted access to ${
          process.env.SERVICE_ACCOUNT_EMAIL
        } on ALL listed sheets.`
      )
    })
}
