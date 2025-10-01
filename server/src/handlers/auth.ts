import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env";
import { unauthorized } from "../middleware/session";
import { OAuth2Client } from "google-auth-library";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

const client = new OAuth2Client(envConfig.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req: Request, res: Response) => {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken) return res.status(401).json({ message: "No token provided" });

  try {
    // verify token with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: envConfig.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid token");

    // payload contains email, name, sub (Google ID)
    const userEmail = payload.email;
    const userId = payload.sub;
    const userName = payload.name;

    if (!userEmail) throw new Error("No email in Google payload");

    const existing = await db
      .select()
      .from(user)
      .where(eq(user.email, userEmail))
      .limit(1);

    if (existing.length === 0) {
      // user exists hehe, so create em
      await db.insert(user).values({
        name: userName!,
        email: userEmail!,
        id: userId,
        authMethod: "google",
      });
    }

    const accessToken = jwt.sign(
      { id: userId, email: userEmail },
      envConfig.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: userId, email: userEmail },
      envConfig.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      data: {
        accessToken,
        refreshToken,
        user: {
          email: userEmail,
          id: userId,
        },
      },
      success: true,
      message: "Signed in with Google successfully",
    });
  } catch (err) {
    if (err instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  }
};

export const refresh = (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(unauthorized);
  }

  const refreshToken = authHeader.split(" ")[1];
  if (!refreshToken) {
    return res.status(401).json(unauthorized);
  }

  try {
    const decoded = jwt.verify(refreshToken, envConfig.REFRESH_SECRET) as {
      id: string;
      email: string;
    };

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      envConfig.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      data: { accessToken: newAccessToken },
      success: true,
      message: "Access token refreshed successfully",
    });
  } catch (err) {
    return res.status(401).json({
      ...unauthorized,
      message: "Invalid or expired refresh token",
    });
  }
};
