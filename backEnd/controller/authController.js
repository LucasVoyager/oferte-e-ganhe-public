const fs = require('fs')
const { consultarUsuarioEspecifico, obterPermissaoUsuario, checarEmailNovaSenha, atualizarSessaoBanco, removerSessaoBanco, inserirToken, consultarUsuarioPorEmail } = require('../services/usuarioServices')
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken')
const { esquemaUsuario } = require('../utils/validateInputs')
const { compareSenha } = require('../utils/hashSenha');
const path = require('path');
const jwtSecret = process.env.JWT_SECRET || 'default_secret'
const htmlConteudo = fs.readFileSync(path.join(__dirname, '../../frontEnd/public/emailTemplate.html'), 'utf8')

const login = async (req, res) => {
    try {
        const {matricula_usuario, senha} = req.body

        const {error} = esquemaUsuario.validate({ matricula_usuario,senha}) 
        if (error) {
        return res.status(400).json({error: error.details[0].message})
        }

        const usuario = await consultarUsuarioEspecifico(matricula_usuario, senha)
        if (usuario.id_perfil === null) {
            return res.status(409).json({message: 'Usuario nao possui perfil relacionado!!!'})
        }

        if (!usuario) {
            return res.status(404).json({message: "usuario nao encontrado"})
        }
        const senhaValida  = await compareSenha(senha, usuario.senha)

        if (!senhaValida) {
            return res.status(401).json({message: "Senha invalida", senha})
        }

       const sessaoAtual = usuario.sessao_usuario

       if (sessaoAtual) {
            return res.status(403).json({message: 'Sessao ativa encontrada. Faça logout primeiro.'})
       }

        const permissoes = await obterPermissaoUsuario(usuario.matricula_usuario)

        if (permissoes === null) {
            return res.status(409).json({message: 'Usuario nao possui perfil relacionado!!!'})
        }

        const token = jwt.sign(
            {matricula_usuario: usuario.matricula_usuario, loja: usuario.id_loja, 
                tipoPermissoes: permissoes.map(p => (p.nome_permissao))},jwtSecret, {expiresIn: "9h"}
        )

        const expires_at = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString()
        
        const atualizandoSessao = await atualizarSessaoBanco([JSON.stringify({token, expires_at: expires_at})], usuario.matricula_usuario)
       
        res.cookie('token', token, {httpOnly: false,})
        res.status(200).json({token, expires_at})
    
        
    } catch (err) {
        console.error('erro ao fazer login', err)
        res.status(500).json({message: "algo deu errado", error: err.message})
    }
}

const logout = async (req,res) => {
    try {
        const token = req.cookies.token
        if (token) {
            const decoded = jwt.decode(token, jwtSecret)
            const {matricula_usuario} = decoded
        
            const removerSessaoUsuario = await removerSessaoBanco(matricula_usuario)
                
            if (removerSessaoUsuario) {
                res.clearCookie('token', {httpOnly: false})
                res.status(200).json({message: 'cookie removido e sessao finalizada.'})
            }
        } else {
            const {matricula_usuario} = req.body
            const removerSessaoUsuario = await removerSessaoBanco(matricula_usuario)
                    
                if (removerSessaoUsuario) {
                    res.clearCookie('token', {httpOnly: false})
                    res.status(200).json({message: 'cookie removido e sessao finalizada.'})
                }
        }    
    } catch (err) {
        res.status(500).json({message: 'erro ao fazer logout', error: err.message})
    }
      
}

const esqueciSenha = async (req, res) => {
    const {email, senha, token} = req.body

    const {error} = esquemaUsuario.validate({email, senha}) 
    if (error) {
        return res.status(400).json({error: error.details[0].message})
    }

    try {
        const usuario = await consultarUsuarioPorEmail(email)
        if (usuario.token_senha_resetar === token) {
            const verificaSenha = await compareSenha(senha, usuario.senha)
            if (!verificaSenha) {
                const emailTrocarSenha = await checarEmailNovaSenha(email, senha)
                if (emailTrocarSenha) {
                    res.status(201).json({message: 'senha trocada com sucesso', emailTrocarSenha})
                }  else {
                    res.status(404).json({message: 'email nao encontrado e token nao confere'})
                } 
            } else {
                res.status(409).json({message: 'senhas nao podem ser iguais'}) 
            }
        }     
    } catch (err) {
        res.status(500).json({message: 'erro ao tentar trocar a senha', error: err.message})
    }
}

const recuperarEmail = async (req, res) => {
    const { email } = req.body;
     if (!email) 
    { return res.status(400).json({ success: false, message: 'Email não encontrado' }); }

     const usuario = await consultarUsuarioPorEmail(email)

     const token = jwt.sign({email: email}, jwtSecret, {expiresIn: '1h'})

     const armazenarToken = await inserirToken(usuario.matricula_usuario,token)

     if (!armazenarToken) {
        res.status(400).json({message: 'erro ao armazenar token'})
     }
    
     const transporter = nodemailer.createTransport({
     service: 'gmail', 
     auth: { 
        user: 'lucasbarrosdossant@gmail.com', 
        pass: process.env.SENHA_GMAIL } 
    })
    
    const mailOptions = { 
        to: email, 
        from: 'lucasbarrosdossant@gmail.com', 
        subject: 'Redefinição de Senha',
        html: htmlConteudo.replace('{{email}}', email).replace('{{token}}', token),
        attachments: [{ 
            filename: 'logo.png', 
            path: 'C:\\Users\\980258\\Desktop\\Aulas\\Atividade\\frontEnd\\public\\images\\logo.png', 
            cid: 'logo' }]
    };
    
     transporter.sendMail(mailOptions, (err, response) => { if (err) { console.error('Erro ao enviar email:', err); return res.status(500).json({ success: false, message: 'Erro ao enviar o email' }); } res.json({ success: true, message: 'Email de redefinição de senha enviado com sucesso' }); })
}

module.exports = {login, logout, esqueciSenha, recuperarEmail}