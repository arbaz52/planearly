import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { graphqlHTTP } from "express-graphql";
import { createConnection } from "typeorm";

import { RequestHasUser } from "./types";
import { schema, rootValue } from "./api";
import { GRAPHQL_PATH, PORT } from "./utils";

import jwtExtract from "./middlewares/jwtExtract";

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
    app.use(jwtExtract);

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
