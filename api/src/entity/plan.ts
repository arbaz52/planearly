import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import lodash from "lodash";
import { v4 as uuid } from "uuid";
import Result from "../model";
import { Database, dijkstra } from "../utils";
import { Graph } from "../types";
import City from "./city";
import Flight from "./flight";

@Entity("plan")
export default class Plan {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => City, (city) => city.plansFrom)
  from!: City;

  @ManyToOne(() => City, (city) => city.plansTo)
  to!: City;

  constructor() {
    this.id = uuid();
  }

  static async findPlan(from: string, to: string) {
    const db = new Database<Plan>(Plan);
    return await db.findOne({
      where: {
        from,
        to,
      },
    });
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
      // const plan = Plan.dijkstra(from, to);

      const flightsData = await Flight.get();
      const citiesData = await City.get();
      if (flightsData.isData() && citiesData.isData()) {
        const flights = flightsData.getData() as Flight[];
        const cities = citiesData.getData() as City[];
        const graph = lodash.reduce(
          cities,
          (prev, curr) => {
            const flightsFrom = lodash.filter(
              flights,
              (flight) =>
                !!lodash.find(
                  curr.flightsFrom,
                  (cityFlight) => cityFlight.id === flight.id
                )
            );

            prev[curr.id] = flightsFrom || [];

            return prev;
          },
          {} as Graph
        );
        const plan = dijkstra(from, to, graph);
      }
    }
  }
}
