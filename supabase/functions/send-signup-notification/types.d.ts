/**
 * Type declarations for Supabase Edge Functions
 * This file helps TypeScript understand Deno and Edge Function types
 */

declare namespace Deno {
  function env.get(key: string): string | undefined;
}

interface ServeRequest {
  method: string;
  json(): Promise<any>;
}

interface ServeResponse {
  status: number;
  headers?: HeadersInit;
}

declare function serve(
  handler: (req: ServeRequest) => Promise<ServeResponse>
): void;
