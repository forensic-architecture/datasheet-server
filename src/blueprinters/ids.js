import R from 'ramda'
import { fmtObj } from '../lib/util'

/**
 * Very similar to the rows blueprinter, but inserts each row as a value in
 * an object, where the value in the 'id' column of the row will be used as
 * the search key
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Object      the structured data.
 */
export default (data) => {
  const itemLabels = data[0]
  const fmt = fmtObj(itemLabels)
  const output = {}

  data.forEach((row, idx) => {
    if (idx === 0) return
    output[fmt(row).id] = fmt(row)
  })

  return output
}
