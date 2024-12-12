const bcrypt = require('bcryptjs')
const Usuario = require('../model/usuarioModel')
const Perfil = require('../model/perfilModel')
const Permissoes = require('../model/permissoesModel')
const { PermissaoPerfil } = require('../model')
const { verificaLoja, verificaEmail, verificaPerfil, verificaMatricula } = require('../utils/validarDados')
const { hashSenha } = require('../utils/hashSenha')
const { Op, where } = require('sequelize')

async function inserirUsuario(nome, matricula_usuario, email, id_loja, id_perfil) {
    const senha = String(process.env.SENHA_PADRAO) 
    const hashedSenha = await hashSenha(senha)

    try {
        await verificaLoja(id_loja)
        id_perfil ? await verificaPerfil(id_perfil) : null
        const verEmail = await verificaEmail(email)
        const verMatricula = await verificaMatricula(matricula_usuario)

        if (!verEmail && !verMatricula) {
            const novoUsuario = await Usuario.create({nome, matricula_usuario, email,senha: hashedSenha, id_loja, id_perfil, criado_por: 'admin'})
            return novoUsuario
        }

    } catch(err) {
        console.error(err)
        throw err
    }
}

async function checarEmailNovaSenha(email, senha) {
    const hashedSenha = await bcrypt.hash(senha, 10)

    try {
        const usuarioEmail = await Usuario.findOne({
            where: {email}
        })

        if (!usuarioEmail) {
            throw new Error('email nao foi encontrado, favor verificar.')
        }

        await Usuario.update({
            senha: hashedSenha,
            token_senha_resetar: null
        }, {where: {email}})

        return usuarioEmail
    } catch (err) {
        console.error("erro ao tentar cadastrar nova senha", err)
    }
}

