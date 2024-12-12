document.addEventListener('DOMContentLoaded', () => {
    // verifica token
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }
    // promise para carregar perfis
    Promise.all([]).then(() => {
        carregarPerfis()
        document.getElementById('formEditarUsuario').addEventListener('submit', cadastrarConta)
    }).catch(err => {
        console.error(err)
    })
    // funcao para criar nova conta, neste caso o admin
    async function cadastrarConta(event) {
        event.preventDefault()

        const mensagemDiv = document.getElementById('mensagem')

        const nome = document.getElementById('nome').value
        const matricula_usuario = parseInt(document.getElementById('matricula').value)
        const email = document.getElementById('email').value
        const id_loja = parseInt(document.getElementById('loja').value)

        const perfisSelecionado = Array.from(document.querySelectorAll('input[name="perfil"]:checked')).map(checkbox => checkbox.id)
        const numeroPerfil = parseInt(perfisSelecionado)
    
        const data = {nome, matricula_usuario, email, id_loja, id_perfil: numeroPerfil}
    
        try {
            const resposta = await fetch('http://localhost:3000/api/usuarios/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(data)
            })

            const dados = await resposta.json()
    
            if (resposta.ok) {
                mensagemDiv.textContent = `${dados.message}`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                setInterval(() => {
                    window.location.href = '/usuarios'
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
            console.error('error', err)
        }
    }
}
)
// fetch nos perfis
async function carregarPerfis() {
    try {
        const resposta = await fetch('http://localhost:3000/api/perfis/consultarTodos')
        if (!resposta.ok) {
            throw new Error('Erro ao carregar perfis')
        } 
        const dados = await resposta.json()
        const perfis = dados.perfis
        preencherCheckboxPerfis(perfis)
    } catch (err) {
        console.error(err)
    }
}
// preencher dados dos perfis atraves de um checkbox
function preencherCheckboxPerfis(perfis) {
    const container = document.getElementById('checkbox')
    perfis.forEach(perfil => {
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.id = perfil.id_perfil
        checkbox.name = 'perfil'
        checkbox.value = perfil.nome_perfil

        const label = document.createElement('label')
        label.htmlFor = perfil.id_perfil
        label.textContent = perfil.nome_perfil

        container.appendChild(checkbox)
        container.appendChild(label)
        container.appendChild(document.createElement('br'))
    })
}