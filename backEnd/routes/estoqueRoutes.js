const express = require('express');
const path = require('path');
const { consEstoque, criarEstoque, editEstoque, delEstoque, consultarEstoqueUsuario, editEstoqueAtual, atualizarMinRec, bucarPorIntervaloLojaEstoque, buscarEstLoj, consEstoqueEspec } = require('../controller/estoqueController');
const { verificaToken, verificaPermissoes, verificaLojaUsuario, salvaMatricula } = require('../middlewares/authMiddlewares');
const router = express.Router();

// admin, atualizar, consultar, relatorios, criacao
// Rotas apenas para admin

router.get('/api/estoqueTaloes/consultarTodos', verificaToken, verificaPermissoes(), consEstoque)

router.get('/api/estoqueTaloes/consultarEstoqueEspecifico/:id_estoque', verificaToken, verificaPermissoes(), consEstoqueEspec)

router.post('/api/estoqueTaloes/cadastrar',verificaToken, verificaPermissoes(), criarEstoque)

router.put('/api/estoqueTaloes/editar/:id_estoque',verificaToken, verificaPermissoes(), editEstoque)

router.delete('/api/estoqueTaloes/deletar/:id_estoque',verificaToken, verificaPermissoes(), delEstoque)

router.patch('/api/estoqueTaloes/atualizarRecMin', verificaToken, verificaPermissoes(), atualizarMinRec)

router.get('/api/estoqueTaloes/consultarIntervalo', verificaToken, verificaPermissoes(), bucarPorIntervaloLojaEstoque)

router.get('/api/estoqueTaloes/consultarLojaEstoque', verificaToken, verificaPermissoes(), buscarEstLoj)

// rotas para atualizar, consultar, relatorios e criacao que aparecerá, dependendo da loja do individuo
router.get('/api/estoqueTaloes/consultarLojaUsuario', verificaToken, verificaPermissoes('CONSULTAS', 'RELATORIOS','ATUALIZAR' ),verificaLojaUsuario(), consultarEstoqueUsuario)

router.patch('/api/estoqueTaloes/editarEstoqueUsuario', verificaToken, verificaPermissoes('ATUALIZAR', 'CONSULTAS', 'RELATORIOS'), verificaLojaUsuario(),salvaMatricula(), editEstoqueAtual)

module.exports = router;