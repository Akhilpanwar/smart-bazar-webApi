import type { Request, Response } from "express";

export const healthCheck = (_req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    service: "smartbazar-api-gateway",
    timestamp: new Date().toISOString(),
  });
};
