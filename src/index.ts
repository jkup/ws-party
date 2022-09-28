// @ts-ignore
import html from "../public/index.html";

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  DO_WEBSOCKET: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return new Response(html, {
      headers: {
        "content-type": "text/html",
      },
    });
  },
};

export class WebSocketDurableObject {
  state: DurableObjectState;
  constructor(state: DurableObjectState, env: any) {
    this.state = state;
  }

  async fetch(request: Request) {
    // To accept the WebSocket request, we create a WebSocketPair (which is like a socketpair,
    // i.e. two WebSockets that talk to each other), we return one end of the pair in the
    // response, and we operate on the other end. Note that this API is not part of the
    // Fetch API standard; unfortunately, the Fetch API / Service Workers specs do not define
    // any way to act as a WebSocket server today.
    let pair = new WebSocketPair();

    // We're going to take pair[1] as our end, and return pair[0] to the client.
    await this.handleSession(pair[1]);

    // Now we return the other end of the pair to the client.
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async handleSession(websocket: WebSocket) {
    websocket.accept();

    websocket.addEventListener("message", async (msg) => {
      console.log(msg);
    });
  }
}
