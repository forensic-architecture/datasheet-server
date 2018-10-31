// FetcherTwo class interfaces with Google Sheet, and saves to a specified db
import {google} from "googleapis";
import {fmtSourceTitle, fmtBlueprinterTitles, deriveFilename, bp} from "./util";
import {byRow, byId} from "./blueprinters";
import R from "ramda";

class Fetcher {
  constructor(db, sourceName, sourceId, blueprinters) {
    /*
     * The database that the fetcher should use. This should be an instance of a model-compliant class.
     * See models/Interface.js for the specifications for a model-compliant class.
     */
    this.db = db;

    /*
     * ID of the Google Sheet where the data is sourced. Note that the privateKey.client_email
     * loaded here must be added to the sheet as an editor.
     */
    this.sourceId = sourceId;

    /*
     * The name of the source. This will prefix tabs saved in the database.
     */
    this.sourceName = sourceName;

    /*
     * These are the available tabs for storing and retrieving data.
     * Each blueprinter is a function that returns a Blueprint from a
     * list of lists (which will be retrieved from gsheets).
     */
    this.blueprinters = fmtBlueprinterTitles(blueprinters);
    this.blueprints = {};
    Object.keys(this.blueprinters).forEach(key => {
      this.blueprints[key] = null;
    });

    /*
     * Google API setup
     */
    this.sheets = google.sheets("v4");
    this.auth = null;
  }

  /** returns a Promise that resolves if access is granted to the account, and rejects otherwise. */
  authenticate(client_email, private_key) {
    const googleAuth = new google.auth.JWT(client_email, null, private_key, [
      "https://www.googleapis.com/auth/spreadsheets"
    ]);
    this.auth = googleAuth;
    const {sourceId} = this;

    return new Promise((resolve, reject) => {
      googleAuth.authorize(function(err, tokens) {
        if (err) {
          reject(err);
          return;
        } else {
          resolve(`Connected to ${sourceId}.`);
        }
      });
    });
  }

  update() {
    let tabTitles;
    /* Retrieve all available routes on a given sheet, and store formatted copies of it where a formatter is available */
    return this.sheets.spreadsheets
      .get({
        auth: this.auth,
        spreadsheetId: this.sourceId
      })
      .then(response => {
        tabTitles = response.data.sheets.map(sheet => sheet.properties.title);
        return this.sheets.spreadsheets.values.batchGet({
          auth: this.auth,
          spreadsheetId: this.sourceId,
          ranges: tabTitles
        });
      })
      .then(results => {
        const tabData = results.data.valueRanges;
        return Promise.all(
          tabData.map((tab, idx) => {
            const {values} = tab;
            if (values == undefined) {
              return Promise.resolve({});
            }
            const name = tabTitles[idx];
            return this.save(name, values);
          })
        );
      })
      .then(() => "All tabs updated");
  }

  save(tab, data) {
    const title = fmtSourceTitle(tab);
    if (Object.keys(this.blueprinters).indexOf(title) > -1) {
      const blueprinters = this.blueprinters[title];

      return blueprinters.map(blueprinter => {
        const saturatedBp = blueprinter(
          tab,
          this.sourceName,
          this.sourceId,
          data
        );
        const blueprint = bp(saturatedBp); // TODO: come up with better semantics.
        this.blueprints[title] = blueprint;
        return this.db.save(saturatedBp);
      });
    } else {
      // If it can't find a blueprinter for the tab title, default to byRow
      return this.db.save(byRow(tab, this.sourceName, this.sourceId, data));
    }
  }

  // NB: could combine these functions by checking kwargs length
  retrieve(tab, resource) {
    const title = fmtSourceTitle(tab);
    const url = `${this.sourceName}/${tab}/${resource}`;
    return this.db.load(url, this.blueprints[title]);
  }

  retrieveFrag(tab, resource, frag) {
    const title = fmtSourceTitle(tab);
    const url = `${this.sourceName}/${tab}/${resource}/${frag}`;
    return this.db.load(url, this.blueprints[title]);
  }
}

export default Fetcher;
