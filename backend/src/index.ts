import { Hono } from "hono";
import { generateResponse } from "./api";

const app = new Hono()
const api = new Hono()
const templateServer = new Hono()

api.get('/:endpoint{.*}', generateResponse)

templateServer.get("/")


app.route("/api", api)

export default {
  port: 8020, 
  fetch: api.fetch, 
}