import R from "ramda";

String.prototype.replaceAll = function(search, replacement) {
  const target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    // return index == 0 ? match.toLowerCase() : match.toUpperCase();
    return match.toUpperCase();
  });
}

export const fmtObj = R.curry(
  (
    columnNames,
    row,
    options = {
      noSpacesInKeys: false,
      hyphenatedKeys: false,
      camelCaseKeys: false
    }
  ) => {
    const obj = {};
    const fmtColName = colName => {
      if (options.camelCaseKeys) {
        return camelize(colName);
      } else if (options.hyphenatedKeys) {
        return colName.toLowerCase().replaceAll(" ", "-");
      } else if (options.noSpacesInKeys) {
        return colName.replaceAll(" ", "");
      } else {
        return colName;
      }
    };
    columnNames.forEach((columnName, idx) => {
      obj[fmtColName(columnName)] = row[idx];
    });
    return obj;
  }
);

/* search for object with key in array. Return index if exists, or -1 if not */
export const idxSearcher = R.curry((attrName, searchValue, myArray) => {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][attrName] == searchValue) {
      return i;
    }
  }
  return -1;
});

/* more site specific functions. TODO: maybe move to another folder? */

export function fmtSourceTitle(name) {
  return name.replaceAll(" ", "-").toLowerCase();
}

export function fmtBlueprinterTitles(tabs) {
  const obj = {};
  Object.keys(tabs).forEach(tab => {
    const name = fmtSourceTitle(tab);
    obj[name] = tabs[tab];
  });
  return obj;
}

export function deriveFilename(source, tab) {
  return `${fmtSourceTitle(source)}-${fmtSourceTitle(tab)}.json`;
}

export function bp(full) {
  const blueprint = {
    name: R.clone(full.name),
    source: R.clone(full.source),
    dialects: R.clone(full.dialects),
    routes: {}
  };
  Object.keys(full.routes).forEach(route => {
    blueprint.routes[route] = {
      options: R.clone(full.routes[route].options)
    };
  });
  return blueprint;
}

export function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}
