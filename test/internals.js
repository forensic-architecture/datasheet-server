import test from 'ava'
import R from 'ramda'
import {
  defaultBlueprint,
  defaultRoute,
  byColumn,
  byRow
} from '../src/lib/blueprinters'

const egInput1 = [
  ['h1', 'h2', 'h3'],
  [1, 2, 3],
  [4, 5, 6]
]

test('defaultBlueprint exports', t => {
  const expected = {
    name: null,
    id: null,
    dialects: ['rest'],
    routes: {}
  }
  t.deepEqual(expected, defaultBlueprint)
})

test('byColumn blueprinter generates expected output', t => {
  const actual = byColumn('eg ColumnBlueprint', 'egSourceName', 'egSourceId', egInput1)
  const expected = R.clone(defaultBlueprint)
  expected.name = 'eg ColumnBlueprint'
  expected.source = {
    id: 'egSourceId',
    name: 'egSourceName'
  }
  expected.routes['h1'] = R.clone(defaultRoute)
  expected.routes['h1'].data = [1, 4]
  expected.routes['h2'] = R.clone(defaultRoute)
  expected.routes['h2'].data = [2, 5]
  expected.routes['h3'] = R.clone(defaultRoute)
  expected.routes['h3'].data = [3, 6]
  t.deepEqual(expected, actual)
})

test('byRow blueprinter generates expected output', t => {
  const actual = byRow('egRowBlueprint', 'egSourceName', 'egSourceId', egInput1, 'items')
  const expected = R.clone(defaultBlueprint)
  expected.name = 'egRowBlueprint'
  expected.source = {
    id: 'egSourceId',
    name: 'egSourceName'
  }
  expected.routes['items'] = R.clone(defaultRoute)
  expected.routes['items'].data = [{
    h1: 1,
    h2: 2,
    h3: 3
  },
  {
    h1: 4,
    h2: 5,
    h3: 6
  }]
  t.deepEqual(expected, actual)
})
