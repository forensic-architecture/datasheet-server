export default {
  errors: {
    update: 'The server could not update. Check your API credentials and internet connection and try again.',
    onlySource: 'You cannot query a source directly. The URL needs to be in the format /:source/:tab/:resource.',
    onlyTab: 'You cannot query a tab directly. The URL needs to be in the format /:source/:tab/:resource.',
    noSource: source => `The source ${source} is not available in this server.`,
    noResource: prts => `The resource '${prts[2]}' does not exists in the tab '${prts[1]}' of the source '${prts[0]}'.`,
    noFragment: prts => `Fragment index does not exist`
  },
  success: {
    update: 'All sources updated'
  }
}
