// tentativas de login para senha errada
let tentativasLogin = {}

// realizar conexao de login
async function login() {
    document.addEventListener('submit', (e) => {
        e.preventDefault()
    })

    document.addEventListener('click', (event) => {
        const mensagemDiv = document.getElementById('mensagem')
        if (mensagemDiv.style.display === 'block' && !mensagemDiv.contains(event.target)) {
            mensagemDiv.style.display = 'none'
        }
    })

    const mensagemDiv = document.getElementById('mensagem')

    const credenciais = {
        matricula_usuario: document.getElementById('matricula').value,
        senha: document.getElementById('senha').value
    }

    const usuarioId = credenciais.matricula_usuario

    if (!tentativasLogin[usuarioId]) {
        tentativasLogin[usuarioId] = { count: 0, locked: false }
    }

    if (tentativasLogin[usuarioId].locked) {
        alert('Você excedeu o número de tentativas, aguarde 3 minutos.')

        let contador = 180;
        const intervaloId = setInterval(() => {
            if (contador > 0) {
                document.getElementById('senhaDiv').style.display = 'none';
                document.getElementById('matriculaDiv').textContent = `Por favor, aguarde ${contador} segundos...`
                contador--
            } else {
                clearInterval(intervaloId);
                document.getElementById('senhaDiv').style.display = 'block'
                document.getElementById('matriculaDiv').textContent = ''
            }
        }, 1000)
        return
    }
    

    try {
        const resposta = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciais)
        })
        
        if (resposta.status === 401) {
            mensagemDiv.textContent = `senha invalida ${resposta.statusText}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
            tentativasLogin[usuarioId].count++
            if (tentativasLogin[usuarioId].count >= 3) {
                tentativasLogin[usuarioId].locked = true
                mensagemDiv.textContent = "Você excedeu o número de tentativas. Por favor, aguarde 180 segundos."
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'

                tentativasLogin[usuarioId].timer = setTimeout(() => {
                    tentativasLogin[usuarioId].locked = false
                    tentativasLogin[usuarioId].count = 0
                    tentativasLogin[usuarioId].timer = null
                    document.getElementById('matriculaDiv').textContent = ''
                }, 180000);

                let contador = 180;
                const intervaloId = setInterval(() => {
                    if (contador > 0) {
                        document.getElementById('matriculaDiv').textContent = `Tempo de espera (${contador}) segundos... 
                        Múltiplas tentativas de senha invalida, caso tenha esquecido suas informações, contate o administrador ou clique em esqueceu a senha.`
                        contador--
                    } else {
                        clearInterval(intervaloId)
                        document.getElementById('matriculaDiv').textContent = ''
                    }
                }, 1000)
            }
            return
        }
       
        if (resposta.status === 403) {
            mensagemDiv.textContent = `Sessao ja existe, por favor fazer logout da sessao anterior, para seguir com novo login.`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
            const buttonLogout = document.getElementById('logout')
            buttonLogout.style.display = 'block'
        }
        
        if (resposta.status === 409) {
            mensagemDiv.textContent = `cadastro nao foi finalizado, aguarde aprovação do administrador.`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }

        const dados = await resposta.json()

        if (dados.error) {
            mensagemDiv.textContent = dados.message
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }

        if (dados.token) {
            document.cookie = `token=${dados.token}; path=/`
            tentativasLogin[usuarioId].count = 0
            mensagemDiv.textContent = 'Login realizado com sucesso, redirecionando...'
            mensagemDiv.className = 'mensagem sucesso'
            mensagemDiv.style.display = 'block'
            setInterval(() => {
                window.location.assign('http://localhost:3000/indexAdmin')
            }, 2000)
        }
    } catch (error) {
        const mensagemDiv = document.getElementById('mensagem')
        mensagemDiv.textContent = `erro na requisição ${error.message}`
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }
}

// realizar logout caso precise, para evitar multiplos logins
async function logout() {
    const mensagemDiv = document.getElementById('mensagem')
    const enviarMatricula = {
        matricula_usuario: parseInt(document.getElementById('matricula').value)
    }
    fetch('http://localhost:3000/api/auth/logout', {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(enviarMatricula)
    }).then(resposta => {
        if (!resposta) {
            throw new Error('erro ao fazer logout')
        }
        return resposta.json()
    }).then(dados => {
        mensagemDiv.textContent = `${dados.message}`
        mensagemDiv.className = 'mensagem sucesso'
        mensagemDiv.style.display = 'block'
    }).catch(err => {
        console.error(err)
        throw err
    }) 
}