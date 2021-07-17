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
let AgentStub = null;
let db = null;
let sandbox = null;

test.beforeEach(async () => {
  sandbox = sinon.createSandbox();
  AgentStub = {
    hasMany: sinon.spy(),
  };

  // Model findByID Stub
  AgentStub.findById = sinon.stub();
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

  t.true(AgentStub.findById.called, 'findById should be called on a model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with specified id')

  t.deepEqual(agent, agentFixtures.byId(id), "should be the same");
});
