import BP from './lib/blueprinters'

export function prefixedTabs (prefix) {
  return {
    [`${prefix}_export_events`]: BP.deeprows,
    [`${prefix}_export_categories`]: [BP.groups, BP.rows],
    [`${prefix}_export_filters`]: BP.tree,
    [`${prefix}_export_narratives`]: BP.rows,
    [`${prefix}_export_sources`]: BP.deepids,
    [`${prefix}_export_sites`]: BP.rows
  }
}

export const tabs = {
  export_events: BP.deeprows,
  export_categories: [BP.groups, BP.rows],
  export_filters: BP.tree,
  export_narratives: BP.rows,
  export_sources: BP.deepids,
  export_sites: BP.rows
}
