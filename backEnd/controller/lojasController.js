const {consultarLoja, editarLoja, inserirLoja, deletarLoja, buscarTransacoesPorIntervaloLojLoja, buscarTransacoesLoja} = require('../services/lojasServices')
const { esquemaLoja } = require('../utils/validateInputs')

async function criarLoja(req, res) {
    const {id_loja, nome_loja, cep_loja} = req.body

    const {error} = esquemaLoja.validate({id_loja, nome_loja, cep_loja}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const novaLoja = await inserirLoja(id_loja, nome_loja, cep_loja)
        res.status(201).json({message: 'Loja cadastrada com sucesso.', loja: novaLoja })
    } catch (err) {
        res.status(500).json({message: 'Erro ao inserir loja', erro: err.message})
    }
}

async function consultLoja(req, res) {
    try {
        const consulLojas = await consultarLoja()
        res.status(201).json({message: 'consulta realizada com sucesso', lojas: consulLojas})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar lojas', error: err.message})
    }
}

async function editLoja(req, res) {
    const {id_loja} = req.params
    const {nome_loja, cep_loja} = req.body

    const {error} = esquemaLoja.validate({id_loja, nome_loja, cep_loja}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const editLoja = await editarLoja(nome_loja, cep_loja, id_loja)
        if (editLoja) {
            res.status(201).json({message: 'loja editada com sucesso', loja: editLoja})
        } else {
            res.status(404).json({message: 'codigo da loja nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao editar informações da loja', error: err.message})
    }
}

async function deletLoja(req, res) {
    const {id_loja} = req.params
    const {error} = esquemaLoja.validate({id_loja}) 
    
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const delLoja = await deletarLoja(id_loja)
        if (delLoja) {
            res.status(201).json({message: 'loja deletada com sucesso', loja: delLoja})
        } else {
            res.status(404).json({message: 'codigo loja nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao deletar loja', error: err.message})
    }
}

async function buscarPorIntervaloLojaLj(req,res) {
    const {idInicio, idFim} = req.query

    if (idInicio === undefined || idFim === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesPorIntervaloLojLoja(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, lojas: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}

async function buscarPorLojaEspecifica(req,res) {
    let {id_loja} = req.query

    id_loja = parseInt(id_loja)

    if (id_loja === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesLoja(id_loja)
        res.status(201).json({lojas: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}

module.exports = {criarLoja, consultLoja, editLoja, deletLoja, buscarPorIntervaloLojaLj,buscarPorLojaEspecifica }