import {  RequestHandler } from "express";

export const verifyInternalAdmin: RequestHandler = (req, res, next) => {
  const user = res.locals.user as { userId?: number };

  if (!user?.userId) {
    res.status(401).json({ error: "No userId in token" });
    return;
  }

  if (user.userId !== 2) {
    res.status(403).json({ error: "Forbidden. Only admin can access internal endpoints." });
    return;
  }

  
  next();
};
