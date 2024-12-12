document.addEventListener('DOMContentLoaded', () => {
    // verifica se usuario possui token, realizado get cookies token
    if (!token) {
        alert('acesso nao autorizado. Faça login novamente.')
        window.location.href = 'http://localhost:3000/api/login'
        return
    }
    // carrega matricula do usuario para carregamento de charts
    carregarDadosUsuario(usuario.matricula_usuario).catch(err => {
        console.error(err)
    })
    // fetch para carregar os dados dos usuarios
    async function carregarDadosUsuario(matricula_usuario) {
        try {
            const resposta = await fetch(`/api/usuarios/consultarEspecifico/${matricula_usuario}`)
            if (!resposta) {
                throw new Error('Erro na resposta da rede')
            }
            const data = await resposta.json()
            const usuariosArray = data.usuario
            const id_loja = parseInt(usuariosArray.id_loja)
            function inciarCharts() {
                taloesChart(id_loja)
                usuarioCharts()
                usuariosPorPerfilCharts()
            }
            google.charts.load('current', {'packages':['corechart']});
            google.charts.setOnLoadCallback(inciarCharts)
              
        } catch (err) {
            console.error('error', err)
        }
    }
    // Exibir sidebars de cada modulo, apenas para usuarios com permissoes especificas
    if (!temPermissao('ADMIN')) {
        naoCarregarId('userChart')
        naoCarregarId('pieChartUPP')
        if (!temPermissao('CONSULTAS', 'RELATORIOS')) {
            naoCarregarId('barChart')
        } 
    }
    
})
// criação de grafico de taloes atraves do google charts, recebo a rota do back end em python e carrego no grafico abaixo, total taloes, total solicitados, total entregue e recebidos.
async function taloesChart(id_loja) {
    if (temPermissao('ADMIN')) {
        await fetch('http://127.0.0.1:8000/dashboard/taloesAdminGrafico') 
        .then(response => response.json())
        .then(data => {
            var chartData = google.visualization.arrayToDataTable([
                ['Categoria', 'Quantidade'],
                ['Taloes', data.Taloes],
                ['Solicitados', data.Solicitados],
                ['Enviados', data.Enviados],
                ['Entregue', data.Entregue]
            ])

            var options = {
                title: 'Talões',
                chartArea: {width: '50%'},
                hAxis: {
                    title: 'Quantidade',
                    minValue: 0
                },
                colors: ['#008D53']
            }

            var chart = new google.visualization.BarChart(document.getElementById('barChart'))
            chart.draw(chartData, options)
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error)
        })
    } else if (temPermissao('CONSULTAS', 'RELATORIOS')) {
        await fetch(`http://127.0.0.1:8000/dashboard/taloes/graficoEspecificoLoja?id_loja=${id_loja}`) 
        .then(response => response.json())
        .then(data => {
            var chartData = google.visualization.arrayToDataTable([
                ['Categoria', 'Quantidade'],
                ['Taloes', data.Taloes],
                ['Solicitados', data.Solicitados],
                ['Enviados', data.Enviados],
                ['Entregue', data.Entregue]
            ])

            var options = {
                title: 'Dashboard',
                chartArea: {width: '50%'},
                hAxis: {
                    title: 'Quantidade',
                    minValue: 0
                },
                colors: ['#008D53']
            }

            var chart = new google.visualization.BarChart(document.getElementById('barChart'))
            chart.draw(chartData, options)
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error)
        })
    } else {
        naoCarregarId('barChart')
    }
   
}
//  criação de grafico de usuarios atraves do google charts, recebo a rota do back end em python e verifico se todos usuarios estao ok ou algum pendente aprovação
async function usuarioCharts() {
   await fetch('http://127.0.0.1:8000/dashboard/usuarioAdminGrafico') 
        .then(response => response.json())
        .then(data => {
            var chartData = google.visualization.arrayToDataTable([
                ['Usuarios', 'Quantidade'],
                ['Total', data.UsuariosTotal],
                ['OK', data.UsuariosOk],
                ['Aguardando aprovacao', data.UsuariosAguardandoAprovacao],
            ]);

            var options = {
                title: 'Usuarios',
                chartArea: {width: '50%'},
                hAxis: {
                    title: 'Total',
                    minValue: 0
                },
                colors: ['#008D53']
            }

            var chart = new google.visualization.BarChart(document.getElementById('userChart'))
            chart.draw(chartData, options)
        })
        .catch(error => {
            console.error('Erro ao buscar os dados:', error)
        })
}
// criação de grafico de usuarios relacionados em cada perfil atraves do google charts, faço um for na rota para "salvar" cada usuario em um array depois realizo um count de quantos perfis e apresento no dashboard
async function usuariosPorPerfilCharts() {
    await fetch('http://127.0.0.1:8000/dashboard/usuariosPorPerfilAdmin') 
         .then(response => response.json())
         .then(data => {
             var chartData = google.visualization.arrayToDataTable([
                 ['Perfil', 'Quantidade'],
                ...data.labels.map((label, index) => [label, data.valores[index]]) 
             ])
 
             var options = {
                 title: 'Usuarios por perfil',
                 pieHole: 0.4,
                 colors: ['#008D53', '#4CAF50', '#228B22']
             };
 
             var chart = new google.visualization.PieChart(document.getElementById('pieChartUPP'))
             chart.draw(chartData, options)
         })
         .catch(error => {
             console.error('Erro ao buscar os dados:', error)
         })
 }
    