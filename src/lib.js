import BP from './lib/blueprinters'

function prefixedTabs (prefix, cfg) {
  if (!cfg) cfg = {}
  const prf = key => cfg[key] ? `${prefix}_` : ''
  return {
    [`${prf('events')}export_events`]: BP.deeprows,
    [`${prf('associations')}export_associations`]: BP.deeprows,
    [`${prf('sources')}export_sources`]: BP.deepids,
    [`${prf('sites')}export_sites`]: BP.rows
  }
}

export const timemap = {
  default: prefixedTabs(),
  prefixedTabs
}
