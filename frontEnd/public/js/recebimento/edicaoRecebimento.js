document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }

    Promise.all([]).then(() => {
        carregarDadosTalao()
        document.getElementById('formEditarTalao').addEventListener('submit', atualizarTalao)
    }).catch(err => {
        console.error(err)
    })

    async function carregarDadosTalao(params) {
        params = new URLSearchParams(window.location.search)
        const id_talao = parseInt(params.get('id_talao'))
        
        try {
            const resposta = await fetch(`http://localhost:3000/api/manutencaoTaloes/consultarEspecifico/${id_talao}`)
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const dados = await resposta.json()
            const talao = dados.talao
            preencherFormulario(talao)
        } catch (err) {
            console.error('erro ao carregar dados', err)
        }
    }

    function preencherFormulario(talao) {
        document.getElementById('codigoLoja').value = talao.id_loja
        document.getElementById('numeroTalao').value = talao.id_talao
        document.getElementById('quantidadeRecebida').value = talao.quantidade_talao_recebido
        document.getElementById('dataRecebimento').value = formatarDataISO(talao.data_hora_recebimento)
        document.getElementById('status').value = talao.status
    }

    
    async function atualizarTalao(event) {
        event.preventDefault()
        const mensagemDiv = document.getElementById('mensagem')

        params = new URLSearchParams(window.location.search)
        const id_talao = parseInt(params.get('id_talao'))
        
        const talaoAtualizado = {
            quantidade_talao_recebido: parseInt(document.getElementById('quantidadeRecebida').value),
            status:  document.getElementById('status').value,
            data_hora_recebimento: formatarData(document.getElementById('dataRecebimento').value),   
        }

        try {
            const resposta = await fetch(`http://localhost:3000/api/recebimentoTaloes/informar/${id_talao}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'Application/json'
                },
                body: JSON.stringify(talaoAtualizado)
            })

            if (!resposta.ok) {
                const errorResposta = await resposta.json()
                mensagemDiv.textContent = `${errorResposta}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'     
            }

            const dados = await resposta.json()
            if (dados) {
                mensagemDiv.textContent = ` ${dados.message}`
                mensagemDiv.className = 'mensagem sucesso'
                mensagemDiv.style.display = 'block'
                setInterval(() => {
                    window.location.href = '/recebimentoTaloes'
                })            
            } else {
                mensagemDiv.textContent = `Erro ao editar recebimento talao ${dados.error}`
                mensagemDiv.className = 'mensagem erro'
                mensagemDiv.style.display = 'block'
            }
            
        } catch (err) {
            console.error('erro ao atualizar', err)
            mensagemDiv.textContent = `Erro ao editar talao ${err}`
            mensagemDiv.className = 'mensagem erro'
            mensagemDiv.style.display = 'block'
        }
    }

})

function formatarDataISO(dataSQ) {
    const data = new Date(dataSQ)
    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()

    return `${ano}-${mes}-${dia}`
}

function formatarData(dataSQ) {
    const data = new Date(dataSQ)
    const dia = data.getDate().toString().padStart(2, '0')
    const mes = (data.getMonth() + 1).toString().padStart(2, '0')
    const ano = data.getFullYear()

    return `${dia}/${mes}/${ano}`
}