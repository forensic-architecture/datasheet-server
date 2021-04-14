import test from 'ava'
import {
  defaultBlueprint
} from '../src/lib/blueprinters'

import rows from '../src/blueprinters/rows'
import deeprows from '../src/blueprinters/deeprows'

const egInput1 = [
  ['h1', 'h2', 'h3'],
  [1, 2, 3],
  [4, 5, 6]
]

// Test default blueprint exports
// Smoke tests
test('defaultBlueprint exports', t => {
  const expected = {
    sheet: {
      name: null,
      id: null
    },
    name: null,
    resources: {}
  }
  t.deepEqual(expected, defaultBlueprint)
})

test('rows blueprinter', t => {
  const expected = [
    { h1: 1, h2: 2, h3: 3 },
    { h1: 4, h2: 5, h3: 6 }
  ]
  const actual = rows(egInput1)
  t.deepEqual(expected, actual)
})

test('deeprows blueprinter', t => {
  const expected = [
    { 'hs': [1, 2, 3] },
    { 'hs': [4, 5, 6] }
  ]
  const actual = deeprows(egInput1)
  t.deepEqual(expected, actual)
})
