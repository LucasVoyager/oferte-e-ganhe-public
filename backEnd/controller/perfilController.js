const {consultarPerfil, editarPerfil, inserirPerfil, deletarPerfil, buscarTransacoesPorIntervaloPerfil, buscarPerfil} = require('../services/perfilServices')
const {consultarPermissaoPerfil, inserirPermissaoPerfil, editarPermissaoPerfil, deletarPermissaoPerfil, consultarPermissoes, consultarPermissaoDoPerfil} = require('../services/permissoesServices')
const { esquemaPerfil, esquemaPermissaoPerfil } = require('../utils/validateInputs')


async function consPerfil(req, res) {
    try {
        const perfis = await consultarPerfil()
        res.status(201).json({message: 'Consulta realizada com sucesso', perfis})
    } catch (err) {
        res.status(500).json({message: "consulta falhou", error: err.message})
    }
}

async function consPermissoes(req, res) {
    try {
        const permissoes = await consultarPermissoes()
        res.status(201).json({message: 'consulta realizada', tipos: permissoes})
    } catch (err) {
        res.status(500).json({message: "erro ao consultar", error: err.message})
    }
}

async function editPerfil(req, res) {
    const {id_perfil} = req.params
    const {nome_perfil, permissoes} = req.body

    const {error} = esquemaPerfil.validate({id_perfil, nome_perfil}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const perfilEditado = await editarPerfil( nome_perfil, id_perfil, permissoes)

        if (perfilEditado) {
            res.status(201).json({message: 'Perfil editado com sucesso', perfil: perfilEditado})
        } else {
            res.status(400).json({message: 'perfil nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao editar perfil', error: err.message})
    }
}

async function criarPerfil(req, res) {
    const {nome_perfil, permissoes} = req.body

    const {error} = esquemaPerfil.validate({nome_perfil}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const novoPerfil = await inserirPerfil(nome_perfil, permissoes)
        res.status(201).json({message: 'Perfil criado com sucesso', perfil: novoPerfil })
    } catch (err) {
        res.status(500).json({message: 'Erro ao criar perefil', error: err.message})
    }
}

async function delPerfil(req, res) {
    const {id_perfil} = req.params

    const {error} = esquemaPerfil.validate({id_perfil}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const perfilDeletado = await deletarPerfil(id_perfil)
        if (perfilDeletado) {
            res.status(201).json({message: 'perfil deletado', perfil: id_perfil})
        } else {
            res.status(401).json({message: 'id_perfil nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: "nao foi possivel deletar perfil", error: err.message})
    }
}

async function consPermPerf(req, res) {
    try {
        const permissaoPerfis = await consultarPermissaoPerfil()
        res.status(201).json({message: 'consulta realizada com sucesso', permissao: permissaoPerfis})
    } catch (err) {
        res.status(500).json({message: 'consulta falhou', error: err.message})
    }
}

async function criarPermissaoPerfil(req, res) {
    const {id_perfil, id_permissao} = req.body

    const {error} = esquemaPermissaoPerfil.validate({id_perfil, id_permissao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const permissaoCadastrada = await inserirPermissaoPerfil(id_perfil, id_permissao)
        res.status(201).json({message: 'permissao cadastrada com sucesso', permissao: permissaoCadastrada})
    } catch (err) {
        res.status(500).json({message: 'erro ao cadastrar permissao', error: err.message})
    }
}

async function editPermissaoPerfil(req, res) {
    const {id_permissao_perfil} = req.params
    const {id_perfil, id_permissao} = req.body
    
    const {error} = esquemaPermissaoPerfil.validate({id_permissao_perfil,id_perfil, id_permissao}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const perEdit = await editarPermissaoPerfil(id_perfil, id_permissao, id_permissao_perfil)
        if (perEdit) {
            res.status(201).json({message: 'permissao do perfil editada com sucesso', permissao: perEdit})
        } else {
            res.status(404).json({message: 'id_permissao nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao editar permissao', error: err.message})
    }
}

async function delPermissaoPerfil(req, res) {
    const {id_permissao_perfil} = req.params

    const {error} = esquemaPermissaoPerfil.validate({id_permissao_perfil}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const delPer = await deletarPermissaoPerfil(id_permissao_perfil)
        if (delPer) {
            res.status(201).json({message: 'permissao relacionada ao perfil deletada com sucesso', permissao: delPer})
        } else {
            res.status(404).json({message: 'id_permissao nao encontrada'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao deletar permissao', error: err.message})
    }
}

async function buscarPorIntervaloPerf(req,res) {
    const {idInicio, idFim} = req.query
    
    if (idInicio === undefined || idFim === undefined ) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const intervalo = await buscarTransacoesPorIntervaloPerfil(idInicio, idFim)
        res.status(201).json({message: `consulta feita pelo intervalo com inicio em ${idInicio} e fim ${idFim}`, perfis: intervalo})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar intervalo', error: err.message})
    }
}

async function consultaPerPerfilEsp(req,res) {
    const {id_perfil} = req.query


    if (id_perfil === undefined) {
        res.status(400).json({message: `IDS intervalo nao podem ser nulos`})
    }

    try {
        const perPerEsp = await consultarPermissaoDoPerfil(id_perfil)
        if (perPerEsp) {
            res.status(201).json({message: `permissoes relacionadas ao perfil ${id_perfil}`, permissoes: perPerEsp})
        } else {
            res.status(404).json({message: 'perfil nao encontrado'})
        }
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar permissoes perfil', error: err.message})
    }
}

async function buscarPerfilEspecifico(req, res) {
    const {id_perfil} = req.query

    if (id_perfil === undefined) {
        res.status(400).json({message: 'id_perfil deve ser valido'})
    }

    try {
        const perfil = await buscarPerfil(id_perfil)
        res.status(201).json({perfis: perfil})
    } catch (err) {
        res.status(500).json({message: 'erro ao consultar perfil', error: err.message})
    }
}

module.exports = {buscarPerfilEspecifico,consultaPerPerfilEsp,consPermissoes, consPerfil,  editPerfil, consPermPerf, criarPerfil, delPerfil, criarPermissaoPerfil, editPermissaoPerfil, delPermissaoPerfil, buscarPorIntervaloPerf}