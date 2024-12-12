document.addEventListener('DOMContentLoaded', () => {
    // verifica token
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }
    // promise para carregar dados usuario e de perfis
    Promise.all([]).then(() => {
        carregarDadosUsuario()
        carregarPerfis()
        document.getElementById('formEditarUsuario').addEventListener('submit', atualizarUsuario)
    }).catch(err => {
        console.error(err)
    })

    async function carregarDadosUsuario(params) {
        params = new URLSearchParams(window.location.search)
        const matricula = parseInt(params.get('matricula'))
        

        try {
            const resposta = await fetch(`/api/usuarios/consultarEspecifico/${matricula}`)
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const dados = await resposta.json()
            const usuarios = dados.usuario
            preencherFormulario(usuarios)
        } catch (err) {
            console.error('erro ao carregar dados', err)
        }
    }
    // função para preencher dados dos usuarios no input
    function preencherFormulario(usuario) {
        document.getElementById('nome').value = usuario.nome
        document.getElementById('matricula').value = usuario.matricula_usuario
        document.getElementById('email').value = usuario.email
        document.getElementById('loja').value = usuario.id_loja
        document.getElementById('matricula').value = usuario.matricula_usuario

        const perfisDoUsuario = usuario.id_perfil
        const checkbox = document.getElementById(perfisDoUsuario)
        if (checkbox) {
            checkbox.checked = true
        }
        
    }
  
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
    // funcao para preencher dados dos perfis atraves de um forEach e criando um checkbox
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
    // funcao para atualizar dados do usuario
    async function atualizarUsuario(event) {
        event.preventDefault()
        // verificar qual checkbox esta selecionado
        const perfisSelecionado = Array.from(document.querySelectorAll('input[name="perfil"]:checked')).map(checkbox => checkbox.id)
        const numeroPerfil = parseInt(perfisSelecionado)
        const mensagemDiv = document.getElementById('mensagem')
        
        const usuarioAtualizado = {
            matricula_usuario: parseInt(document.getElementById('matricula').value),
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            id_loja: parseInt(document.getElementById('loja').value),
            id_perfil: numeroPerfil
        }

        try {
            const resposta = await fetch(`/api/usuarios/editar/${usuarioAtualizado.matricula_usuario}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(usuarioAtualizado)
            })

            if (!resposta.ok) {
                mensagemDiv.textContent = `erro ao atualizar usuario`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }

            const dados = await resposta.json()
            mensagemDiv.textContent = `${dados.message}`
            mensagemDiv.className = 'mensagem sucesso'
            mensagemDiv.style.display = 'block'
            setInterval(() => {
                window.location.href = '/usuarios'
            }, 1500)
        } catch (err) {
            console.error('erro ao atualizar', err)
            mensagemDiv.textContent = `${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
    }

})

