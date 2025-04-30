const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)

exports.handler = async (event, context) => {
  // Get the path from the event
  const path = event.path.replace('/.netlify/functions/api', '')
  
  // Handle the request
  return new Promise((resolve, reject) => {
    // Mock request and response
    const req = {
      method: event.httpMethod,
      body: event.body ? JSON.parse(event.body) : {},
      query: event.queryStringParameters || {},
      path: path
    }
    
    const res = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: '',
      getHeader: () => {},
      setHeader: (key, value) => {
        res.headers[key] = value
      },
      end: (data) => {
        res.body = data
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: res.body
        })
      }
    }
    
    router.handle(req, res, {})
  })
}