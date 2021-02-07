import {
  Column,
  Entity,
  getManager,
  Index,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

import Flight from "./flight";
import Plan from "./plan";

import Result from "../model";
import { Database } from "../utils";

@Entity("city")
export default class City {
  @PrimaryColumn()
  id: string;

  @Index({ unique: true })
  @Column({ type: "varchar", nullable: false })
  name: string;

  @OneToMany(() => Flight, (flight) => flight.from)
  flightsFrom!: Flight[];
  @OneToMany(() => Flight, (flight) => flight.to)
  flightsTo!: Flight[];

  @OneToMany(() => Plan, (plan) => plan.from)
  plansFrom!: Plan[];

  @OneToMany(() => Plan, (plan) => plan.to)
  plansTo!: Plan[];

  constructor(name: string) {
    this.id = uuid();
    this.name = name;
  }

  static async get() {
    const db = new Database<City>(City);
    const cities = await db.find({}, [
      "flightsFrom",
      "flightsTo",
      "flightsFrom.from",
      "flightsFrom.to",
    ]);
    return new Result<City[]>(cities, 200);
  }
  static async getOne(id: string) {
    const db = new Database<City>(City);
    const city = await db.findOne({ where: { id } }, [
      "flightsFrom",
      "flightsTo",
      "flightsFrom.from",
      "flightsFrom.to",
    ]);
    if (city) return new Result<City>(city, 200);
    return new Result<Error>(new Error("City not found"), 404);
  }

  static async create(name: string) {
    const db = new Database<City>(City);
    const newCity = new City(name);
    newCity.id = uuid();

    if (await db.save(newCity)) {
      return new Result<City>(newCity, 200);
    } else {
      return new Result<Error>(new Error("Could not create the city"), 500);
    }
  }

  static async update(id: string, name: string) {
    const db = new Database<City>(City);
    const city = new City(name);
    city.id = id;
    if (await db.save(city)) {
      return new Result<City>(city, 200);
    } else {
      return new Result<Error>(new Error("Could not update the city"), 500);
    }
  }

  static async remove(id: string) {
    const db = new Database<City>(City);
    const city = await db.findOne({
      where: {
        id,
      },
    });
    if (city) {
      await Plan.removeAll();
      await Flight.removeFlightsForCity(city.id);
      if (db.remove(city)) {
        return new Result<boolean>(true, 200);
      }
      return new Result<Error>(new Error("City could not be removed"), 500);
    } else {
      return new Result<Error>(new Error("City not found"), 404);
    }
  }

  toJson(): { id: string; name: string } {
    return JSON.parse(JSON.stringify(this));
  }
}
