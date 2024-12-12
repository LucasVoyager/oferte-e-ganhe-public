const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Usuario = sequelize.define('Usuario', {
    matricula_usuario: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    id_loja: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    criado_por: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sessao_usuario: {
        type: DataTypes.JSON,
        allowNull: true
    },
    token_senha_resetar: {
        type: DataTypes.STRING(255),
        allowNull: true
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
    tableName: 'usuario',
    schema: 'oferteeganhe',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'update_em'
})

module.exports = Usuario
