export const JWT_SECRET = process.env.JWT_SECRET || "LOST_FREQUENCIES";
export const JWT_EXPIRES_IN = "7d";
export const JWT_ALGORITHM = process.env.JWT_ALGORITHM || "HS256";
export const PORT = process.env.APP_PORT || 4000;
export const GRAPHQL_PATH = process.env.GRAPHQL_PATH || "/graphql";
