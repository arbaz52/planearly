import { Request, Response } from "express";
import Admin from "./entity/admin";
import Login from "./entity/login";
import Traveler from "./entity/traveler";
export interface IToken {
  id: string;
  signedAt: number;
  isAdmin: boolean;
}
export interface RequestHasUser extends Request {
  user?: IToken;
}
export interface IContext {
  req: Request;
  res: Response;
  token?: IToken;
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

export interface LoginTravelerParams {
  email: string;
  password: string;
}

export interface RegisterTravelerParams {
  email: string;
  password: string;
  fullName: string;
}
