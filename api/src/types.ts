import { Request, Response } from "express";
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

export interface CityParams {
  id: string;
}

export interface CreateCityParams {
  name: string;
}

export interface CreateFlightParams {
  from: string;
  to: string;
  cost: number;
}
