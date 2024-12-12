const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const Transacao = sequelize.define("Transacao", {
    id_talao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantidade_talao_solicitado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidade_talao_enviado: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    quantidade_talao_recebido: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    data_hora_envio: {
        type: DataTypes.DATE,
        allowNull: true
    },
    data_entrega_prevista: {
        type: DataTypes.DATE,
        allowNull: true
    },
    data_hora_recebimento: {
        type: DataTypes.DATE,
        allowNull: true
    },
    numero_remessa: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_loja: {
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
    tableName: 'transacao',
    schema: 'oferteeganhe',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'update_em'
})


module.exports = Transacao