import BP from './lib/blueprinters'

const timemapStructure = {
  welfare_export_events: BP.deeprows,
  welfare_export_categories: [BP.groups, BP.rows],
  welfare_export_narratives: BP.rows,
  welfare_export_sources: BP.deepids,
  welfare_export_sites: BP.rows,
  welfare_export_tags: BP.tree
}

export default {
  gsheets: [{
    name: 'example',
      name: 'welfare',
      id: '1ej3kEtANGYsEBUCTfWsIR0UhTSJIuXFHLYspti2sgHo',
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
