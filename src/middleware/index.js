import { Router } from 'express'
import morgan from 'morgan'
import mapbox from './mapbox'

// eslint-disable-next-line
export default ({ config, db }) => {
  let routes = Router()

  /* logging middleware */
  routes.use(morgan('dev'))

  if (process.env.MAPBOX_TOKEN) {
    routes.get('/mapbox/:z/:y/:x', mapbox(process.env.MAPBOX_TOKEN))
  }

  return routes
}
