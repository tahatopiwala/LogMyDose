import { Request, Response, NextFunction } from "express";
import { env } from "../lib/env.js";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  if (env.NODE_ENV === "development") {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${req.method} ${req.path} ${res.statusCode} - ${duration}ms`,
      );
    });
  }

  next();
}
