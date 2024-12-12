const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres', 
    process.env.DB_USER || 'postgres', 
    process.env.DB_PASSWORD || 'postgres', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false
})

 const conexao = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão bem-sucedida.');
        
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados com sucesso.');
    } catch (error) {
        console.error('Erro durante a conexão ou sincronização:', error);
    }
}

conexao()

module.exports = sequelize
