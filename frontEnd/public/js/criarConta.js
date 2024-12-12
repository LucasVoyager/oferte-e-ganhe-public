// função para usuario realizar criação de conta atraves da tela inicial, realizar um fetch post para o back end e trata cada resposta status da sua devida maneira
async function criarConta() {
    document.addEventListener("submit", (e) => {
        e.preventDefault()
    })

    document.addEventListener('click', (event) => {
        const mensagemDiv = document.getElementById('mensagem')
        if (mensagemDiv.style.display === 'block' && !mensagemDiv.contains(event.target)) {
            mensagemDiv.style.display = 'none'
        }
    })

    const mensagemDiv = document.getElementById('mensagem')
    
    const nome = document.getElementById('nome').value
    const matricula_usuario = document.getElementById('matricula').value
    const email = document.getElementById('email').value
    const id_loja = document.getElementById('loja').value
    const senha = document.getElementById('senha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    if (!nome || !matricula_usuario || !email || !id_loja || !senha || !confirmarSenha) {
            mensagemDiv.textContent = `todos os campos devem ser preenchidos`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
    }

    if (senha != confirmarSenha) {
        mensagemDiv.textContent = `senhas devem ser iguais`
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }

    const data = {nome, matricula_usuario, email, id_loja, senha}

    try {
        const resposta = await fetch('/api/login/criarConta', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(data)
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            mensagemDiv.textContent = `${dados.message}`
            mensagemDiv.className = 'mensagem sucesso'
            mensagemDiv.style.display = 'block'
            setInterval(() => {
                 window.location.href = 'http://localhost:3000/api/login'
            }, 2000)
        } else {
            console.error('Erro ao enviar dados', resposta.statusText)
            mensagemDiv.textContent = `${dados.error}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
    } catch (err) {
        console.error('error', err)
        const mensagemDiv = document.getElementById('mensagem')
        mensagemDiv.textContent = `${err}`
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }

}