document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        fetchUsuarios()
    }).catch(err => {
        console.error(err)
    })

    async function fetchUsuarios() {
        try {
            const resposta = await fetch('http://localhost:3000/api/usuarios/consultarUsuariosAprovacao')
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const data = await resposta.json()
            const usuariosArray = data.usuarios

            if (Array.isArray(usuariosArray)) {
                exibirUsuarios(usuariosArray)
            } else {
                console.error('dados nao sao um array', usuariosArray)
            }
            
        } catch (err) {
            console.error('error', err)
        }
    }

    window.fetchUsuarios = fetchUsuarios
})

async function aplicarFiltro() {
    const id_Loja = parseInt(document.getElementById('idLoja').value)
    const intMax = parseInt(document.getElementById('intervaloMax').value)
    const intMin = parseInt(document.getElementById('intervaloMin').value)
    
    if (isNaN(id_Loja)) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/usuarios/aprovarUsuarios/consultarIntervalo?idInicio=${intMin}&idFim=${intMax}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const usuariosArrayFiltrado = data.usuarios
                exibirUsuarios(usuariosArrayFiltrado)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    } else {
        try {
            const resposta = await fetch(`http://localhost:3000/api/usuarios/aprovarUsuarios/consultarIntervaloLoja?id_loja=${id_Loja}`)
            if (resposta.ok) {
                const data = await resposta.json()
                const usuariosArrayLoja = data.usuarios
                exibirUsuarios(usuariosArrayLoja)
            } else {
                const erroData = await resposta.json()
                alert(`${erroData}`)
            }
        } catch (err) {
            console.error(err)
        }
    }
}

function exibirUsuarios(usuarios) {
    const tbody = document.querySelector('#tabelaUsuario tbody')
    tbody.innerHTML = ''

    usuarios.forEach(usuario => {
        if (!usuario) {
            console.error('usuario invalido', usuario)
            return
        }

        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td data-label="matricula">${usuario.matricula_usuario}</td> 
        <td data-label="nome">${usuario.nome}</td>
        <td data-label="loja">${usuario.id_loja}</td>
        <td data-label="email">${usuario.email}</td>  
        <td> 
        <button onclick="aprovarUsuario(${usuario.matricula_usuario})">Aprovar</button>
        <button onclick="deletarUsuario(${usuario.matricula_usuario})">Rejeitar</button>
        `
        tbody.appendChild(tr)
    })
}

async function aprovarUsuario(matricula) {
    const mensagemDiv = document.getElementById('mensagem')
        try {
            const resposta = await fetch(`http://localhost:3000/api/usuarios/aprovarUsuarios/${matricula}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'Application/json'
                }
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
            console.error(err)
            mensagemDiv.textContent = `${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
               
}

async function deletarUsuario(matricula) {
    const mensagemDiv = document.getElementById('mensagem')
        try {
            const resposta = await fetch(`http://localhost:3000/api/usuarios/deletar/${matricula}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'Application/json'
                }
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
            console.error(err)
            mensagemDiv.textContent = `${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
               
}

