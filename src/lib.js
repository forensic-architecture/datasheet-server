import BP from './lib/blueprinters'

export function prefixedTabs (prefix, cfg) {
  if (!cfg) cfg = {}
  const prf = key => cfg[key] ? `${prefix}_` : ''
  return {
    [`${prf('events')}export_events`]: BP.deeprows,
    [`${prf('categories')}export_categories`]: [BP.groups, BP.rows],
    [`${prf('filters')}export_filters`]: BP.tree,
    [`${prf('narratives')}export_narratives`]: BP.rows,
    [`${prf('sources')}export_sources`]: BP.deepids,
    [`${prf('sites')}export_sites`]: BP.rows
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
