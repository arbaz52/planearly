import jwt from "jsonwebtoken";
import { IToken } from "../types";
import { JWT_ALGORITHM, JWT_EXPIRES_IN, JWT_SECRET } from "../utils";
import Admin from "./admin";
import Traveler from "./traveler";
export default class Login {
  user: Admin | Traveler;
  token: string;

  constructor(user: Admin | Traveler, isAdmin: boolean = false) {
    this.user = user;
    const token = jwt.sign(this.toToken(user, isAdmin), JWT_SECRET, {
      algorithm: JWT_ALGORITHM as
        | "HS256"
        | "HS384"
        | "HS512"
        | "RS256"
        | "RS384"
        | "RS512"
        | "ES256"
        | "ES384"
        | "ES512"
        | "PS256"
        | "PS384"
        | "PS512"
        | "none"
        | undefined,
      expiresIn: JWT_EXPIRES_IN,
    });
    this.token = token;
  }

  toToken(user: Admin | Traveler, isAdmin: boolean): IToken {
    return {
      isAdmin,
      id: user.id,
      signedAt: new Date().valueOf(),
    };
  }
}
