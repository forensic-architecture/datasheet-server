import R from 'ramda'
import { fmtObj } from '../lib/util'
import { defaultBlueprint, defaultRoute } from '../lib/blueprinters'

/**
 * byGroup - generate a Blueprint from a data sheet grouped by a column called 'group'
 * The resource name defaults to 'groups', or a custom resource name can be passed.
 * Each resource item is an object with values labelled according to column
 * names. Items are inserted in the data list at idx = id.
 *
 * @param  {type} data         list of lists representing sheet data.
 * @param  {type} label="groups"  name of resource in blueprint.
 * @param  {type} name=""      name of blueprint.
 * @return {type} Blueprint
 */
export default function byGroup (
  tabName,
  sheetName,
  sheetId,
  data,
  label = 'groups'
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

  const dataGroups = {}

  data.forEach((row, idx) => {
    if (idx === 0) return
    const group = fmt(row).group
    if (!dataGroups[group]) {
      dataGroups[group] = [fmt(row)]
    } else {
      dataGroups[group].push(fmt(row))
    }
  })
  Object.keys(dataGroups).forEach(groupKey => {
    bp.resources[label].data.push({
      group: groupKey,
      group_label: dataGroups[groupKey][0].group_label,
      data: dataGroups[groupKey]
    })
  })
  return bp
}
