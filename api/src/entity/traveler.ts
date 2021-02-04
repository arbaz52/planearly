import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import Result from "../model";
import { Database } from "../utils";
import Login from "./login";

@Entity("traveler")
export default class Traveler {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false, type: "varchar" })
  fullName: string;

  @Index({ unique: true })
  @Column({ nullable: false, type: "varchar" })
  email: string;

  @Column({ nullable: false, type: "varchar" })
  password: string;

  constructor(email: string, password: string, fullName: string) {
    this.id = "";
    this.email = email;
    this.password = password;
    this.fullName = fullName;
  }

  static async register(email: string, password: string, fullName: string) {
    const db = new Database<Traveler>(Traveler);
    const newTraveler = new Traveler(email, password, fullName);
    newTraveler.id = uuid();

    const traveler = await db.findOne({
      where: { email },
    });
    if (traveler) {
      return new Result<Traveler>(new Error("Email already in use"), 400);
    }

    if (await db.save(newTraveler)) {
      return new Result<Traveler>(newTraveler, 200);
    } else {
      return new Result<Traveler>(
        new Error("Account could not be created!"),
        500
      );
    }
  }

  static async login(email: string, password: string) {
    const db = new Database<Traveler>(Traveler);
    const traveler = await db.findOne({
      where: { email },
    });
    if (traveler) {
      if (traveler.password === password) {
        const _login = new Login<Traveler>(traveler);
        return new Result<Login<Traveler>>(_login, 200);
      } else {
        return new Result<Traveler>(new Error("Incorrect password!"), 400);
      }
    } else {
      return new Result<Traveler>(new Error("Traveler not found!"), 404);
    }
  }

  static async get() {
    const db = new Database<Traveler>(Traveler);
    const travelers = await db.find({});
    return new Result<Traveler[]>(travelers, 200);
  }
}
