document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        fetchTaloes()
    }).catch(err => {
        console.error(err)
    })

    async function fetchTaloes() {
        try {
            const resposta = await fetch('http://localhost:3000/api/envioTaloes/consultarTodos')
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }

            const data = await resposta.json()
            const TaloesArray = data.envio

            if (Array.isArray(TaloesArray)) {
                exibirTaloes(TaloesArray)
            } else {
                console.error('dados nao sao um array', TaloesArray)
            }
            
        } catch (err) {
            console.error('error', err)
        }
    }

    window.fetchTaloes = fetchTaloes
})

async function aplicarFiltro() {
    const id_Loja = parseInt(document.getElementById('idLoja').value)
    const intMax = parseInt(document.getElementById('intervaloMax').value)
    const intMin = parseInt(document.getElementById('intervaloMin').value)
    
    if (isNaN(id_Loja)) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/envioTaloes/consultarIntervalo?idInicio=${intMin}&idFim=${intMax}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const taloesArrayFiltrado = data.transacoes
                exibirTaloes(taloesArrayFiltrado)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    } else {
        try {
            const resposta = await fetch(`http://localhost:3000/api/envioTaloes/consultarLojaIntervalo?id_loja=${id_Loja}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const taloesArrayLoja = data.transacoes
                exibirTaloes(taloesArrayLoja)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function exibirTaloes(taloes) {
    const tbody = document.querySelector('#tabelaAprovarSolicitacao tbody')
    tbody.innerHTML = ''

    if (Array.isArray(taloes)) {
        taloes.forEach(talao => {
            if (!talao) {
                console.error('talao invalido', talao)
                return
            } 

            if (talao.status === 'solicitado') {
                const dataCriacao = formatarData(talao.criado_em)

                const tr = document.createElement('tr')

            tr.innerHTML = `
                <td data-label="Loja">${talao.id_loja}</td> 
                <td data-label="Quantidade Talao Solicitado">${talao.quantidade_talao_solicitado}</td>
                <td data-label="Matricula Usuario">${talao.id_usuario}</td>
                <td data-label="Data Criação">${dataCriacao}</td>
                <td>
                <button onclick="aprovarEnvio(${talao.id_talao})">Aprovar</button>
                <button onclick="deletarEnvio(${talao.id_talao})">Rejeitar</button>  
                </td>
                `
                tbody.appendChild(tr)
            }  
        })
    } else {

        if (!taloes) {
            console.error('talao invalido', taloes)
            return
        }

        if (taloes.status === 'solicitado') {
            const dataCriacao = formatarData(taloes.criado_em)
   
            const tr = document.createElement('tr')

            tr.innerHTML = `
                <td data-label="Loja">${taloes.id_loja}</td> 
                <td data-label="Quantidade Talao SOlicitado">${taloes.quantidade_talao_solicitado}</td>
                <td data-label="Matricula Usuario">${taloes.id_usuario}</td>
                <td data-label="Data Criação">${dataCriacao}</td>
                <td>
                <button onclick="aprovarEnvio(${taloes.id_talao})">Editar</button> 
                </td>
                `
                tbody.appendChild(tr)
        }
        
    }
}

async function aprovarEnvio(id_talao) {
    id_talao = parseInt(id_talao)
    const mensagemDiv = document.getElementById('mensagem')
    try {
        const resposta = await fetch(`http://localhost:3000/api/envioTaloes/aprovarSolicitacao/${id_talao}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
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
                window.location.href = `/editarEnvio?id_talao=${id_talao}`
            }, 1500)
        } else {
            mensagemDiv.textContent = `Erro ao aprovar talao ${dados.error}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
        
    } catch (err) {
        console.error('erro ao atualizar', err)
        mensagemDiv.textContent = `Erro ao aprovar ${err}`
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }
}

async function deletarEnvio(id_talao) {
    id_talao = parseInt(id_talao)
    const mensagemDiv = document.getElementById('mensagem')
    try {
        const resposta = await fetch(`http://localhost:3000/api/envioTaloes/deletar/${id_talao}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
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
                window.location.href = `/envioTaloes`
            }, 1500)
        } else {
            mensagemDiv.textContent = `Erro ao aprovar talao ${dados.error}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
        
    } catch (err) {
        console.error('erro ao atualizar', err)
        mensagemDiv.textContent = `Erro ao aprovar ${err}`
        mensagemDiv.className = 'mensagem erro'
        mensagemDiv.style.display = 'block'
    }
}

function formatarData(dataSQ) {
    const data = new Date(dataSQ)
    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}
