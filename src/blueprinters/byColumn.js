import R from 'ramda'
import { defaultBlueprint, defaultRoute } from '../lib/blueprinters'

/**
 * byColumn - generate a Blueprint from a data sheet by column. Each column
 * name is a resheet, and all values in that column are the resheet items.
 *
 * @param  {type} data - list of lists representing sheet data.
 * @return {type} Blueprint
 * generated.
 */
export default function byColumn (tabName, sheetName, sheetId, data) {
  // Define Blueprint props
  const bp = R.clone(defaultBlueprint)
  bp.sheet = {
    name: sheetName,
    id: sheetId
  }
  bp.name = tabName

  // column names define routes
  const labels = data[0]
  labels.forEach(label => {
    bp.routes[label] = R.clone(defaultRoute)
  })

  // remaining rows as data
  data.forEach((row, idx) => {
    if (idx === 0) return
    labels.forEach((label, idx) => {
      bp.routes[label].data.push(row[idx])
    })
  })
  return bp
}
