const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Permissoes = sequelize.define('Permissoes', {
    id_permissao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_permissao: {
        type: DataTypes.STRING(55),
        allowNull: false
    },
    descricao: {
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
    tableName: 'permissoes',
    schema: 'oferteeganhe',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'update_em'
})

module.exports = Permissoes