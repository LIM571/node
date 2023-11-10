const database = require('../db');
const Sequelize = require('sequelize');
const Lutador = database.define('lutadores', {
id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false,
primaryKey: true},
nome: { type: Sequelize.STRING, allowNull: false},
nome_luta: { type: Sequelize.STRING, allowNull: false},
idade:{ type:Sequelize.INTEGER, allowNull: false},
peso: { type: Sequelize.FLOAT, allowNull: false},
imagem: { type: Sequelize.STRING, allowNull: false}

})
module.exports = Lutador;