async function consultaUsuarios() {
    try {
        const usuarios = await Usuario.findAll({
            order: ['matricula_usuario'],
            where: {
                criado_por: 'admin'
            }, include: {
                model: Perfil,
                attributes: ['nome_perfil']
            }
        })
        return usuarios
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function consultarUsuarioEspecifico(matricula_usuario) {
    
    try {
        await matriculaExiste(matricula_usuario)

        const usuario = await Usuario.findOne({
            where: {
                matricula_usuario: matricula_usuario
            }, include: {
                model: Perfil,
                attributes: ['nome_perfil']
            }
        })
        return usuario
    } catch (err) {
       console.error(err)
       throw err
    }
}

async function editarUsuario(nome, matricula_usuario, email, id_loja, id_perfil) {
    try {
        await matriculaExiste(matricula_usuario)

        await Usuario.update({
            nome,
            email,
            id_loja,
            id_perfil
        }, {
            where: {matricula_usuario}
        })

        const usuarioAtualizado = await Usuario.findOne({
            where: {matricula_usuario}
        })

        return usuarioAtualizado
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function deletarUsuario(matricula_usuario) {
    try {
        const usuarioADeletar = await matriculaExiste(matricula_usuario)

        await Usuario.destroy({
            where: {matricula_usuario}
        })

        return usuarioADeletar
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function obterPermissaoUsuario(matricula_usuario) {
    try {
        await matriculaExiste(matricula_usuario)

        const usuario = await Usuario.findOne({
            where: {matricula_usuario},
            include: {
                model: Perfil,
                include: {
                    model: Permissoes,
                    through: {
                        mode: PermissaoPerfil,
                        atributes: []}
                }
            }
        })

        if (!usuario) {
            throw new Error("Erro ao localizar usuario")
        }

        const permissoes = usuario.Perfil.Permissoes.map(permissao => ({
            nome_permissao: permissao.nome_permissao
        }))

        return permissoes
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function criarContaLogin(nome, matricula_usuario, email, senha, id_loja) {
    const hashedSenha = await hashSenha(senha)

    try {
        const verMat = await verificaMatricula(matricula_usuario)
        await verificaLoja(id_loja)
        const verEmail = await verificaEmail(email)

        if (!verEmail && !verMat) {
            const novoUsuarioLogin = await Usuario.create({
                nome,
                matricula_usuario,
                email,
                senha: hashedSenha,
                id_loja,
                criado_por: 'criar_conta'
            })
    
            return novoUsuarioLogin
        }
        
    } catch(err) {
        console.error(err)
        throw err
    }
}

async function consultaUsuariosParaAprovacao() {
    try {
        const usuarioAAprovado = await Usuario.findAll({
            where: {criado_por: 'criar_conta'}
        })

        return usuarioAAprovado
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function aprovarUsuario(matricula_usuario) {
    try {
       await matriculaExiste(matricula_usuario)
       const criadoPor = await Usuario.findOne({
        attributes: ['criado_por'],
        where: {matricula_usuario}
       })

       if (criadoPor.criado_por === 'admin') {
        throw new Error("usuario ja foi aprovado")
       }

        const usuarioAprova = await Usuario.update({
            criado_por: 'admin'
        }, {
            where: {matricula_usuario}
        })

        return usuarioAprova
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function matriculaExiste(matricula_usuario) {
    const matriculaEx = await Usuario.findOne({
        where: {matricula_usuario}
    })

    if (!matriculaEx) {
        throw new Error('Matricula digitada nao foi encontrada.')
    }

    return matriculaEx
}

async function buscarTransacoesPorIntervaloLojaUsuario(idInicio, idFim) {
    try {
        const buscarPorIntervalo = Usuario.findAll({
            where: {
                id_loja: {
                    [Op.between]: [idInicio, idFim]
                }
            }, include: {
                model: Perfil,
                attributes: ['nome_perfil']
            }
        })
        return buscarPorIntervalo
    } catch (err) {
        console.error('Erro ao buscar usuarios', err)
        throw err
    }
}

async function buscarUsuarioAprovacaoIntervalo(idInicio, idFim) {
    try {
        const buscarPorIntervalo = Usuario.findAll({
            where: {
                id_loja: {
                    [Op.between]: [idInicio, idFim]
                },
                criado_por: 'criar_conta'
            }
        })
        return buscarPorIntervalo
    } catch (err) {
        console.error('Erro ao buscar usuarios', err)
        throw err
    }
}

async function buscarUsuariosLoja(id_loja) {
    try {
        const buscarPorLoja = await Usuario.findAll({
            where: {id_loja}, include: {
                model: Perfil,
                attributes: ['nome_perfil']
            }
        })

        return buscarPorLoja
    } catch (err) {
        console.error('Erro ao buscar pelo id_loja', err)
        throw err
    }
}

async function buscarUsuariosLojaAprovacao(id_loja) {
    try {
        const buscarPorLoja = await Usuario.findAll({
            where: {id_loja, criado_por: 'criar_conta'},
        })

        return buscarPorLoja
    } catch (err) {
        console.error('Erro ao buscar pelo id_loja', err)
        throw err
    }
}

async function atualizarSessaoBanco(sessao_usuario,matricula_usuario) {
    try {
        const sesaoAtualizada = await Usuario.update({
            sessao_usuario
        }, {where: {matricula_usuario}},)
        return sesaoAtualizada
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function removerSessaoBanco(matricula_usuario) {
    try {
        const sessao_usuario = ''
        const sesaoAtualizada = await Usuario.update({
            sessao_usuario
        }, {where: {matricula_usuario}},)
        return sesaoAtualizada
    } catch (err) {
        console.error(err)
        throw err
    }
}

async function inserirToken(matricula_usuario,token) {
    try {
        const tokenInserido = await Usuario.update({
            token_senha_resetar: token
        }, {where: {matricula_usuario}})

        return tokenInserido
    } catch (err) {
        console.error(err)
        throw err
    }
    
}

async function consultarUsuarioPorEmail(email) {
    try {
        const usuario = await Usuario.findOne({
            where: {email}
        })

        return usuario
    } catch (err) {
        console.error(err)
        throw err
    }
}

module.exports = {consultarUsuarioPorEmail,inserirToken,removerSessaoBanco,atualizarSessaoBanco,buscarUsuarioAprovacaoIntervalo,buscarUsuariosLojaAprovacao,buscarUsuariosLoja,criarContaLogin,consultaUsuariosParaAprovacao,aprovarUsuario, inserirUsuario, consultaUsuarios, editarUsuario, deletarUsuario, consultarUsuarioEspecifico, obterPermissaoUsuario, checarEmailNovaSenha,buscarTransacoesPorIntervaloLojaUsuario}