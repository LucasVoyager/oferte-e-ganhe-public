const express = require('express');
const path = require('path');
const { verificaToken, verificaPermissoes, validarSessao } = require('../middlewares/authMiddlewares');
const router = express.Router();

// rota teste de verificação totem
router.get('/api/verificaToken', verificaToken,verificaPermissoes(), (req, res) => {
    res.status(200).json({message: 'Token valido', user: req.user})
})

// todos tem acesso
router.get('/criarConta', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/criarConta.html'));
})

router.get('/enviarEmail', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/enviarEmail.html'));
})

router.get('/esqueciSenha', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/esqueciSenha.html'));
})

router.get('/api/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/loginUsuario.html'));
});

// usuarios - apenas admin
router.get('/usuarios',verificaToken,  verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/user/listaUsuarios.html'));
})

router.get('/editarUsuario', verificaToken, verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/user/editarUsuario.html'));
})

router.get('/criarUsuario', verificaToken, verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/user/cadastroUsuario.html'));
})

router.get('/aprovarUsuario', verificaToken, verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/user/aprovarUsuario.html'));
})

// Perfis - apenas admin
router.get('/perfis', verificaToken, verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/perfil/perfisUsuario.html'));
})

router.get('/editarPerfil', verificaToken, verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/perfil/editarPerfil.html'));
})

router.get('/cadastrarPerfil', verificaToken, verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/perfil/cadastrarPerfil.html'));
})

// lojas apenas admin
router.get('/lojas', verificaToken,verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/loja/loja.html'));
});

router.get('/editarLoja', verificaToken,verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/loja/editarLoja.html'));
});
router.get('/cadastrarLoja', verificaToken,verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/loja/cadastrarLoja.html'));
});

// recebimento: admin, atualizar, consultas, relatorios, edicao
router.get('/recebimentoTaloes', verificaToken, verificaPermissoes('CONSULTAS', 'RELATORIOS', 'EDICAO', 'ATUALIZAR'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/recebimento/recebimento.html'));
})

router.get('/edicaoRecebimento', verificaToken, verificaPermissoes('EDICAO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/recebimento/edicaoRecebimento.html'));
})

router.get('/informarRecebimento', verificaToken, verificaPermissoes('ATUALIZAR', 'EDICAO', 'ATUALIZAR'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/recebimento/informarRecebimento.html'));
})

// envio: admin, solicitações, consultas, relatorios, edicao, criacao
router.get('/envioTaloes', verificaToken, verificaPermissoes('CONSULTAS', 'RELATORIOS', 'EDICAO', 'SOLICITACOES'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/envio/envio.html'));
});

router.get('/editarEnvio', verificaToken, verificaPermissoes('EDICAO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/envio/edicaoEnvio.html'));
});

router.get('/cadastrarEnvio', verificaToken, verificaPermissoes('CRIACAO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/envio/cadastrarEnvio.html'));
});

router.get('/aprovarSolicitacao', verificaToken, verificaPermissoes(), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/envio/aprovarEnvio.html'));
});

router.get('/solicitarEnvio', verificaToken, verificaPermissoes('SOLICITACOES'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/envio/solicitarEnvio.html'));
});


// estoque: admin, atualizar, consultas, relatorios, edicao, criacao
router.get('/estoqueTaloes', verificaToken,verificaPermissoes('ATUALIZAR', 'CONSULTAS', 'RELATORIOS', 'EDICAO', 'CRIACAO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/estoque/estoque.html'));
});

// manutencao: admin e edicao
router.get('/manutencaoTaloes', verificaToken, verificaPermissoes('EDICAO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/manutencao/manutencao.html'));
});

router.get('/edicaoManutencao', verificaToken, verificaPermissoes('EDICAO'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/pages/taloes/manutencao/edicaoManutencao.html'));
});


// todos mas verificando via html
router.get('/indexAdmin', verificaToken, (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontEnd/public/index.html'));
});

module.exports = router;
