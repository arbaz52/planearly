import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import Result from "../model";
import { IContext } from "../types";
import { Database } from "../utils";
import Login from "./login";

@Entity("admin")
export default class Admin {
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
    const db = new Database<Admin>(Admin);
    const newAdmin = new Admin(email, password, fullName);
    newAdmin.id = uuid();

    const admin = await db.findOne({
      where: { email },
    });
    if (admin) {
      return new Result<Admin>(new Error("Email already in use"), 400);
    }

    if (await db.save(newAdmin)) {
      return new Result<Admin>(newAdmin, 200);
    } else {
      return new Result<Error>(new Error("Account could not be created!"), 500);
    }
  }

  static async login(email: string, password: string) {
    const db = new Database<Admin>(Admin);
    const admin = await db.findOne({
      where: { email },
    });
    if (admin) {
      if (admin.password === password) {
        const _login = new Login(admin, true);
        return new Result<Login>(_login, 200);
      } else {
        return new Result<Error>(new Error("Incorrect password!"), 400);
      }
    } else {
      return new Result<Error>(new Error("Admin not found!"), 404);
    }
  }

  static async get() {
    const db = new Database<Admin>(Admin);
    const admins = await db.find({});
    return new Result<Admin[]>(admins, 200);
  }
}
