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
    name: 'example',
    id: '1UC7DkCFeUXHfpUxUGruExwFbP4pqVBdJLOKfo6wDDGk',
    tabs: timemapStructure,
  }],

  
  xlsx: [
    /** {
      name: 'my_local_sheet',
      tabs: timemapStructure,
      path: 'temp/my_local_sheet.xlsx'
    } **/
  ]
}
