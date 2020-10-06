// import { timemap } from './lib'

// export default {
//   gsheets: [
//     {
//       name: 'curfew-2',
//       id: '15dQTFRkcePCHF4Nfr_JhQWz1LfYtL8_pXhom2F4opWM',
//       tabs: timemap.default
//     }
//   ],
// }
import { timemap } from './lib'

export default {
  gsheets: [],
  xlsx: [
    {
      name: 'timemap_data',
      path: 'data/timemap_data.xlsx',
      tabs: timemap.default
    }
  ]
}