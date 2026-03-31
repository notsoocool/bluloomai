import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// Load `.env*` before Next compiles the proxy (Edge). Without this, Turbopack can bake
// `pk_test_dummy` into the Clerk bundle and you get "Publishable key not valid."
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
