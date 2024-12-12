const { Op } = require('sequelize')
const Estoque = require('../model/estoqueModel')
const { verificaLoja } = require('../utils/validardados')

async function inserirEstoqueLoja( id_loja, quantidade_atual, quantidade_minima, quantidade_recomendada) {
    try {
        const status = calculaStatusEstoque(quantidade_atual, quantidade_minima, quantidade_recomendada)
        await verificaLoja(id_loja)
        await verificaLojaEstoque(id_loja)

        const novoEstoque = await Estoque.create({
            status, 
            id_loja, 
            quantidade_atual, 
            quantidade_minima, 
            quantidade_recomendada
        })

        return novoEstoque

    } catch (err) {
        console.error(err)
        throw err
    }    
    
}

async function consultarEstoque() {
    try {
        const estoque = await Estoque.findAll(
            {order: ['id_loja']}
        )
        return estoque
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consultarEstoqueEspecifico(id_estoque) {
    try {
        const estoque = await Estoque.findOne({
            where: {id_estoque}
        })

        return estoque
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarEstoque(quantidade_atual, quantidade_minima, quantidade_recomendada, id_estoque) {
    try {
        const status = calculaStatusEstoque(quantidade_atual, quantidade_minima, quantidade_recomendada)

        await Estoque.update({
            status, 
            quantidade_atual, 
            quantidade_minima, 
            quantidade_recomendada
        }, {
            where: {id_estoque}
        })

        const estoqueAtualizado = await Estoque.findOne({
            where: {id_estoque}
        })

        return estoqueAtualizado
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function atualizarEstoqueAtual(quantidade_atual, id_loja) {
    try {
        await verificaLoja(id_loja)

        await Estoque.update({
            quantidade_atual
        }, {
            where: {id_loja}
        })

        const estoqueASerAtualizado = await Estoque.findOne({
            where: {id_loja}
        })

        return estoqueASerAtualizado

    } catch (err) {
        console.error(err)
        throw err
    }
}

async function deletarEstoque(id_estoque) {
    try {
       const estoqueADeletar = await verificaEstoqueExiste(id_estoque)

        await Estoque.destroy({
            where: {id_estoque}
        })

        return estoqueADeletar
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consEstoqueUsuario(id_loja) {
    try {
        await verificaLoja(id_loja)
        await verificaLojaCadastradaEstoque(id_loja)

        const estoqueUsuario = await Estoque.findAll({
            where: {id_loja}
        })
        return estoqueUsuario
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function atualizaStatus(id_loja, quantidade_atual) {
    try {
        await verificaLoja(id_loja)

        const obterValorLoja = await Estoque.findOne({
            attributes: ['quantidade_minima', 'quantidade_recomendada'],
            where: {id_loja}
        })

        if(!obterValorLoja) {
            throw new Error('valores nulos de quantidade_minima e recomendada')
        }

        const {quantidade_minima, quantidade_recomendada} = obterValorLoja

        const novoStatus = calculaStatusEstoque(quantidade_atual,quantidade_minima, quantidade_recomendada)

        try {
            const statusAtualizado = await Estoque.update({
                status: novoStatus,
                quantidade_atual
            }, {
                where: {id_loja}
            })
            
            return statusAtualizado
        } catch (err) {
            console.error(err)
            throw err
        }       
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function atualizarMinRecGeral(quantidade_minima, quantidade_recomendada) {
    try {
        const minRec = await Estoque.update({
            quantidade_minima,
            quantidade_recomendada
        }, {where: {}})

        return minRec
    } catch (err) {
        console.error(err)
        throw err
    }
    
}

const calculaStatusEstoque = (quantidadeAtual, quantidadeMinima, quantidadeRecomendada) => {
    if (quantidadeAtual == undefined || quantidadeAtual == null) {
        throw new Error('Quantidade atual deve ter um valor atribuido')
    }

    if (quantidadeAtual < quantidadeMinima) {
        return 'Quantidade Baixa'
    } else if (quantidadeAtual >= quantidadeMinima && quantidadeAtual <= quantidadeRecomendada) {
        return 'Quantidade Média'
    } else if (quantidadeAtual > quantidadeRecomendada) {
        return 'Quantidade Ok'
    } 

}

async function verificaLojaEstoque(id_loja) {
    const verificaEstoqueLoja = await Estoque.findOne({
        where: {id_loja}
    })

    if (verificaEstoqueLoja) {
        throw new Error('Loja ja foi cadastrada no estoque')
    }
}

async function verificaLojaCadastradaEstoque(id_loja) {
    const verificaEstoqueLoja = await Estoque.findOne({
        where: {id_loja}
    })

    if (!verificaEstoqueLoja) {
        throw new Error('Loja nao foi cadastrada no estoque')
    }
}

async function verificaEstoqueExiste(id_estoque) {
    const estoque = await Estoque.findOne({
        where: {id_estoque}
    })

    if (!estoque) {
        throw new Error('Estoque nao encontrado')
    }

    return estoque
}

async function buscarTransacoesPorIntervaloLojEstoque(idInicio, idFim) {
    try {
        const buscarPorIntervalo = Estoque.findAll({
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

async function buscarEstoqueLoja(id_loja) {
    try {
        const estoqueLoja = await Estoque.findOne({
            where: {
                id_loja
            }
        })

        return estoqueLoja
    } catch (err) {
        console.error(err)
        throw err
    }
}

module.exports = { consultarEstoqueEspecifico,buscarEstoqueLoja,buscarTransacoesPorIntervaloLojEstoque,atualizarMinRecGeral,atualizaStatus, atualizarEstoqueAtual,consEstoqueUsuario,inserirEstoqueLoja, consultarEstoque, editarEstoque, deletarEstoque }
