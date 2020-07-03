import { fmtObj } from '../lib/util'

/**
 * Each resource item is an object with values labelled according
 * to column names specified in the sheet's first row. If two or more
 * column names are the same except for a different integer at the end
 * (e.g. 'tag1', and 'tag2'), then the values of those two columns are
 * aggregated into a list, which is the value of the prefix's key ('tag').
 * Any values in those columns that are empty will NOT be added to the list.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
export default (data) => {
  const itemLabels = data[0]
  const baseFmt = fmtObj(itemLabels)
  const output = []

  // create a structure to indicate which columns needs to be aggregated
  const endsWithNumber = new RegExp('(.*?)[0-9]+$')
  const structure = {
    __flat: []
  }

  itemLabels.forEach(label => {
    const matches = label.match(endsWithNumber)
    if (!matches) {
      structure.__flat.push(label)
    } else {
      const labelPrefix = `${matches[1]}s`
      if (labelPrefix in structure) {
        structure[labelPrefix].push(label)
      } else {
        structure[labelPrefix] = [ label ]
      }
    }
  })

  // generate the value for deep labels using the structure created
  data.forEach((row, idx) => {
    if (idx === 0) return
    const baseRow = baseFmt(row)
    const deepRow = {}

    // generate deep row labels using structure
    Object.keys(structure)
      .forEach(newLabel => {
        if (newLabel !== '__flat') {
          const oldLabels = structure[newLabel]
          // only add new value if not ''
          const labelValues = []
          oldLabels.forEach(l => {
            const vl = baseRow[l]
            if (vl !== '') {
              labelValues.push(vl)
            }
          })
          deepRow[newLabel] = labelValues
        }
      })

    // move values for flat labels over from base
    structure.__flat.forEach(label => {
      deepRow[label] = baseRow[label]
    })
    if (!Object.keys(deepRow).every(k => deepRow[k] === '')) {
      output.push(deepRow)
    }
  })

  return output
}
