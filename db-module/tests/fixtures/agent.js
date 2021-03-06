"use strict";

const { extend } = require("../../utils/extend");

const agent = {
  id: 1,
  uuid: "yyy-yyy-yyy",
  name: "fixture",
  username: "murket",
  hostname: "test-host",
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const agents = [
  agent,
  extend(agent, {
    id: 2,
    uuid: "yyy-yyy-yyw",
    connected: false,
    username: "test",
  }),
  extend(agent, {
    id: 3,
    uuid: "yyy-yyy-yyx",
  }),
  extend(agent, {
    id: 4,
    uuid: "yyy-yyy-yyz",
    username: "test",
  }),
];

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter((agent) => agent.connected),
  murket: agents.filter((agent) => agent.username === "murket"),
  byUuid: (id) => agents.filter((agent) => agent.uuid === id).shift(),
  byId: (id) => agents.filter((agent) => agent.id === id).shift(),
};
