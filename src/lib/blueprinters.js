import path from 'path'
import fs from 'fs'
import R from 'ramda'

export const defaultBlueprint = {
  name: null,
  id: null,
  dialects: ['rest'], // supported dialects, can (eventually) be multiple
  resources: {}
}

export const defaultResource = {
  options: {
    fragment: true
  },
  data: []
}

export function buildDesaturated (tab, resource) {
  const bp = R.clone(defaultBlueprint)
}

// import all default exports from 'blueprinters' folder
const allBps = {}
const REL_PATH_TO_BPS = '../blueprinters'
const normalizedPath = path.join(__dirname, REL_PATH_TO_BPS)
fs.readdirSync(normalizedPath).forEach(file => {
  const bpName = file.replace('.js', '')
  allBps[bpName] = require(`${REL_PATH_TO_BPS}/${file}`).default
})

// NB: revert to ES5 'module.exports' required to make blueprinters from
// each file in blueprinters folder available for granular import from here.
module.exports = Object.assign({
  defaultBlueprint,
  defaultResource
}, allBps)
