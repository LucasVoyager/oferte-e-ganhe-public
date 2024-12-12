document.addEventListener('DOMContentLoaded', () => {
    // verifica token
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
    // realiza fetch na rota de consulta usuarios
    async function fetchUsuarios() {
        try {
            const resposta = await fetch('/api/usuarios/consultarTodos')
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
// funcao que realiza o carregamento do filtro atraves da rota e enviando intervalo dependendo dos valores digitados
async function aplicarFiltro() {
    const id_Loja = parseInt(document.getElementById('idLoja').value)
    const intMax = parseInt(document.getElementById('intervaloMax').value)
    const intMin = parseInt(document.getElementById('intervaloMin').value)
    
    if (isNaN(id_Loja)) {
        try {
            const resposta = await fetch(`http://localhost:3000/api/usuarios/consultarIntervalo?idInicio=${intMin}&idFim=${intMax}`)
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
            const resposta = await fetch(`http://localhost:3000/api/usuarios/consultarIntervaloLoja?id_loja=${id_Loja}`)
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
// funcao para exibir usuarios na tabela atraves de um foreach, pegando as infos direto do banco e colocando na td da tabela
function exibirUsuarios(usuarios) {
    const tbody = document.querySelector('#tabelaUsuario tbody')
    tbody.innerHTML = ''

    usuarios.forEach(usuario => {
        if (!usuario) {
            console.error('usuario invalido', usuario)
            return
        }

        const perfilNome = usuario.Perfil?.nome_perfil ? usuario.Perfil.nome_perfil : 'Sem Perfil' 
        const dataCriacao = formatarData(usuario.criado_em)

        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td data-label="matricula">${usuario.matricula_usuario}</td> 
        <td data-label="nome">${usuario.nome}</td>
        <td data-label="email">${usuario.email}</td> 
        <td data-label="loja">${usuario.id_loja}</td> 
        <td data-label="perfil">${perfilNome}</td>
        <td data-label="data-criacao">${dataCriacao}</td>
        <td> 
        <button onclick="window.location.href='/editarUsuario?matricula=${usuario.matricula_usuario}'">Editar</button> 
        <button onclick="deletarUsuario(${usuario.matricula_usuario})">Deletar</button> 
        </td>
        `
        tbody.appendChild(tr)
    })
}
// funcao para deletar usuario com base na matricula
async function deletarUsuario(matricula) {
    if (confirm('Tem certeza que quer deletar este usuario?'))
        try {
            const mensagemDiv = document.getElementById('mensagem')
            const resposta = await fetch(`http://localhost:3000/api/usuarios/deletar/${matricula}`, {
                method: 'DELETE'
            })

            if (resposta.ok) {
                mensagemDiv.textContent = `Usuario deletado com sucesso.`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                fetchUsuarios()
            } else {
                mensagemDiv.textContent = `Erro ao deletar usuario.`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
                alert('Erro ao deletar Usuario')
            }
        } catch (err) {
            console.error(err)
        }
               
}
// funcao para formatar a data que vem do meu banco de dados, remover o iso no caso
function formatarData(dataSQ) {
    const data = new Date(dataSQ)
    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}
// funcao que faz um fetch na rota get do python para exportar csv
async function pegarCSV() {
    try {
        const resposta = await fetch('http://127.0.0.1:8000/usuarios/export/csv')
        if (!resposta.ok) {
            throw new Error('Erro ao carregar csv')
        }

        const blob = await resposta.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'usuarios.csv'
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