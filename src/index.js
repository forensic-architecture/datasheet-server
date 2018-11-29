import http from 'http'
import express from 'express'
import initialize from './initialize'
import middleware from './middleware'
import api from './api'
import config from './config'

let app = express()
app.server = http.createServer(app)

// enable cross origin requests explicitly in development
if (process.env.NODE_ENV === 'development') {
  const cors = require('cors')
  console.log('Enabling CORS in development...')
  app.use(cors())
}

initialize(controller => {
  app.use(
    middleware({
      config,
      controller
    })
  )
  app.use(
    '/api',
    api({
      config,
      controller
    })
  )

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`)
  })
})

export default app
