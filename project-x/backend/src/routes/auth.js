import { Hono } from "hono";
import bcrypt from "bcrypt";
import { setSession, clearSession, isAuthenticated } from "../auth.js";
import User from "../models/User.js";

const router = new Hono();

// Login
router.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    console.log("Login attempt:", { username });

    if (!username || !password) {
      return c.json(
        {
          message: "Username and password are required",
        },
        400
      );
    }

    const user = await User.findByUsername(username);
    if (!user) {
      console.log("User not found:", username);
      return c.json(
        {
          message: "Invalid username or password",
        },
        401
      );
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log("Invalid password for:", username);
      return c.json(
        {
          message: "Invalid username or password",
        },
        401
      );
    }

    // Don't send password in response
    const { password: _, ...userData } = user;

    // Set session
    await setSession(c, userData);

    // Get the cookie that was set
    const cookieHeader = c.res.headers.get("Set-Cookie");
    console.log("Set-Cookie header:", cookieHeader);

    return c.json(
      {
        message: "Login successful",
        user: userData,
        // Kirim cookie info untuk debugging
        cookieSet: !!cookieHeader,
      },
      200
    );
  } catch (error) {
    console.error("Login error:", error);
    return c.json(
      {
        message: "Login failed",
        error: error.message,
      },
      500
    );
  }
});

// Logout
router.post("/logout", isAuthenticated, async (c) => {
  try {
    const user = c.get("user");
    clearSession(c);
    return c.json({
      message: "Logout successful",
      username: user?.username,
    });
  } catch (error) {
    console.error("Logout error:", error);
    return c.json(
      {
        message: "Logout failed",
        error: error.message,
      },
      500
    );
  }
});

// Get current user
router.get("/me", isAuthenticated, async (c) => {
  try {
    const user = c.get("user");
    return c.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json(
      {
        message: "Failed to get user",
        error: error.message,
      },
      500
    );
  }
});

// Check session status
router.get("/status", async (c) => {
  try {
    const user = c.get("user");
    const cookie = c.req.header("cookie");
    console.log("Status check - Cookie:", cookie);
    console.log("Status check - User:", user);

    if (user) {
      return c.json({
        authenticated: true,
        user,
        hasCookie: !!cookie,
      });
    }
    return c.json({
      authenticated: false,
      user: null,
      hasCookie: !!cookie,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return c.json({
      authenticated: false,
      user: null,
    });
  }
});

export default router;
