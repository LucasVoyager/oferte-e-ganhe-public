const express = require('express')
const path = require('path')
const {verificaToken, verificaPermissoes} = require('../middlewares/authMiddlewares')
const router = express.Router()
const { delUsuario, editUsuario, criarUsuario, consUsuario, criarConta, aprovUsuario, consUsuApro, consUsEspecifico, bucarPorIntervaloLojaUsar, buscarLojaUser, bucarPorIntervaloLojaUsarAprovacao, buscarLojaUserAprovacao } = require('../controller/userController');

// todos
router.get('/api/usuarios/criarconta', verificaToken, criarUsuario)

router.get('/api/usuarios/consultarEspecifico/:matricula_usuario', verificaToken, consUsEspecifico)

// apenas admin consultara todos usuarios
router.get('/api/usuarios/consultarTodos',verificaToken,verificaPermissoes(), consUsuario)

router.get('/api/usuarios/consultarIntervalo',verificaToken,verificaPermissoes(), bucarPorIntervaloLojaUsar)

router.get('/api/usuarios/consultarIntervaloLoja',verificaToken,verificaPermissoes(), buscarLojaUser)

router.get('/api/usuarios/aprovarUsuarios/consultarIntervalo',verificaToken,verificaPermissoes(), bucarPorIntervaloLojaUsarAprovacao)

router.get('/api/usuarios/aprovarUsuarios/consultarIntervaloLoja',verificaToken,verificaPermissoes(), buscarLojaUserAprovacao)


// tela de criar usuario dentro da gestao de usuarios, apenas admin
router.post('/api/usuarios/register',verificaToken,verificaPermissoes(), criarUsuario)

// editar usuario dentro de gestao, apenas admin
router.put('/api/usuarios/editar/:matricula_usuario',verificaToken,verificaPermissoes(), editUsuario)

// deletar usuario apenas admin dentro de gestao
router.delete('/api/usuarios/deletar/:matricula_usuario',verificaToken,verificaPermissoes(), delUsuario)

// consultar usuarios para aprovação apenas admin
router.get('/api/usuarios/consultarUsuariosAprovacao',verificaToken,verificaPermissoes(), consUsuApro)

// aprovar usuarios que foram criados na tela de login apenas admin
router.put('/api/usuarios/aprovarUsuarios/:matricula_usuario',verificaToken,verificaPermissoes(), aprovUsuario)

// todos com acesso a rota de usuarios que realizaram cadastro via tela de criar conta
router.post('/api/login/criarConta', criarConta)

module.exports = router
