const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Loja = sequelize.define('Loja', {
    id_loja: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true
    },
    nome_loja: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    cep_loja: {
        type: DataTypes.STRING(255),
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
    tableName: 'loja',
    schema: 'oferteeganhe',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'update_em'
})

module.exports = Loja