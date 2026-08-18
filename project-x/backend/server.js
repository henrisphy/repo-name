import { serve } from "@hono/node-server";
import app from "./src/index.js";

const port = process.env.PORT || 5000;
serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`🚀 Backend running on http://localhost:${info.port}`);
  }
);
