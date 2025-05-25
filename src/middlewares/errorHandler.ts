import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export default function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next?: NextFunction
) {
  if (err instanceof AppError) {
    const response: Record<string, any> = {
      status: false,
      message: err.message,
    };

    if ("errors" in err) {
      response.errors = (err as any).errors;
    }

    if ("metadata" in err) {
      Object.assign(response, (err as any).metadata);
    }

    console.error("[AppError]", {
      path: req.originalUrl,
      method: req.method,
      message: err.message,
      statusCode: err.statusCode,
      errors: (err as any).errors || null,
      metadata: (err as any).metadata || null,
    });

    return res.status(err.statusCode).json(response);
  }

  console.error("[Unhandled Error]", {
    path: req.originalUrl,
    method: req.method,
    error: err,
  });
  return res
    .status(500)
    .json({ status: "error", message: "Something went wrong" });
}
