document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    } 

    if (!temPermissao('ADMIN')) {
        fetchEstoque().then(() => {
            naoCarregarId('criarLojaID')
            naoCarregarId('definirQuantidadeID')
            naoCarregarId('filtro')
            if (!temPermissao('RELATORIOS')) {
                naoCarregarId('exportarTabelas')
            } 
        }).catch(err => {
            console.error(err)
        })
    
        async function fetchEstoque() {
            try {
                const resposta = await fetch('http://localhost:3000/api/estoqueTaloes/consultarLojaUsuario')
                if (!resposta.ok) {
                    throw new Error('Erro na resposta da rede')
                }
   
                const data = await resposta.json()
                const estoqueArray = data.estoque
    
                if (Array.isArray(estoqueArray)) {
                    exibirEstoque(estoqueArray)
                } else {
                    console.error('dados nao sao um array', estoqueArray)
                }
                
            } catch (err) {
                console.error('error', err)
            }
        }

        window.fetchEstoque = fetchEstoque
      
    } 
    fetchEstoque().catch(err => {
        console.error(err)
    })

    async function fetchEstoque() {
        try {
            const resposta = await fetch('http://localhost:3000/api/estoqueTaloes/consultarTodos')
            if (!resposta.ok) {
                throw new Error('Erro na resposta da rede')
            }

            const data = await resposta.json()
            const estoqueArray = data.estoque

            if (Array.isArray(estoqueArray)) {
                exibirEstoque(estoqueArray)
            } else {
                console.error('dados nao sao um array', estoqueArray)
            }
            
        } catch (err) {
            console.error('error', err)
        }
    }
    document.addEventListener('submit', (e) => {
        e.preventDefault()
    })

    window.fetchEstoque = fetchEstoque

})

const mensagemDiv = document.getElementById('mensagem')

