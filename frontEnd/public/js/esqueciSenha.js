// função para salvar nova senha, faz o fetch na rota post para alterar senha, verifica email, verifica o token (ambos sao pegos por parametros da rota atraves do params) e envio para o back end
async function salvarSenha() {
    params = new URLSearchParams(window.location.search)
    const email = params.get('email')
    const token = params.get('token')
    const senha = document.getElementById('senha').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

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

    if ( !email ||  !senha || !confirmarSenha) {
        mensagemDiv.textContent = `todos os campos devem ser preenchidos`
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }

    if (senha != confirmarSenha) {
        mensagemDiv.textContent = `senhas devem ser iguais`
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }

    const data = {email, senha, token}

    try {
        const resposta = await fetch('http://localhost:3000/api/auth/esqueciSenha', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify(data)
        })
     
        if (resposta.status === 409) {
            mensagemDiv.textContent = `A senha nao pode ser igual a anterior`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
            return
        }
       
        if(!resposta.ok) {
            mensagemDiv.textContent = `erro ao trocar senha, email nao encontrado`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
       
        if (resposta.ok) {
            mensagemDiv.textContent = `senha alterada com sucesso!`
            mensagemDiv.className = 'mensagem sucesso'
            mensagemDiv.style.display = 'block'
            setInterval(() => {
                window.location.href = 'http://localhost:3000/api/login'
            }, 2000)
        } else {
            mensagemDiv.textContent = 'Erro ao enviar dados'
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
    } catch (err) {
        console.error('error', err)
        const mensagemDiv = document.getElementById('mensagem')
        mensagemDiv.textContent = 'Erro ao enviar dados', err
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }

}

// função que faz o fetch na rota post para enviar email do usuario, realizo verificações e retorno cada mensagem personalizada com base na sua resposta.status
async function enviarEmail() {
    document.getElementById('recoverPasswordForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        document.addEventListener('click', (event) => {
            const mensagemDiv = document.getElementById('mensagem')
            if (mensagemDiv.style.display === 'block' && !mensagemDiv.contains(event.target)) {
                mensagemDiv.style.display = 'none'
            }
        })
    
        fetch('/api/requisitarSenhaEMail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const mensagemDiv = document.getElementById('mensagem')
                mensagemDiv.textContent = `Um link de redefinição de senha foi enviado para o seu email.`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                setInterval(() => {
                    window.location.href = 'http://localhost:3000/api/login'
                }, 2000)
            } else {
                mensagemDiv.textContent = `Erro ao enviar o link de redefinição de senha. ${resposta.statusText}`, 
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            mensagemDiv.textContent = `${error}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        });
    })    
}