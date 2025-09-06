import { Hono } from 'hono';
import { generateConceptFromSeed } from './concept-generator';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
import * as fs from 'fs';
import * as path from 'path';
import { getCookie, setCookie } from 'hono/cookie';
import { randomBytes } from 'crypto';

const app = new Hono();
const api = new Hono();
const templateServer = new Hono();

const client = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY'],
});

// Use import.meta.dir for a more robust path in Bun
const htmlTemplatePath = path.join(import.meta.dir, '../../frontend/interdimensional-net/index.html');
const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf-8');
const logoPath = path.join(import.meta.dir, '../../frontend/interdimensional-net/assets/logo.png');
const faviconPath = path.join(import.meta.dir, '../../frontend/interdimensional-net/assets/favicon.png');
const logo = fs.readFileSync(logoPath);
const favicon = fs.readFileSync(faviconPath);

// 1x1 transparent PNG
const emptyPng = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');

// keep this api route for later, we ain't touchin it rn
api.get('/:endpoint{.*}', (c) => {
    c.status(200);
    return c.text('API endpoint: ' + c.req.path);
});

// Serve logo
templateServer.get('/assets/logo.png', (c) => {
    c.header('Content-Type', 'image/png');
    c.status(200);
    return c.body(logo);
});
templateServer.get('/assets/favicon.png', (c) => {
    c.header('Content-Type', 'image/png');
    c.status(200);
    return c.body(favicon);
});

// Serve empty image for other .png requests
templateServer.get('*.png', (c) => {
    c.header('Content-Type', 'image/png');
    c.status(200);
    return c.body(emptyPng);
});


// the interdimensional cable server, this is where the magic happens
templateServer.get('*', async (c) => {
    let seed = getCookie(c, 'seed');
  const querySeed = c.req.query('seed');
  const acceptHeader = c.req.header('Accept');

  if (querySeed && acceptHeader && acceptHeader.includes('text/html')) {
    seed = querySeed;
  } else if (!seed) {
    seed = randomBytes(16).toString('hex');
    console.log('Generated new seed:', seed);
        const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    setCookie(c, 'seed', seed, { expires: expiry });
    setCookie(c, 'seed_expires', expiry.getTime().toString(), { expires: expiry });
  }

  const path = c.req.path;
  const concept = generateConceptFromSeed(seed);
  
  console.log(`Using seed: ${seed}`);
  
  const prompt = `
{CONCEPT - ${concept}}

write HTML for the page located at **"${path}"**. Make up whatever API endpoint you need if using any. You are inside the body tag already. Use style tags and style the body tag as well. The page, if not on / or if it really has API interaction, should feature some sort of form>input / form>button to send data to an API. No \
\`\`\`html, return in plaintext. Do not use local image paths (e.g., /images/foo.png); instead, you can use placeholder images from a service like https://placehold.co/.

(HTML should be styled [ you can use bootstrap, it's all bundled in. site gotta be in dark mode though] - your view is in the "body>main" tag. do not modify width & height of body, or the layout. For layout, use your container.) Use Bootstrap classes extensively for layout, components (like navbars, cards, buttons), and typography to create a modern and responsive design.
  `;

  try {
    const result = await client.chat.completions.create({
        messages: [{role:"user", "content":prompt}],
        model: 'gpt-oss-120b',
        max_completion_tokens: 65536,
        temperature: 1,
        top_p: 1,
        reasoning_effort: "medium"
    });

    console.log(result.choices?.[0].message.content)
    
    const aiHtml = result.choices?.[0].message.content;

    if (aiHtml) {
        const finalHtml = htmlTemplate.replace('{{content}}', aiHtml);
        c.status(200);
        return c.html(finalHtml);
    }

    return c.text("AI failed to generate content.", 500);
  } catch (error) {
    console.error(error);
    return c.text("Error calling AI.", 500);
  }
});

app.route('/api', api);
app.route('/', templateServer);

export default {
  port: 8020,
  fetch: app.fetch,
};