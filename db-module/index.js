"use strict";

const setupDatabase = require("./lib/db");
const setupAgentModel = require("./models/agent");
const setupMetricModel = require("./models/metric");
const setupAgent = require("./lib/agent");
const defaults = require("defaults");

module.exports = async function (config) {
  config = defaults(config, {
    dialect: "sqlite",
    pool: {
      max: 10,
      min: 0,
      idle: 10000,
    },
    query: {
      raw: true,
    },
  });

  // Define models and relationships
  const sequelize = setupDatabase(config);
  const AgentModel = setupAgentModel(config);
  const MetricModel = setupMetricModel(config);

  AgentModel.hasMany(MetricModel);
  MetricModel.belongsTo(AgentModel);

  // Try connection with DB
  await sequelize.authenticate();

  // exec sync and force to erase db if setup existe
  if (config.setup) {
    await sequelize.sync({ force: true });
  }

  const Agent = setupAgent(AgentModel);
  const Metric = {};

  return {
    Agent,
    Metric,
  };
};
