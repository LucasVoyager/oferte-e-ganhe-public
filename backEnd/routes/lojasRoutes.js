const express = require('express')
const { criarLoja, editLoja, deletLoja, consultLoja, buscarPorIntervaloLojaLj, buscarPorLojaEspecifica } = require('../controller/lojasController');
const { verificaToken, verificaPermissoes } = require('../middlewares/authMiddlewares');
const router = express.Router()

// apenas admin com acesso a lojas
router.get('/api/lojas/consultarTodas', verificaToken, verificaPermissoes(), consultLoja)

router.post('/api/lojas/cadastrar',verificaToken, verificaPermissoes(), criarLoja)

router.put('/api/lojas/editar/:id_loja',verificaToken, verificaPermissoes(), editLoja)

router.delete('/api/lojas/deletar/:id_loja',verificaToken, verificaPermissoes(), deletLoja) 

router.get('/api/lojas/consultarLoja', verificaToken, verificaPermissoes(), buscarPorLojaEspecifica)

router.get('/api/lojas/consultarIntervalo', verificaToken, verificaPermissoes(), buscarPorIntervaloLojaLj)

module.exports = router