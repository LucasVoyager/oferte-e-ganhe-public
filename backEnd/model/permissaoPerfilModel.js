const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')

const PermissaoPerfil = sequelize.define('PermissaoPerfil', {
    id_permissao_perfil: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_permissao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_perfil: {
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
    schema: 'oferteeganhe',
    tableName: 'permissao_perfil', 
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'update_em'
})



module.exports = PermissaoPerfil