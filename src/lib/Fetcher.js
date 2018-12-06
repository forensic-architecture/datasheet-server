// FetcherTwo class interfaces with Google Sheet, and saves to a specified db
import { google } from 'googleapis'
import {
  fmtSheetTitle,
  fmtBlueprinterTitles,
  bp,
  isFunction
} from './util'
import { byRow } from './blueprinters'
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
     * These are the available tabs for storing and retrieving data.
     * Each blueprinter is a function that returns a Blueprint from a
     * list of lists (which will be retrieved from gsheets).
     */
    this.blueprinters = fmtBlueprinterTitles(blueprinters)
    this.blueprints = {}
    Object.keys(this.blueprinters).forEach(key => {
      this.blueprints[key] = null
    })

    /*
     * Google API setup
     */
    this.sheets = google.sheets('v4')
    this.auth = null

    /**
     * saveBp is a curried function that takes in a title and
     * a blueprinter. NB: it sits here in the constructor as
     * I am not sure how to curry a class method with Ramda.
     */
    this._saveBp = R.curry((tab, title, data, blueprinter) => {
      const saturatedBp = blueprinter(
        tab,
        this.sheetName,
        this.sheetId,
        data
      )
      const blueprint = bp(saturatedBp) // TODO: come up with better semantics.
      this.blueprints[title] = blueprint
      return this.db.save(saturatedBp)
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
    /* Retrieve all available routes on a given sheet, and store formatted copies of it where a formatter is available */
    return this.sheets.spreadsheets
      .get({
        auth: this.auth,
        spreadsheetId: this.sheetId
      })
      .then(response => {
        tabTitles = response.data.sheets.map(sheet => sheet.properties.title)
        return this.sheets.spreadsheets.values.batchGet({
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

  save (tab, data) {
    const title = fmtSheetTitle(tab)
    if (Object.keys(this.blueprinters).indexOf(title) > -1) {
      const bpConfig = this.blueprinters[title]

      if (isFunction(bpConfig)) {
        return this._saveBp(tab, title, data, bpConfig)
      } else {
        return bpConfig.map(this._saveBp(tab, title, data))
      }
    } else {
      // If it can't find a blueprinter for the tab title, default to byRow
      return this.db.save(byRow(tab, this.sheetName, this.sheetId, data))
    }
  }

  // NB: could combine these functions by checking kwargs length
  retrieve (tab, resource) {
    const title = fmtSheetTitle(tab)
    const url = `${this.sheetName}/${tab}/${resource}`
    return this.db.load(url, this.blueprints[title])
  }

  retrieveFrag (tab, resource, frag) {
    const title = fmtSheetTitle(tab)
    const url = `${this.sheetName}/${tab}/${resource}/${frag}`
    return this.db.load(url, this.blueprints[title])
  }
}

export default Fetcher
