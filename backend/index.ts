import { Hono } from "hono";

const app = new Hono()
const api = new Hono()

api.get('/:endpoint{.*}', (c) => {
  
  return c.text('endpoint : '+ c.req.path)
})

app.route("/api", api)

export default {
  port: 8020, 
  fetch: api.fetch, 
}