import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import City from "./city";
import { v4 as uuid } from "uuid";
import Result from "../model";
import { Database } from "../utils";

@Entity("flight")
export default class Flight {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => City, (city) => city.flightsFrom)
  from: City;

  @ManyToOne(() => City, (city) => city.flightsTo)
  to: City;

  @Column({ nullable: false, type: "integer" })
  cost: number;

  constructor(from: City, to: City, cost: number) {
    this.id = uuid();
    this.from = from;
    this.to = to;
    this.cost = cost;
  }

  static async create(from: string, to: string, cost: number) {
    const fromCity = (await City.getOne(from)).getData();
    const toCity = (await City.getOne(to)).getData();

    if (
      fromCity &&
      toCity &&
      !(fromCity instanceof Error) &&
      !(toCity instanceof Error)
    ) {
      const db = new Database<Flight>(Flight);
      const newFlight = new Flight(fromCity, toCity, cost);
      newFlight.id = uuid();
      if (await db.save(newFlight)) {
        return new Result<Flight>(newFlight, 200);
      } else {
        return new Result<Error>(new Error("Could not create the flight"), 500);
      }
    } else {
      return new Result<Error>(
        new Error("Could not create the flight, invalid cities"),
        400
      );
    }
  }

  static async get() {
    const db = new Database<Flight>(Flight);
    const flights = await db.find({}, ["from", "to"]);
    return new Result<Flight[]>(flights, 200);
  }
}
