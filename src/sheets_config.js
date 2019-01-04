import BP from './lib/blueprinters'

export default {
  googleSheets: {
    sheets: [
      {
        name: 'example',
        id: '1UC7DkCFeUXHfpUxUGruExwFbP4pqVBdJLOKfo6wDDGk',
        tabs: {
          export_events: [BP.deeprows, BP.rows],
          export_categories: [BP.groups, BP.rows],
          export_narratives: BP.rows,
          export_sources: BP.deepids,
          export_sites: BP.rows,
          export_tags: BP.tree
        }
      }
    ]
  }
}