async function aplicarFiltro() {
    const id_Loja = parseInt(document.getElementById('idLoja').value)
    const intMax = parseInt(document.getElementById('intervaloMax').value)
    const intMin = parseInt(document.getElementById('intervaloMin').value)
    
    if (isNaN(id_Loja)) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/estoqueTaloes/consultarIntervalo?idInicio=${intMin}&idFim=${intMax}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const estoqueArrayFiltrado = data.transacoes
                exibirEstoque(estoqueArrayFiltrado)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    } else {
        try {
            const resposta = await fetch(`http://localhost:3000/api/estoqueTaloes/consultarLojaEstoque?id_loja=${id_Loja}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const estoqueArrayLoja = data.estoques
                exibirEstoque(estoqueArrayLoja)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function exibirEstoque(estoques) {
    const tbody = document.querySelector('#tabelaEstoque tbody')
    tbody.innerHTML = ''

    if (temPermissao('ADMIN')) {
        if (Array.isArray(estoques)) {
            estoques.forEach(estoque => {
                if (!estoque) {
                    console.error('estoque invalido', estoque)
                    return
                }
                
                const tr = document.createElement('tr')
                tr.innerHTML = `
                <td data-label="Loja">${estoque.id_loja}</td> 
                <td data-label="Quantidade Atual">${estoque.quantidade_atual}</td>
                <td data-label="Status">${estoque.status}</td> 
                <td data-label="Quantidade Minima">${estoque.quantidade_minima}</td> 
                <td data-label="Quantidade Recomendada">${estoque.quantidade_recomendada}</td>
                <td> 
                <button onclick="abrirModal('editarCampos',${estoque.id_loja})">Editar</button> 
                <button onclick="deletarEstoque(${estoque.id_estoque})">Deletar</button>  
                </td>
                `
                tbody.appendChild(tr)
            }) 
            } else {
                const tr = document.createElement('tr')
                tr.innerHTML = `
                <td data-label="Loja">${estoques.id_loja}</td> 
                <td data-label="Quantidade Atual">${estoques.quantidade_atual}</td>
                <td data-label="Status">${estoques.status}</td> 
                <td data-label="Quantidade Minima">${estoques.quantidade_minima}</td> 
                <td data-label="Quantidade Recomendada">${estoques.quantidade_recomendada}</td>
                <td> 
                <button onclick="abrirModal('editarCampos',${estoques.id_loja})">Editar</button> 
                <button onclick="deletarEstoque(${estoques.id_estoque})">Deletar</button>  
                </td>
                `
                tbody.appendChild(tr)
            }
    
    } 
    else if (temPermissao('CONSULTAS', 'RELATORIOS','ATUALIZAR')) {
        if (Array.isArray(estoques)) {
            estoques.forEach(estoque => {
                if (!estoque) {
                    console.error('estoque invalido', estoque)
                    return
                }
                
                const tr = document.createElement('tr')
                tr.innerHTML = `
                <td data-label="Loja">${estoque.id_loja}</td> 
                <td data-label="Quantidade Atual">${estoque.quantidade_atual}</td>
                <td data-label="Status">${estoque.status}</td> 
                <td data-label="Quantidade Minima">${estoque.quantidade_minima}</td> 
                <td data-label="Quantidade Recomendada">${estoque.quantidade_recomendada}</td>
                <td> 
                <button onclick="abrirModal('atualizarQuantidade',${estoque.id_Loja})">Atualizar</button>  
                </td>
                `
                tbody.appendChild(tr)
                if(estoque.status === 'Quantidade Baixa') {
                    mensagemDiv.textContent = `Estoque baixo, favor solicitar envio de talao.`
                    mensagemDiv.className = 'mensagem erro'
                    mensagemDiv.style.display = 'block'
                    return
                } else {
                    mensagemDiv.textContent = `Estoque ${estoque.status}`
                    mensagemDiv.className = 'mensagem sucesso'
                    mensagemDiv.style.display = 'block'
                    return
                }
            }) 
    }             
}}


async function abrirModal(tipo, id) {
    const modal = document.getElementById('modalBase')
    const conteudoModal = document.getElementById('conteudoModal')

    if (tipo === 'editarCampos') {
        const estoqueLoja = await fetch(`http://localhost:3000/api/estoqueTaloes/consultarLojaEstoque?id_loja=${id}`).then(resposta => resposta.json())
        const estoqueSalvo = estoqueLoja.estoques

        conteudoModal.innerHTML = `
            <form>
            <h2>Loja ${estoqueSalvo.id_loja}</h2> 
            <h4>Informações</h4>
            <br>
            <label for="quantidadeAtual">Quantidade atual: </label>
            <br>
            <input type="number" id="quantidadeAtual" name="quantidadeAtual" value=${estoqueSalvo.quantidade_atual} required> <br><br> 
            <label for="quantidadeMinima">Quantidade minima: </label>
            <br>
            <input type="number" id="quantidadeMinima" name="quantidadeMinima" value=${estoqueSalvo.quantidade_minima} required> <br><br> 
            <label for="quantidadeRecomendada">Quantidade recomendada: </label>
            <br>
            <input type="number" id="quantidadeRecomendada" name="quantidadeRecomendada" value=${estoqueSalvo.quantidade_recomendada} required> <br><br> 
            <br>
            <div class="card-buttons"> 
            <button type="submit" onclick="salvarQuantidade(${parseInt(estoqueSalvo.id_estoque)})">Salvar</button> 
            </div>
            </form>
            `
            modal.style.display = 'flex'
    } else if (tipo === 'definirQuantidade') {
        conteudoModal.innerHTML = `
            <form>
            <h2>Definir minimo e recomendado para todas as lojas</h2> 
            <label for="quantidadeMinima">Quantidade minima: </label> 
            <input type="number" id="quantidadeMinima" name="quantidadeMinima" required> <br><br> 
            <label for="quantidadeRecomendada">Quantidade recomendada: </label> 
            <input type="number" id="quantidadeRecomendada" name="quantidadeRecomendada" required> <br><br> 
            <div class="card-buttons"> 
            <button type="submit" onclick="salvarQuantidadeTodas()">Salvar</button> 
            </div>
            </form>
            `
            modal.style.display = 'flex'
    }   else if (tipo === 'criarLoja') {
        conteudoModal.innerHTML = `
            <form>
            <h2>Cadastrar nova loja</h2>
            <label for="codigoLoja">Codigo da loja: </label> 
            <input type="number" id="codigoLoja" name="codigoLoja" required> <br><br>
            <label for="quantidadeAtual">Quantidade atual: </label> 
            <input type="number" id="quantidadeAtual" name="quantidadeAtual" required> <br><br>
            <label for="quantidadeMinima">Quantidade minima: </label> 
            <input type="number" id="quantidadeMinima" name="quantidadeMinima" required> <br><br> 
            <label for="quantidadeRecomendada">Quantidade recomendada: </label> 
            <input type="number" id="quantidadeRecomendada" name="quantidadeRecomendada" required> <br><br> 
            <div class="card-buttons"> 
            <button type="submit" onclick="cadastrarLoja()">Salvar</button> 
            </div>
            </form>
            `
            modal.style.display = 'flex'
    } else if (tipo === 'atualizarQuantidade') {
        conteudoModal.innerHTML = `
            <form>
            <h2>Atualizar Quantidade Atual</h2>
            <label for="quantidadeAtual">Quantidade atual: </label> 
            <input type="number" id="quantidadeAtual" name="quantidadeAtual" required> <br><br> 
            <div class="card-buttons"> 
            <button type="submit" onclick="atualizarQuantidade()">Salvar</button> 
            </div>
            </form>
            `
            modal.style.display = 'flex'
    }   else {
        console.error('tipo de modal nao existe')   
    }
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId)
    modal.style.display = 'none'
}

