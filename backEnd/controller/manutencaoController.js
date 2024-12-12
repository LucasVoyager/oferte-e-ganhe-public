const {consultaTalao, editarTalao, buscarTransacoesPorIntervaloLojaManutencao, consultarTalaoEspecifico, consultarTaloesLoja} = require('../services/manutencaoServices')
const { esquemaTransacao } = require('../utils/validateInputs')

async function consManutencao(req, res) {
    try {
        const consTalao = await consultaTalao()
        res.status(201).json({message: 'consulta de taloes realizada com sucesso', taloes: consTalao})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar taloes ', error: err.message})
    }
}

async function consLojaTransacoes(req,res) {
    const {id_loja} = req.query
    
    try {
        const consTalao = await consultarTaloesLoja(id_loja)
        if (!consTalao) {
            res.status(404).json({message: 'transacao nao encontrada para loja informada'})
        }
        res.status(201).json({message: 'consulta de taloes realizada com sucesso', taloes: consTalao})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar taloes ', error: err.message})
    }
}

async function consTalaoEsp(req, res) {
    const {id_talao} = req.params

    try {
        const consTalao = await consultarTalaoEspecifico(id_talao)
        res.status(201).json({talao: consTalao})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar talao', error: err.message})
    }
}

async function editManutencao(req, res) {
    const {id_talao} = req.params
    const {quantidade_talao_solicitado,quantidade_talao_enviado, quantidade_talao_recebido, status, data_hora_envio, data_entrega_prevista, data_hora_recebimento, numero_remessa, id_usuario, id_loja} = req.body

    const {error} = esquemaTransacao.validate({quantidade_talao_solicitado, quantidade_talao_enviado, quantidade_talao_recebido, status, data_hora_envio, data_entrega_prevista, data_hora_recebimento, numero_remessa, id_usuario, id_loja, id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const editTalao = await editarTalao(quantidade_talao_solicitado,quantidade_talao_enviado, quantidade_talao_recebido, status, data_hora_envio, data_entrega_prevista, data_hora_recebimento, numero_remessa, id_usuario, id_loja, id_talao)
        if (editTalao) {
            res.status(200).json({message: 'talao editado com sucesso', talao: editTalao})
        } else {
            res.status(404).json({message: 'id_talao nao encontrado'})
        } 
    } catch (err) {
        res.status(500).json({message: 'erro ao editar o talao', error: err.message})
    }
}

async function bucarPorIntervaloLojaMant(req,res) {
    const {idInicio, idFim} = req.query

    if (idInicio === undefined || idFim === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesPorIntervaloLojaManutencao(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, transacoes: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}



module.exports = {consManutencao, editManutencao, bucarPorIntervaloLojaMant, consTalaoEsp, consLojaTransacoes}