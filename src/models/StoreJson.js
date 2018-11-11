import fs from "mz/fs";
import hash from "object-hash";
import {fmtSourceTitle} from "../lib/util";
import path from "path";

const STORAGE_DIRNAME = "temp";

class StoreJson {
  save(bp) {
    return Promise.all(
      Object.keys(bp.routes).map(route =>
        fs.writeFile(
          `${STORAGE_DIRNAME}/${fmtSourceTitle(
            bp.source.name
          )}__${fmtSourceTitle(bp.name)}__${route}.json`,
          JSON.stringify(bp.routes[route].data)
        )
      )
    );
  }

  load(url, bp) {
    const parts = url.split("/");
    const fname = `${STORAGE_DIRNAME}/${parts[0]}__${parts[1]}__${
      parts[2]
    }.json`;
    return fs
      .exists(fname)
      .then(isAvailable => {
        if (isAvailable) return fs.readFile(fname, "utf8");
        else {
          throw new Error("No resource exists");
        }
      })
      .then(data => JSON.parse(data))
      .then(data => {
        if (parts.length === 3) {
          // No lookup if the requested url doesn't have a fragment
          return data;
        } else if (parts[2] === "ids") {
          // Do a lookup if fragment is included to filter a relevant item
          // When the resource requested is 'ids'
          const id = parseInt(parts[3]);
          if (!isNaN(id) && id >= 0 && id < data.length) {
            return data[id];
          } else {
            throw new Error(`Fragment index does not exist`);
          }
        } else {
          // Do a lookup if fragment is included to filter a relevant item
          const index = parseInt(parts[3]);
          if (!isNaN(index) && index >= 0 && index < data.length) {
            console.log(data, index);
            return data.filter((vl, idx) => idx === index)[0];
          } else {
            throw new Error(`Fragment index does not exist`);
          }
        }
      });
  }

  // TODO: add method to build blueprint from data source
}

export default StoreJson;
