import { fmtObj } from '../lib/util'

/**
 * Each resource item is an object with values labelled according
 * to column names specified in the sheet's first row.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
export default (data) => {
  const itemLabels = data[0]
  const fmt = fmtObj(itemLabels)
  const output = []

  data.forEach((row, idx) => {
    if (idx === 0) return
    output.push(fmt(row))
  })

  return output
}
