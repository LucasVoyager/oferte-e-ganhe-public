document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        carregarDadosLoja()
        document.getElementById('formEditarLoja').addEventListener('submit', atualizarLoja)
    }).catch(err => {
        console.error(err)
    })

    async function carregarDadosLoja(params) {
        params = new URLSearchParams(window.location.search)
        const id_loja = parseInt(params.get('id_loja'))
        
        try {
            const resposta = await fetch(`http://localhost:3000/api/lojas/consultarLoja?id_loja=${id_loja}`)
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const dados = await resposta.json()
            const lojas = dados.lojas
            preencherFormulario(lojas)
        } catch (err) {
            console.error('erro ao carregar dados', err)
        }
    }

    function preencherFormulario(lojas) {
        document.getElementById('nome').value = lojas.nome_loja
        document.getElementById('codigoLoja').value = lojas.id_loja
        document.getElementById('cep').value = lojas.cep_loja    
    }

    
    async function atualizarLoja(event) {
        event.preventDefault()

        const mensagemDiv = document.getElementById('mensagem')
        
        const lojaAtualizada = {
            nome_loja: document.getElementById('nome').value,
            cep_loja: document.getElementById('cep').value,
            id_loja: parseInt(document.getElementById('codigoLoja').value)
        }
       

        try {
            const resposta = await fetch(`http://localhost:3000/api/lojas/editar/${lojaAtualizada.id_loja}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(lojaAtualizada)
            })

            if (!resposta.ok) {
                mensagemDiv.textContent = `Erro ao atualizar loja`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }

            const dados = await resposta.json()
            if (dados) {
                mensagemDiv.textContent = `${dados.message}`
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
            
        } catch (err) {
            mensagemDiv.textContent = `${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
            console.error('erro ao atualizar', err)
        }
    }

})

