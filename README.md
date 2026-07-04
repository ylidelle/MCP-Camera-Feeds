# MCP Camera Feeds 🦈🐧🐋

A Model Context Protocol (MCP) server that lets Claude take live snapshots from Georgia Aquarium webcams, analyze what it sees, and log observations over time.

## Cameras

| ID | Camera | View |
|----|--------|------|
| `ocean-voyager` | Ocean Voyager (whale sharks, mantas) | Underwater |
| `beluga-whale` | Beluga Whale Cam | Underwater |
| `african-penguin` | African Penguin Cam | Above-water habitat |
| `sharks-predators` | Sharks! Predators of the Deep | Underwater |

## Tools

| Tool | Description |
|------|-------------|
| `take_snapshot` | Capture a live frame from the active camera + return species info |
| `switch_camera` | Switch to a different camera |
| `list_cameras` | List all cameras and which is active |
| `make_observation` | Save a timestamped note with optional tags |
| `get_observations` | Retrieve past observations |

## Setup

**Requirements:** Node.js 18+

```bash
npm install
npx playwright install chromium
npm run build
```

## Connecting to Claude

### Claude Code
```bash
claude mcp add aquarium-cameras node "/path/to/dist/index.js"
```

### Remote (claude.ai custom connector / Railway)
The server also ships a Streamable HTTP entry point:

```bash
node dist/http.js   # listens on $PORT (default 8080)
```

Set `AUTH_TOKEN` to require the token in the URL — the MCP endpoint becomes
`https://your-app.up.railway.app/<AUTH_TOKEN>/mcp`. Paste that URL into
claude.ai → Settings → Connectors → Add custom connector.

Deploying on Railway: the included `Dockerfile` uses the official Playwright
image (version-matched to `package-lock.json`), so Chromium just works.

### Claude Desktop
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "aquarium-cameras": {
      "command": "node",
      "args": ["/path/to/dist/index.js"]
    }
  }
}
```

## Adding More Cameras

Add entries to `src/cameras.ts` — each camera needs an `id`, `name`, `url`, `description`, and `info` block. Optional fields:
- `bufferMs` — extra load time for slow streams (default: 5000ms)
- `clickToPlay` — set `true` if the stream needs a click to start

Then `npm run build` and restart Claude.

## Development

```bash
npm run dev   # run with tsx (no build step)
npm run build # compile TypeScript
npm start     # run compiled output
```
