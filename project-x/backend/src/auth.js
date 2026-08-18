import { getSignedCookie, setSignedCookie, deleteCookie } from "hono/cookie";

const secret = process.env.SESSION_SECRET || "UHJkR2VulG9uZ1N0cmluZ3NlY3JldA";

export const sessionMiddleware = async (c, next) => {
  try {
    const session = await getSignedCookie(c, secret, "session");
    if (session) {
      try {
        const userData = JSON.parse(session);
        c.set("user", userData);
        console.log("Session found for user:", userData.username);
      } catch (e) {
        console.error("Failed to parse session:", e);
        c.set("user", null);
      }
    } else {
      console.log("No session found");
      c.set("user", null);
    }
  } catch (error) {
    console.error("Session middleware error:", error);
    c.set("user", null);
  }
  await next();
};

export const setSession = async (c, userData) => {
  const isProduction = process.env.NODE_ENV === "production";
  await setSignedCookie(c, "session", JSON.stringify(userData), secret, {
    path: "/",
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge: 60 * 60 * 24,
  });
  c.set("user", userData);
  console.log("Session set for user:", userData.username);
};

export const clearSession = (c) => {
  deleteCookie(c, "session", {
    path: "/",
  });
  c.set("user", null);
  console.log("Session cleared");
};

export const isAuthenticated = async (c, next) => {
  const user = c.get("user");
  if (!user) {
    console.log("Unauthorized: No user in session");
    return c.json(
      {
        message: "Unauthorized - Please login first",
        code: "UNAUTHORIZED",
      },
      401
    );
  }
  console.log("Authenticated:", user.username);
  await next();
};

export const isLead = async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ message: "Unauthorized" }, 401);
  }
  if (user.role !== "lead") {
    console.log("Forbidden: User", user.username, "is not a lead");
    return c.json(
      {
        message: "Forbidden - Lead access required",
        code: "FORBIDDEN",
      },
      403
    );
  }
  console.log("Lead access granted:", user.username);
  await next();
};
