import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { envConfig } from "../config/env";

interface RequestContext {
  user?: { id: string; email: string };
}

const contextMap = new WeakMap<Request, RequestContext>();

export const getContext = (req: Request): RequestContext => {
  if (!contextMap.has(req)) contextMap.set(req, {});
  return contextMap.get(req)!;
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(unauthorized);
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json(unauthorized);
  }

  try {
    const decoded = jwt.verify(token, envConfig.JWT_SECRET) as {
      id: string;
      email: string;
    };

    // Attach user to request context
    const context = getContext(req);
    context.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      ...unauthorized,
      message: "Invalid or expired token",
    });
  }
};

export const unauthorized = {
  error: "Unauthorized",
  data: null,
  success: false,
  message: "Login to continue",
};
