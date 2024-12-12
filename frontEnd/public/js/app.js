document.addEventListener('DOMContentLoaded', () => {
    // carrega matricula usuario geral
    Promise.all([]).then(carregaDadosUsuario(usuario.matricula_usuario)).catch(err => {
        console.error(err)
    })
   
    async function carregaDadosUsuario(matricula_usuario) {
        try {
            const resposta = await fetch(`/api/usuarios/consultarEspecifico/${matricula_usuario}`)
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const data = await resposta.json()
            const usuariosArray = data.usuario
            preencherUsuarioHeader(usuariosArray)
              
        } catch (err) {
            console.error('error', err)
        }
    }
    // preenche informações do usuario que estao no header apos receber dados da função carregar ususario
    async function preencherUsuarioHeader(usuarioA) {
        const usuario = document.getElementById('username')
        const perfil = document.getElementById('profile-name')
    
        usuario.textContent = usuarioA.nome
        perfil.textContent = usuarioA.Perfil.nome_perfil
    }
    // verifica permissao direto do token para esconder certos ids da sidebar
    if (!temPermissao('ADMIN')) {
        naoCarregarId('perfisEusuarioAs')
        naoCarregarId('lojaAs')
        if (!temPermissao('EDICAO')) {
            naoCarregarId('manutencaoAs')
       }
    }

    document.addEventListener('click', (event) => {
        const mensagemDiv = document.getElementById('mensagem')
        if (mensagemDiv.style.display === 'block' && !mensagemDiv.contains(event.target)) {
            mensagemDiv.style.display = 'none'
        }
    })
    
})
// recebendo token
const token = getCookie('token')
// convertendo token jwt
const usuario = converterJWT(token)
// verificando permissoes
const temPermissao = (...permissoes) => {
    return  permissoes.some(p => usuario.tipoPermissoes.includes(p))
}
// funcao para realizar logout, realiza um fetch post para apagar cookie token e encerrar sessao salva no banco, quem faz isso é a rota
function logout() {
    fetch('http://localhost:3000/api/auth/logout', {
        method: 'Post',
        credentials: 'include'
    }).then(resposta => {
        if (!resposta) {
            throw new Error('erro ao fazer logout')
        }
        return resposta.json()
    }).then(dados => {
        window.location.href = 'http://localhost:3000/api/login'
    }).catch(err => {
        console.error(err)
        throw err
    }) 
}
// funcao para receber cookie direto do front end
function getCookie(nome) {
    const cookies = document.cookie.split(';')
    for (let cookie of cookies) {
        cookie = cookie.trim()
        if (cookie.startsWith(nome + '=')) {
            return cookie.substring((nome + '=').length)
        }
    }   
    return null
}
// funcao para converter jwt do token
function converterJWT(token) {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(jsonPayload)
}
// funcao para nao carregar componentes com base na sua permissao
function naoCarregarId(id) {
    id = document.getElementById(id)
    return id.style.display = 'none'
}
// funcao para exibir sidebar quando ativa
function toggleSidebar() {
    document.querySelector('.aside').classList.toggle('active')
}