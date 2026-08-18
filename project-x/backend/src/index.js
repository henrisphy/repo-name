import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { serveStatic } from "hono/serve-static";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import teamRoutes from "./routes/team.js";
import uploadRoutes from "./routes/upload.js";
import { sessionMiddleware } from "./auth.js";

dotenv.config();

const app = new Hono();

// CORS - Konfigurasi yang lebih permisif untuk development
app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow all origins in development
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        process.env.CLIENT_URL,
        // Tambahkan origin dari request
        origin,
      ].filter(Boolean);

      console.log("CORS - Origin:", origin);
      console.log("CORS - Allowed origins:", allowedOrigins);

      // Untuk development, izinkan semua
      if (process.env.NODE_ENV === "development") {
        return origin || allowedOrigins[0];
      }

      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    exposeHeaders: ["Set-Cookie", "Cookie"],
    maxAge: 86400, // 24 hours
  })
);

// Logging
app.use("*", logger());

// Request logging detail
app.use("*", async (c, next) => {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  console.log("Headers:", JSON.stringify(c.req.header(), null, 2));
  console.log(`${"=".repeat(50)}`);
  await next();
});

// Security headers
app.use("*", secureHeaders());

// Session middleware - PASTIKAN INI DIPANGGIL SEBELUM ROUTES
app.use("*", sessionMiddleware);

// Static files untuk uploads
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(
  `/${uploadDir}/*`,
  serveStatic({
    root: "./",
    rewriteRequestPath: (path) => path,
  })
);

// Routes
app.route("/api/auth", authRoutes);
app.route("/api/tasks", taskRoutes);
app.route("/api/team", teamRoutes);
app.route("/api/upload", uploadRoutes);

// Health check
app.get("/", (c) =>
  c.json({
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    uploadDir: process.env.UPLOAD_DIR,
  })
);

// Debug endpoint - untuk cek session
app.get("/api/debug/session", async (c) => {
  const user = c.get("user");
  const cookie = c.req.header("cookie");
  return c.json({
    hasUser: !!user,
    user: user,
    hasCookie: !!cookie,
    cookie: cookie,
    headers: c.req.header(),
  });
});

// Global error handler
app.onError((err, c) => {
  console.error("Global Error:", err);
  return c.json(
    {
      message: err.message || "Internal Server Error",
      status: 500,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
    500
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      message: "Route not found",
      path: c.req.url,
      method: c.req.method,
    },
    404
  );
});

export default app;
