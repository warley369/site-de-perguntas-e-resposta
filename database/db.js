const Sequelize = require('sequelize');

const conn = new Sequelize('guiaperguntas', 'root', '12345', {
   host: 'localhost',
   dialect: 'mysql'
})

module.exports = conn;