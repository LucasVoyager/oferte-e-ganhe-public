const {consultarEnvioTalao, editarEnvioTalao, inserirEnvioTalão, deletarEnvioTalao, consEnvioUsuario, solicitacaoEnvio, aprovarEnvio, buscarTransacoesPorIntervaloLojas, buscarPorLoja} = require('../services/envioServices')
const { esquemaTransacao } = require('../utils/validateInputs')

async function consEnvio(req, res) {
    try {
        const envioTaloes = await consultarEnvioTalao()
        res.status(201).json({message: 'consulta realizada com sucesso', envio: envioTaloes})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar envio taloes', error: err.message})
    }
}

async function criarEnvio(req, res) {
    const {quantidade_talao_solicitado, quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja} = req.body

    const {error} = esquemaTransacao.validate({quantidade_talao_solicitado, quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const novoEnvioTalao = await inserirEnvioTalão(quantidade_talao_solicitado, quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja )
        res.status(201).json({message: 'cadastro de envio solicitado', envio: novoEnvioTalao})
    } catch (err) {
        res.status(500).json({message: 'Erro ao cadastrar envio', error: err.message})
    }
}

async function editEnvio(req, res) {
    const {id_talao} = req.params
    const {quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja} = req.body

    const {error} = esquemaTransacao.validate({quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja, id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const editarEnvio = await editarEnvioTalao(quantidade_talao_enviado, status, data_hora_envio, data_entrega_prevista, numero_remessa, id_usuario, id_loja, id_talao)
        if (editarEnvio) {
            res.status(201).json({message: 'envio editado com sucesso', envio: editarEnvio})
        } else {
            res.status(404).json({message: 'id_talao nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao editar envio', error: err.message})
    }
}

async function delEnvio(req, res) {
    const {id_talao} = req.params

    const {error} = esquemaTransacao.validate({id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const delEnvioTalao = await deletarEnvioTalao(id_talao)
        if (delEnvioTalao) {
            res.status(201).json({message: 'envio talao deletado com sucesso', envio: delEnvioTalao})
        } else {
            res.status(404).json({message: 'id_talao nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao tentar deletar transacao', error: err.message})
    }
}

async function consEnvioLoja(req,res) {
    const id_loja = req.user.loja

    const {error} = esquemaTransacao.validate({id_loja}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const consultaLoja = await consEnvioUsuario(id_loja)
        res.status(201).json({message: 'consulta realizada com sucesso', consulta: consultaLoja})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar envio loja', error: err.message})
    }
}

async function solicitacaoEnvioLoja(req, res) {
    const {loja, matricula_usuario} = req.user
    const {quantidade_talao_solicitado} = req.body

    const {error} = esquemaTransacao.validate({id_loja: loja, id_usuario: matricula_usuario, quantidade_talao_solicitado}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const solEnvio = await solicitacaoEnvio(quantidade_talao_solicitado, matricula_usuario, loja)
        res.status(201).json({message: 'solicitado com sucesso', solicitacao: solEnvio})
    } catch (err) {
        res.status(500).json({message: 'erro ao solicitar', error: err.message})
    }
}

async function aprovEnvioAd(req, res) {
    const {id_talao} = req.params

    const {error} = esquemaTransacao.validate({id_talao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const aprovTalaoSolicitado = await aprovarEnvio(id_talao)
        if (aprovTalaoSolicitado) {
            res.status(201).json({message: 'aprovado com sucesso', talao: aprovTalaoSolicitado})
        } else {
            res.status(404).json({message: 'talao nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao aprovar a solicitação', error: err.message})
    }
}

async function bucarPorIntervaloLoj(req,res) {
    const {idInicio, idFim} = req.query

    if (idInicio === undefined || idFim === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesPorIntervaloLojas(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, transacoes: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}

async function buscarIntLoja(req, res) {
    const {id_loja} = req.query
    
    if (id_loja === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarPorLoja(id_loja)
        res.status(201).json({message: `consulta feita pela loja ${id_loja}`, transacoes: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}

module.exports = {buscarIntLoja,consEnvio, criarEnvio, editEnvio, delEnvio, consEnvioLoja, solicitacaoEnvioLoja, aprovEnvioAd, bucarPorIntervaloLoj}