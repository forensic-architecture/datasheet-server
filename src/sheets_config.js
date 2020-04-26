import BP from './lib/blueprinters'

const timemapStructure = {
  export_events: BP.deeprows,
  export_categories: [BP.groups, BP.rows],
  export_narratives: BP.rows,
  export_sources: BP.deepids,
  export_sites: BP.rows,
  export_tags: BP.tree
}

export default {
  gsheets: [{
    name: 'nzacts',
    tabs: timemapStructure,
    id: '1ej3kEtANGYsEBUCTfWsIR0UhTSJIuXFHLYspti2sgHo'
  }],

  xlsx: [{
    name: 'morocco_pushbacks',
    tabs: timemapStructure,
    path: 'temp/morocco_pushbacks.xlsx'
  }]
}
