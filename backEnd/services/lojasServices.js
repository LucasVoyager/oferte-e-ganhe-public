const { Op } = require('sequelize')
const Loja = require('../model/lojasModel')
const { verificaLoja } = require('../utils/validardados')

async function inserirLoja(id_loja,nome_loja,cep_loja = 'Loja') { 
    try {
        await verificaLojaExiste(id_loja)
        
        const novaLoja = await Loja.create({
            id_loja,
            nome_loja,
            cep_loja
        })

        return novaLoja
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function editarLoja( nome_loja, cep_loja, id_loja) {
    try {
        await verificaLoja(id_loja)

       await Loja.update({
         nome_loja,
         cep_loja,
         id_loja
       }, {
        where: {id_loja}
       })

       const lojaAtualizada = await Loja.findOne({
        where: {id_loja}
       })

       return lojaAtualizada
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consultarLoja() {
    try {
        return await Loja.findAll(
            {order: ['id_loja']}
        )
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function deletarLoja(id_loja) {
      try {
        const lojaDeletada = verificaLoja(id_loja)

        await Loja.destroy({
            where: {id_loja}
        })

        return lojaDeletada
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function verificaLojaExiste(id_loja) {
    const loja = await Loja.findOne({
        where: {id_loja}
    })
    if (loja) {
        throw new Error('Codigo loja ja cadastrado')
    }
}

async function buscarTransacoesPorIntervaloLojLoja(idInicio, idFim) {
    try {
        const buscarPorIntervalo = Loja.findAll({
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

async function buscarTransacoesLoja(id_loja) {
    try {
        const buscarloja = Loja.findOne({
            where: {id_loja} })
        return buscarloja
    } catch (err) {
        console.error('Erro ao buscar Estoques', err)
        throw err
    }
}

module.exports = { inserirLoja, consultarLoja, deletarLoja, editarLoja, buscarTransacoesLoja }