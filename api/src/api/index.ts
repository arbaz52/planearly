import { buildSchema } from "graphql";
import Admin from "../entity/admin";
import City from "../entity/city";
import Flight from "../entity/flight";
import Login from "../entity/login";
import Plan from "../entity/plan";
import Traveler from "../entity/traveler";
import {
  CityParams,
  CreateCityParams,
  CreateFlightParams,
  GeneratePlanParams,
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

    # City
    city(id: ID!): City
    cities: [City]

    # Flight
    flight(id: ID!): Flight
    flights: [Flight]

    # FlightPlans | Plans
    generatePlan(from: ID!, to: ID!): [Flight]
  }
  type Mutation {
    registerAdmin(email: String!, password: String!, fullName: String!): Admin
    registerTraveler(email: String!, password: String!, fullName: String!): Traveler

    # City
    createCity(name: String!): City

    # Flight
    createFlight(from: String!, to: String!, cost: Int!): Flight
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
  type City {
    id: ID
    name: String
    flightsFrom: [Flight]
    flightsTo: [Flight]
  }
  type Flight {
    id: ID
    from: City
    to: City
    cost: Int

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

  city: async ({ id }: CityParams, context: IContext) => {
    const city = await City.getOne(id);
    city.throwError(context);
    return city.getData();
  },
  cities: async ({}, context: IContext) => {
    const cities = await City.get();
    cities.throwError(context);
    return cities.getData();
  },
  flights: async ({}, context: IContext) => {
    const flights = await Flight.get();
    flights.throwError(context);
    return flights.getData();
  },
  generatePlan: async ({ from, to }: GeneratePlanParams, context: IContext) => {
    Plan.generate(from, to);
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

  createCity: async ({ name }: CreateCityParams, context: IContext) => {
    const isAdmin = Login.isAdmin(context);
    isAdmin.throwError(context);

    const city = await City.create(name);

    city.throwError(context);

    return city.getData();
  },

  createFlight: async (
    { cost, from, to }: CreateFlightParams,
    context: IContext
  ) => {
    const isAdmin = Login.isAdmin(context);
    isAdmin.throwError(context);

    const flight = await Flight.create(from, to, cost);

    flight.throwError(context);

    return flight.getData();
  },
};
