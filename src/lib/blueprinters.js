import path from 'path'
import fs from 'fs'

export const defaultBlueprint = {
  name: null,
  id: null,
  dialects: ['rest'], // supported dialects, can (eventually) be multiple
  resources: {}
}

export const defaultRoute = {
  options: {
    fragment: true
  },
  data: []
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
  defaultRoute
}, allBps)
