const express = require('express')
const path = require('path')
const {buscarPerfilEspecifico,consPerfil, consPermPerf, criarPerfil,  editPerfil,  delPerfil, consPermissoes, criarPermissaoPerfil, editPermissaoPerfil, delPermissaoPerfil, buscarPorIntervaloPerf, consultaPerPerfilEsp } = require('../controller/perfilController')
const { verificaToken, verificaPermissoes } = require('../middlewares/authMiddlewares')
const router = express.Router()

// apenas admin com acesso a criação, edição e exclusão de perfis
router.get('/api/perfis/consultarTodos',verificaToken,verificaPermissoes(), consPerfil)

router.get('/api/perfis/consultarIntervalo',verificaToken,verificaPermissoes(), buscarPorIntervaloPerf)

router.get('/api/perfis/consultarPerfil',verificaToken,verificaPermissoes(), buscarPerfilEspecifico)

router.get('/api/perfis/consultarIntervaloPermissoesPerfil',verificaToken,verificaPermissoes(), consultaPerPerfilEsp)

router.get('/api/perfis/consultarPermissoes',verificaToken,verificaPermissoes(), consPermissoes)

router.get('/api/perfis/consultarPermissaoPerfil',verificaToken,verificaPermissoes(), consPermPerf)

router.post('/api/perfis/cadastrar',verificaToken,verificaPermissoes(), criarPerfil)

router.put('/api/perfis/editar/:id_perfil',verificaToken,verificaPermissoes(), editPerfil) 

router.post('/api/perfis/cadastrarPermissao',verificaToken,verificaPermissoes(), criarPermissaoPerfil)

router.put('/api/perfis/editarPermissao/:id_permissao_perfil',verificaToken,verificaPermissoes(), editPermissaoPerfil)

router.delete('/api/perfis/deletar/:id_perfil',verificaToken,verificaPermissoes(), delPerfil) 

router.delete('/api/perfis/deletarPermissao/:id_permissao_perfil',verificaToken,verificaPermissoes(), delPermissaoPerfil)



module.exports = router