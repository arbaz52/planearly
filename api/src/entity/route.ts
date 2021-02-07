import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import Result from "../model";
import { Database } from "../utils";
import Flight from "./flight";
import Plan from "./plan";

@Entity("route")
export default class Route {
  @PrimaryColumn()
  id: string;

  @Column({ type: "integer", nullable: false })
  order!: number;

  @ManyToOne(() => Plan, (plan) => plan.routes)
  plan!: Plan;

  @ManyToOne(() => Flight, (flight) => flight.routes)
  flight!: Flight;

  constructor(order: number) {
    this.id = uuid();
    this.order = order;
  }

  static async create(plan: Plan, order: number, flight: Flight) {
    const db = new Database<Route>(Route);

    const newRoute = new Route(order);
    newRoute.id = uuid();
    newRoute.flight = flight;
    newRoute.plan = plan;

    if (await db.save(newRoute)) {
      return new Result<Route>(newRoute, 200);
    } else {
      return new Result<Error>(new Error("Could not create the route"), 500);
    }
  }

  /**
   * won't be exposed as api endpoint
   */
  async remove() {
    const db = new Database<Route>(Route);
    return await db.remove(this);
  }
}
