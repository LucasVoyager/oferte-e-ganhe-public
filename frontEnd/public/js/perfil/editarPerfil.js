document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        carregarDadosPerfil()
        document.getElementById('formEditarPerfil').addEventListener('submit', atualizarPerfil)
    }).catch(err => {
        console.error(err)
    })

    async function carregarDadosPerfil(params) {
        params = new URLSearchParams(window.location.search)
        const id_perfil = parseInt(params.get('id_perfil'))
        
        try {
            const resposta = await fetch(`/api/perfis/consultarPerfil?id_perfil=${id_perfil}`)
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const dados = await resposta.json()
            const perfil = dados.perfis
            preencherFormulario(perfil)
        } catch (err) {
            console.error('erro ao carregar dados', err)
        }
    }

    function preencherFormulario(perfil) {
        document.getElementById('nome').value = perfil.nome_perfil
        const permissoesPerfil = perfil.Permissoes.map(permissao => permissao.id_permissao)
        carregarPermissoes().then(() => {
            permissoesPerfil.forEach(id_permissao => {
                const checkbox = document.getElementById(id_permissao)
                if (checkbox){
                    checkbox.checked = true
                }
            })
        })
    }
    
    async function atualizarPerfil(event) {
        event.preventDefault()
        const mensagemDiv = document.getElementById('mensagem')

        params = new URLSearchParams(window.location.search)
        const id_perfil = parseInt(params.get('id_perfil'))
        
        const perfilAtualizado = {
            id_perfil: id_perfil,
            nome_perfil: document.getElementById('nome').value,
            permissoes: Array.from(document.querySelectorAll('input[name="permissao"]:checked')).map(ci => parseInt(ci.id))
            
        }

        try {
            const resposta = await fetch(`http://localhost:3000/api/perfis/editar/${perfilAtualizado.id_perfil}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(perfilAtualizado)
            })

            if (!resposta.ok) {
                mensagemDiv.textContent = `Erro ao atualizar perfil`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }

            const dados = await resposta.json()
            if (dados) {
                mensagemDiv.textContent = ` ${dados.message}`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                setInterval(() => {
                    window.location.href = '/perfis'
                })
            } else {
                mensagemDiv.textContent = `Erro a atualizar o perfil ${dados.error}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }
            
        } catch (err) {
            console.error('erro ao atualizar perfil', err)
            mensagemDiv.textContent = `Erro ao atualizar perfil ${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
    }

})

async function carregarPermissoes() {
    try {
        const resposta = await fetch('http://localhost:3000/api/perfis/consultarPermissoes')
        if (!resposta.ok) {
            throw new Error('Erro ao carregar permissoes')
        } 
        const dados = await resposta.json()
        const permissoes = dados.tipos
        preencherCheckboxPermissoes(permissoes)
    } catch (err) {
        console.error(err)
    }
}

function preencherCheckboxPermissoes(permissoes) {
    const container = document.getElementById('checkbox')
    permissoes.forEach(permissao => {
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = permissao.id_permissao
        checkbox.name = 'permissao'
        checkbox.value = permissao.nome_permissao

        const label = document.createElement('label')
        label.htmlFor = permissao.id_permissao
        label.textContent = permissao.nome_permissao

        container.appendChild(checkbox)
        container.appendChild(label)
    })
}
