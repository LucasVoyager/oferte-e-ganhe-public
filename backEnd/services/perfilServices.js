const { Op } = require('sequelize')
const { Perfil, Permissoes, PermissaoPerfil } = require('../model')
const { verificaPerfil } = require('../utils/validarDados')
const { inserirPermissaoPerfil, deletarPermissaoPerfil, consultarPermissaoDoPerfil } = require('./permissoesServices')

async function inserirPerfil(nome_perfil, permissoes) {
    try {
        const verificaNome = await verificaNomePerfil(nome_perfil)
        
        if (!verificaNome) {
            const novoPerfil = await Perfil.create({
                nome_perfil
            })

            for (const id_permissao of permissoes ) {
                if (!id_permissao) {
                    throw new Error('Permissao nao foi informada, favor verificar.')
                }
                await inserirPermissaoPerfil(novoPerfil.id_perfil, id_permissao)
            }

            return novoPerfil 
        }  
              
    } catch(err) {
        console.error(err)
        throw err
    }
}

async function consultarPerfil() {
    try {
       const perfis = await Perfil.findAll({
        order: ['id_perfil'],
        include: {
                model: Permissoes,
                through: {
                    mode: PermissaoPerfil,
                    atributes: []}
            }
        })
       return perfis
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarPerfil(nome_perfil,id_perfil, permissoes) {
    try {
        await verificaPerfil(id_perfil)
        await Perfil.update({
            nome_perfil
        }, {
            where: {id_perfil}
        })

        const permissoesAtuais = await consultarPermissaoDoPerfil(id_perfil)

        const setPermissoesAtuais = new Set(permissoesAtuais.map(pp => pp.id_permissao))
        const novasPermissoes = new Set(permissoes)

        for (const id_permissao of novasPermissoes) {
            if (!setPermissoesAtuais.has(id_permissao)) {
                await inserirPermissaoPerfil(id_perfil, id_permissao)
            }
        }

        for (const {id_permissao, id_permissao_perfil} of permissoesAtuais) {
            if (!novasPermissoes.has(id_permissao)) {
                await deletarPermissaoPerfil(id_permissao_perfil)
            }
        }

        const perfilEditado = await buscarPerfil(id_perfil)

        return perfilEditado      
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function deletarPerfil(id_perfil) {
    try {
        await verificaPerfil(id_perfil)

        const permissoesAtuais = await consultarPermissaoDoPerfil(id_perfil)
        const idPP = permissoesAtuais.map(p => p.id_permissao_perfil)

        for (let i = 0; i < idPP.length; i++) {
            await deletarPermissaoPerfil(idPP[i])   
        }

        await Perfil.destroy({
            where: {id_perfil}
        })

        return true
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function verificaNomePerfil(nome_perfil) {
    const nomePerfil = await Perfil.findOne({
        where: {nome_perfil}
    })

    if (!nomePerfil) {
        return false
    }

   if (nomePerfil.nome_perfil === nome_perfil) {
        throw new Error('Nome do perfil ja existe')
    }

}

async function buscarTransacoesPorIntervaloPerfil(idInicio, idFim) {
    try {
        const buscarPorIntervalo = Perfil.findAll({
            where: {
                id_perfil: {
                    [Op.between]: [idInicio, idFim]
                }
            }, include: {
                model: Permissoes, 
                    through: {
                        model: PermissaoPerfil,
                        attributes: []
                    }
                }
        })
        return buscarPorIntervalo
    } catch (err) {
        console.error('Erro ao buscar Perfis', err)
        throw err
    }
}

async function buscarPerfil(id_perfil) {
    try {
            const perfil = await Perfil.findOne({
            where: {id_perfil},
            include: {
                model: Permissoes, 
                    through: {
                        model: PermissaoPerfil,
                        attributes: []
                    }
                }
            })

            return perfil
        } catch (err) {
        console.error('erro ao procurar perfil', err)
        throw err
    }
}

module.exports = { buscarPerfil,inserirPerfil, consultarPerfil, editarPerfil, deletarPerfil, buscarTransacoesPorIntervaloPerfil }