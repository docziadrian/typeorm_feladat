import "reflect-metadata";
const dotenv = require("dotenv");
import { DataSource } from "typeorm";
import { Team } from "./entities/entities/Team";
import { Driver } from "./entities/entities/Driver";
import { Race } from "./entities/entities/Race";
import { RaceResult } from "./entities/entities/RaceResult";
import { Circuit } from "./entities/entities/Circuit";

dotenv.config({ path: "./src/.env" });

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DBHOST || "localhost",
  port: parseInt(process.env.DBPORT || "3306"),
  username: process.env.DBUSER || "root",
  password: process.env.DBPASS || "",
  database: process.env.DBNAME || "test",
  synchronize: true,
  logging: false,
  entities: [Team, Driver, Race, RaceResult, Circuit],
});
