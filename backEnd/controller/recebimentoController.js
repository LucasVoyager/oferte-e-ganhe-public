const {consultarRecebimentoTalao, editarRecebimentoTalao, inserirRecebimentoTalao, deletarRecebimentoTalao, consultarRecebimentoLoja, atualizarRecebimento, editarRecebimentoLoja, buscarTransacoesPorIntervaloLojasRecebimento, buscarTransacaoLojaEspecifica} = require('../services/recebimentoServices')
const { esquemaTransacao } = require('../utils/validateInputs')

async function consRecebimento(req, res) {
    try {
        const recebimentoTaloes = await consultarRecebimentoTalao()
        res.status(201).json({message: 'consulta realizada', recebimento: recebimentoTaloes})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar', error: err.message})
    }
}

async function criarRecebimento(req, res) {
    const {id_talao} = req.params
    const {quantidade_talao_recebido, status, data_hora_recebimento} = req.body

    const {error} = esquemaTransacao.validate({quantidade_talao_recebido, status, data_hora_recebimento, id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const novoRecebimentoTalao = await inserirRecebimentoTalao( quantidade_talao_recebido, status, data_hora_recebimento, id_talao)
        res.status(201).json({message: 'Recebimento atualizado', recebimento: novoRecebimentoTalao})
    } catch (err) {
        res.status(500).json({message: 'Erro ao atualizar recebimento', error: err.message})
    }
}

async function editRecebimento(req, res) {
    const {id_talao} = req.params
    const {quantidade_talao_recebido, status, data_hora_recebimento} = req.body

    const {error} = esquemaTransacao.validate({quantidade_talao_recebido, status, data_hora_recebimento, id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const edicaoRecebimentoTalao = await editarRecebimentoTalao(quantidade_talao_recebido, status, data_hora_recebimento, id_talao)
        if (edicaoRecebimentoTalao) {
            res.status(201).json({message: 'transação editada com sucesso', transacao: edicaoRecebimentoTalao})
        } else {
            res.status(404).json({message: 'transacao nao encontrada'})
        } 
    } catch (err) {
        res.status(500).json({message: "erro ao editar transacao", error: err.message})
    }
}

async function consRecebimentoLoja(req, res) {
    const loja = req.user.loja
    
    const {error} = esquemaTransacao.validate({id_loja: loja}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const resultadoLojas = await consultarRecebimentoLoja(loja)
        res.status(201).json({message: 'consulta realizada com sucesso', recebimento: resultadoLojas})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar lojas especifica', error: err.message})
    }
    
}

async function atualizarRecebimentoLoja(req, res) {
    const {id_talao} = req.params
    const {loja, matricula_usuario} = req.user
    const {quantidade_talao_recebido, status, data_hora_recebimento} = req.body

    const {error} = esquemaTransacao.validate({id_loja: loja, quantidade_talao_recebido, status, data_hora_recebimento, id_usuario: matricula_usuario, id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const atualizaRecebimentoLoja = await atualizarRecebimento(quantidade_talao_recebido, status, data_hora_recebimento, matricula_usuario, loja, id_talao)
        if (atualizaRecebimentoLoja) {
            res.status(201).json({message: 'recebimento atualizado com sucesso', recebimento: atualizaRecebimentoLoja})
        } else {
            res.status(404).json({message: 'talao nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao atualizar', error: err.message})
    }
}

async function editRecebimentoLoja(req, res) {
    const {id_talao} = req.params
    const {loja, matricula_usuario} = req.user
    const {quantidade_talao_recebido, status, data_hora_recebimento} = req.body

    const {error} = esquemaTransacao.validate({id_loja: loja, quantidade_talao_recebido, status, data_hora_recebimento, id_usuario: matricula_usuario, id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const editRecLoja = await editarRecebimentoLoja(quantidade_talao_recebido, status, data_hora_recebimento, matricula_usuario, loja, id_talao)
        if (editRecLoja) {
            res.status(201).json({message: 'recebimento editado com sucesso', recebimento: editRecLoja})
        } else {
            res.status(404).json({message: 'talao nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao editar', error: err.message})
    }
}

async function bucarPorIntervaloLojaRec(req,res) {
    const {idInicio, idFim} = req.query

    if (idInicio === undefined || idFim === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesPorIntervaloLojasRecebimento(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, transacoes: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}

async function buscarTransacaoLj(req, res) {
    const {id_loja} = req.query

    try {
        const transacao = await buscarTransacaoLojaEspecifica(id_loja)
        if (!transacao) {
            res.status(404).json({message: 'loja nao encontrada'})
        }
        res.status(201).json({messa: 'consulta realizada com sucesso', transacoes: transacao})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar loja especifica', error: err.message})
    }
}

module.exports = {buscarTransacaoLj,bucarPorIntervaloLojaRec,editRecebimentoLoja,atualizarRecebimentoLoja,consRecebimento, criarRecebimento, editRecebimento, consRecebimentoLoja}