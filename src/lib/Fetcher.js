import R from 'ramda'
import { createHash } from 'crypto'
import { buildDesaturated } from './blueprinters'
import {
  fmtName,
  fmtBlueprinterTitles,
  isFunction
} from './util'

/* GsheetFetcher deps */
import { google } from 'googleapis'
/* LocalFetcher deps */
import X from 'xlsx'

class Fetcher {
  constructor (db, name, bps) {
    /*
     * The database that the fetcher should use. This should be an instance of a model-compliant class.
     * See models/Interface.js for the specifications for a model-compliant class.
     */
    this.db = db
    /*
     * The name of the sheet. This will prefix tabs saved in the database.
     */
    this.sheetName = name
    /*
     * A unique ID for the Fetcher to identify its elements in the model layer
     */
    const bpsstring = Object.keys(bps).join(';')
    this.id = createHash('md5').update(name).update(bpsstring).digest('hex')
    /*
     * These are the available tabs for storing and retrieving data.
     * Each blueprinter is a function that returns a Blueprint from a
     * list of lists (which will be retrieved from gsheets).
     */
    this.blueprinters = fmtBlueprinterTitles(bps)
    /*
     * This object is the canonical represenation for the data that a Fetcher
     * proxies. When the fetcher is initialized, its model layer (db) is indexed,
     * and this object populated accordingly. Whenever the fetcher updates, this
     * data structure updates as well. It is the model layer that determines the
     * performance of indexing the blueprints.
     */
    this.blueprints = null
    this._buildBlueprintsAsync() // NB: modifies this.blueprints on completion
    /** curry to allow convenient syntax with map */
    this._saveViaBlueprinter = R.curry(this._saveViaBlueprinter.bind(this))
  }

  _buildBlueprintsAsync () {
    return this.db.index()
      .then(allUrls => {
        const allParts = allUrls.reduce((acc, url) => {
          if (url.startsWith(this.id)) {
            const parts = url.split('/')
            let duplicateTab = acc.reduce((tabFound, p) => {
              return tabFound || p[0] === parts[1]
            }, false)
            if (duplicateTab) {
              acc.forEach(p => {
                if (p[0] === parts[1]) {
                  p[1].push(parts[2])
                }
              })
            } else {
              acc.push([ parts[1], [ parts[2] ] ])
            }
          }
          return acc
        }, [])

        return allParts
          .map(parts => {
            const bp = buildDesaturated(
              this.sheetId,
              this.sheetName,
              parts[0],
              parts[1]
            )
            bp.urls = Object.keys(bp.resources).map(r => `/api/${bp.sheet.name}/${bp.name}/${r}`)
            return bp
          })
      })
      .then(res => {
        this.blueprints = res
      })
  }

  /** save data under a given tab name via its blueprinter, which generates
   * its resource name. Note that this is curried in the constructor.
   */
  _saveViaBlueprinter (tab, data, blueprinter) {
    const saturatedBp = blueprinter(
      this.sheetId,
      this.sheetName,
      tab,
      data
    )

    return Promise.all(
      Object.keys(saturatedBp.resources).map(route =>
        this.db.save(`${this.id}/${tab}/${route}`, saturatedBp.resources[route].data)
      )
    )
  }

  save (_tab, data) {
    const tab = fmtName(_tab)

    if (Object.keys(this.blueprinters).indexOf(tab) > -1) {
      const bpConfig = this.blueprinters[tab]

      if (isFunction(bpConfig)) {
        // if bpConfig specifies a single blueprinter
        return this._saveViaBlueprinter(tab, data, bpConfig)
      } else {
        // if bpConfig specifies an array of blueprinters
        return bpConfig.map(this._saveViaBlueprinter(tab, data))
      }
    } else {
      // NB: if a blueprinter is not specified for a tab,
      // just skip it.
      return true
    }
  }

  // NB: could combine these functions by checking kwargs length
  retrieve (tab, resource) {
    const title = fmtName(tab)
    const url = `${this.id}/${tab}/${resource}`
    return this.db.load(url, this.blueprints[title])
  }

  retrieveFrag (tab, resource, frag) {
    const title = fmtName(tab)
    const url = `${this.id}/${tab}/${resource}/${frag || ''}`
    return this.db.load(url, this.blueprints[title])
  }

  /** Run on startup. Should be overridden if explicit auth is required **/
  authenticate (env) {
    return Promise.resolve(this)
  }
}

class GsheetFetcher extends Fetcher {
  constructor (db, name, bps, sheetId) {
    super(db, name, bps)
    this.type = 'Google Sheet'
    if (arguments.length < 4) throw Error('You must provide the sheet ID')

    /*
     * ID of the Google Sheet where the data is sheetd. Note that the privateKey.clientEmail
     * loaded here must be added to the sheet as an editor.
     */
    this.sheetId = sheetId
    /*
     * Google API setup
     */
    this.API = google.sheets('v4')
    this.auth = null
  }

  /** returns a Promise that resolves if access is granted to the account, and rejects otherwise. */
  authenticate (env) {
    const googleAuth = new google.auth.JWT(env.SERVICE_ACCOUNT_EMAIL, null, env.SERVICE_ACCOUNT_PRIVATE_KEY, [
      'https://www.googleapis.com/auth/spreadsheets'
    ])
    this.auth = googleAuth
    const { sheetId } = this
    const me = this

    return new Promise((resolve, reject) => {
      googleAuth.authorize(function (err) {
        if (err) {
          reject(err)
        } else {
          console.log(`Connected to ${me.sheetName}. (${me.type} with ID ${sheetId}).`)
          console.log(`    grant access to: ${process.env.SERVICE_ACCOUNT_EMAIL}`)
          resolve(me)
        }
      })
    })
  }

  update () {
    let tabTitles
    /* Retrieve all available resources on a given sheet, and store formatted copies of it where a formatter is available */
    return this.API.spreadsheets
      .get({
        auth: this.auth,
        spreadsheetId: this.sheetId
      })
      .then(response => {
        tabTitles = response.data.sheets.map(sheet => sheet.properties.title)
        return this.API.spreadsheets.values.batchGet({
          auth: this.auth,
          spreadsheetId: this.sheetId,
          ranges: tabTitles
        })
      })
      .then(results => {
        const tabData = results.data.valueRanges

        return Promise.all(
          tabData.map((tab, idx) => {
            const { values } = tab

            if (values === undefined) {
              return Promise.resolve({})
            }

            const name = tabTitles[idx]
            return this.save(name, values)
          })
        )
      })
      .then(this._buildBlueprintsAsync())
      .then(() => true)
      .catch(() => false)
  }
}

class LocalFetcher extends Fetcher {
  constructor (db, name, bps, path) {
    super(db, name, bps)
    this.path = path
    this.update().then(res =>
      console.log(`${res ? 'Successful' : 'Couldn\'t'} update ${name}`)
    )
  }

  update () {
    const wb = X.readFile(this.path)
    wb.SheetNames.forEach(name => {
      const sh = wb.Sheets[name]
      const csv = X.utils.sheet_to_csv(sh, { FS: '\t' })
      const ll = csv.split('\n').map(line => line.split('\t'))
      this.save(name, ll)
    })
    return Promise.resolve(true)
  }
}

export default {
  'gsheets': GsheetFetcher,
  'xlsx': LocalFetcher,
  'ods': LocalFetcher,
  'local': LocalFetcher
}
