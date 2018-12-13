import R from 'ramda'
import { fmtObj } from '../lib/util'

/**
 * Each resource item is inserted into a tree. TODO: describe layout.
 *
 * @param  {type} data        list of lists representing sheet data.
 * @return {type} Array       the structured data.
 */
export default (data) => {
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

  return tree
}
