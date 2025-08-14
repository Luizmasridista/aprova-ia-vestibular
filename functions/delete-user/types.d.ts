// Ambient shims to satisfy VSCode TypeScript for Deno Edge Functions
// These shims are only for editor intellisense and do not affect runtime.

// Minimal Deno global used by this function
declare const Deno: {
  env: { get: (name: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

// Declare the remote ESM module so the TS server doesn't error on resolution
declare module "https://esm.sh/@supabase/supabase-js@2" {
  export * from "@supabase/supabase-js";
}
