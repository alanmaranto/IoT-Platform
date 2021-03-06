"use strict";

const agentFixtures = require("./agent");
const { extend, sortBy } = require("../../utils/extend");

const metric = {
  id: 1,
  agentId: 1,
  type: "CPU",
  value: "18%",
  createdAt: new Date(),
  agent: agentFixtures.byId(1),
};

const metrics = [
  metric,
  extend(metric, { id: 2, value: "25%" }),
  extend(metric, { id: 3, value: "2%" }),
  extend(metric, {
    id: 4,
    agentId: 2,
    type: "Memory",
    value: "33%",
    agent: agentFixtures.byId(2),
  }),
];

function findByAgentUuid(uuid) {
  return metrics
    .filter((m) => (m.agent ? m.agent.uuid === uuid : false))
    .map((m) => {
      const clone = Object.assign({}, m);

      delete clone.agent;

      return clone;
    });
}

function findByTypeAgentUuid(type, uuid) {
  return metrics
    .filter(
      (metric) =>
        metric.type === type &&
        (metric.agent ? metric.agent.uuid === uuid : false)
    )
    .map((metric) => {
      const clone = Object.assign({}, metric);

      delete clone.agentId;
      delete clone.agent;

      return clone;
    })
    .sort(sortBy("createdAt"))
    .reverse();
}

module.exports = {
  all: metrics,
  findByAgentUuid,
  findByTypeAgentUuid,
};