async function salvarQuantidade(id_estoque) {
    const dadosEstoque = {
        quantidade_atual: parseInt(document.getElementById('quantidadeAtual').value),
        quantidade_minima: parseInt(document.getElementById('quantidadeMinima').value),
        quantidade_recomendada: parseInt(document.getElementById('quantidadeRecomendada').value)
    }

    try {
        const resposta = await fetch(`/api/estoqueTaloes/editar/${id_estoque}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosEstoque)
        })

        if (!resposta.ok) {
            const errorResposta = await resposta.json()
            throw new Error(`${errorResposta}`)
        }

        const dados = await resposta.json()
        if (dados) {
            alert(`Quantidade atualizada.`)
            window.location.href = '/estoqueTaloes'
        } else {
            alert(`Erro ao salvar quantidade estoque ${dados.error}`)
        }
    } catch (err) {
        console.error('erro ao atualizar', err)
    }
}

async function salvarQuantidadeTodas() {
    const estoqueQuantidades = {
        quantidade_minima: parseInt(document.getElementById('quantidadeMinima').value),
        quantidade_recomendada: parseInt(document.getElementById('quantidadeRecomendada').value)
    }

    try {
        const resposta = await fetch('http://localhost:3000/api/estoqueTaloes/atualizarRecMin', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estoqueQuantidades)
        })

        if (!resposta.ok) {
            const errorResposta = await resposta.json()
            throw new Error(`${errorResposta}`)
        }

        const dados = await resposta.json()
        if (dados) {
            alert(`${dados.message}`)
            window.location.href = '/estoqueTaloes'
        } else {
            alert(`Erro ao salvar quantidade estoque ${dados.error}`)
        }
    } catch (err) {
        console.error('erro ao atualizar', err)
    }
}

async function deletarEstoque(id_estoque) {
    try {
        if (confirm('tem certeza que deseja deletar o estoque?')) {
            const resposta = await fetch(`/api/estoqueTaloes/deletar/${id_estoque}`, {
                method: 'DELETE'
            })
    
            if (!resposta.ok) {
                const errorResposta = await resposta.json()
                throw new Error(`${errorResposta}`)
            }
    
            const dados = await resposta.json()
            if (dados) {
                alert(`${dados.message}`)
                window.location.href = '/estoqueTaloes'
            } else {
                alert(`Erro ao deletar estoque ${dados.error}`)
            }
        }
        
    } catch (err) {
        console.error('erro ao atualizar', err)
    }
        
}

async function cadastrarLoja() {
    const dadosEstoque = {
        id_loja: parseInt(document.getElementById('codigoLoja').value),
        quantidade_atual: parseInt(document.getElementById('quantidadeAtual').value),
        quantidade_minima: parseInt(document.getElementById('quantidadeMinima').value),
        quantidade_recomendada: parseInt(document.getElementById('quantidadeRecomendada').value)
    }
    
    try {
        const resposta = await fetch('http://localhost:3000/api/estoqueTaloes/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosEstoque)
        })

        if (!resposta.ok) {
            const errorResposta = await resposta.json()
            throw new Error(`${errorResposta}`)
        }

        const dados = await resposta.json()

        if (dados) {
            alert( `${dados.message}`)
            window.location.href = '/estoqueTaloes'
        } else {
            alert(`Erro ao criar novo estoque ${dados.error}`)
        }
    } catch (err) {
        console.error('erro ao atualizar', err)
    }
}

async function atualizarQuantidade() {
    const dadosEstoque = {
        quantidade_atual: parseInt(document.getElementById('quantidadeAtual').value)
    }

    try {
        const resposta = await fetch('http://localhost:3000/api/estoqueTaloes/editarEstoqueUsuario', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosEstoque)
        })

        if (!resposta.ok) {
            const errorResposta = await resposta.json()
            throw new Error(`${errorResposta}`)
        }

        const dados = await resposta.json()
        if (dados) {
            alert(`Atualizado com sucesso.`)
            window.location.href = '/estoqueTaloes'
        } else {
            alert(`Erro ao atualizar quantidade estoque ${dados.error}`)
        }
    } catch (err) {
        console.error('erro ao atualizar', err)
    }
}

async function pegarCSV() {
    if(temPermissao('ADMIN')) {
        try {
            const resposta = await fetch('http://127.0.0.1:8000/estoque/export/csv')
            if (!resposta.ok) {
                throw new Error('Erro ao carregar csv')
            }
    
            const blob = await resposta.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'estoque.csv'
            document.body.appendChild(a)
            a.click()
            a.remove()
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
            const resposta = await fetch(`http://127.0.0.1:8000/estoque/loja/export/csv?id_loja=${usuario.loja}`)
            if (!resposta.ok) {
                throw new Error('Erro ao carregar csv')
            }
    
            const blob = await resposta.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'estoque.csv'
            document.body.appendChild(a)
            a.click()
            a.remove()
            mensagemDiv.textContent = `Exportado com sucesso.`
            mensagemDiv.className = 'mensagem sucesso'
            mensagemDiv.style.display = 'block'
        } catch (err) {
            console.error('erro ao exportar csv', err)
        }
    }
}