"use strict";

module.exports = function setupMetric(MetricModel, AgentModel) {
  async function findByAgentUuid(uuid) {
    const condition = {
      attributes: ["type"],
      group: ["type"],
      include: [
        {
          attributes: [],
          model: AgentModel,
          where: {
            uuid,
          },
        },
      ],
      raw: true,
    };
    return MetricModel.findAll(condition);
  }

  async function create(uuid, metric) {
    const agent = await AgentModel.findOne({
      where: { uuid },
    });

    if (agent) {
      // metric.agentId = agent.id
      Object.assign(metric, { agent: agent.id });
      const result = await MetricModel.create(metric);
      return result.toJSON();
    }
  }

  async function findByTypeAgentUuid(type, uuid) {
    const condition = {
      attributes: ["id", "type", "value", "createdAt"],
      where: {
        type,
      },
      limit: 20,
      order: [["createdAt", "DESC"]],
      include: [
        {
          attributes: [],
          model: AgentModel,
          where: {
            uuid,
          },
        },
      ],
      raw: true,
    };
    return MetricModel.findAll(condition);
  }
  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid,
  };
};
