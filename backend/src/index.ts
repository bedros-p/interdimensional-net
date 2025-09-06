import { Hono } from 'hono';
import { generateConceptFromSeed } from './concept-generator';

const app = new Hono();
const api = new Hono();
const templateServer = new Hono();

// keep this api route for later, we ain't touchin it rn
api.get('/:endpoint{.*}', (c) => c.text('API endpoint: ' + c.req.path));

// the interdimensional cable server, this is why the magic happens
templateServer.get('*', (c) => {
  const path = c.req.path;
  const concept = generateConceptFromSeed(path);
  console.log(`Path: ${path}, Concept: ${concept}`);
  // just returnin the concept as text for now, we'll make it spit out html later
  return c.text(`Path: ${path}\nConcept: ${concept}`);
});

app.route('/api', api);
app.route('/', templateServer);

export default {
  port: 8020,
  fetch: app.fetch,
};
