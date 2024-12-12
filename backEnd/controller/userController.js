const jwt = require("jsonwebtoken")
const {consultaUsuarios, inserirUsuario, editarUsuario, deletarUsuario, consultaUsuariosParaAprovacao, aprovarUsuario, criarContaLogin, buscarTransacoesPorIntervaloLojaUsuario, consultarUsuarioEspecifico, buscarUsuariosLoja, buscarUsuariosLojaAprovacao, buscarUsuarioAprovacaoIntervalo} = require('../services/usuarioServices')
const { esquemaUsuario } = require("../utils/validateInputs")

async function consUsuario(req, res) {
    try {
        const usuarios = await consultaUsuarios()
        res.status(201).json({usuarios})
    } catch (err) {
        res.status(500).json({message: 'Erro ao consultar', error: err.message})
    }
}

async function consUsEspecifico(req, res) {
    const {matricula_usuario} = req.params

    try {
        const usuario = await consultarUsuarioEspecifico(matricula_usuario)
        res.status(201).json({usuario})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar', error: err.message})
    }
}

async function criarUsuario(req, res) {
    const {nome, matricula_usuario, email, id_loja, id_perfil} = req.body

    const {error} = esquemaUsuario.validate({nome, matricula_usuario, email, id_loja, id_perfil}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const novoUsuario = await inserirUsuario(nome, matricula_usuario, email,  id_loja, id_perfil)
        res.status(201).json({ message: 'Usuario cadastrado', usuario: novoUsuario})
    } catch (err) {
        res.status(500).json({message: 'Erro ao cadastrar', error: err.message})
    }
}

async function editUsuario(req, res) {
    const {matricula_usuario} = req.params
    const {nome, email, id_loja, id_perfil} = req.body
   

    const {error} = esquemaUsuario.validate({nome, matricula_usuario, email, id_loja, id_perfil}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const usuarioEditado = await editarUsuario(nome, matricula_usuario, email, id_loja, id_perfil)

        if (usuarioEditado) {
            res.status(201).json({message: 'usuario editado com sucesso', usuario: usuarioEditado})
        } else {
            res.status(404).json({message: 'usuario nao encontrado'})
        } 
    } catch (err) {
        res.status(500).json({message: 'erro ao editar usuario', error: err.message})
    }
}

async function delUsuario(req, res) {
    const {matricula_usuario} = req.params

    const {error} = esquemaUsuario.validate({matricula_usuario}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const usuarioDeletado = await deletarUsuario(matricula_usuario)

        if (usuarioDeletado) {
            res.status(200).json({message: "usuario deletado com sucesso", usuario: usuarioDeletado})
        } else {
            res.status(404).json({message: "usuario nao encontrado"})
        }
    } catch (err) {
        res.status(500).json({message: "erro ao deletar usuario", error: err.message})
    }
}

async function criarConta(req, res) {
    const {nome, matricula_usuario, email, senha, id_loja} = req.body

    const {error} = esquemaUsuario.validate({nome, matricula_usuario, email, senha, id_loja}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }
    
    try {
        const novoUsuario = await criarContaLogin(nome, matricula_usuario, email, senha, id_loja)
        res.status(201).json({ message: 'Usuario cadastrado', usuario: novoUsuario})
    } catch (err) {
        res.status(500).json({message: 'Erro ao cadastrar', error: err.message})
    }
}

async function consUsuApro(req, res) {
    try {
        const usuariosAprovacao = await consultaUsuariosParaAprovacao()
        res.status(201).json({message: 'Consulta de usuarios para aprovação, sucesso.', usuarios: usuariosAprovacao})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar', error: err.message})
    }
}

async function aprovUsuario(req, res) {
    const {matricula_usuario} = req.params

    const {error} = esquemaUsuario.validate({matricula_usuario}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const novoUsuarioAprovado = await aprovarUsuario(matricula_usuario)
        if(novoUsuarioAprovado) {
            res.status(201).json({message: 'usuario aprovado com sucesso', usuario: matricula_usuario})
        } else {
            res.status(404).json({message: 'usuario nao encontado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao aprovar usuario', error: err.message})
    }
}

async function bucarPorIntervaloLojaUsar(req,res) {
    let {idInicio, idFim} = req.query
    idInicio = parseInt(idInicio, 10)
    idFim = parseInt(idFim, 10)

    if (isNaN(idInicio) || isNaN(idFim) ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesPorIntervaloLojaUsuario(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, usuarios: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
             
}

async function bucarPorIntervaloLojaUsarAprovacao(req,res) {
    let {idInicio, idFim} = req.query
    idInicio = parseInt(idInicio, 10)
    idFim = parseInt(idFim, 10)

    if (isNaN(idInicio) || isNaN(idFim) ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarUsuarioAprovacaoIntervalo(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, usuarios: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
             
}

async function buscarLojaUser(req, res) {
    const {id_loja} = req.query

    if (isNaN(id_loja)) {
        res.status(400).json({message: 'deve ser um numero valido'})
    }


    try {
        const usuariosLojas = await buscarUsuariosLoja(id_loja)
        if (usuariosLojas) {
            res.status(200).json({usuarios: usuariosLojas})
        } else {
            res.status(404).json({message: 'id_loja filtrado nao foi encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao tentar carregar filtro loja', error: err.message})
    }
}

async function buscarLojaUserAprovacao(req, res) {
    const {id_loja} = req.query

    if (isNaN(id_loja)) {
        res.status(400).json({message: 'deve ser um numero valido'})
    }

    try {
        const usuariosLojas = await buscarUsuariosLojaAprovacao(id_loja)
        if (usuariosLojas) {
            res.status(200).json({usuarios: usuariosLojas})
        } else {
            res.status(404).json({message: 'id_loja filtrado nao foi encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao tentar carregar filtro loja', error: err.message})
    }
}

module.exports = {buscarLojaUserAprovacao,bucarPorIntervaloLojaUsarAprovacao,buscarLojaUser,consUsEspecifico,consUsuario, criarUsuario, editUsuario, delUsuario, criarConta, consUsuApro, aprovUsuario, bucarPorIntervaloLojaUsar}