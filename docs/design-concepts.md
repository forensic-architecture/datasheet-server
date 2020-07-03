### Design Concepts
The codebase currently only supports Google Sheets as a source, and a REST-like format as a query language. It is designed, however, with extensibility in mind.

**Sources**     
A source represents a sheet-like collection of data, such as a Google Sheet. A source has one or more **tabs**, each of which contains a 2-dimensional grids of cells. Each cell contains a body of text (a string).

**Resources**     
The data from sources are made available as resources, which are structured blocks of data that are granularly accessible through a query language. Resources are the outfacing aspect of Datasheet Server, and represent the only kind of data that can be queried by applications. Each resource is configured with one or more **query languages**. (Currently only a REST-like query language supported.)

**Blueprints**       
Blueprints are a data structure that represent the way that infromation from **sources** are to be turned into **resources**. For each tab in a source, there is a corresponding Blueprint. Blueprints are created through a [blueprinter function](/src/blueprinters) invoked on the raw data from a source tab.

Blueprints are JSON objects. There have two forms:

1. _desaturated_ -- describes the resources and query languages available on data from a source tab.
2. _saturated_ --  both describes resources available on data from a source etab, and contains that data.

A desaturated Blueprint can be saturated by retrieving its data from the server's **model layer**, which stores tab data from sources.

A JSON catalogue of the available blueprints (desaturated) in a server is available at `/api/blueprints`.


