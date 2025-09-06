import { Context, Hono } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env['CEREBRAS_API_KEY'],
});

// export function generateResponse(ctx : Context<BlankEnv, "/:endpoint{.*}", BlankInput>){
//     console.log(ctx.body)/
//     return ctx.text('endpoint : '+ ctx.req.path)
// }:
