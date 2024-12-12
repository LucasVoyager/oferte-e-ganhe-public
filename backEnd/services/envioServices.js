const { Op } = require("sequelize")
const { Transacao } = require("../model")
const { verificaLoja, verificaUsuarioExiste, converterData, verificaTalaoExiste, verificaMatricula } = require("../utils/validardados")

async function inserirEnvioTalão(quantidade_talao_solicitado, quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja) { 
    try {
        await verificaLoja(id_loja)
        await verificaUsuarioExiste(id_usuario)
        
        const novoTalao = await Transacao.create({
            quantidade_talao_solicitado, 
            quantidade_talao_enviado, 
            status, 
            data_hora_envio: converterData(data_hora_envio),
            data_entrega_prevista: converterData(data_entrega_prevista), 
            numero_remessa, 
            id_usuario,
            id_loja
        })
        return novoTalao
    } catch(err) {
        console.error(err)
        throw err
    }
}

async function consultarEnvioTalao() {
    try {
        const envio = await Transacao.findAll({
            order: ['id_talao'],
           attributes: [ 'id_talao',
            'quantidade_talao_solicitado',
            'quantidade_talao_enviado',
            'status',
            'data_hora_envio', 
            'data_entrega_prevista',
            'numero_remessa', 
            'id_usuario', 
            'id_loja',
            'criado_em']
        })

        return envio
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarEnvioTalao(quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja, id_talao) {
    try {
        await verificaTalaoExiste(id_talao)
        await verificaLoja(id_loja)
        await verificaUsuarioExiste(id_usuario)

        await Transacao.update({            
            quantidade_talao_enviado, 
            status, 
            data_hora_envio: converterData(data_hora_envio), 
            data_entrega_prevista: converterData(data_entrega_prevista), 
            numero_remessa, 
            id_usuario, 
            id_loja
        }, {where: { id_talao}})

        const talaoEnvioAlterado = await Transacao.findOne({
            attributes: [ 
                'quantidade_talao_enviado', 
                'status', 'data_hora_envio', 
                'data_entrega_prevista', 
                'numero_remessa', 
                'id_usuario', 
                'id_loja', 'id_talao'],
            where: {id_talao}
        })

        return talaoEnvioAlterado
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function deletarEnvioTalao(id_talao) {
    try {
        const idTalaoExclusao = await Transacao.findOne({
            where: {id_talao}
        })

       await verificaTalaoExiste(id_talao)

        await Transacao.destroy(
            {where: {id_talao}}
        )

        return idTalaoExclusao
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consEnvioUsuario(id_loja) {
    try {
        await verificaLoja(id_loja)

        const idLojaTransacao = await Transacao.findOne({
            where: {id_loja}
        })

        if (!idLojaTransacao) {
            throw new Error('id_loja do usuario nao possui taloes enviados, solicitados ou recebidos')
        }

        const talaoLoja = await Transacao.findAll({
            attributes: ['id_talao',
            'quantidade_talao_solicitado',
            'quantidade_talao_enviado',
            'status',
            'data_hora_envio', 
            'data_entrega_prevista',
            'numero_remessa', 
            'id_usuario', 
            'id_loja',
            'criado_em'],
            where: {id_loja}
        })

        return talaoLoja
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function solicitacaoEnvio(quantidade_talao_solicitado, id_usuario, id_loja) {
    try {
        await verificaLoja(id_loja)
        await verificaUsuarioExiste(id_usuario)

        const solicitacaoTalao = await Transacao.create({
            quantidade_talao_solicitado, status: 'solicitado', id_usuario, id_loja
        })

        return solicitacaoTalao
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function aprovarEnvio(id_talao) {
    try {
        await verificaTalaoExiste(id_talao)

        await Transacao.update({   
            status: 'aprovado'   
        }, {where: {id_talao}}) 

        const talaoAposUpdate = await Transacao.findOne({
            where: {id_talao}
        })

        return talaoAposUpdate
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function buscarTransacoesPorIntervaloLojas(idInicio, idFim) {
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
        console.error('Erro ao buscar transacaoes', err)
        throw err
    }
}

async function buscarPorLoja(id_loja) {
    try {
        const buscarPorIntervalo = Transacao.findAll({
            where: {id_loja}
        })
        return buscarPorIntervalo
    } catch (err) {
        console.error('Erro ao buscar transacaoes', err)
        throw err
    }
}

module.exports = { buscarPorLoja,aprovarEnvio,solicitacaoEnvio,inserirEnvioTalão, consultarEnvioTalao, editarEnvioTalao, deletarEnvioTalao, consEnvioUsuario, buscarTransacoesPorIntervaloLojas }