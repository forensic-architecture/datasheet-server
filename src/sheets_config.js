import BP from './lib/blueprinters'

export default {
  googleSheets: {
    sheets: [
      {
        name: 'example',
        id: '15gb_aYJw7WSVZmtS0FZvcpGx1-kwKX3VHH8YV6La4hY',
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
