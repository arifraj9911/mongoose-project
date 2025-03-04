import mongoose from "mongoose";
import config from "./config";
import app from "./app";

import { Server } from "http";

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

// for asynchronour Promise reject handle (unhandleRejection)
process.on("unhandledRejection", () => {
  console.log(`Shutting down server`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// for synchronous handle
process.on("uncaughtException", () => {
  console.log(`Shutting down server uncuaght`);
  process.exit(1);
});
