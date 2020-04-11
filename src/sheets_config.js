import BP from './lib/blueprinters'

const timemapStructure = {
  teuruwera_export_events: BP.deeprows,
  teuruwera_export_categories: [BP.groups, BP.rows],
  // Blair Peach
  // 1iPE3QiIdvUtimH8DlVae3GGUydgBQDTkoNlN5cfjK_o

  // FA
  // 1ej3kEtANGYsEBUCTfWsIR0UhTSJIuXFHLYspti2sgHo
  export_narratives: BP.rows,
  teuruwera_export_sources: BP.deepids,
  export_sites: BP.rows,
  export_tags: BP.tree
}

export default {
  googleSheets: {
    sheets: [{
      name: 'teuruwera',
      id: '1UC7DkCFeUXHfpUxUGruExwFbP4pqVBdJLOKfo6wDDGk',
      tabs: timemapStructure
    }]
  }
}
