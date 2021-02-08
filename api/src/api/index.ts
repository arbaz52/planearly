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
  FlightParams,
  GeneratePlanParams,
  IContext,
  LoginAdminParams,
  LoginTravelerParams,
  RegisterAdminParams,
  RegisterTravelerParams,
  RemoveCityParams,
  RemoveFlightParams,
  UpdateCityParams,
  UpdateFlightParams,
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
    generatePlan(from: ID!, to: ID!): Plan
    plans: [Plan]
  }
  type Mutation {
    registerAdmin(email: String!, password: String!, fullName: String!): Admin
    registerTraveler(email: String!, password: String!, fullName: String!): Traveler

    # City
    createCity(name: String!): City
    updateCity(id: ID!, name: String!): City
    removeCity(id: ID!): Boolean

    # Flight
    createFlight(from: ID!, to: ID!, cost: Int!): Flight
    updateFlight(id: ID!, from: ID!, to: ID!, cost: Int!): Flight
    removeFlight(id: ID!): Boolean
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
  type Plan {
    id: ID
    from: City
    to: City
    routes: [Route]
  }
  type Route {
    id: ID
    order: Int
    flight: Flight
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
  flight: async ({ id }: FlightParams, context: IContext) => {
    const flights = await Flight.getOne(id);
    flights.throwError(context);
    return flights.getData();
  },
  flights: async ({}, context: IContext) => {
    const flights = await Flight.get();
    flights.throwError(context);
    return flights.getData();
  },
  generatePlan: async ({ from, to }: GeneratePlanParams, context: IContext) => {
    const plan = await Plan.generate(from, to);
    plan.throwError(context);
    return plan.getData();
  },
  plans: async ({}, context: IContext) => {
    const plans = await Plan.get();
    plans.throwError(context);
    return plans.getData();
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
  updateCity: async ({ id, name }: UpdateCityParams, context: IContext) => {
    const isAdmin = Login.isAdmin(context);
    isAdmin.throwError(context);

    const city = await City.update(id, name);
    city.throwError(context);

    return city.getData();
  },
  removeCity: async ({ id }: RemoveCityParams, context: IContext) => {
    const isAdmin = Login.isAdmin(context);
    isAdmin.throwError(context);

    const removed = await City.remove(id);
    removed.throwError(context);
    return removed.getData();
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
  updateFlight: async (
    { id, from, to, cost }: UpdateFlightParams,
    context: IContext
  ) => {
    const isAdmin = Login.isAdmin(context);
    isAdmin.throwError(context);

    const flight = await Flight.update(id, from, to, cost);
    flight.throwError(context);

    return flight.getData();
  },
  removeFlight: async ({ id }: RemoveFlightParams, context: IContext) => {
    const isAdmin = Login.isAdmin(context);
    isAdmin.throwError(context);

    const removed = await Flight.remove(id);
    removed.throwError(context);
    return removed.getData();
  },
};
