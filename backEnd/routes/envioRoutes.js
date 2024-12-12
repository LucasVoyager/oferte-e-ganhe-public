const express = require('express')
const path = require('path')
const {verificaToken, verificaPermissoes, verificaLojaUsuario, salvaMatricula} = require('../middlewares/authMiddlewares')
const { consEnvio, criarEnvio, editEnvio, delEnvio, consEnvioLoja, solicitacaoEnvioLoja, aprovEnvioAd, bucarPorIntervaloLoj, buscarIntLoja } = require('../controller/envioController');
const router = express.Router()

// apenas admin
router.get('/api/envioTaloes/consultarTodos',verificaToken, verificaPermissoes(),consEnvio)

router.post('/api/envioTaloes/cadastrar',verificaToken, verificaPermissoes('CRIACAO'), criarEnvio)

router.patch('/api/envioTaloes/editar/:id_talao',verificaToken, verificaPermissoes('EDICAO'), editEnvio)

router.patch('/api/envioTaloes/aprovarSolicitacao/:id_talao',verificaToken, verificaPermissoes(), aprovEnvioAd)

router.delete('/api/envioTaloes/deletar/:id_talao',verificaToken, verificaPermissoes(), delEnvio)

router.get('/api/envioTaloes/consultarIntervalo', verificaToken, verificaPermissoes(), bucarPorIntervaloLoj)

router.get('/api/envioTaloes/consultarLojaIntervalo', verificaToken, verificaPermissoes(), buscarIntLoja)

// SOLICITACOES, CONSULTAS, RELATORIOS, CRIACAO
router.get('/api/envioTaloes/consultarEnvioLoja',verificaToken, verificaPermissoes('CONSULTAS', 'RELATORIOS', 'SOLICITACOES', 'CRIACAO'), verificaLojaUsuario(), consEnvioLoja)

router.post('/api/envioTaloes/solicitacaoEnvioLoja',verificaToken, verificaPermissoes('SOLICITACOES', 'CRIACAO'),verificaLojaUsuario(), salvaMatricula(), solicitacaoEnvioLoja)



module.exports = router