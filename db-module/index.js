"use strict";

const setupDatabase = require("./lib/db");
const setupAgentModel = require("./models/agent");
const setupMetricModel = require("./models/metric");

module.exports = async function (config) {
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
    await sequelize.sync({ force: true})
  }

  const Agent = {};
  const Metric = {};

  return {
    Agent,
    Metric,
  };
};
