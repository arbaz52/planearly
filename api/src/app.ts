import express from "express";
import cors from "cors";
import jwt from "express-jwt";
import { config } from "dotenv";
import { graphqlHTTP } from "express-graphql";
import { createConnection } from "typeorm";

import { schema, rootValue } from "./api";
import { GRAPHQL_PATH, JWT_ALGORITHM, JWT_SECRET, PORT } from "./utils";
import { RequestHasUser } from "./types";

//priming env.
config();

const app = express();

createConnection()
  .then((connection) => {
    /**
     * middlewares
     */
    app.use(express.json());
    app.use(cors());
    app.use(
      jwt({
        algorithms: [JWT_ALGORITHM],
        secret: JWT_SECRET,
        credentialsRequired: false, //we handle this on our own, on resolver level.
      })
    );

    app.use(
      GRAPHQL_PATH!,
      graphqlHTTP((req, res, graphQLParams) => ({
        schema,
        rootValue,
        graphiql: true,
        context: {
          req,
          res,
          token: (req as RequestHasUser).user,
        },
      }))
    );

    app.listen(PORT);
    const link = `Server running on: http://localhost:${PORT}${GRAPHQL_PATH}`;
    console.info(link);
  })
  .catch((error: Error) => {
    console.error(error);
  });
