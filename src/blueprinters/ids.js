import R from 'ramda'
import { fmtObj } from '../lib/util'
import { defaultBlueprint, defaultResource } from '../lib/blueprinters'

/**
 * ids - generate a Blueprint from a data sheet by id, which is an integer.
 * The resource name defaults to 'ids', or a custom resource name can be passed.
 * Each resource item is an object with values labelled according to column
 * names. Items are inserted in the data list at idx = id.
 *
 * @param  {type} data         list of lists representing sheet data.
 * @param  {type} label="ids"  name of resource in blueprint.
 * @param  {type} name=""      name of blueprint.
 * @return {type} Blueprint
 */
export default function ids (
  tabName,
  sheetName,
  sheetId,
  data,
  label = 'ids'
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
  bp.resources[label] = R.clone(defaultResource)
  bp.resources[label].data = {}

  data.forEach((row, idx) => {
    if (idx === 0) return
    bp.resources[label].data[fmt(row).id] = fmt(row)
  })

  return bp
}
