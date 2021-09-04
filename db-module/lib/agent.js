"use strict";

module.exports = function setupAgent(AgentModel) {
  function findById(id) {
    return AgentModel.findById(id);
  }
  async function createOrUpdate(agent) {
    const condition = {
      where: {
        uuid: agent.uuid,
      },
    };

    const existingAgent = await AgentModel.findOne(condition);

    if (existingAgent) {
      const updated = await AgentModel.update(agent, condition);
      if (updated) {
        return AgentModel.findOne(condition);
      }
      return existingAgent;
    }

    const result = await AgentModel.create(agent);
    return result.toJSON();
  }
  return {
    findById,
    createOrUpdate,
  };
};
