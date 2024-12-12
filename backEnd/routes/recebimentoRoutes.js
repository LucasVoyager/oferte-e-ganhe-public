const express = require('express')
const path = require('path')
const {verificaToken, verificaPermissoes, verificaLojaUsuario, salvaMatricula} = require('../middlewares/authMiddlewares')
const { consRecebimento, criarRecebimento, editRecebimento, consRecebimentoLoja, atualizarRecebimentoLoja, editRecebimentoLoja, bucarPorIntervaloLojaRec, buscarTransacaoLj } = require('../controller/recebimentoController');
const router = express.Router()

// rotas apenas admin
router.get('/api/recebimentoTaloes/consultarTodos',verificaToken, verificaPermissoes(), consRecebimento)

router.patch('/api/recebimentoTaloes/informar/:id_talao',verificaToken, verificaPermissoes(), criarRecebimento)

router.patch('/api/recebimentoTaloes/editar/:id_talao',verificaToken, verificaPermissoes(), editRecebimento)

router.get('/api/recebimentoTaloes/consultarIntervalo', verificaToken, verificaPermissoes(), bucarPorIntervaloLojaRec)

router.get('/api/recebimentoTaloes/consultarLoja', verificaToken, verificaPermissoes(), buscarTransacaoLj)

// rotas para atualizar, consultas, relatorios, edicao
router.get('/api/recebimentoTaloes/consultarRecebimento',verificaToken, verificaPermissoes('CONSULTAS', 'RELATORIOS', 'ATUALIZAR'), verificaLojaUsuario(), salvaMatricula(), consRecebimentoLoja)

router.patch('/api/recebimentoTaloes/atualizarRecebimento/:id_talao',verificaToken, verificaPermissoes('ATUALIZAR'),verificaLojaUsuario(), salvaMatricula(), atualizarRecebimentoLoja)

router.patch('/api/recebimentoTaloes/editarRecebimento/:id_talao',verificaToken, verificaPermissoes('EDICAO'),verificaLojaUsuario(), salvaMatricula(), editRecebimentoLoja)


module.exports = router