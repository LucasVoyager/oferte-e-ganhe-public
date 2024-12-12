const { Op } = require('sequelize')
const Transacao = require('../model/transacaoModel')
const { verificaLoja, verificaUsuarioExiste, verificaTalaoExiste, converterData } = require('../utils/validardados')

async function consultaTalao() {
    try {
        const todasTransacao = await Transacao.findAll(
         {order: ['id_talao']}
        )
        return todasTransacao
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarTalao(quantidade_talao_solicitado,quantidade_talao_enviado, quantidade_talao_recebido, status, data_hora_envio, data_entrega_prevista, data_hora_recebimento, numero_remessa, id_usuario, id_loja, id_talao) {
    try {
        await verificaLoja(id_loja)
        await verificaUsuarioExiste(id_usuario)
        await verificaTalaoExiste(id_talao)

        await Transacao.update({
            quantidade_talao_solicitado, 
            quantidade_talao_recebido,
            quantidade_talao_enviado,
            status, 
            data_hora_envio: converterData(data_hora_envio), 
            data_entrega_prevista: converterData(data_entrega_prevista), 
            data_hora_recebimento: converterData(data_hora_recebimento), 
            numero_remessa, 
            id_usuario, 
            id_loja
        }, {where: {
            id_talao
        }})

        const talaoAtualizado = await Transacao.findOne({
            where: {id_talao}
        })

        return talaoAtualizado
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function buscarTransacoesPorIntervaloLojaManutencao(idInicio, idFim) {
    try {
        const buscarPorIntervalo = Transacao.findAll({
            where: {
                id_loja: {
                    [Op.between]: [idInicio, idFim]
                }
            }
        })
        return buscarPorIntervalo
    } catch (err) {
        console.error('Erro ao buscar Estoques', err)
        throw err
    }
}

async function consultarTalaoEspecifico(id_talao) {
    try {
        const talao = await Transacao.findOne({
            where: {id_talao}
        })

        return talao
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consultarTaloesLoja(id_loja) {
    try {
        const talao = await Transacao.findAll({
            where: {id_loja}
        })
        return talao
    } catch (err) {
        console.error(err)
        throw err
    }
}

module.exports = {consultarTaloesLoja,consultaTalao, editarTalao, buscarTransacoesPorIntervaloLojaManutencao, consultarTalaoEspecifico}
