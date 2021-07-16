"use strict";

const debug = require("debug")("iotverse:db:setup");
const inquirer = require("inquirer");
const chalk = require("chalk");
const db = require("./");

const prompt = inquirer.createPromptModule();

async function setup() {
  const answer = await prompt([
    {
      type: "confirm",
      name: "setup",
      message: "This will destroy your database, are you sure?",
    },
  ]);

  if (!answer.setup) {
    return console.log("Nothing happened :)");
  }

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
  console.error(`${chalk.red("[fatal error]")} ${error.message}`);
  console.error(error.stack);
  process.exit(1);
}

setup();
