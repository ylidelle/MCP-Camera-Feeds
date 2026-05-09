import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { CAMERAS, findCamera } from './cameras.js';
import { takeSnapshot } from './snapshot.js';
import { getObservations, makeObservation } from './observations.js';

const server = new Server(
  { name: 'aquarium-cameras', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

let activeCameraId = 'ocean-voyager';

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'take_snapshot',
      description:
        'Navigate to the active aquarium camera, capture a live frame, and return it as an image for analysis.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'switch_camera',
      description: 'Switch the active camera to a different aquarium feed.',
      inputSchema: {
        type: 'object',
        properties: {
          camera_id: {
            type: 'string',
            description: 'ID of the camera to switch to',
            enum: CAMERAS.map((c) => c.id),
          },
        },
        required: ['camera_id'],
      },
    },
    {
      name: 'list_cameras',
      description: 'List all configured aquarium cameras and which one is active.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'make_observation',
      description:
        'Record a timestamped observation or note about what is visible in the current camera feed.',
      inputSchema: {
        type: 'object',
        properties: {
          note: {
            type: 'string',
            description: 'The observation to record',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Optional tags, e.g. ["whale-shark", "feeding", "resting"]',
          },
        },
        required: ['note'],
      },
    },
    {
      name: 'get_observations',
      description: 'Retrieve past observations, optionally filtered by camera.',
      inputSchema: {
        type: 'object',
        properties: {
          camera_id: {
            type: 'string',
            description: 'Filter by camera ID (omit for all cameras)',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of observations to return (default: 20)',
          },
        },
        required: [],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  switch (name) {
    case 'take_snapshot': {
      const camera = findCamera(activeCameraId);
      if (!camera) throw new Error(`Camera not found: ${activeCameraId}`);

      const imageData = await takeSnapshot(camera.url, camera.bufferMs, camera.clickToPlay, camera.skipAd);

      return {
        content: [
          {
            type: 'text',
            text: `Live snapshot from **${camera.name}** — ${new Date().toLocaleString()}\n\n${camera.info}`,
          },
          { type: 'image', data: imageData, mimeType: 'image/jpeg' },
        ],
      };
    }

    case 'switch_camera': {
      const { camera_id } = args as { camera_id: string };
      const camera = findCamera(camera_id);
      if (!camera) throw new Error(`Unknown camera: ${camera_id}`);
      activeCameraId = camera_id;
      const adNote = camera.skipAd
        ? '\n\n⚠️ **Heads up:** This feed may have a pre-roll ad. The snapshot will take a bit longer than usual while it waits for the ad to finish.'
        : '';
      return {
        content: [{ type: 'text', text: `Switched to **${camera.name}**. Use take_snapshot to capture a frame.${adNote}` }],
      };
    }

    case 'list_cameras': {
      const lines = CAMERAS.map(
        (c) =>
          `• \`${c.id}\` — ${c.name}${c.id === activeCameraId ? ' **[active]**' : ''}\n  ${c.description}`
      ).join('\n');
      return { content: [{ type: 'text', text: lines }] };
    }

    case 'make_observation': {
      const { note, tags } = args as { note: string; tags?: string[] };
      const camera = findCamera(activeCameraId);
      if (!camera) throw new Error(`Camera not found: ${activeCameraId}`);

      const obs = await makeObservation({
        cameraId: activeCameraId,
        cameraName: camera.name,
        note,
        tags,
      });

      return {
        content: [
          {
            type: 'text',
            text: `Observation saved (${obs.id})\n**Camera:** ${obs.cameraName}\n**Time:** ${obs.timestamp}\n**Note:** ${obs.note}${obs.tags.length ? `\n**Tags:** ${obs.tags.join(', ')}` : ''}`,
          },
        ],
      };
    }

    case 'get_observations': {
      const { camera_id, limit } = args as { camera_id?: string; limit?: number };
      const observations = await getObservations({
        cameraId: camera_id,
        limit: limit ?? 20,
      });

      if (observations.length === 0) {
        return { content: [{ type: 'text', text: 'No observations recorded yet.' }] };
      }

      const lines = observations
        .map(
          (o) =>
            `**[${o.timestamp}]** ${o.cameraName}\n${o.note}${o.tags.length ? ` _(${o.tags.join(', ')})_` : ''}`
        )
        .join('\n\n');

      return { content: [{ type: 'text', text: lines }] };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
