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
    resources: {}
  }
  t.deepEqual(expected, defaultBlueprint)
})

test('byColumn blueprinter generates expected output', t => {
  const actual = byColumn('eg ColumnBlueprint', 'egSheetName', 'egSheetId', egInput1)
  const expected = R.clone(defaultBlueprint)
  expected.name = 'eg ColumnBlueprint'
  expected.sheet = {
    id: 'egSheetId',
    name: 'egSheetName'
  }
  expected.resources['h1'] = R.clone(defaultRoute)
  expected.resources['h1'].data = [1, 4]
  expected.resources['h2'] = R.clone(defaultRoute)
  expected.resources['h2'].data = [2, 5]
  expected.resources['h3'] = R.clone(defaultRoute)
  expected.resources['h3'].data = [3, 6]
  t.deepEqual(expected, actual)
})

test('byRow blueprinter generates expected output', t => {
  const actual = byRow('egRowBlueprint', 'egSheetName', 'egSheetId', egInput1, 'items')
  const expected = R.clone(defaultBlueprint)
  expected.name = 'egRowBlueprint'
  expected.sheet = {
    id: 'egSheetId',
    name: 'egSheetName'
  }
  expected.resources['items'] = R.clone(defaultRoute)
  expected.resources['items'].data = [{
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
