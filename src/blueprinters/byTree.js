import R from 'ramda'
import { defaultBlueprint, defaultRoute } from '../lib/blueprinters'

/**
 * byTree - generate a Blueprint from a data sheet grouped by a column called 'group'
 * The resource name defaults to 'groups', or a custom resource name can be passed.
 * Each resource item is an object with values labelled according to column
 * names. Items are inserted in the data list at idx = id.
 *
 * @param  {type} data         list of lists representing sheet data.
 * @param  {type} label="groups"  name of resource in blueprint.
 * @param  {type} name=""      name of blueprint.
 * @return {type} Blueprint
 */
export default function byTree (
  tabName,
  sheetName,
  sheetId,
  data,
  label = 'tree'
) {
  // Define Blueprint
  const bp = R.clone(defaultBlueprint)
  bp.sheet = {
    name: sheetName,
    id: sheetId
  }
  bp.name = tabName

  // Column names define routes
  bp.routes[label] = R.clone(defaultRoute)
  bp.routes[label].data = {}

  const tree = {
    key: 'tags',
    children: {}
  }

  data.forEach(path => {
    const root = path[0]
    if (!tree.children[root]) {
      tree.children[root] = {
        key: root,
        children: {}
      }
    }

    let depth = 1
    let parentNode = tree.children[root]

    while (depth < path.length) {
      const node = path[depth]
      if (!parentNode.children[node]) {
        parentNode.children[node] = {
          key: node,
          children: {}
        }
      }
      parentNode = parentNode.children[node]

      depth++
    }
  })

  bp.routes[label].data = tree
  return bp
}
