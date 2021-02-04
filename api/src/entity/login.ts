import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils";
export default class Login<T> {
  user: T;
  token: string;

  constructor(user: T) {
    this.user = user;
    const token = jwt.sign(this.toJson(user), JWT_SECRET);
    this.token = token;
  }

  toJson(user: T) {
    const json = JSON.parse(JSON.stringify(user));
    delete json.password;
    return json;
  }
}
