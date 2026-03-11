const express = require("express");
const dotenv = require("dotenv");
import { AppDataSource } from "./data-source";
const cors = require("cors");

import teamRoutes from "./routes/team.route";
import driverRoutes from "./routes/driver.route";
import circuitRoutes from "./routes/circuit.routes";
import raceRoutes from "./routes/race.route";
import raceResultRoutes from "./routes/raceresult.route";

import { TeamService } from "./services/team.service";
import { DriverService } from "./services/driver.service";
import { CircuitService } from "./services/circuit.service";
import { RaceService } from "./services/race.service";
import { RaceResultService } from "./services/raceresult.service";

dotenv.config({ path: "./src/.env" });
const app = express();
const port = process.env.PORT || 4444;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
  }),
);

app.get("/api/health", (_req: any, res: any) => {
  res.json({ status: "ok" });
});

app.get("/api/dashboard", async (_req: any, res: any) => {
  try {
    const [teams, drivers, circuits, races, results] = await Promise.all([
      new TeamService().count(),
      new DriverService().count(),
      new CircuitService().count(),
      new RaceService().count(),
      new RaceResultService().count(),
    ]);
    res.json({ teams, drivers, circuits, races, results });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use("/api/teams", teamRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/circuits", circuitRoutes);
app.use("/api/races", raceRoutes);
app.use("/api/results", raceResultRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  })
  .catch((err: any) => {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);
  });
