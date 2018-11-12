import R from 'ramda'
import { fmtObj } from '../lib/util'
import { defaultBlueprint, defaultRoute } from '../lib/blueprinters'

/**
 * byId - generate a Blueprint from a data source by id, which is an integer.
 * The resource name defaults to 'ids', or a custom resource name can be passed.
 * Each resource item is an object with values labelled according to column
 * names. Items are inserted in the data list at idx = id.
 *
 * @param  {type} data         list of lists representing sheet data.
 * @param  {type} label="ids"  name of resource in blueprint.
 * @param  {type} name=""      name of blueprint.
 * @return {type} Blueprint
 */
export default function byId (
  tabName,
  sourceName,
  sourceId,
  data,
  label = 'ids'
) {
  // Define Blueprint
  const bp = R.clone(defaultBlueprint)
  bp.source = {
    name: sourceName,
    id: sourceId
  }
  bp.name = tabName

  // Column names define routes
  const itemLabels = data[0]
  const fmt = fmtObj(itemLabels)
  bp.routes[label] = R.clone(defaultRoute)
  bp.routes[label].data = []

  data.forEach((row, idx) => {
    if (idx === 0) return
    bp.routes[label].data[fmt(row).id] = fmt(row)
  })
  return bp
}
