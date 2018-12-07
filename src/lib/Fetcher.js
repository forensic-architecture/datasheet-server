// FetcherTwo class interfaces with Google Sheet, and saves to a specified db
import { google } from 'googleapis'
import {
  fmtName,
  fmtBlueprinterTitles,
  isFunction
} from './util'
import { createHash } from 'crypto'
import R from 'ramda'

class Fetcher {
  constructor (db, sheetName, sheetId, blueprinters) {
    /*
     * The database that the fetcher should use. This should be an instance of a model-compliant class.
     * See models/Interface.js for the specifications for a model-compliant class.
     */
    this.db = db

    /*
     * ID of the Google Sheet where the data is sheetd. Note that the privateKey.clientEmail
     * loaded here must be added to the sheet as an editor.
     */
    this.sheetId = sheetId

    /*
     * The name of the sheet. This will prefix tabs saved in the database.
     */
    this.sheetName = sheetName

    /*
     * A unique ID for the Fetcher to identify its elements in the model layer
     */
    this.id = createHash('md5').update(sheetName).update(sheetId).digest('hex')

    /*
     * These are the available tabs for storing and retrieving data.
     * Each blueprinter is a function that returns a Blueprint from a
     * list of lists (which will be retrieved from gsheets).
     */
    this.blueprinters = fmtBlueprinterTitles(blueprinters)

    /*
     * This object is the canonical represenation for the data that a Fetcher
     * proxies. When the fetcher is initialized, its model layer (db) is indexed,
     * and this object populated accordingly. Whenever the fetcher updates, this
     * data structure updates as well. It is the model layer that determines the
     * performance of indexing the blueprints.
     */
    this.blueprints = this._indexDbForBlueprints()
      .then(allUrls => {
        const allParts = allUrls.reduce((acc, url) => {
          if (url.startsWith(this.id)) {
            const parts = url.split('/')
            acc.push([ parts[1], parts[2] ])
            return acc
          }
        }, [])
        console.log(allParts)
        return {}
      })

    /*
     * Google API setup
     */
    this.API = google.sheets('v4')
    this.auth = null

    /** curry to allow convenient syntax with map */
    this._saveViaBlueprinter = R.curry(this._saveViaBlueprinter)
  }

  /** save data under a given tab name via its blueprinter, which generates
   * its resource name. Note that this is curried in the constructor.
   */
  _saveViaBlueprinter (tab, data, blueprinter) {
    const saturatedBp = blueprinter(
      tab,
      this.sheetName,
      this.sheetId,
      data
    )

    return Promise.all(
      Object.keys(saturatedBp.resources).map(route =>
        this.db.save(`${this.id}/${tab}/${route}`, saturatedBp.resources[route].data)
      )
    )
  }

  /** index the db and produce appropriate blueprints structure **/
  _indexDbForBlueprints () {
    return this.db.index()
      .then(res => {
        return res
      })
  }

  /** returns a Promise that resolves if access is granted to the account, and rejects otherwise. */
  authenticate (clientEmail, privateKey) {
    const googleAuth = new google.auth.JWT(clientEmail, null, privateKey, [
      'https://www.googleapis.com/auth/spreadsheets'
    ])
    this.auth = googleAuth
    const { sheetId } = this

    return new Promise((resolve, reject) => {
      googleAuth.authorize(function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(`Connected to ${sheetId}.`)
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
      .then(() => true)
      .catch(() => false)
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
    const url = `${this.sheetName}/${tab}/${resource}/${frag}`
    return this.db.load(url, this.blueprints[title])
  }
}

export default Fetcher
