import { Hono } from "hono";
import { isAuthenticated } from "../auth.js";
import User from "../models/User.js";

const router = new Hono();

router.get("/staff", isAuthenticated, async (c) => {
  const user = c.get("user");
  if (user.role !== "lead") {
    return c.json({ message: "Only lead can view team" }, 403);
  }
  const staff = await User.getTeamStaff(user.username);
  return c.json(staff);
});

export default router;
