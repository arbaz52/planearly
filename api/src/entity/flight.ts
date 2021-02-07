import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import every from "lodash/every";

import City from "./city";
import Route from "./route";

import Result from "../model";
import { Database } from "../utils";
import Plan from "./plan";

@Entity("flight")
export default class Flight {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => City, (city) => city.flightsFrom, { eager: true })
  from: City;

  @ManyToOne(() => City, (city) => city.flightsTo, { eager: true })
  to: City;

  @Column({ nullable: false, type: "integer" })
  cost: number;

  @OneToMany(() => Route, (route) => route.flight)
  routes!: Route[];

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

  static async update(id: string, from: string, to: string, cost: number) {
    const fromCity = (await City.getOne(from)).getData();
    const toCity = (await City.getOne(to)).getData();

    if (
      fromCity &&
      toCity &&
      !(fromCity instanceof Error) &&
      !(toCity instanceof Error)
    ) {
      const db = new Database<Flight>(Flight);
      const flight = new Flight(fromCity, toCity, cost);
      flight.id = id;
      if (await db.save(flight)) {
        //after the update, truncate the plans, so new can be generated
        await Plan.removeAll();
        return new Result<Flight>(flight, 200);
      } else {
        return new Result<Error>(new Error("Could not update the flight"), 500);
      }
    } else {
      return new Result<Error>(
        new Error("Could not create the flight, invalid cities"),
        400
      );
    }
  }

  static async remove(id: string) {
    const db = new Database<Flight>(Flight);
    const flight = await db.findOne({
      where: {
        id,
      },
    });
    if (flight) {
      await Plan.removeAll();
      if (db.remove(flight)) {
        return new Result<boolean>(true, 200);
      }
      return new Result<Error>(new Error("Flight could not be removed"), 500);
    } else {
      return new Result<Error>(new Error("Flight not found"), 404);
    }
  }

  static async removeFlightsForCity(cityId: string) {
    const db = new Database<Flight>(Flight);
    const flights = await db.find({
      where: [{ from: cityId }, { to: cityId }],
    });
    return every(
      await Promise.all(
        flights.map(async (flight) => await Flight.remove(flight.id))
      )
    );
  }

  static async get() {
    const db = new Database<Flight>(Flight);
    const flights = await db.find({}, ["from", "to"]);
    return new Result<Flight[]>(flights, 200);
  }
}
