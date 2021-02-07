import { Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import find from "lodash/find";
import reduce from "lodash/reduce";
import filter from "lodash/filter";

import { v4 as uuid } from "uuid";

import City from "./city";
import Flight from "./flight";
import Route from "./route";

import Result from "../model";
import { Graph } from "../types";
import { Database, dijkstra } from "../utils";

@Entity("plan")
export default class Plan {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => City, (city) => city.plansFrom)
  from!: City;

  @ManyToOne(() => City, (city) => city.plansTo)
  to!: City;

  @OneToMany(() => Route, (route) => route.plan)
  routes!: Route[];

  constructor() {
    this.id = uuid();
  }

  static async findPlan(from: string, to: string) {
    const db = new Database<Plan>(Plan);
    const plan = await db.findOne(
      {
        where: {
          from,
          to,
        },
      },
      ["from", "to"]
    );
    return plan;
  }

  static async get() {
    const db = new Database<Plan>(Plan);
    return new Result<Plan[]>(
      await db.find({}, [
        "from",
        "to",
        "routes",
        "routes.flight",
        "routes.flight.from",
        "routes.flight.to",
      ]),
      200
    );
  }

  /**
   * check if straight flight plan exits.
   * check if a plan already exits.
   * if nothing, generate one and store it.
   */
  static async generate(from: string, to: string) {
    const plan = await Plan.findPlan(from, to);
    if (plan) {
      return new Result<Plan>(plan, 200);
    } else {
      //generate flight plan and store it in the db.

      //getting cities from db.....
      const fromCity = await City.getOne(from);
      const toCity = await City.getOne(to);

      //returning the result<error> object.
      if (fromCity.isError() || toCity.isError()) {
        return (fromCity || toCity) as Result<Error>;
      }

      const flightsData = await Flight.get();
      const citiesData = await City.get();
      if (flightsData.isData() && citiesData.isData()) {
        const flights = flightsData.getData() as Flight[];
        const cities = citiesData.getData() as City[];
        const graph = reduce(
          cities,
          (prev, curr) => {
            const flightsFrom = filter(
              flights,
              (flight) =>
                !!find(
                  curr.flightsFrom,
                  (cityFlight) => cityFlight.id === flight.id
                )
            );

            prev[curr.id] = flightsFrom || [];

            return prev;
          },
          {} as Graph
        );
        const plans = dijkstra(from, to, graph);
        console.log(plans);

        // saving the routes for future use.
        const dbPlan = new Database<Plan>(Plan);
        const storage = await Promise.all(
          Object.keys(plans).map(async (cityId) => {
            //storing empty routes so they do not get recalculated again.
            const route = plans[cityId];
            //store the plan
            const newPlan = new Plan();
            newPlan.from = fromCity.getData() as City;
            const toCity = find(cities, (city) => city.id === cityId);
            if (toCity) newPlan.to = toCity;
            if (await dbPlan.save(newPlan)) {
              //save each flight order
              const storedRoutes = await Promise.all(
                route.map(async (flight, index) => {
                  console.log(newPlan, index, flight);
                  const _route = await Route.create(newPlan, index, flight);
                  return _route;
                })
              );
              return { cityId, storedRoutes };
            } else {
              throw new Error("Could not create the path");
            }
          })
        );

        // returning the desired route.
        const plan = await Plan.findPlan(from, to);
        console.log(plan);
        if (plan) {
          return new Result<Plan>(plan, 200);
        } else {
          return new Result<Plan>(new Error("Flight Plan does not exist"), 404);
        }
      }
    }
  }
}
