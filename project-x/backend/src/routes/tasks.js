import { Hono } from "hono";
import { isAuthenticated, isLead } from "../auth.js";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";
import Photo from "../models/Photo.js";

const router = new Hono();

router.get("/", isAuthenticated, async (c) => {
  const filters = {};
  const query = c.req.query();
  if (query.division) filters.division = query.division;
  if (query.assignedTo) filters.assignedTo = query.assignedTo;
  if (query.status) filters.status = query.status;
  const tasks = await Task.findAll(filters);
  return c.json(tasks);
});

router.get("/:id", isAuthenticated, async (c) => {
  const id = parseInt(c.req.param("id"));
  const task = await Task.findById(id);
  if (!task) return c.json({ message: "Task not found" }, 404);
  const comments = await Comment.findByTask(id);
  const photos = await Photo.findByTask(id);
  return c.json({
    ...task,
    comments: comments || [],
    photos: photos || [],
  });
});

router.post("/", isAuthenticated, isLead, async (c) => {
  const { title, description, assignedTo, dueDate, priority } =
    await c.req.json();
  const user = c.get("user");
  const newTask = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: user.username,
    division: user.division,
    dueDate,
    priority,
  });
  return c.json(newTask, 201);
});

router.put("/:id", isAuthenticated, async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const task = await Task.findById(id);
    if (!task) return c.json({ message: "Task not found" }, 404);

    const user = c.get("user");
    if (user.role !== "lead" && task.assigned_to !== user.username) {
      return c.json({ message: "Forbidden" }, 403);
    }

    const updates = await c.req.json();
    const allowedUpdates = {};

    if (updates.title !== undefined) allowedUpdates.title = updates.title;
    if (updates.description !== undefined)
      allowedUpdates.description = updates.description;
    if (updates.status !== undefined) {
      allowedUpdates.status = updates.status;
      if (updates.status === "completed") {
        allowedUpdates.completed_at = new Date().toISOString().split("T")[0];
      } else if (updates.status === "working") {
        allowedUpdates.completed_at = null;
      }
    }
    if (updates.priority !== undefined)
      allowedUpdates.priority = updates.priority;
    if (updates.due_date !== undefined)
      allowedUpdates.due_date = updates.due_date;

    const updated = await Task.update(id, allowedUpdates);
    const comments = await Comment.findByTask(id);
    const photos = await Photo.findByTask(id);
    return c.json({ ...updated, comments, photos });
  } catch (err) {
    console.error("Update task error:", err);
    return c.json({ message: err.message }, 500);
  }
});

router.post("/:id/comments", isAuthenticated, async (c) => {
  try {
    const taskId = parseInt(c.req.param("id"));
    const { text } = await c.req.json();
    const user = c.get("user");
    const comment = await Comment.create(
      taskId,
      user.username,
      user.name,
      text
    );
    return c.json(comment, 201);
  } catch (err) {
    console.error("Add comment error:", err);
    return c.json({ message: err.message }, 500);
  }
});

router.delete("/:id", isAuthenticated, isLead, async (c) => {
  const id = parseInt(c.req.param("id"));
  await Task.delete(id);
  return c.json({ message: "Deleted" });
});

export default router;
