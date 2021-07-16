"use strict";

const debug = require("debug")("iotverse:db:setup");
const db = require("./");

async function setup() {
  const config = {
    database: process.env.DB_NAME || "iotverse",
    username: process.env.DB_USER || "iot_user",
    password: process.env.DB_PASS || "am3r1c41",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: (setUp) => debug(setUp),
    setup: true,
  };
  await db(config).catch(handleFatalError);

  console.log("DB connected!");
  process.exit(0);
}

function handleFatalError(error) {
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}

setup();
