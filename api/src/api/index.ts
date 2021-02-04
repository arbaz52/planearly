import { buildSchema } from "graphql";
import Admin from "../entity/admin";
import Traveler from "../entity/traveler";
import Result from "../model";
import {
  IContext,
  LoginAdminParams,
  LoginTravelerParams,
  RegisterAdminParams,
  RegisterTravelerParams,
} from "../types";
import { adminOnly } from "../utils";

export const schema = buildSchema(`
  type Query {
    greet: String
    loginAdmin(email: String!, password: String!): AdminLogin
    admins: [Admin]
    loginTraveler(email: String!, password: String!): TravelerLogin
    travelers: [Traveler]
    authTest: Boolean
  }
  type Mutation {
    registerAdmin(email: String!, password: String!, fullName: String!): Admin
    registerTraveler(email: String!, password: String!, fullName: String!): Traveler
  }
  type AdminLogin {
    user: Admin
    token: String
  }
  type TravelerLogin {
    user: Traveler
    token: String
  }
  type Admin {
    id: ID
    fullName: String
    email: String
  }
  type Traveler {
    id: ID
    fullName: String
    email: String
  }
`);

export const rootValue = {
  // just a basic greeting message.
  greet: ({}, context: IContext) => {
    return "How you doin'?";
  },

  //queries
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

  loginTraveler: async (
    { email, password }: LoginTravelerParams,
    context: IContext
  ) => {
    const login = await Traveler.login(email, password);
    if (login.isError()) throw login.getError();
    return login.getData();
  },
  travelers: async ({}, context: IContext) => {
    const travelers = await Traveler.get();
    if (travelers.isError()) throw travelers.getError();
    return travelers.getData();
  },
  authTest: ({}, context: IContext) => {
    return adminOnly(context.token);
  },

  //mutations
  registerAdmin: async (
    { email, password, fullName }: RegisterAdminParams,
    context: IContext
  ) => {
    const register = await Admin.register(email, password, fullName);
    if (register.isError()) throw register.getError();
    return register.getData();
  },
  registerTraveler: async (
    { email, password, fullName }: RegisterTravelerParams,
    context: IContext
  ) => {
    const register = await Traveler.register(email, password, fullName);
    if (register.isError()) throw register.getError();
    return register.getData();
  },
};
