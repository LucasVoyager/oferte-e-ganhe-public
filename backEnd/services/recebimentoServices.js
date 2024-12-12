const { Op } = require("sequelize")
const { Transacao } = require("../model")
const { verificaTalaoExiste, converterData, verificaLoja } = require("../utils/validardados")


async function inserirRecebimentoTalao(quantidade_talao_recebido, status, data_hora_recebimento,id_talao) {
    try {
        await verificaTalaoExiste(id_talao)
        const verificaSeInformado = await verificaSeFoiInformado(id_talao)

        if (!verificaSeInformado) {
            await Transacao.update({
                quantidade_talao_recebido, 
                status, 
                data_hora_recebimento: converterData(data_hora_recebimento)
            }, {where: {id_talao}})
    
            const recebimentoInformado = await Transacao.findOne({
                where: {id_talao}
            })

            return recebimentoInformado
        }  
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarRecebimentoTalao(quantidade_talao_recebido, status, data_hora_recebimento, id_talao) {
    try {
        await verificaTalaoExiste(id_talao)

        await Transacao.update({
            quantidade_talao_recebido, 
            status, 
            data_hora_recebimento: converterData(data_hora_recebimento)
        }, {where: {id_talao}})

        const recebimentoInformado = await Transacao.findOne({
            where: {id_talao}
        })
 

        return recebimentoInformado
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consultarRecebimentoTalao() {
    try {
        const recebimento = await Transacao.findAll({
            order: ['id_talao'],
            attributes: ['id_talao',
                'quantidade_talao_recebido', 
                'status', 
                'data_hora_recebimento','numero_remessa', 
                'id_usuario', 
                'id_loja', 'update_em']
        })
        return recebimento
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consultarRecebimentoLoja(id_loja) {
    try {
        await verificaLoja(id_loja)

        const recebimentoLoja = await Transacao.findAll({
            attributes: ['id_talao',
                'quantidade_talao_recebido', 
                'status', 
                'data_hora_recebimento', 
                'id_usuario', 
                'id_loja', 'numero_remessa', 'update_em'],
            where: {id_loja}
        })

        return recebimentoLoja
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function atualizarRecebimento(quantidade_talao_recebido, status, data_hora_recebimento, id_usuario, id_loja, id_talao) {
    try {
        await verificaTalaoExiste(id_talao)

        const verificaSeInformado = await verificaSeFoiInformado(id_talao)

        if (!verificaSeInformado) {
            await Transacao.update({
                quantidade_talao_recebido, 
                status, 
                data_hora_recebimento: converterData(data_hora_recebimento), 
                id_usuario, 
                id_loja
            }, {where: {id_talao}})
    
            const updateRecebimento = await Transacao.findOne({
                where: {id_talao}
            })
    
            return updateRecebimento
        }
 
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarRecebimentoLoja(quantidade_talao_recebido, status, data_hora_recebimento, id_usuario, id_loja, id_talao) {
    try {
        await verificaTalaoExiste(id_talao)

         await Transacao.update({
            quantidade_talao_recebido, 
            status, 
            data_hora_recebimento: converterData(data_hora_recebimento), 
            id_usuario, 
            id_loja
        }, {where: {id_talao}})

        const updateRecebimento = await Transacao.findOne({
            where: {id_talao}
        })

        return updateRecebimento
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function verificaSeFoiInformado(id_talao) {
    const verificaSeInformado = await Transacao.findOne({
        attributes: ['status'],
        where: {id_talao}
    })

    if (verificaSeInformado.status === 'entregue') {
        throw new Error(`Status entregue para o talao ${id_talao}, nao pode informar novamente, tente editar o recebimento!`)
    }

    return false
}

async function buscarTransacoesPorIntervaloLojasRecebimento(idInicio, idFim) {
    try {
        const buscarPorIntervalo = await Transacao.findAll({
            where: {
                id_loja: {
                    [Op.between]: [idInicio, idFim]
                }
            }
        })
        return buscarPorIntervalo
    } catch (err) {
        console.error('Erro ao buscar transacaoes', err)
        throw err
    }
}

async function buscarTransacaoLojaEspecifica(id_loja) {
    try {
        const buscarTransacao = await Transacao.findAll({
            where: {id_loja}
        })

        return buscarTransacao
    } catch (err) {
        console.error(err)
        throw err
    }
}

module.exports = {buscarTransacaoLojaEspecifica,buscarTransacoesPorIntervaloLojasRecebimento,editarRecebimentoLoja,atualizarRecebimento,consultarRecebimentoLoja,inserirRecebimentoTalao, editarRecebimentoTalao, consultarRecebimentoTalao}