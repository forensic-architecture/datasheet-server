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
          export_events: [BP.byId, BP.byRow],
          export_categories: [BP.byGroup, BP.byRow],
          export_sites: BP.byRow,
          export_tags: BP.byTree
        }
      }
    ]
  }
}
