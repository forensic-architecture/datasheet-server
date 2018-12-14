import BP from './lib/blueprinters'

export default {
  port: 4040,
  googleSheets: {
    email: 'SOME_SERVICE_ACCOUNT_EMAIL',
    privateKey: 'SOME_SERVICE_ACCOUNT_PRIVATE_KEY',
    sheets: [
      {
        name: 'example',
        id: '1UC7DkCFeUXHfpUxUGruExwFbP4pqVBdJLOKfo6wDDGk',
        tabs: {
          export_events: [BP.deeprows, BP.rows],
          export_categories: [BP.groups, BP.rows],
          export_sources: BP.ids,
          export_sites: BP.rows,
          export_tags: BP.tree
        }
      }
    ]
  }
}
