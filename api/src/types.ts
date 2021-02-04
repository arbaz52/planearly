import { Request, Response } from "express";

export interface IContext {
  req: Request;
  res: Response;
}

export interface LoginAdminParams {
  email: string;
  password: string;
}

export interface RegisterAdminParams {
  email: string;
  password: string;
  fullName: string;
}
