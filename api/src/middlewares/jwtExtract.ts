import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils";
import { IToken, RequestHasUser } from "../types";

const jwtExtract = (
  req: Request,
  res: Response,
  next: (error: Error | undefined) => void
) => {
  let _req = req as RequestHasUser;
  const {
    headers: { authorization },
  } = req;
  if (authorization) {
    const token = authorization.replace(/bearer/gi, "").trim();
    try {
      jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
      const decoded = jwt.decode(token) as IToken;
      _req.user = decoded;
    } catch (ex) {
      console.log(req, res, next, authorization);
      console.error(ex);
    }
  }
  next(undefined);
};

export default jwtExtract;
