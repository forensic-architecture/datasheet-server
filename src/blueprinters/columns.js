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
  const columnNames = data[0]
  const columns = columnNames.map(name => ([]))

  data.forEach((row, idx) => {
    if (idx === 0) return
    row.forEach((item, idx) => {
      columns[idx].push(item)
    })
  })

  return columns.map((column, idx) => ({
    name: columnNames[idx],
    items: column
  }))
}
