import http from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createServer } from './server.js';

const PORT = Number(process.env.PORT ?? 8080);
const AUTH_TOKEN = process.env.AUTH_TOKEN ?? '';

// With a token set, the MCP endpoint lives at /<token>/mcp — the token rides
// in the URL because claude.ai custom connectors can't send custom headers.
const MCP_PATH = AUTH_TOKEN ? `/${AUTH_TOKEN}/mcp` : '/mcp';

// Stamped once at process start, so /health also proves the container RESTARTED
// and isn't just an old process answering with a new-looking commit var.
const STARTED_AT = new Date().toISOString();

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);

  if (url.pathname === '/' || url.pathname === '/health') {
    // 🚩 THIS USED TO RETURN A FIXED STRING, so it answered "is something
    // running?" and NEVER "is MY code running?" -- which is the only question
    // I have ever actually had after `railway up`. My own notes say the first
    // poll after a deploy still served the OLD text, and the way I found that
    // out was noticing stale content by accident, days later.
    //   >>> A health check with no build identity cannot distinguish a live
    //   >>> deploy from a stale one. It reports "fine" in both worlds.
    // Railway injects RAILWAY_GIT_COMMIT_SHA; unset locally, which is itself
    // informative rather than a failure.
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end(
      'aquarium-cameras-mcp ok 🦈🐧🐋\n' +
        `commit: ${process.env.RAILWAY_GIT_COMMIT_SHA ?? 'local-or-unset'}\n` +
        `started: ${STARTED_AT}\n`,
    );
    return;
  }

  if (url.pathname !== MCP_PATH) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }

  // Stateless streamable HTTP: sessions aren't tracked, so only POST is served
  if (req.method !== 'POST') {
    res.writeHead(405, { 'content-type': 'application/json', allow: 'POST' });
    res.end(
      JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Method not allowed.' },
        id: null,
      })
    );
    return;
  }

  try {
    const body = JSON.parse((await readBody(req)) || 'null');
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (err) {
    console.error('MCP request failed:', err);
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal server error' },
          id: null,
        })
      );
    }
  }
});

httpServer.listen(PORT, () => {
  console.log(`aquarium-cameras MCP listening on :${PORT} (endpoint: ${MCP_PATH})`);
});
