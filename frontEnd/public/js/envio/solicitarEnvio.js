document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        document.getElementById('formCriarTalao').addEventListener('submit', criarTalao)
    }).catch(err => {
        console.error(err)
    })
  
    async function criarTalao(event) {
        event.preventDefault()
        const mensagemDiv = document.getElementById('mensagem')
    
        const talaoCriado = {
            quantidade_talao_solicitado: parseInt(document.getElementById('quantidadeSolicitada').value)
        }

        try {
            const resposta = await fetch('http://localhost:3000/api/envioTaloes/solicitacaoEnvioLoja', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(talaoCriado)
            })

            if (!resposta.ok) {
                const errorResposta = await resposta.json()
                mensagemDiv.textContent = `${errorResposta}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'     
            }

            const dados = await resposta.json()
            if (dados) {
                mensagemDiv.textContent = ` ${dados.message}`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                setInterval(() => {
                window.location.href = '/envioTaloes'
             })
            } else {
                mensagemDiv.textContent = `Erro ao solicitar talao ${dados.error}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }
            
        } catch (err) {
            console.error('erro ao atualizar', err)
            mensagemDiv.textContent = `Erro ao solicitar ${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
    }

})