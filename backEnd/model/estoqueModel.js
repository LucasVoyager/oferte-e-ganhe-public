const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Estoque = sequelize.define('Estoque', {
    id_estoque: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    id_loja: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade_atual: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade_minima: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade_recomendada: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    criado_em: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }, 
    update_em: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: 'estoque',
    schema: 'oferteeganhe',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'update_em'
})

module.exports = Estoque