import R from 'ramda'
import { fmtObj } from '../lib/util'
import { defaultBlueprint, defaultRoute } from '../lib/blueprinters'

/**
 * byRow - generate a Blueprint from a data sheet by row. The resource name
 * defaults to 'rows', or a custom resource name can be passed. Each resource
 * item is an object with values labelled according to column names.
 *
 * @param  {type} data         list of lists representing sheet data.
 * @param  {type} label="rows" name of resource in blueprint.
 * @param  {type} name=""      name of blueprint.
 * @return {type} Blueprint
 */
export default function byRow (
  tabName,
  sheetName,
  sheetId,
  data,
  label = 'rows'
) {
  // Define Blueprint
  const bp = R.clone(defaultBlueprint)
  bp.sheet = {
    name: sheetName,
    id: sheetId
  }
  bp.name = tabName

  // Column names define resources
  const itemLabels = data[0]
  const fmt = fmtObj(itemLabels)
  bp.resources[label] = R.clone(defaultRoute)
  bp.resources[label].data = []

  data.forEach((row, idx) => {
    if (idx === 0) return
    bp.resources[label].data.push(fmt(row))
  })
  return bp
}
