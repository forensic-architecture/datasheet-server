import BP from "./lib/blueprinters";

// state care
// 1lc_jXGPfVxTi3dfJmFEVg-3xOuRIvdpZsbg6ki76_l8

// Blair Peach
// 1iPE3QiIdvUtimH8DlVae3GGUydgBQDTkoNlN5cfjK_o

// FA
// 1ej3kEtANGYsEBUCTfWsIR0UhTSJIuXFHLYspti2sgHo
export default {
  googleSheets: {
    sheets: [
      {
        name: "example",
        id: "1lc_jXGPfVxTi3dfJmFEVg-3xOuRIvdpZsbg6ki76_l8",
        tabs: {
          export_events: [BP.deeprows, BP.rows],
          export_categories: [BP.groups, BP.rows],
          export_narratives: BP.rows,
          export_sources: BP.deepids,
          export_sites: BP.rows,
          export_tags: BP.tree
        }
      }
    ]
  }
};
