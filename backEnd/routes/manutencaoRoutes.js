const express = require('express')
const path = require('path')
const {verificaToken, verificaPermissoes} = require('../middlewares/authMiddlewares')
const { consManutencao, editManutencao, bucarPorIntervaloLojaMant, consTalaoEsp, consLojaTransacoes } = require('../controller/manutencaoController')
const router = express.Router()

// 
router.get('/api/manutencaoTaloes/consultarEspecifico/:id_talao',verificaToken,verificaPermissoes('ATUALIZAR', 'CONSULTAS', 'EDICAO'), consTalaoEsp)

// apenas admin e edicao fara manutenção nos talões
router.get('/api/manutencaoTaloes/consultarTodos',verificaToken,verificaPermissoes('EDICAO'), consManutencao)

router.put('/api/manutencaoTaloes/editar/:id_talao',verificaToken,verificaPermissoes('EDICAO'),  editManutencao)

router.get('/api/manutencaoTaloes/consultarIntervalo',verificaToken,verificaPermissoes('EDICAO'), bucarPorIntervaloLojaMant)

router.get('/api/manutencaoTaloes/consultarPorLoja',verificaToken,verificaPermissoes('EDICAO'), consLojaTransacoes)

module.exports = router