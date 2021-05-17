import path from 'path'
import fs from 'fs'
import R from 'ramda'

const defaultBlueprint = {
  name: null,
  sheet: {
    name: null,
    id: null
  },
  resources: {}
}

const defaultResource = {
  data: []
}

function buildDesaturated (sheetId, sheetName, tab, resources) {
  const bp = R.clone(defaultBlueprint)
  bp.sheet.name = sheetName
  bp.sheet.id = sheetId
  bp.name = tab
  bp.resources = resources.reduce((acc, r) => {
    acc[r] = null
    return acc
  }, {})
  return bp
}

const buildBlueprinter = R.curry((datafierName, datafier, sheetId, sheetName, tabName, data) => {
  const bp = R.clone(defaultBlueprint)
  bp.sheet = {
    name: sheetName,
    id: sheetId
  }
  bp.name = tabName
  bp.resources[datafierName] = R.clone(defaultResource)
  bp.resources[datafierName].data = datafier(data)

  return bp
})

// import all default exports from 'blueprinters' folder
const allBps = {}
const REL_PATH_TO_BPS = '../blueprinters'
const normalizedPath = path.join(__dirname, REL_PATH_TO_BPS)
fs.readdirSync(normalizedPath).forEach(file => {
  const bpName = file.replace('.js', '')
  const datafier = require(`${REL_PATH_TO_BPS}/${file}`).default
  allBps[bpName] = buildBlueprinter(bpName, datafier)
})

function deeprowsWithSchema (datafierName, schema) {
  const datafier = data => {
    const transformedData = allBps.deeprows('', '', '', data).resources.deeprows.data
    return transformedData.map(row => {
      Object.keys(schema).forEach(key => {
        row[key] = schema[key](row[key])
      })
      return row
    })
  }

  return buildBlueprinter(`deeprows_${datafierName}`, datafier)
}

// NB: revert to ES5 'module.exports' required to make blueprinters from
// each file in blueprinters folder available for granular import from here.
module.exports = Object.assign({
  defaultBlueprint,
  defaultResource,
  buildDesaturated,
  deeprowsWithSchema
}, allBps)
