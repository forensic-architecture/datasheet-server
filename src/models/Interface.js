/* eslint-disable */
/**
 * Model is a class whose sole responsibility is to save and load blueprints.
 * It allows for different storage mechanisms for different kinds of blueprints.
 */
class Model {
  /**
   * save - save a Blueprint, using the information it contains.
   *
   * @param  {type} blueprint the Blueprint to be saved.
   * @return {type} Promise   which returns True.
   */
  save (blueprint) {}

  /**
   * load - load a resource from a data model, using a Blueprint object as
   * well as a REST-like  URL of the format /:source/:tab/:resource.
   *
   * @param  {type} url       String that represents the path to resource.
   * @param  {type} blueprint Blueprint object (desaturated?).
   * @return {type}           Object containing the resource data.
   */
  load (url, blueprint) {}
}
