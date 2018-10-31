import path from "path";
import fs from "fs";

const REL_PATH_TO_BPS = "../blueprinters";
const allBps = {};

export const defaultBlueprint = {
  name: null,
  id: null,
  dialects: ["rest"], // supported dialects, can (eventually) be multiple
  routes: {}
};

export const defaultRoute = {
  options: {
    fragment: true
  },
  data: []
};

// import all default exports from 'blueprinters' folder
const normalizedPath = path.join(__dirname, REL_PATH_TO_BPS);
fs.readdirSync(normalizedPath).forEach(file => {
  const bpName = file.replace(".js", "");
  allBps[bpName] = require(`${REL_PATH_TO_BPS}/${file}`).default;
});

module.exports = allBps;
