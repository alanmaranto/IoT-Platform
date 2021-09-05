"use strict";

const test = require("ava");
const proxyquire = require("proxyquire");
const sinon = require("sinon");

const agentFixtures = require("./fixtures/agent");

let config = {
  logging: function () {},
};

let MetricStub = {
  belongsTo: sinon.spy(),
};

let single = Object.assign({}, agentFixtures.single);
let id = 1;
let uuid = "yyy-yyy-yyy";
let AgentStub = null;
let db = null;
let sandbox = null;

let uuidArgs = {
  where: {
    uuid,
  },
};

let usernameArgs = {
  where: {
    username: "murket",
    connected: true,
  },
};

let connectedArgs = {
  where: {
    connected: true,
  },
};

let newAgent = {
  uuid: "234-234-234",
  name: "test",
  username: "alan",
  hostname: "alan",
  pid: 0,
  connected: false,
};

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  AgentStub = {
    hasMany: sinon.spy(),
  };

  //Model find one Stub
  AgentStub.findOne = sandbox.stub();
  AgentStub.findOne
    .withArgs(uuidArgs)
    .returns(Promise.resolve(agentFixtures.byUuid(uuid)));

  // Model find All
  AgentStub.findAll = sandbox.stub();
  AgentStub.findAll.withArgs().returns(Promise.resolve(agentFixtures.all));
  AgentStub.findAll
    .withArgs(connectedArgs)
    .returns(Promise.resolve(agentFixtures.connected));
  AgentStub.findAll
    .withArgs(usernameArgs)
    .returns(Promise.resolve(agentFixtures.murket));

  // Model create stub
  AgentStub.create = sandbox.stub();
  AgentStub.create.withArgs(newAgent).returns(
    Promise.resolve({
      toJSON() {
        return newAgent;
      },
    })
  );

  // Model update Stub
  AgentStub.update = sandbox.stub();
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single));

  // Model findByID Stub
  AgentStub.findById = sandbox.stub();
  AgentStub.findById
    .withArgs(id)
    .returns(Promise.resolve(agentFixtures.byId(id)));

  const setupDatabase = proxyquire("../", {
    "./models/agent": () => AgentStub,
    "./models/metric": () => MetricStub,
  });
  db = await setupDatabase(config);
});

test.afterEach((t) => {
  sandbox && sandbox.restore();
});

test("Agent", (t) => {
  t.truthy(db.Agent, "Agent service should exists");
});

test.serial("Setup", (t) => {
  t.true(AgentStub.hasMany.called, "AgentModel.hasMany was executed");
  t.true(
    AgentStub.hasMany.calledWith(MetricStub),
    "Argument should be the Metric model"
  );
  t.true(MetricStub.belongsTo.called, "MetricModel.belongsTo was executed");
  t.true(
    MetricStub.belongsTo.calledWith(AgentStub),
    "Argument should be the Agent model"
  );
});

test.serial("AgentFindById", async (t) => {
  let agent = await db.Agent.findById(id);

  t.true(AgentStub.findById.called, "findById should be called on a model");
  t.true(AgentStub.findById.calledOnce, "findById should be called once");
  t.true(
    AgentStub.findById.calledWith(id),
    "findById should be called with specified id"
  );

  t.deepEqual(agent, agentFixtures.byId(id), "should be the same");
});

test.serial("Agent#createOrUpdate - when user exists", async (t) => {
  let agent = await db.Agent.createOrUpdate(single);

  t.true(AgentStub.findOne.called, "findOne should be called on model");
  t.true(AgentStub.findOne.calledTwice, "findOne should be called twice");
  t.true(AgentStub.update.calledOnce, "update should be called once");

  t.deepEqual(agent, single, "agent should be the same");
});

test.serial("Agent#createOrUpdate - new ", async (t) => {
  let agent = await db.Agent.createOrUpdate(newAgent);

  t.true(AgentStub.findOne.called, "should be called");
  t.true(AgentStub.findOne.calledOnce, "should be called once");
  t.true(
    AgentStub.findOne.calledWith({
      where: {
        uuid: newAgent.uuid,
      },
    }),
    "should be called with uuid args"
  );
  t.true(AgentStub.create.called, "should be called on model");
  t.true(AgentStub.create.calledOnce, "should be called once");
  t.true(AgentStub.create.calledWith(newAgent), "create should be called");

  t.deepEqual(agent, newAgent, "agent should be the same");
});

test.serial("Agent#findByUuid", async (t) => {
  let agents = await db.Agent.findByUuid(uuid);

  t.true(AgentStub.findOne.called, "should be called on model");
  t.true(AgentStub.findOne.calledOnce, "should be called once");
  t.true(
    AgentStub.findOne.calledWith(uuidArgs),
    "should be called with uuid args"
  );

  t.deepEqual(agents, agentFixtures.byUuid(uuid), "agents should be the same");
});

test.serial("Agent#findByUsername", async (t) => {
  let agents = await db.Agent.findByUsername("murket");

  t.true(AgentStub.findAll.called, "should be called on model");
  t.true(AgentStub.findAll.calledOnce, "should be called once");
  t.true(
    AgentStub.findAll.calledWith(usernameArgs),
    "should be called with username args"
  );

  t.is(
    agents.length,
    agentFixtures.murket.length,
    "agents should be the same amount"
  );
  t.deepEqual(agents, agentFixtures.murket, "agents should be the same");
});

test.serial("Agent#findConnected", async (t) => {
  let agents = await db.Agent.findConnected();

  t.true(AgentStub.findAll.called, "should be called on model");
  t.true(AgentStub.findAll.calledOnce, "should be called once");
  t.true(
    AgentStub.findAll.calledWith(connectedArgs),
    "should be called with connectedArgs"
  );

  t.is(
    agents.length,
    agentFixtures.connected.length,
    "agents should be the same"
  );
  t.deepEqual(agents, agentFixtures.connected, "agents should be the same");
});

test.serial("Agent#findAll", async (t) => {
  let agents = await db.Agent.findAll();

  t.true(AgentStub.findAll.called, "should be called on model");
  t.true(AgentStub.findAll.calledOnce, "should be called once");
  t.true(AgentStub.findAll.calledWith(), "should be called without args");

  t.is(
    agents.length,
    agentFixtures.all.length,
    "agents should be the same amount"
  );
  t.deepEqual(agents, agentFixtures.all, "agents should be the same");
});
