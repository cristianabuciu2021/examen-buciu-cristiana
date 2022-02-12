const sequelize = require('../sequelize');
const { DataTypes } = require('sequelize');



const Astronaut = sequelize.define(
    'astronaut',
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
                len: [5, 200]
            }
        },
        role: {
            type: DataTypes.STRING,
            validate:{ 
                isIn: [['COMMANDER','PILOT','ENGINEER']]},
            allowNull: false
            
        }
    }
);

module.exports = Astronaut;