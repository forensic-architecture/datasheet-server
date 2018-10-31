import R from "ramda";
import {fmtObj, idxSearcher} from "../lib/util";
import {defaultBlueprint, defaultRoute} from "../lib/blueprinters";

/**
 * byRow - generate a Blueprint from a data source by row. The resource name
 * defaults to 'rows', or a custom resource name can be passed. Each resource
 * item is an object with values labelled according to column names.
 *
 * @param  {type} data         list of lists representing sheet data.
 * @param  {type} label="rows" name of resource in blueprint.
 * @param  {type} name=""      name of blueprint.
 * @return {type} Blueprint
 */
export default function byRow(
  tabName,
  sourceName,
  sourceId,
  data,
  label = "rows"
) {
  // Define Blueprint
  const bp = R.clone(defaultBlueprint);
  bp.source = {
    name: sourceName,
    id: sourceId
  };
  bp.name = tabName;

  // Column names define routes
  const itemLabels = data[0];
  const fmt = fmtObj(itemLabels);
  bp.routes[label] = R.clone(defaultRoute);
  bp.routes[label].data = [];

  data.forEach((row, idx) => {
    if (idx == 0) return;
    bp.routes[label].data.push(fmt(row));
  });
  return bp;
}
