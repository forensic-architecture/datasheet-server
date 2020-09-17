<h1 align="center">
  Datasheet Server
</h1>

<p align="center">
  <strong>Turn spreadsheet data into a structured, dynamic API. </strong><br>
</p>
<p align="center">
  <a href="https://github.com/forensic-architecture/datasheet-server/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Datasheet Server is released under the MIT license." />
  </a>
  <a href="https://travis-ci.com/forensic-architecture/datasheet-server">
    <img src="https://travis-ci.com/forensic-architecture/datasheet-server.svg?branch=develop" alt="Build Status"/>
  </a>
</p>

<h3 align="center">
  <a href="#overview">Overview</a>
  <span> · </span>
  <a href="#configuration">Configuration</a>
  <span> · </span>
  <a href="#quickstart">Quickstart</a>
</h3>

Datasheet server makes resources from a spreadsheet available as a structured API.

- **Manage structured data without developers**. Allows anyone to dynamically manage data, while simultaneously making this data available in a reliably structured format for frontend interfaces and other programmatic applications.
- **Designed for a dynamic workflow**. References data in a spreadsheet source as a ground truth, but adds a layer of indirection that keep API routes from breaking when changes are made.
- **Customisable data transformation**. Easily create new blueprints to specify the API structure that should be presented from source data.
- **Extensible architecture**. Currently supports Google Sheet as a source and a REST-like query language, but structured modularly with an intention to support other sources and query languages.

## [Overview](#overview)
Datasheet server is a Node server developed at [Forensic Architecture](https://forensic-architecture.org) to make data that is being dynamically modified by researchers concurrently consumable for programmatic applications as an API. We use spreadsheets extensively to keep track of information during [our investigations](http://forensic-architecture.org/cases), and we often want to make this data available via structured queries to make it available in a frontend web application, a game engine, or another use case.

Querying data directly from spreadsheets is brittle, as it relies on the maintenance of a rigid structure in the sheets at all times. By putting Datasheet Server as a proxy that sits in between source sheets and their consumers, it is possible to dynamically modify sheets without breaking applications. A data admin can then use Datasheet Server to ensure that applications always receive eligible data, without foregoing the spreadsheets as sources of truth.

To see how to get a local instance of datasheet server running in practice, see [this wiki](https://github.com/forensic-architecture/timemap/wiki/running-timemap-and-datasheet-server-locally) explaining how to use it to feed data from a Google Sheet to a local instance of [Timemap](https://github.com/forensic-architecture/timemap).

#### [Sources](#sources)
Sources are specified in [src/config.js](https://github.com/forensic-architecture/datasheet-server/blob/develop/src/config.js). Datasheet server currently only supports Google Sheets as a source.

###### [Google Sheets](#source-google-sheets)
| sheets | A list of objects, one for each sheet that is being used as a source. Each sheet object has a `name` (String), an `id` (String), and a `tabs` (object) field, which are explained below. | object |

Each Google Sheet being used as a as source requires a corresponding object in `sheets`. The object should be structured as follows:

| Option | Description | Type |
| ------ | ----------- | ---- |
| name | Used to refer to data served from this source | string |
| path/id | The path to the XLSX sheet on your local, or the ID of the sheet in Google. (You can find it in the address bar when the Sheet is open in a browser. It is the string that follows 'spreadsheets/d/'). | string |
| tabs | An object that maps each tab in the source to one or more Blueprinters. All of the Blueprinters in the [blueprinters folder](/lib/blueprinters) are available through a single import as at the top of [example.config.js](/src/example.config.js). <br> To correctly associate a Blueprinter, the object key needs to be _the tab name with all lowercase letters, and spaces replaced by a '-'_. For example, if the tab name in Google Sheets is 'Info About SHEEP', the object key should be 'info-about-sheep'. <br> The value should be the Blueprinter function that you want to use for the data in that tab. If you require more than one endpoint for a single tab, you can support multiple blueprinters by making the item an array. See the example of a configuration object below. <br>TODO: no Blueprinter is used by default. | object |

See src/config.js for an example configuration sheet. 


## [Quickstart](#quickstart)
Clone the repository to your local:
```
git clone https://www.github.com/forensic-architecture/datasheet-server
```

Follow the steps in the [configuration](#configuration) section of this
document.

### Run with Docker
To create a new instance of the server with [Docker](https://www.docker.com/) installed, ensure that you have followed the steps in the quickstart guide above, then and build an image locally. (Note that Docker must be installed):
```sh
docker build -t datasheet-server .
```
You can then run the container and make available the relevant port (`4040` by default):
```sh
docker run -d -p 4040:4040 datasheet-server
```
If running on a cloud server, you'll probably need to zero out the host IP:
```sh
docker run -d -p 0.0.0.0:4040:4040 datasheet-server
```

### Run locally
Install dependencies:
```sh
yarn # npm install
```
And run development server:
```sh
yarn dev # npm run dev
```

## Contribute

### [Code of Conduct](CODE_OF_CONDUCT.md)

Please read our adopted [code of conduct](CODE_OF_CONDUCT.md) before contributing, so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](CONTRIBUTING.md)

Read our [contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements.

## Community
If you have any questions or just want to chat, please join our team [fa_open_source](https://keybase.io/team/fa_open_source) on Keybase for community discussion. Keybase is a great platform for encrypted chat and file sharing.

## License

Datasheet Server is distributed under the [MIT License](https://github.com/forensic-architecture/datasheet-server/blob/develop/LICENSE).
