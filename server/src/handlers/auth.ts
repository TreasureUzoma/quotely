import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env";
import { unauthorized } from "../middleware/session";
import { google } from "googleapis";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

if (!envConfig.PROD_URL) {
  throw new Error("PROD_URL missing");
}

const oauth2Client = new google.auth.OAuth2(
  envConfig.GOOGLE_CLIENT_ID,
  envConfig.GOOGLE_CLIENT_SECRET,
  `${envConfig.PROD_URL}/api/v1/auth/google/callback`
);

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const clientRedirect = decodeURIComponent(req.query.state as string);

    if (!code) return res.status(400).send("No code provided");

    const { tokens } = await oauth2Client.getToken({
      code,
      redirect_uri: `${envConfig.PROD_URL}/api/v1/auth/google/callback`,
    });
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email || !userInfo.id) {
      return res.status(400).json({
        message: "Invalid Google user data",
        data: null,
        success: false,
      });
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(user)
      .where(eq(user.email, userInfo.email))
      .limit(1);

    console.log(existing);

    if (existing.length === 0) {
      // create user
      await db.insert(user).values({
        googleId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name || "Unknown",
        authMethod: "google",
        emailVerified: true,
      });
    }

    // Generate your app JWTs
    const accessToken = jwt.sign(
      { id: userInfo.id, email: userInfo.email },
      envConfig.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: userInfo.id, email: userInfo.email },
      envConfig.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect back to app with tokens
    const finalRedirect = `${clientRedirect}?accessToken=${accessToken}&refreshToken=${refreshToken}`;
    res.redirect(finalRedirect);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Google login failed",
      error: err,
      success: false,
      data: null,
    });
  }
};

export const googleSignIn = (req: Request, res: Response) => {
  const clientRedirect = req.query.redirect_uri as string;
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    redirect_uri: `${envConfig.PROD_URL}/api/v1/auth/google/callback`,
    state: encodeURIComponent(clientRedirect),
  });

  res.redirect(url);
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
