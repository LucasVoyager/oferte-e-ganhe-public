document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        fetchLojas()
    }).catch(err => {
        console.error(err)
    })

    async function fetchLojas() {
        try {
            const resposta = await fetch('http://localhost:3000/api/lojas/consultarTodas')
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const data = await resposta.json()
            const lojasArray = data.lojas

            if (Array.isArray(lojasArray)) {
                exibirLojas(lojasArray)
            } else {
                console.error('dados nao sao um array', lojasArray)
            }
            
        } catch (err) {
            console.error('error', err)
        }
    }

    window.fetchLojas = fetchLojas
})


async function aplicarFiltro() {
    const id_Loja = parseInt(document.getElementById('idLoja').value)
    const intMax = parseInt(document.getElementById('intervaloMax').value)
    const intMin = parseInt(document.getElementById('intervaloMin').value)
    
    if (isNaN(id_Loja)) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/lojas/consultarTodas?idInicio=${intMin}&idFim=${intMax}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const lojasArrayFiltrado = data.lojas
                exibirLojas(lojasArrayFiltrado)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    } else {
        try {
            const resposta = await fetch(`http://localhost:3000/api/lojas/consultarLoja?id_loja=${id_Loja}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const lojasArrayLoja = data.lojas
                exibirLojas(lojasArrayLoja)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function exibirLojas(Lojas) {
    const tbody = document.querySelector('#tabelaLojas tbody')
    tbody.innerHTML = ''

    if (Array.isArray(Lojas)) {
        Lojas.forEach(loja => {
            if (!loja) {
                console.error('loja invalida', loja)
                return
            }
    
            const tr = document.createElement('tr')
            tr.innerHTML = `
            <td data-label="Loja">${loja.id_loja}</td> 
            <td data-label="Nome da Loja">${loja.nome_loja}</td>
            <td data-label="Cep">${loja.cep_loja}</td> 
            <td> 
            <button onclick="window.location.href='/editarLoja?id_loja=${loja.id_loja}'">Editar</button> 
            <button onclick="deletarloja(${loja.id_loja})">Deletar</button> 
            </td>
            `
            tbody.appendChild(tr)
        })
    } else {
        const tr = document.createElement('tr')
            tr.innerHTML = `
            <td data-label="Loja">${Lojas.id_loja}</td> 
            <td data-label="Nome da Loja">${Lojas.nome_loja}</td>
            <td data-label="Cep">${Lojas.cep_loja}</td> 
            <td> 
            <button onclick="window.location.href='/editarLoja?id_loja=${Lojas.id_loja}'">Editar</button> 
            <button onclick="deletarloja(${Lojas.id_loja})">Deletar</button> 
            </td>
            `
            tbody.appendChild(tr)
    }
}

async function deletarloja(id_loja) {
    const mensagemDiv = document.getElementById('mensagem')
    if (confirm('Tem certeza que deseja deletar esta loja?'))
        try {
            const resposta = await fetch(`http://localhost:3000/api/lojas/deletar/${id_loja}`, {
                method: 'DELETE'
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                mensagemDiv.textContent = ` ${dados.message}`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                fetchLojas()
            } else {
                mensagemDiv.textContent = `Erro ao deletar loja ${dados.error}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }
        } catch (err) {
            console.error(err)
            mensagemDiv.textContent = `Erro ao deletar loja ${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
               
}

async function pegarCSV() {
    try {
        const resposta = await fetch('http://127.0.0.1:8000/lojas/export/csv')
        if (!resposta.ok) {
            throw new Error('Erro ao carregar csv')
        }

        const blob = await resposta.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'lojas.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        const mensagemDiv = document.getElementById('mensagem')
        mensagemDiv.textContent = `Exportado com sucesso.`
        mensagemDiv.className = 'mensagem sucesso'
        mensagemDiv.style.display = 'block'
    } catch (err) {
        console.error('erro ao exportar csv', err)
    }
}