import fs from 'file-system'

function exportToFile(url, data) {
  console.info(url, data)
  return 1
}

export const utilities = {
  default: exportToFile(),
  exportToFile
}