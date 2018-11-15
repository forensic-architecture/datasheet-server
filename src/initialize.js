import StoreJson from './models/StoreJson'
import Fetcher from './lib/Fetcher'
import Controller from './lib/Controller'
import config from './config'

const { googleSheets } = config
const { sheets, privateKey, email } = googleSheets

function authenticate (_fetcher) {
  return _fetcher.fetcher.authenticate(email, privateKey).then(msg => {
    console.log(msg)
    return true
  })
}

export default callback => {
  const fetchers = sheets.map(sheet => {
    return {
      name: sheet.name,
      fetcher: new Fetcher(new StoreJson(), sheet.name, sheet.id, sheet.tabs)
    }
  })

  Promise.all(fetchers.map(authenticate))
    .then(() => {
      console.log(`===================`)
      console.log(`grant access to: ${email}`)
      console.log(`===================`)

      // NB: reformat fetchers as config for controller
      const config = {}
      fetchers.forEach(fetcher => {
        config[fetcher.name] = fetcher.fetcher
      })
      const controller = new Controller(config)
      callback(controller)
    })
    .catch(err => {
      console.log(err)
      console.log(
        `ERROR: the server couldn't connect to all of the sheets you provided. Ensure you have granted access to ${
          email
        } on ALL listed sheets.`
      )
    })
}
