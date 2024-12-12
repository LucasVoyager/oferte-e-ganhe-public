const express = require('express');
const dotenv = require('dotenv')
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const viewRoutes = require('./routes/viewRoutes.js')
const userRoutes = require('./routes/userRoutes.js');
const loginRoutes = require('./routes/loginRoutes.js')
const lojasRoutes = require('./routes/lojasRoutes.js')
const envioTaloes = require('./routes/envioRoutes.js')
const estoqueTaloes = require('./routes/estoqueRoutes.js')
const manutencaoTaloes = require('./routes/manutencaoRoutes.js')
const recebimentoTaloes = require('./routes/recebimentoRoutes.js')
const perfilRoutes = require('./routes/perfilRoutes.js');
const errorMiddlewares = require('./middlewares/errorMiddlewares.js');

// variaveis de ambiente
dotenv.config()

// start aplicação
const app = express();

// cookie
app.use(cookieParser())

// configurando cors para requisições feita ao backend atraves do cabeçalho
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware que analisa corpos da requesição
app.use(express.json())

// Middleware para servir arquivos estáticos (CSS e JS)
app.use(express.static(path.join(__dirname, '../frontEnd/public')));

// Rotas 
app.use('/', viewRoutes)
app.use('/', userRoutes)
app.use('/', loginRoutes)
app.use('/', lojasRoutes)
app.use('/', envioTaloes)
app.use('/', estoqueTaloes)
app.use('/', manutencaoTaloes)
app.use('/', recebimentoTaloes)
app.use('/', perfilRoutes)

// tratar erro
app.use(errorMiddlewares)

module.exports = app;
