import { version } from '../../package.json'
import { Router } from 'express'
import copy from '../copy/en'

export default ({ config, controller }) => {
  let api = Router()

  api.get('/', (req, res) => {
    res.json({
      version
    })
  })

  api.get('/blueprints', (req, res) => {
    res.json(controller.blueprints())
  })

  api.get('/:source/:tab/:resource/:frag', (req, res) => {
    const { source, tab, resource, frag } = req.params
    controller
      .retrieveFrag(source, tab, resource, frag)
      .then(data => res.json(data))
      .catch(err =>
        res.status(err.status || 404)
          .send({ error: err.message })
      )
  })

  api.get('/:source/:tab/:resource', (req, res) => {
    controller
      .retrieve(req.params.source, req.params.tab, req.params.resource)
      .then(data => res.json(data))
      .catch(err =>
        res.status(err.status || 404)
          .send({ error: err.message })
      )
  })

  api.get('/update', (req, res) => {
    controller
      .update()
      .then(msg =>
        res.json({
          success: msg
        })
      )
      .catch(err =>
        res.status(404)
          .send({ error: err.message })
      )
  })

  // ERROR routes. Note that it is important that these come AFTER routes
  // like /update, so that the regex does not greedily match these routes.

  api.get('/:source', (req, res) => {
    res.status(404)
      .send({ error: copy.errors.onlySource })
  })

  api.get('/:source/:tab', (req, res) => {
    res.status(404)
      .send({ error: copy.errors.onlyTab })
  })

  return api
}
