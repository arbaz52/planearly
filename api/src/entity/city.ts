import { Column, Entity, Index, OneToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import Flight from "./flight";
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

  constructor(name: string) {
    this.id = uuid();
    this.name = name;
  }

  static async get() {
    const db = new Database<City>(City);
    const cities = await db.find({}, ["flightsFrom", "flightsTo"]);
    return new Result<City[]>(cities, 200);
  }
  static async getOne(id: string) {
    const db = new Database<City>(City);
    const city = await db.findOne({ where: { id } }, [
      "flightsFrom",
      "flightsTo",
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

  /**
   * TODO: complete
   */
  async update() {
    const db = new Database<City>(City);
    const { id, ...rest } = this.toJson();
  }

  toJson(): { id: string; name: string } {
    return JSON.parse(JSON.stringify(this));
  }
}
