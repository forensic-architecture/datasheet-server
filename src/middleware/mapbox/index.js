import fetch from "node-fetch";
import fs from "fs";
// TODO: load images from mapbox API and store.

const baseUrl = "http://a.tiles.mapbox.com/v4/mapbox.satellite";
export default accessToken => (req, res) => {
  const {x, y, z} = req.params;
  // const filename = `${z}-${y}-${x}.png`
  // const fileStream = fs.createWriteStream(`${z}-${y}-${x}.png`)
  fetch(
    `http://a.tiles.mapbox.com/v4/mapbox.satellite/${z}/${y}/${x}@2x.png?access_token=${accessToken}`
  ).then(result => {
    res.set("Content-Type", "image/png");
    result.body.pipe(res);
  });
};
