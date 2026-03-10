const express = require("express");
const dotenv = require("dotenv");
import { AppDataSource } from "./data-source";
const cors = require("cors");

dotenv.config({ path: "./src/.env" });
const app = express();
const port = process.env.PORT || 4444;

app.use(express.json());
app.use(cors());

// routes

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    // 1. db inicializálása -> 2. szerver indítása
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
    process.exit(1);
  });
