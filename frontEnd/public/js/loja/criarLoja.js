document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        document.getElementById('formCriarLoja').addEventListener('submit', criarLoja)
    }).catch(err => {
        console.error(err)
    })

    
    async function criarLoja(event) {
        event.preventDefault()

        const mensagemDiv = document.getElementById('mensagem')
        
        const lojaCriada = {
            nome_loja: document.getElementById('nome').value,
            cep_loja: document.getElementById('cep').value,
            id_loja: parseInt(document.getElementById('codigoLoja').value)
        }

        try {
            const resposta = await fetch('http://localhost:3000/api/lojas/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(lojaCriada)
            })

            if (resposta.status === 400) {
                mensagemDiv.textContent = `Erro ao criar loja, Cep deve estar no formato "00000-000"`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            } else if (!resposta.ok) {
                const dadosErro = await resposta.json()
                mensagemDiv.textContent = `Erro ao criar loja ${dadosErro.error}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            } else {
                const dados = await resposta.json()
                if (dados) {
                    mensagemDiv.textContent = `Loja criada com sucesso`
                    mensagemDiv.className = 'mensagem sucesso'
                    mensagemDiv.style.display = 'block'
                    setInterval(() => {
                        window.location.href = '/lojas'
                    }, 1500)
                } else {
                    mensagemDiv.textContent = `${dados.error}`
                    mensagemDiv.className = 'mensagem erro'
                    mensagemDiv.style.display = 'block'
                }
            }  
        } catch (err) {
            mensagemDiv.textContent = `${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
            console.error('erro ao atualizar', err)
        }
    }

})

