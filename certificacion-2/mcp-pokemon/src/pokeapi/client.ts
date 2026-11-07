import { execFile } from "node:child_process";
import { promisify } from "node:util";

export class PokeApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly url?: string,
  ) {
    super(message);
    this.name = "PokeApiError";
  }
}

export type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export type PokeApiClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  cacheTtlMs?: number;
  userAgent?: string;
};

const DEFAULT_BASE_URL = "https://pokeapi.co/api/v2";
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_CACHE_TTL_MS = 1000 * 60 * 30;
const execFileAsync = promisify(execFile);

export class PokeApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly cacheTtlMs: number;
  private readonly userAgent: string;
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor(options: PokeApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.cacheTtlMs = options.cacheTtlMs ?? DEFAULT_CACHE_TTL_MS;
    this.userAgent = options.userAgent ?? "mcp-pokemon/1.0.0";
  }

  async get<T>(pathOrUrl: string): Promise<T> {
    const url = this.toUrl(pathOrUrl);
    const cached = this.readCache<T>(url);
    if (cached) return cached;

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
        throw new PokeApiError(
          `PokeAPI request failed with ${response.status} ${response.statusText}`,
          response.status,
          url,
        );
      }

      const value = (await response.json()) as T;
      this.writeCache(url, value);
      return value;
    } catch (error) {
      if (error instanceof PokeApiError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new PokeApiError(`PokeAPI request timed out after ${this.timeoutMs}ms`, undefined, url);
      }

      const fallbackValue = await this.tryWindowsPowerShellFallback<T>(url);
      if (fallbackValue) {
        this.writeCache(url, fallbackValue);
        return fallbackValue;
      }

      throw new PokeApiError(formatUnknownFetchError(error), undefined, url);
    } finally {
      clearTimeout(timeout);
    }
  }

  list<T>(endpoint: string, limit: number, offset: number): Promise<T> {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safeOffset = Math.max(offset, 0);
    return this.get<T>(`/${endpoint}?limit=${safeLimit}&offset=${safeOffset}`);
  }

  private toUrl(pathOrUrl: string): string {
    if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
      return pathOrUrl;
    }
    const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
    return `${this.baseUrl}${path}`;
  }

  private readCache<T>(url: string): T | undefined {
    const entry = this.cache.get(url);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(url);
      return undefined;
    }
    return entry.value as T;
  }

  private writeCache<T>(url: string, value: T): void {
    this.cache.set(url, {
      value,
      expiresAt: Date.now() + this.cacheTtlMs,
    });
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

export function normalizeIdentifier(value: string | number): string {
  if (typeof value === "number") return String(value);
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

export function englishEntry<T extends { language?: { name?: string } }>(entries: T[] | undefined): T | undefined {
  return entries?.find((entry) => entry.language?.name === "en") ?? entries?.[0];
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
