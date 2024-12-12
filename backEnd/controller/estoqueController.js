const {consultarEstoque, editarEstoque, inserirEstoqueLoja, deletarEstoque, consEstoqueUsuario, atualizarEstoqueAtual, atualizaStatus, atualizarMinRecGeral, buscarTransacoesPorIntervaloLojEstoque, buscarEstoqueLoja, consultarEstoqueEspecifico } = require('../services/estoqueServices')
const { esquemaEstoque } = require('../utils/validateInputs')

async function consEstoque(req, res) {
    try {
        const consEstoque = await consultarEstoque()
        res.status(201).json({message: 'estoque consultado com sucesso', estoque: consEstoque})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar estoque', error: err.message})
    }
}

async function consEstoqueEspec(req, res) {
    const {id_estoque} = req.params

    try {
        const estoque = await consultarEstoqueEspecifico(id_estoque)
        res.status(201).json({estoques: estoque})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar estoque especifico', error: err.message})
    }
}

async function consultarEstoqueUsuario(req,res) {
    const id_loja = req.user.loja

    const {error} = esquemaEstoque.validate({id_loja}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const estoqueLoja = await consEstoqueUsuario(id_loja)
        res.status(201).json({message: 'consulta realizada com sucesso', estoque: estoqueLoja})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar loja', error: err.message})
    }

}

async function criarEstoque(req, res) {
    const { id_loja, quantidade_atual, quantidade_minima, quantidade_recomendada} = req.body

    const {error} = esquemaEstoque.validate({id_loja, quantidade_atual, quantidade_minima}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const novoEstoqueLoja = await inserirEstoqueLoja(id_loja, quantidade_atual, quantidade_minima, quantidade_recomendada)
        res.status(201).json({message: 'Estoque cadastrado com sucesso', estoqueLoja: novoEstoqueLoja})

    } catch (err) {
        res.status(500).json({message: 'erro ao cadastrar estoque', error: err.message})
    }
}

async function editEstoque(req, res) {
    const {id_estoque} = req.params
    const {quantidade_atual, quantidade_minima, quantidade_recomendada} = req.body

    const {error} = esquemaEstoque.validate({id_estoque, quantidade_atual, quantidade_minima}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const editEstoqueLoja = await editarEstoque(quantidade_atual, quantidade_minima, quantidade_recomendada, id_estoque)
        if (editEstoqueLoja) {
            res.status(201).json({message: 'estoque editado', estoque: editEstoqueLoja})
        } else {
            res.status(404).json({message: 'id do estoque nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao editar estoque da loja', error: err.message})
    }
}

async function editEstoqueAtual(req, res) {
    const id_loja = req.user.loja
    const {quantidade_atual} = req.body

    const {error} = esquemaEstoque.validate({id_loja, quantidade_atual}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {

        const estoqueEditado = await atualizarEstoqueAtual(quantidade_atual, id_loja)

        const statusEditado = await atualizaStatus(id_loja, quantidade_atual)
        
        if (estoqueEditado && statusEditado) {
            res.status(201).json({message: `estoque da loja:${id_loja} foi atualizado com a quantidade ${quantidade_atual}`, loja: estoqueEditado })
        } 
    } catch (err) {
        res.status(500).json({message: 'erro ao atualizar estoque da loja', error: err.message})
    }
    
}

async function delEstoque(req, res) {
    const {id_estoque} = req.params

    const {error} = esquemaEstoque.validate({id_estoque}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const delEstoqueLoja = await deletarEstoque(id_estoque)
        if (delEstoqueLoja) {
            res.status(201).json({message: 'estoque da loja deletado com sucesso', estoque: delEstoqueLoja})
        } else {
            res.status(404).json({message: 'id estoque nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao deletar estoque', error: err.message})
    }
}

async function atualizarMinRec(req, res) {
    const {quantidade_minima, quantidade_recomendada} = req.body

    const {error} = esquemaEstoque.validate({quantidade_minima, quantidade_recomendada}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const atualizadoMinRec = await atualizarMinRecGeral(quantidade_minima, quantidade_recomendada)
        if (atualizadoMinRec) {
            res.status(201).json({message: 'atualizado com sucesso', minima: quantidade_minima, recomendada: quantidade_recomendada})
        } 
    } catch (err) {
        res.status(500).json({message: 'erro ao atualizar min e rec', error: err.message})
    }
    
}

async function bucarPorIntervaloLojaEstoque(req,res) {
    const {idInicio, idFim} = req.query

    if (idInicio === undefined || idFim === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesPorIntervaloLojEstoque(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, transacoes: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}

async function buscarEstLoj(req, res) {
    const {id_loja} = req.query
    
    if (id_loja === undefined ) {
        res.status(400).json({message: `ID nao pode ser nulos`})
    }

    try {
        const estoque = await buscarEstoqueLoja(id_loja)
        if (!estoque) {
            res.status(404).json({message: 'loja nao encontrada'})
        }
        res.status(201).json({estoques: estoque})
    } catch (err) {
        res.status(500).json({message: 'erro ao tentar buscar loja', error: err.message})
    }

}

module.exports = {consEstoqueEspec,buscarEstLoj,atualizarMinRec,editEstoqueAtual,consultarEstoqueUsuario,consEstoque, criarEstoque, editEstoque, delEstoque, bucarPorIntervaloLojaEstoque}