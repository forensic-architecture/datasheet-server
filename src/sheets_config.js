import BP from './lib/blueprinters'

const timemapStructure = {
  teuruwera_export_events: BP.deeprows,
  teuruwera_export_categories: [BP.groups, BP.rows],
  export_narratives: BP.rows,
  teuruwera_export_sources: BP.deepids,
  export_sites: BP.rows,
  export_tags: BP.tree
}

export default {
  gsheets: [{
    name: 'example',
    id: '1UC7DkCFeUXHfpUxUGruExwFbP4pqVBdJLOKfo6wDDGk',
    tabs: timemapStructure
  }]
}
