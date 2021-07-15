'use strict'

const Sequelize = require('sequelize')
let sequelize = null

// Using Singleton Pattern

module.exports = function setupDatabase (config) {
  if (!sequelize) {
    sequelize = new Sequelize(config)
  }
  return sequelize
}
