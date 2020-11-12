import R from 'ramda'

/* eslint-disable */
String.prototype.replaceAll = function (search, replacement) {
  const target = this
  return target.replace(new RegExp(search, 'g'), replacement)
}
/* eslint-enable */

function camelize (str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match) {
    if (+match === 0) return '' // or if (/\s+/.test(match)) for white spaces
    return match.toUpperCase()
  })
}

export function getFileExt (str) {
  const re = /(?:\.([^.]+))?$/
  return re.exec(str)[1]
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
    const obj = {}
    const fmtColName = colName => {
      if (options.camelCaseKeys) {
        return camelize(colName)
      } else if (options.hyphenatedKeys) {
        return colName.toLowerCase().replaceAll(' ', '-')
      } else if (options.noSpacesInKeys) {
        return colName.replaceAll(' ', '')
      } else {
        return colName
      }
    }
    columnNames.forEach((columnName, idx) => {
      const value = row[idx] ? row[idx] : ''
      obj[fmtColName(columnName)] = value
    })
    return obj
  }
)

/* search for object with key in array. Return index if exists, or -1 if not */
export const idxSearcher = R.curry((attrName, searchValue, myArray) => {
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][attrName] === searchValue) {
      return i
    }
  }
  return -1
})

/* more site specific functions. TODO: maybe move to another folder? */

export function fmtName (name) {
  return name.replaceAll(' ', '-').toLowerCase()
}

export function fmtBlueprinterTitles (tabs) {
  const obj = {}
  Object.keys(tabs).forEach(tab => {
    const name = fmtName(tab)
    obj[name] = tabs[tab]
  })
  return obj
}

export function deriveFilename (sheet, tab) {
  return `${fmtName(sheet)}-${fmtName(tab)}.json`
}

export function desaturate (full) {
  const blueprint = {
    name: R.clone(full.name),
    sheet: R.clone(full.sheet),
    dialects: R.clone(full.dialects),
    resources: {}
  }
  Object.keys(full.resources).forEach(route => {
    blueprint.resources[route] = {
      options: R.clone(full.resources[route].options)
    }
  })
  return blueprint
}

export function isFunction (functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  )
}
