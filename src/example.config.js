import BP from './lib/blueprinters'

export default {
  port: 4040,
  googleSheets: {
    sheets: [
      {
        name: 'example',
        id: '15gb_aYJw7WSVZmtS0FZvcpGx1-kwKX3VHH8YV6La4hY',
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
