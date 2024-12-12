const jwt = require("jsonwebtoken")
const { consultarUsuarioEspecifico } = require("../services/usuarioServices")
const jwtSecret = process.env.JWT_SECRET || 'default_secret'

const verificaToken = async (req, res, next) => {
    const token = req.cookies.token
   
    if(!token) {
        return res.status(401).json({message: "sem token de autorização"})
    } else if (token) {
        try {
            const decoded = jwt.verify(token, jwtSecret)
            if(!decoded) {
                return res.status(401).json({message: "sem token de autorização"})
            }

            const sessaovalida = await validarSessao(decoded.matricula_usuario,token)
            if (!sessaovalida) {
                return res.status(401).json({message: 'Sessao invalida ou expirada.'})
            }
            const decode = jwt.verify(token, jwtSecret)
            req.user = decode
            next()
        } catch(err) {
            res.status(401).json({message: "token nao é valido"})
        }   
    } else {
        return res.status(403).json({message: "sem token de autorização"})
    }
    
}

const verificaPermissoes = (...permissoes) => { 
    return (req,res,next) => {
        const tipoPermissoesUser = req.user.tipoPermissoes
        if(tipoPermissoesUser.includes('ADMIN')) {
            return next()
        }
       
        if (permissoes.some(elem => tipoPermissoesUser.includes(elem))) {
            return next()
        }
        
        res.status(403).json({message: 'nao tem acesso'})
    }
}

const verificaLojaUsuario = (loja) => {
    return (req, res, next) => {
        const loja = req.user.loja 
        next()
    }
}

const salvaMatricula = (matricula) => {
    return (req, res, next) => {
        const matricula = req.user.matricula_usuario
        next()
    }
}

// implementando validação por timeout
const validarSessao = async (matricula_usuario, token) => {
        try {
            const result = await consultarUsuarioEspecifico(matricula_usuario)

            if (!result) {
                return false
            }

            const sessao = result.sessao_usuario
            
            if (!sessao || sessao.length === 0) {
                return false
            }
            
            const sessaoObj = JSON.parse(sessao[0])
            const expiresAt = sessaoObj.expires_at

            if (new Date(expiresAt) < new Date()) {
                return false
            }

           return true
        } catch (err) {
            return false
        }
}


module.exports = {validarSessao,verificaToken, verificaPermissoes, verificaLojaUsuario, salvaMatricula}