/* eslint-disable */
/**
 * Model is a class whose sole responsibility is to save and load data through a custom URL format.
 * As an interfacce, it allows for different storage mechanisms, and different scale/performance for different kinds of data.
 * 
 * ERRORS:
 * When a load function fails, it should throw either:
 * 1. noResource(parts) if the resource doesn't exist on that sheet/tab.
 * 2. noFragment(parts) if a fragment lookup fails because it doesn't exist.
 * 3. modelLayerGeneric(parts) if something else goes wrong.
 *
 * This is a WIP layer. See StoreJson.js for an example in action.
 */
class Model {
  /**
   * Index the data stored by this model, returning a list of the available URLs. 
   * @return {Promise(boolean)} Unpacks to a list of available URLs if successful, throws an error otherwise.
   */
  index () {}
  
  /**
   * Save data at a URL. The URL is in the format
   *    /:fetcherID/:tab/:resource
   * Fetcher IDs must be unique, tabs and resources can be duplicated across
   * different fetchers.
   * 
   * @param  {string} url - the URL at which to save the data.
   * @param  {object} data - the data to be saved.
   * @return {Promise(boolean)} Unpacks to true if the update was successful, false if otherwise.
   */
  save (url, data) {}

  /**
   * Load data from a URL, in the format
   *    /:fetcherID/:tab/:resource
   * 
   * @param  {string} url - the URL at which to load the data.
   * @return {Promise(object)} a Promise that unpacks to the data retrieved. An error will be thrown if the URL is invalid.
   */
  load (url) {}
}
