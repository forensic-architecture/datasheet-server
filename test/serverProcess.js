import test from 'ava'
import fetch from 'node-fetch'
import childProcess from 'child_process'

const SERVER_LAUNCH_WAIT_TIME = 10 * 1000
const SERVER_ROOT = 'http://localhost:4040'
let serverProc = null
let serverExited = false
function checkStatus (res) {
  if (res.ok) {
    return res
  } else {
    throw new Error('Route is not present')
  }
}

/* SETUP: launch a development server with a wait time */
test.before.cb(t => {
  console.log('launching server...')
  serverProc = childProcess.spawn('yarn', ['dev'], {
    cwd: '.',
    stdio: 'ignore'
  })

  serverProc.on('exit', function (code, signal) {
    serverExited = true
  })

  setTimeout(t.end, SERVER_LAUNCH_WAIT_TIME)
})

/* CLEANUP: kill the server */
test.after(function () {
  console.log('killing server...')
  serverProc.kill('SIGKILL')
})

test('should launch', t => {
  t.false(serverExited)
})

test('should update', t => {
  const expected = {
    success: 'All sheets updated'
  }

  return fetch(`${SERVER_ROOT}/api/update`)
    .then(checkStatus)
    .then(res => res.json())
    .then(json => {
      t.deepEqual(json, expected)
    })
})

const passUrls = [
  // /
  '/api/',
  // /blueprints
  '/api/blueprints',
  // /:sheet/:tab/:resource
  '/api/example/export_events/rows',
  // /:sheet/:tab/:resource/:frag
  '/api/example/export_events/rows/1'
]

const failUrls = [
  // /:sheet
  '/api/example',
  // /:sheet/:tab
  '/api/example/events'
]

passUrls.forEach(function (url) {
  test(`should respond successfully to request for ${url}`, t => {
    return fetch(`${SERVER_ROOT}${url}`)
      .then(checkStatus)
      .then(res => res.json())
      .then(json => {
        t.pass()
      })
  })
})

failUrls.forEach(function (url) {
  test(`should respond with 404 for ${url}`, t => {
    return fetch(`${SERVER_ROOT}${url}`)
      .then(res => {
        if (!res.ok) {
          t.pass()
        } else {
          t.fail()
        }
      })
  })
})
