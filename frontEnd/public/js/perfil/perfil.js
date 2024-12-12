document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        fetchPerfis()
    }).catch(err => {
        console.error(err)
    })

    async function fetchPerfis() {
        try {
            const resposta = await fetch('http://localhost:3000/api/perfis/consultarTodos')
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const data = await resposta.json()
            const perfisArray = data.perfis

            if (Array.isArray(perfisArray)) {
                exibirPerfis(perfisArray)
            } else {
                console.error('dados nao sao um array', perfisArray)
            }
            
        } catch (err) {
            console.error('error', err)
        }
    }

    window.fetchPerfis = fetchPerfis
})

async function aplicarFiltro() {
    const id_perfil = parseInt(document.getElementById('idPerfil').value)
    const intMax = parseInt(document.getElementById('intervaloMax').value)
    const intMin = parseInt(document.getElementById('intervaloMin').value)
    
    if (isNaN(id_perfil)) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/perfis/consultarIntervalo?idInicio=${intMin}&idFim=${intMax}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const perfisArrayFiltrado = data.perfis
                exibirPerfis(perfisArrayFiltrado)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    } else {
        try {
            const resposta = await fetch(`/api/perfis/consultarPerfil?id_perfil=${id_perfil}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const perfisArray = data.perfis
                exibirPerfis(perfisArray)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function exibirPerfis(Perfis) {
    const tbody = document.querySelector('#tabelaPerfis tbody')
    tbody.innerHTML = ''

    if (Array.isArray(Perfis)) {
        Perfis.forEach(perfil => {
            if (!perfil) {
                console.error('perfil invalido', perfil)
                return
            }

            const permissoes = perfil.Permissoes.map(permissao => permissao.nome_permissao).join(',')
    
            const tr = document.createElement('tr')
            tr.innerHTML = `
            <td data-label="ID Perfil">${perfil.id_perfil}</td> 
            <td data-label="Nome Perfil">${perfil.nome_perfil.toUpperCase()}</td>
            <td data-label="Permissoes">${permissoes}</td> 
            <td> 
            <button onclick="window.location.href='/editarPerfil?id_perfil=${perfil.id_perfil}'">Editar</button> 
            <button onclick="deletarPerfil(${perfil.id_perfil})">Deletar</button> 
            </td>
            `
            tbody.appendChild(tr)
        })
    } else {

        const permissoes = Perfis.Permissoes.map(permissao => permissao.nome_permissao).join(',')

        const tr = document.createElement('tr')
            tr.innerHTML = `
            <td data-label="ID Perfil">${Perfis.id_perfil}</td> 
            <td data-label="Nome Perfil">${Perfis.nome_perfil.toUpperCase()}</td>
            <td data-label="Permissoes">${permissoes}</td> 
            <td> 
            <button onclick="window.location.href='/editarPerfil?id_perfil=${Perfis.id_perfil}'">Editar</button> 
            <button onclick="deletarPerfil(${Perfis.id_perfil})">Deletar</button> 
            </td>
            `
            tbody.appendChild(tr)
    }
}

async function deletarPerfil(id_perfil) {
    const mensagemDiv = document.getElementById('mensagem')
    if (confirm('Tem certeza que deseja deletar este perfil?'))
        try {
            const resposta = await fetch(`http://localhost:3000/api/perfis/deletar/${id_perfil}`, {
                method: 'DELETE'
            })

            const dados = await resposta.json()

            if (resposta.ok) {
                mensagemDiv.textContent = ` ${dados.message}`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                fetchPerfis()
            } else {
                mensagemDiv.textContent = `Erro ao deletar perfil ${dados.error}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }
        } catch (err) {
            console.error(err)
            mensagemDiv.textContent = `Erro ao deletar perfil ${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
}
               
async function pegarCSV() {
    try {
        const resposta = await fetch('http://127.0.0.1:8000/perfil/export/csv')
        if (!resposta.ok) {
            throw new Error('Erro ao carregar csv')
        }

        const blob = await resposta.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'perfis.csv'
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