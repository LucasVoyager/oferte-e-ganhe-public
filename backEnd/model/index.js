const sequelize = require('../config/database');
const Usuario = require('./usuarioModel');
const Perfil = require('./perfilModel');
const Transacao = require('./transacaoModel');
const Permissoes = require('./permissoesModel');
const PermissaoPerfil = require('./permissaoPerfilModel');
const Estoque = require('./estoqueModel');
const Loja = require('./lojasModel');

// Definindo todas as associações entre os modelos
Usuario.belongsTo(Perfil, { foreignKey: 'id_perfil'});
Usuario.belongsTo(Loja, { foreignKey: 'id_loja'});

Perfil.hasMany(Usuario, { foreignKey: 'id_perfil' });
Loja.hasMany(Usuario, { foreignKey: 'id_loja' });

Permissoes.belongsToMany(Perfil, { through: PermissaoPerfil, foreignKey: 'id_permissao' });
Perfil.belongsToMany(Permissoes, { through: PermissaoPerfil, foreignKey: 'id_perfil' });

Transacao.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Transacao.belongsTo(Loja, { foreignKey: 'id_loja' });

Loja.hasMany(Transacao, { foreignKey: 'id_loja' });
Usuario.hasMany(Transacao, { foreignKey: 'id_usuario' });

Estoque.belongsTo(Loja, { foreignKey: 'id_loja' });
Loja.hasMany(Estoque, { foreignKey: 'id_loja' });

module.exports = {
    sequelize,
    Usuario,
    Loja,
    Transacao,
    Perfil,
    PermissaoPerfil,
    Permissoes,
    Estoque
};
