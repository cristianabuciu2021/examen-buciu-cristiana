const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');

const Spacecraft = sequelize.define(
    'spacecraft',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 200]
            }
        },
        maxSpeed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1000
            }
        },
        weight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 200
            }
        }
    }
);

module.exports = Spacecraft;