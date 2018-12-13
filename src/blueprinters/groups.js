import R from 'ramda'
import { fmtObj } from '../lib/util'

/**
 * Each resource item is an object with values labelled according to column
 * names. Items are inserted into the data list at idx = id.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
export default (data) => {
  const itemLabels = data[0]
  const fmt = fmtObj(itemLabels)
  const output = []
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
  Object.keys(dataGroups)
    .forEach(groupKey => {
      output.push({
        group: groupKey,
        group_label: dataGroups[groupKey][0].group_label,
        data: dataGroups[groupKey]
      })
    })

  return output
}
