const { Permissoes, PermissaoPerfil, Perfil } = require("../model")
const { verificaPerfil, verificaPermissao } = require("../utils/validardados")

async function consultarPermissoes() {
    try {
        const permissoes = await Permissoes.findAll()
        return permissoes
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consultarPermissaoPerfil() {
    try {
        const permissaoPerfilTabela = await PermissaoPerfil.findAll()
        return permissaoPerfilTabela
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function inserirPermissaoPerfil(id_perfil, id_permissao) {
    try {
        await verificaPerfil(id_perfil)
        await verificaPermissao(id_permissao)
        const verPerPerf = await verificaPermissaoPerfil(id_perfil, id_permissao)

        if (!verPerPerf) {
            const novaPermissaoPerfil = await PermissaoPerfil.create({
                id_perfil,
                id_permissao
               })
        
               return novaPermissaoPerfil
        }

    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarPermissaoPerfil(id_perfil, id_permissao, id_permissao_perfil) {
    try {
        await verificaPerfil(id_perfil)
        await verificaPermissao(id_permissao)
        const verPerPerf = await verificaPermissaoPerfil(id_perfil, id_permissao)

        if (!verPerPerf) {
            await PermissaoPerfil.update({
                id_perfil, id_permissao
            }, {where: {id_permissao_perfil}})
    
            const permissaoPerfilAtt = await PermissaoPerfil.findOne({
                where: {id_permissao_perfil}
            })
    
            return permissaoPerfilAtt
        }
        
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function deletarPermissaoPerfil(id_permissao_perfil) {
    try {
        const permissaoPefilADeletar = await PermissaoPerfil.findOne({
            where: {id_permissao_perfil}
        })

        if (!permissaoPefilADeletar) {
            throw new Error('permissao perfil nao encontrada')
        }

        await PermissaoPerfil.destroy({
            where: {id_permissao_perfil}
        })

        return permissaoPefilADeletar
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function verificaPermissaoPerfil(id_perfil, id_permissao) {
    const permissaoPerfilExiste = await PermissaoPerfil.findOne({
        where: {id_perfil, id_permissao}
    })
    
    if (permissaoPerfilExiste) {
        throw new Error(`Já existe a permissao ${id_permissao} para o perfil ${id_perfil}`)
    }

    return false
}

async function consultarPermissaoDoPerfil(id_perfil) {
    try {
        await verificaPerfil(id_perfil)

        const PermissaoEspPerfil = await PermissaoPerfil.findAll({
            where: {id_perfil}
        })

        return PermissaoEspPerfil
    } catch (err) {
        console.error('erro ao consultar perfil', err)
        throw err
    }
}

module.exports = {consultarPermissoes,consultarPermissaoPerfil, inserirPermissaoPerfil, editarPermissaoPerfil, deletarPermissaoPerfil, consultarPermissaoDoPerfil}