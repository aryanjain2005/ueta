/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import { JWTPayload } from "jose";

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;
declare namespace App {
  interface Locals extends Runtime {
    user?: JWTPayload;
  }
}
