import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { epicArchiveUrl, NasaApiClient, NasaApiError } from "./nasaapi/client.js";
import type {
  Apod,
  EpicImage,
  MediaLibrarySearchResponse,
  NearEarthObject,
  NeoFeedResponse,
} from "./nasaapi/types.js";

const api = new NasaApiClient();

function textResult(text: string, structuredContent?: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text }],
    structuredContent,
  };
}

function errorResult(error: unknown) {
  if (error instanceof NasaApiError) {
    return { ...textResult(`NASA API error: ${error.message}${error.url ? ` (${error.url})` : ""}`), isError: true };
  }
  return {
    ...textResult(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`),
    isError: true,
  };
}

function formatNeo(neo: NearEarthObject): string {
  const approach = neo.close_approach_data[0];
  const diameter = neo.estimated_diameter.meters;
  const hazard = neo.is_potentially_hazardous_asteroid ? "⚠️ potentially hazardous" : "not hazardous";
  return [
    `${neo.name} (${hazard})`,
    `  Diameter: ${diameter.estimated_diameter_min.toFixed(0)}-${diameter.estimated_diameter_max.toFixed(0)} m`,
    approach
      ? `  Closest approach: ${approach.close_approach_date} at ${Number(approach.miss_distance.kilometers).toLocaleString()} km, ${Number(approach.relative_velocity.kilometers_per_hour).toFixed(0)} km/h`
      : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

function createServer() {
  const server = new McpServer({
    name: "mcp-nasa",
    version: "1.0.0",
  });

  server.registerTool(
    "get-apod",
    {
      title: "Astronomy Picture of the Day",
      description: "Get NASA's Astronomy Picture of the Day for a specific date, or N random ones.",
      inputSchema: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD. Defaults to today. Ignored if 'random' is set."),
        random: z.number().int().min(1).max(10).optional().describe("If set, returns this many random APODs instead of a specific date."),
      }),
    },
    async ({ date, random }) => {
      try {
        const data = await api.getApi<Apod | Apod[]>("/planetary/apod", {
          date: random ? undefined : date,
          count: random,
        });
        const items = Array.isArray(data) ? data : [data];
        const lines = items.map((item) =>
          [`${item.title} (${item.date})`, item.explanation, `Media: ${item.media_type} — ${item.hdurl ?? item.url}`].join("\n"),
        );
        return textResult(lines.join("\n\n---\n\n"), { apod: data });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get-neo-feed",
    {
      title: "Near Earth Object Feed",
      description: "List asteroids with a close approach to Earth within a date range (max 7 days).",
      inputSchema: z.object({
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("YYYY-MM-DD"),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD, defaults to startDate. Max 7 days after startDate."),
      }),
    },
    async ({ startDate, endDate }) => {
      try {
        const data = await api.getApi<NeoFeedResponse>("/neo/rest/v1/feed", {
          start_date: startDate,
          end_date: endDate,
        });
        const days = Object.entries(data.near_earth_objects);
        const lines = days.flatMap(([day, neos]) => [`${day} (${neos.length} objects):`, ...neos.map((neo) => formatNeo(neo))]);
        return textResult(`${data.element_count} near-earth objects found.\n\n${lines.join("\n")}`, { feed: data });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get-neo-details",
    {
      title: "Near Earth Object Details",
      description: "Get full orbital and close-approach details for one asteroid by its NASA JPL id (e.g. from get-neo-feed results).",
      inputSchema: z.object({
        neoId: z.string().describe("NASA JPL small body id, e.g. 3542519."),
      }),
    },
    async ({ neoId }) => {
      try {
        const neo = await api.getApi<NearEarthObject>(`/neo/rest/v1/neo/${encodeURIComponent(neoId)}`);
        const orbitClass = neo.orbital_data?.orbit_class?.orbit_class_type;
        const lines = [
          formatNeo(neo),
          orbitClass ? `Orbit class: ${orbitClass}` : undefined,
          `Total known close approaches: ${neo.close_approach_data.length}`,
          `JPL page: ${neo.nasa_jpl_url}`,
        ].filter(Boolean);
        return textResult(lines.join("\n"), { neo });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "search-nasa-media",
    {
      title: "Search NASA Image and Video Library",
      description: "Search NASA's public image, video, and audio library by keyword.",
      inputSchema: z.object({
        query: z.string().describe("Search keywords, e.g. 'apollo 11' or 'black hole'."),
        mediaType: z.enum(["image", "video", "audio"]).optional().describe("Restrict results to one media type."),
        limit: z.number().int().min(1).max(50).default(10),
      }),
    },
    async ({ query, mediaType, limit }) => {
      try {
        const data = await api.getUrl<MediaLibrarySearchResponse>("https://images-api.nasa.gov/search", {
          q: query,
          media_type: mediaType,
        });
        const items = data.collection.items.slice(0, limit);
        const results = items.map((item) => {
          const info = item.data[0];
          const thumbnail = item.links?.find((link) => link.rel === "preview")?.href;
          return { nasaId: info.nasa_id, title: info.title, mediaType: info.media_type, date: info.date_created, thumbnail };
        });
        const lines = results.map((item) => `${item.title} [${item.mediaType}] (${item.nasaId})${item.thumbnail ? `\n  ${item.thumbnail}` : ""}`);
        return textResult(`${data.collection.metadata?.total_hits ?? results.length} results for "${query}":\n\n${lines.join("\n")}`, {
          results,
        });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get-earth-images",
    {
      title: "Get Earth Images (EPIC)",
      description: "Get full-disc Earth images from the DSCOVR satellite (NASA EPIC camera) for a given date, or the most recent available day.",
      inputSchema: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("YYYY-MM-DD. Defaults to the most recent available day."),
        collection: z.enum(["natural", "enhanced"]).default("natural"),
      }),
    },
    async ({ date, collection }) => {
      try {
        const path = date ? `/api/${collection}/date/${date}` : `/api/${collection}`;
        const images = await api.getUrl<EpicImage[]>(`https://epic.gsfc.nasa.gov${path}`);
        if (images.length === 0) {
          return textResult(`No EPIC images available for ${date ?? "the most recent day"}.`);
        }
        const items = images.map((img) => ({
          identifier: img.identifier,
          caption: img.caption,
          date: img.date,
          url: epicArchiveUrl(collection, img.date.slice(0, 10), img.image),
        }));
        const lines = items.map((item) => `${item.date} — ${item.caption}\n  ${item.url}`);
        return textResult(`${items.length} EPIC images:\n\n${lines.join("\n")}`, { images: items });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  return server;
}

void serveStdio(createServer);
