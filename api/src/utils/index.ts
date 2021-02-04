import { IToken } from "../types";

export * from "./database";
export * from "./consts";
export { default as Database } from "./database";

export const adminOnly = (token: IToken | undefined | null = undefined) => {
  if (token) {
    if (!token.isAdmin) {
      throw new Error("Unauthorized");
    }
    return true;
  } else {
    throw new Error("Authorization header missing");
  }
};
