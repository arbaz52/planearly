import { buildSchema } from "graphql";
import Admin from "../entity/admin";
import { IContext, LoginAdminParams, RegisterAdminParams } from "../types";

export const schema = buildSchema(`
  type Query {
    greet: String
    loginAdmin(email: String!, password: String!): AdminLogin
    admins: [Admin]
  }
  type Mutation {
    registerAdmin(email: String!, password: String!, fullName: String!): Admin
  }
  type AdminLogin {
    user: Admin
    token: String
  }
  type Admin {
    id: ID
    fullName: String
    email: String
  }
`);

export const rootValue = {
  greet: ({}, context: IContext) => {
    return "How you doin'?";
  },
  loginAdmin: async (
    { email, password }: LoginAdminParams,
    context: IContext
  ) => {
    const login = await Admin.login(email, password);
    if (login.isError()) throw login.getError();
    return login.getData();
  },
  admins: async ({}, context: IContext) => {
    const admins = await Admin.get();
    if (admins.isError()) throw admins.getError();
    return admins.getData();
  },
  registerAdmin: async (
    { email, password, fullName }: RegisterAdminParams,
    context: IContext
  ) => {
    const register = await Admin.register(email, password, fullName);
    if (register.isError()) throw register.getError();
    return register.getData();
  },
};
