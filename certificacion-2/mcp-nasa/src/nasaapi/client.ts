import { execFile } from "node:child_process";
import { promisify } from "node:util";

export class NasaApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly url?: string,
  ) {
    super(message);
    this.name = "NasaApiError";
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;
const execFileAsync = promisify(execFile);

export type NasaApiClientOptions = {
  apiKey?: string;
  timeoutMs?: number;
  userAgent?: string;
};

export class NasaApiClient {
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly userAgent: string;

  constructor(options: NasaApiClientOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.NASA_API_KEY ?? "DEMO_KEY";
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.userAgent = options.userAgent ?? "mcp-nasa/1.0.0";
  }

  /** GET against api.nasa.gov, with the api_key query param attached automatically. */
  async getApi<T>(path: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
    const url = new URL(`https://api.nasa.gov${path}`);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    url.searchParams.set("api_key", this.apiKey);
    return this.request<T>(url.toString());
  }

  /** GET against a fully-qualified URL (used for images-api.nasa.gov and epic.gsfc.nasa.gov, which don't take api_key). */
  async getUrl<T>(fullUrl: string, params: Record<string, string | number | boolean | undefined> = {}): Promise<T> {
    const url = new URL(fullUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
    return this.request<T>(url.toString());
  }

  private async request<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          accept: "application/json",
          "user-agent": this.userAgent,
        },
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new NasaApiError(
          `NASA API request failed with ${response.status} ${response.statusText}${body ? `: ${body.slice(0, 300)}` : ""}`,
          response.status,
          url,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof NasaApiError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new NasaApiError(`NASA API request timed out after ${this.timeoutMs}ms`, undefined, url);
      }

      const fallbackValue = await this.tryWindowsPowerShellFallback<T>(url);
      if (fallbackValue) return fallbackValue;

      throw new NasaApiError(formatUnknownFetchError(error), undefined, url);
    } finally {
      clearTimeout(timeout);
    }
  }

  private async tryWindowsPowerShellFallback<T>(url: string): Promise<T | undefined> {
    if (process.platform !== "win32") return undefined;

    try {
      const escapedUrl = url.replace(/'/g, "''");
      const command = [
        "$ErrorActionPreference='Stop'",
        "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12",
        `$response = Invoke-RestMethod -Uri '${escapedUrl}' -Headers @{Accept='application/json'; 'User-Agent'='${this.userAgent}'} -TimeoutSec ${Math.ceil(this.timeoutMs / 1000)}`,
        "$response | ConvertTo-Json -Depth 100 -Compress",
      ].join("; ");
      const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], {
        timeout: this.timeoutMs + 5_000,
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024,
      });

      if (!stdout.trim()) return undefined;
      return JSON.parse(stdout) as T;
    } catch {
      return undefined;
    }
  }
}

export function epicArchiveUrl(collection: "natural" | "enhanced", date: string, imageIdentifier: string, ext: "png" | "jpg" = "png"): string {
  const [year, month, day] = date.split("-");
  return `https://epic.gsfc.nasa.gov/archive/${collection}/${year}/${month}/${day}/${ext}/${imageIdentifier}.${ext}`;
}

function formatUnknownFetchError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);

  const cause = (error as Error & { cause?: unknown }).cause;
  if (cause instanceof Error) {
    const code = (cause as Error & { code?: string }).code;
    const codeText = code ? ` [${code}]` : "";
    return `${error.message}: ${cause.message}${codeText}`;
  }

  return error.message;
}
