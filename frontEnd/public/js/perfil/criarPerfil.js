document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        carregarPermissoes()
        document.getElementById('formCriarPerfil').addEventListener('submit', criarPerfil)
    }).catch(err => {
        console.error(err)
    })
    
    async function criarPerfil(event) {
        event.preventDefault()
        const mensagemDiv = document.getElementById('mensagem')
        
        const perfilCriado = {
            nome_perfil: document.getElementById('nome').value,
            permissoes: Array.from(document.querySelectorAll('input[name="permissao"]:checked')).map(ci => parseInt(ci.id))
            
        }

        try {
            const resposta = await fetch('http://localhost:3000/api/perfis/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(perfilCriado)
            })

            if (!resposta.ok) {
                mensagemDiv.textContent = `Erro ao criar perfil`
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
                mensagemDiv.textContent = `Erro a criar o perfil ${dados.error}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }
            
        } catch (err) {
            console.error('erro ao criar perfil', err)
            mensagemDiv.textContent = `Erro ao criar perfil ${err}`
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
        container.appendChild(document.createElement('br'))
    })
}
