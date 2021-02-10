export default {
  errors: {
    update: 'The server could not update. Check your API credentials and internet connection and try again.',
    export: {
      fileMissing: 'The server could not export. Check that you provided a file path to export to and try again.',
      writeFailed: 'The server could not export the data to the file. There is an issue with the data format'
    },
    onlySheet: 'You cannot query a sheet directly. The URL needs to be in the format /:sheet/:tab/:resource.',
    onlyTab: 'You cannot query a tab directly. The URL needs to be in the format /:sheet/:tab/:resource.',
    noSheet: sheet => `The sheet ${sheet} is not available in this server.`,
    noResource: prts => `The resource '${prts[2]}' does not exists in the tab '${prts[1]}' in this sheet.`,
    noFragment: prts => `Fragment index does not exist`,
    modelLayer: prts => `Something went wrong at the model layer`
  },
  success: {
    update: 'All sheets updated',
    export: dest => `All resources exported to the file: ${dest}`,
  }
}
