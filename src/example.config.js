import BP from "./lib/blueprinters";

export default {
  port: 4040,
  googleSheets: {
    email: "project-name@reliable-baptist-23338.iam.gserviceaccount.com",
    privateKey: "SOME_PRIVATE_KEY",
    sheets: [
      {
        name: "example",
        id: "1s-vfBR8Uy-B-TLO_C5Ozw4z-L0E3hdP8ohMV761ouRI",
        tabs: {
          objects: BP.byRow
        }
      }
    ]
  }
};
