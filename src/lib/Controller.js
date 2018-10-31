/**
 * Controller
 *
 */
class Controller {
  constructor(fetchers) {
    this.fetchers = fetchers;
  }

  sourceExists(source) {
    return true;
    if (Object.keys(this.fetchers).indexOf(source) == -1) return false;
  }

  blueprints() {
    return Object.keys(this.fetchers).map(
      source => this.fetchers[source].blueprints
    );
  }

  update() {
    return Promise.all(
      Object.keys(this.fetchers).map(source => {
        return this.fetchers[source].update();
      })
    ).then(results => {
      return "All sources updated";
    });
  }

  retrieve(source, tab, resource) {
    if (this.sourceExists(source)) {
      const fetcher = this.fetchers[source];
      return fetcher.retrieve(tab, resource);
    } else {
      return Promise.resolve().then(() => {
        throw new Error(`Source ${source} not available.`);
      });
    }
  }

  retrieveFrag(source, tab, resource, frag) {
    if (this.sourceExists(source)) {
      const fetcher = this.fetchers[source];
      return fetcher.retrieveFrag(tab, resource, frag);
    } else {
      return Promise.resolve().then(() => {
        throw new Error(`Source ${source} not available.`);
      });
    }
  }
}

export default Controller;
