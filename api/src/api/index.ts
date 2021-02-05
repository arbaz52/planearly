import { buildSchema } from "graphql";
import Admin from "../entity/admin";
import Login from "../entity/login";
import Traveler from "../entity/traveler";
import {
  IContext,
  LoginAdminParams,
  LoginTravelerParams,
  RegisterAdminParams,
  RegisterTravelerParams,
} from "../types";

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
    login.throwError(context);
    return login.getData();
  },
  admins: async ({}, context: IContext) => {
    const admins = await Admin.get();
    admins.throwError(context);
    return admins.getData();
  },

  loginTraveler: async (
    { email, password }: LoginTravelerParams,
    context: IContext
  ) => {
    const login = await Traveler.login(email, password);
    login.throwError(context);
    return login.getData();
  },
  travelers: async ({}, context: IContext) => {
    const travelers = await Traveler.get();
    travelers.throwError(context);
    return travelers.getData();
  },
  authTest: ({}, context: IContext) => {
    const auth = Login.isAdmin(context);
    auth.throwError(context);
    return auth.getData();
  },

  //mutations
  registerAdmin: async (
    { email, password, fullName }: RegisterAdminParams,
    context: IContext
  ) => {
    const register = await Admin.register(email, password, fullName);
    register.throwError(context);
    return register.getData();
  },
  registerTraveler: async (
    { email, password, fullName }: RegisterTravelerParams,
    context: IContext
  ) => {
    const register = await Traveler.register(email, password, fullName);
    register.throwError(context);
    return register.getData();
  },
};
