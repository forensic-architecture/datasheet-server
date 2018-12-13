import R from 'ramda'
import { fmtObj } from '../lib/util'

/**
 * Each resource item is an object with values labelled according
 * to column names specified in the sheet's first row. If two or more
 * column names are the same except for a different integer at the end
 * (e.g. 'tag1', and 'tag2'), then the values of those two columns are
 * aggregated into a list, which is the value of the prefix's key ('tag').
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
export default (data) => {
  // TODO: make these deep rows.
  const itemLabels = data[0]
  const fmt = fmtObj(itemLabels)
  const output = []

  data.forEach((row, idx) => {
    if (idx === 0) return
    output.push(fmt(row))
  })

  return output
}
