import { Router } from 'express'
import { mapboxAccessToken } from '../config'
import morgan from 'morgan'
import mapbox from './mapbox'

// eslint-disable-next-line
export default ({ config, db }) => {
  let routes = Router()

  /* logging middleware */
  routes.use(morgan('dev'))

  if (mapboxAccessToken) {
    routes.get('/mapbox/:z/:y/:x', mapbox(mapboxAccessToken))
  }

  return routes
}
