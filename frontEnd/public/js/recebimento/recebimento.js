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

    if (temPermissao('ADMIN')) {  
        async function fetchTaloes() {
            try {
                const resposta = await fetch('http://localhost:3000/api/recebimentoTaloes/consultarTodos')
                if (!resposta) {
                    throw new Error('Erro na resposta da rede')
                }
    
                const data = await resposta.json()
                const TaloesArray = data.recebimento
    
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
    } else if (temPermissao('CONSULTAS', 'RELATORIOS', 'ATUALIZAR', 'EDICAO')) {
        naoCarregarId('filtro')
        if (!temPermissao('RELATORIOS')) {
            naoCarregarId('exportarTabelas')
        }
        
        async function fetchTaloes() {
            try {
                const resposta = await fetch('http://localhost:3000/api/recebimentoTaloes/consultarRecebimento')
                if (!resposta) {
                    throw new Error('Erro na resposta da rede')
                }
    
                const data = await resposta.json()
                const TaloesArray = data.recebimento
    
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
    }

    
})

async function aplicarFiltro() {
    const id_Loja = parseInt(document.getElementById('idLoja').value)
    const intMax = parseInt(document.getElementById('intervaloMax').value)
    const intMin = parseInt(document.getElementById('intervaloMin').value)
    
    if (isNaN(id_Loja)) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/recebimentoTaloes/consultarIntervalo?idInicio=${intMin}&idFim=${intMax}`)
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
            const resposta = await fetch(`http://localhost:3000/api/recebimentoTaloes/consultarLoja?id_loja=${id_Loja}`)
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
    const tbody = document.querySelector('#tabelaRecebimento tbody')
    tbody.innerHTML = ''

    if (temPermissao('ADMIN')) {
        if (Array.isArray(taloes)) {
            taloes.forEach(talao => {
                if (!talao) {
                    console.error('talao invalido', talao)
                    return
                }
                
                const dataAtualizacao= formatarData(talao.update_em)
        
                const tr = document.createElement('tr')
        
                if (talao.status === 'entregue') {
                    tr.innerHTML = `
                    <td data-label="Loja">${talao.id_loja}</td> 
                    <td data-label="Numero Talão">${talao.id_talao}</td>
                    <td data-label="Numero Remessa">${talao.numero_remessa}</td> 
                    <td data-label="Status">${talao.status}</td>
                    <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                    <td>
                    <button onclick="abrirModal(${talao.id_talao})">Detalhes</button> 
                    </td>
                    `
                    tbody.appendChild(tr)
                } else {
                    if (!talao.status !== 'solicitado') {
                        tr.innerHTML = `
                        <td data-label="Loja">${talao.id_loja}</td> 
                        <td data-label="Numero Talão">${talao.id_talao}</td>
                        <td data-label="Numero Remessa">${talao.numero_remessa}</td> 
                        <td data-label="Status">${talao.status}</td>
                        <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                        <td>
                        <button onclick="window.location.href='/edicaoRecebimento?id_talao=${talao.id_talao}'">Editar</button> 
                        <button onclick="abrirModal(${talao.id_talao})">Detalhes</button> 
                        <button onclick="window.location.href='/informarRecebimento?id_talao=${talao.id_talao}'">Informar Recebimento</button>
                        </td>
                        `
                        tbody.appendChild(tr)
                    }   
                }
            })
        } else {
    
            if (!taloes) {
                console.error('talao invalido', taloes)
                return
            }
                const dataAtualizacao= formatarData(taloes.update_em)
        
                const tr = document.createElement('tr')
        
                if (taloes.status === 'entregue') {
                    tr.innerHTML = `
                    <td data-label="Loja">${taloes.id_loja}</td> 
                    <td data-label="Numero Talão">${taloes.id_talao}</td>
                    <td data-label="Numero Remessa">${taloes.numero_remessa}</td> 
                    <td data-label="Status">${taloes.status}</td>
                    <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                    <td>
                    <button onclick="abrirModal(${taloes.id_talao})">Detalhes</button> 
                    </td>
                    `
                    tbody.appendChild(tr)
                } else {
                    if (!taloes.status !== 'solicitado') {
                        tr.innerHTML = `
                        <td data-label="Loja">${taloes.id_loja}</td> 
                        <td data-label="Numero Talão">${taloes.id_talao}</td>
                        <td data-label="Numero Remessa">${taloes.numero_remessa}</td> 
                        <td data-label="Status">${taloes.status}</td>
                        <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                        <td>
                        <button onclick="window.location.href='/edicaoRecebimento?id_talao=${taloes.id_talao}'">Editar</button> 
                        <button onclick="abrirModal(${taloes.id_talao})">Detalhes</button> 
                        <button onclick="window.location.href='/informarRecebimento?id_talao=${taloes.id_talao}'">Informar Recebimento</button>
                        </td>
                        `
                        tbody.appendChild(tr)
                    }
                }
        }
    } else {
        if (Array.isArray(taloes)) {
            taloes.forEach(talao => {
                if (!talao) {
                    console.error('talao invalido', talao)
                    return
                }
                
                const dataAtualizacao= formatarData(talao.update_em)
        
                const tr = document.createElement('tr')
        
                if (talao.status === 'entregue') {
                    tr.innerHTML = `
                    <td data-label="Loja">${talao.id_loja}</td> 
                    <td data-label="Numero Talão">${talao.id_talao}</td>
                    <td data-label="Numero Remessa">${talao.numero_remessa}</td> 
                    <td data-label="Status">${talao.status}</td>
                    <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                    <td>
                    <p>Talao entregue, sem ações!</p>
                    </td>
                    `
                    tbody.appendChild(tr)
                } else if (!talao.status === 'solicitado') {
                        tr.innerHTML = `
                        <td data-label="Loja">${talao.id_loja}</td> 
                        <td data-label="Numero Talão">${talao.id_talao}</td>
                        <td data-label="Numero Remessa">${talao.numero_remessa}</td> 
                        <td data-label="Status">${talao.status}</td>
                        <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                        <td>
                        <button onclick="window.location.href='/informarRecebimento?id_talao=${talao.id_talao}'">Informar Recebimento</button>
                        </td>
                        `
                        tbody.appendChild(tr)
                    }  else {
                        tr.innerHTML = `
                        <td data-label="Loja">${talao.id_loja}</td> 
                        <td data-label="Numero Talão">${talao.id_talao}</td>
                        <td data-label="Numero Remessa">${talao.numero_remessa}</td> 
                        <td data-label="Status">${talao.status}</td>
                        <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                        <td>
                        <button onclick="window.location.href='/informarRecebimento?id_talao=${talao.id_talao}'">Informar Recebimento</button>
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
                const dataAtualizacao= formatarData(taloes.update_em)
        
                const tr = document.createElement('tr')
        
                if (taloes.status === 'entregue') {
                    tr.innerHTML = `
                    <td data-label="Loja">${taloes.id_loja}</td> 
                    <td data-label="Numero Talão">${taloes.id_talao}</td>
                    <td data-label="Numero Remessa">${taloes.numero_remessa}</td> 
                    <td data-label="Status">${taloes.status}</td>
                    <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                    <td>
                    <button onclick="abrirModal(${taloes.id_talao})">Detalhes</button> 
                    </td>
                    `
                    tbody.appendChild(tr)
                } else {
                    if (!talao.status === 'solicitado') {
                        tr.innerHTML = `
                        <td data-label="Loja">${taloes.id_loja}</td> 
                        <td data-label="Numero Talão">${taloes.id_talao}</td>
                        <td data-label="Numero Remessa">${taloes.numero_remessa}</td> 
                        <td data-label="Status">${taloes.status}</td>
                        <td data-label="Data Ultima Atualização">${dataAtualizacao}</td>
                        <td>
                        <button onclick="window.location.href='/edicaoRecebimento?id_talao=${taloes.id_talao}'">Editar</button> 
                        <button onclick="abrirModal(${taloes.id_talao})">Detalhes</button> 
                        <button onclick="window.location.href='/informarRecebimento?id_talao=${taloes.id_talao}'">Informar Recebimento</button>
                        </td>
                        `
                        tbody.appendChild(tr)
                    }      
                }
        }
    }  
}

function formatarData(dataSQ) {
    const data = new Date(dataSQ)
    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}

async function abrirModal(id_talao) {
    try {
        const resposta = await fetch(`/api/manutencaoTaloes/consultarEspecifico/${id_talao}`)
        if (!resposta.ok) {
            throw new Error("erro ao carregar dados do talao")
        }

        const dados = await resposta.json()
        const talao = dados.talao

        const dataHoraEnvio = formatarData(talao.data_hora_envio)
        const dataEntregaPrevista = formatarData(talao.data_entrega_prevista)
        const dataHoraRecebimento = formatarData(talao.data_hora_recebimento)
        const criadoEm = formatarData(talao.criado_em)
        const updateEm = formatarData(talao.update_em)

        const conteudoModal = document.getElementById('conteudoModal')
        conteudoModal.innerHTML = `
        <p><strong>ID do Talão:</strong> ${talao.id_talao}</p> 
        <p><strong>Quantidade Solicitada:</strong> ${talao.quantidade_talao_solicitado}</p> 
        <p><strong>Quantidade Enviada:</strong> ${talao.quantidade_talao_enviado}</p> 
        <p><strong>Quantidade Recebida:</strong> ${talao.quantidade_talao_recebido}</p> 
        <p><strong>Status:</strong> ${talao.status}</p> 
        <p><strong>Data e Hora de Envio:</strong> ${dataHoraEnvio}</p> 
        <p><strong>Data de Entrega Prevista:</strong> ${dataEntregaPrevista}</p> 
        <p><strong>Data e Hora de Recebimento:</strong> ${dataHoraRecebimento}</p> 
        <p><strong>Número da Remessa:</strong> ${talao.numero_remessa}</p> 
        <p><strong>Matricula do Usuário:</strong> ${talao.id_usuario}</p> 
        <p><strong>ID da Loja:</strong> ${talao.id_loja}</p> 
        <p><strong>Criado em:</strong> ${criadoEm}</p> 
        <p><strong>Atualizado em:</strong> ${updateEm}</p>
        `
        const modal = document.getElementById('modalDetalhes')
        modal.style.display = 'flex'
    } catch (err) {
        console.error('erro ao abrir modal', err)
    }
}

function fecharModal() {
    const modal = document.getElementById('modalDetalhes')
    modal.style.display = 'none'
}

async function pegarCSV() {
    if (temPermissao('ADMIN')) {
        try {
            const resposta = await fetch('http://127.0.0.1:8000/recebimento/export/csv')
            if (!resposta.ok) {
                throw new Error('Erro ao carregar csv')
            }
    
            const blob = await resposta.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'recebimento.csv'
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
    } else {
        try {
            const token = getCookie('token')
            const usuario = converterJWT(token)
            const resposta = await fetch(`http://127.0.0.1:8000/recebimento/loja/export/csv?id_loja=${usuario.loja}`)
            if (!resposta.ok) {
                throw new Error('Erro ao carregar csv')
            }
    
            const blob = await resposta.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'recebimento.csv'
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
}