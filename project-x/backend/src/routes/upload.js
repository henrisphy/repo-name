import { Hono } from "hono";
import { isAuthenticated } from "../auth.js";
import Photo from "../models/Photo.js";
import Task from "../models/Task.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = new Hono();

// Allowed file types
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/jpg",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

router.post("/tasks/:id/photos", isAuthenticated, async (c) => {
  try {
    const taskId = parseInt(c.req.param("id"));
    if (isNaN(taskId)) {
      return c.json({ message: "Invalid task ID" }, 400);
    }

    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return c.json({ message: "Task not found" }, 404);
    }

    const user = c.get("user");
    const body = await c.req.parseBody();
    const file = body["photo"];
    const caption = body["caption"] || "";

    // Validate file
    if (!file || typeof file === "string") {
      return c.json({ message: "No file uploaded or invalid file" }, 400);
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return c.json(
        {
          message: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP",
        },
        400
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return c.json(
        {
          message: `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        400
      );
    }

    // Create upload directory if it doesn't exist - menggunakan UPLOAD_DIR dari env
    const uploadDir = path.join(
      __dirname,
      "../../",
      process.env.UPLOAD_DIR || "uploads"
    );
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`✅ Created upload directory: ${uploadDir}`);
    }

    // Generate unique filename
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.name) || ".jpg";
    const filename = unique + ext;
    const filePath = path.join(uploadDir, filename);

    // Save file
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    const fileUrl = `/${process.env.UPLOAD_DIR || "uploads"}/${filename}`;
    const photo = await Photo.create(
      taskId,
      fileUrl,
      caption,
      user.username,
      user.name
    );

    return c.json(
      {
        message: "Photo uploaded successfully",
        data: photo,
      },
      201
    );
  } catch (error) {
    console.error("Upload error:", error);
    return c.json(
      {
        message: "Failed to upload photo",
        error: error.message,
      },
      500
    );
  }
});

// Get photos for a task
router.get("/tasks/:id/photos", isAuthenticated, async (c) => {
  try {
    const taskId = parseInt(c.req.param("id"));
    if (isNaN(taskId)) {
      return c.json({ message: "Invalid task ID" }, 400);
    }

    const photos = await Photo.findByTask(taskId);
    return c.json({
      data: photos,
      count: photos.length,
    });
  } catch (error) {
    console.error("Get photos error:", error);
    return c.json(
      {
        message: "Failed to get photos",
        error: error.message,
      },
      500
    );
  }
});

export default router;
