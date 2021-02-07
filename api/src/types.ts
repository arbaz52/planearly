import { Request, Response } from "express";
import Flight from "./entity/flight";
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

export interface GeneratePlanParams {
  from: string;
  to: string;
}

export interface Node {
  cityId: string;
  cost: number;
  parent?: Flight;
}

//cities with departing flights.
export interface Graph {
  [cityId: string]: Flight[];
}

export interface Routes {
  [cityId: string]: Flight[];
}

export interface UpdateCityParams {
  id: string;
  name: string;
}

export interface RemoveCityParams {
  id: string;
}

export interface UpdateFlightParams {
  id: string;
  from: string;
  to: string;
  cost: number;
}

export interface RemoveFlightParams {
  id: string;
}
