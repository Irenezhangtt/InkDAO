import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
await cp(path.join(root, "build"), client, { recursive: true });

const worker = `export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let response = await env.ASSETS.fetch(request);
    if (response.status === 404 && request.method === "GET" && !url.pathname.includes(".")) {
      response = await env.ASSETS.fetch(new Request(new URL("/index.html", url), request));
    }
    return response;
  }
};
`;

const config = {
  topLevelName: "inkdao",
  name: "inkdao",
  compatibility_date: "2026-05-15",
  compatibility_flags: ["nodejs_compat"],
  main: "index.js",
  no_bundle: true,
  rules: [{ type: "ESModule", globs: ["**/*.js", "**/*.mjs"] }],
  assets: { directory: "../client" },
  observability: { enabled: true }
};

await writeFile(path.join(server, "index.js"), worker);
await writeFile(path.join(server, "wrangler.json"), JSON.stringify(config));
