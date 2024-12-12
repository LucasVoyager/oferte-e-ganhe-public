const { Perfil, Permissoes, Transacao } = require('../model')
const Loja = require('../model/lojasModel')
const Usuario = require('../model/usuarioModel')

async function verificaLoja(id_loja) {
    const loja = await Loja.findOne({
        where: {id_loja}
    })
    if (!loja) {
        throw new Error('Loja nao existe')
    }
    return loja
}

async function verificaPerfil(id_perfil) {
    const perfil = await Perfil.findOne({
        where: {id_perfil}
    })

    if (!perfil) {
        throw new Error('Perfil nao existe')
    }

    return perfil
}

async function verificaEmail(email) {
    const usuarioEmail = await Usuario.findOne({
        where: {email}
    })

    if(usuarioEmail) {
        throw new Error('email ja existe, favor adicionar outro.')
    }

    return false

}

async function verificaMatricula(matricula_usuario) {
    const matUsuario = await Usuario.findOne({
        where: {matricula_usuario}
    })

    if (matUsuario) {
        throw new Error('Usuario ja foi cadastrado, favor checar.')
    }

    return false
}

async function verificaPermissao(id_permissao) {
    const permisaoExiste = Permissoes.findOne({
        where: {id_permissao}
    })

    if (!permisaoExiste) {
        throw new Error("id permissao informada nao existe")
    }

    return permisaoExiste
}

async function verificaUsuarioExiste(matricula_usuario) {
    const matUsuario = await Usuario.findOne({
        where: {matricula_usuario}
    })

    if (!matUsuario) {
        throw new Error('Usuario informado nao existe')
    }

    return matUsuario
}

function converterData(data) {
    const partes = data.split('/')
    const dia = partes[0]
    const mes = partes[1]
    const ano = partes[2]
    return `${ano}-${mes}-${dia}`
}

async function verificaTalaoExiste(id_talao) {
    const idTalaoExiste = await Transacao.findOne({
        where: {id_talao}
    })

    if (!idTalaoExiste) {
        throw new Error('talao nao existe')
    }

    return idTalaoExiste
}

module.exports = {
    verificaLoja,
    verificaPerfil,
    verificaEmail,
    verificaMatricula,
    verificaPermissao,
    verificaUsuarioExiste,
    converterData,
    verificaTalaoExiste
}