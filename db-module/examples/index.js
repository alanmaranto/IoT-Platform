"use strict";

const db = require("../");

async function run() {
  const config = {
    database: process.env.DB_NAME || "iotverse",
    username: process.env.DB_USER || "iot_user",
    password: process.env.DB_PASSWORD || "am3r1c41",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  };

  const { Agent, Metric } = await db(config).catch(handleFatalError);

  const agent = await Agent.createOrUpdate({
    uuid: "xxx",
    name: "test",
    username: "test",
    hostname: "test",
    pid: 1,
    connected: true,
  }).catch(handleFatalError);
  console.log("--agent--", agent);

  const agents = await Agent.findAll().catch(handleFatalError);
  console.log("agents", agents);

  const metrics = await Metric.findByAgentUuid(agent.uuid).catch(
    handleFatalError
  );
  console.log("metrics", metrics);

  const metric = await Metric.create(agent.uuid, {
    type: "CPU",
    value: "300",
  }).catch(handleFatalError);

  console.log("metric", metric);

  const metricsByType = await Metric.findByTypeAgentUuid(
    "memory",
    agent.uuid
  ).catch(handleFatalError);

  console.log("metrics with type", metricsByType);
}

function handleFatalError(err) {
  console.error(err.message);
  console.error(err.stack);
  process.exit(1);
}

run();
