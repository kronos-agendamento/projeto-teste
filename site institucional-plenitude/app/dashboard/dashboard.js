document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'http://localhost:8080';

    // Carrega os dados dos Gráficos e KPIs
    function fetchData(endpoint, callback) {
        fetch(baseUrl + endpoint)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    callback(data);
                } else {
                    console.error('Dados não disponíveis');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
            });
    }
    

    // Altera os dados das KPIs
    function updateKPIsDashboards() {
        const endpoints = {
            procedimentoMaisRealizado: '/api/procedimentos/mais-agendado',
            procedimentoComMelhorAvaliacao: '/api/procedimentos/melhor-nota',
            receitaAcumulada: '/api/especificacoes/receita-acumulada',
            canaisDeDivulgacao: '/api/usuarios/canais-de-divulgacao',
            clientesAtivos: '/usuarios/clientes-ativos',
            clientesInativos: '/api/usuarios/clientes-inativos',
            clientesFidelizados: '/api/usuarios/clientes-fidelizados-ultimos-tres-meses'
        };
    
        fetchData(endpoints.clientesAtivos, updateClientesAtivos);
       // fetchData(endpoints.clientesInativos, updateClientesInativos);
       // fetchData(endpoints.clientesFidelizados, updateClientesFidelizados);
    
       // fetchData(endpoints.procedimentoMaisRealizado, updateChart1);
       // fetchData(endpoints.procedimentoComMelhorAvaliacao, updateChart2);
       // fetchData(endpoints.receitaAcumulada, updateChart3);
       // fetchData(endpoints.canaisDeDivulgacao, updateChart4);
    }
    
    // Chama a função para atualizar o dashboard ao carregar a página
    updateKPIsDashboards();
    
    setInterval(updateKPIsDashboards, 5000);

    // Atualiza as KPIs
    function updateClientesAtivos(data) {
        document.getElementById('clientes-ativos').querySelector('h2').textContent = data;
    }
    
    function updateClientesInativos(data) {
        document.getElementById('clientes-inativos').querySelector('h2').textContent = data.valor;
    }
    
    function updateClientesFidelizados(data) {
        document.getElementById('clientes-fidelizados').querySelector('h2').textContent = data.valor;
    }

    // Atualiza os Gráficos
    function updateChart1(data) {
        const labels = data.map(item => item.nome); // Ajuste conforme a estrutura dos dados recebidos
        const valores = data.map(item => item.quantidade); // Ajuste conforme a estrutura dos dados recebidos
    
        dataChart1 = { labels, data: valores };
        createCharts();
    }
    
    function updateChart2(data) {
        const labels = data.map(item => item.nome); // Ajuste conforme a estrutura dos dados recebidos
        const valores = data.map(item => item.media); // Ajuste conforme a estrutura dos dados recebidos
    
        dataChart2 = { labels, data: valores };
        createCharts();
    }
    
    function updateChart3(data) {
        const labels = data.map(item => item.mes); // Ajuste conforme a estrutura dos dados recebidos
        const valores = data.map(item => item.receita); // Ajuste conforme a estrutura dos dados recebidos
    
        dataChart3 = { labels, data: valores };
        createCharts();
    }
    
    function updateChart4(data) {
        const labels = data.map(item => item.canal); // Ajuste conforme a estrutura dos dados recebidos
        const valores = data.map(item => item.clientes); // Ajuste conforme a estrutura dos dados recebidos
    
        dataChart4 = { labels, data: valores };
        createCharts();
    }
    
    
    

    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');
    const ctx3 = document.getElementById('chart3').getContext('2d');
    const ctx4 = document.getElementById('chart4').getContext('2d');

    let chart1, chart2, chart3, chart4;


    // function createCharts(dataChart1, dataChart2, dataChart3, dataChart4) {
    //     if (chart1) chart1.destroy();
    //     if (chart2) chart2.destroy();
    //     if (chart3) chart3.destroy();
    //     if (chart4) chart4.destroy();
    
    //     // chart1 = new Chart(ctx1, {
    //     //     type: 'bar',
    //     //     data: {
    //     //         labels: dataChart1.labels,
    //     //         datasets: [{
    //     //             label: 'Quantidade de Agendamentos',
    //     //             data: dataChart1.data,
    //     //             backgroundColor: '#D2135D',
    //     //         }]
    //     //     }
    //     // });
    
    //     // chart2 = new Chart(ctx2, {
    //     //     type: 'bar',
    //     //     data: {
    //     //         labels: dataChart2.labels,
    //     //         datasets: [{
    //     //             label: 'Média de Avaliações',
    //     //             data: dataChart2.data,
    //     //             backgroundColor: '#D2135D',
    //     //         }]
    //     //     }
    //     // });
    
    //     chart3 = new Chart(ctx3, {
    //         type: 'line',
    //         data: {
    //             labels: dataChart3.labels,
    //             datasets: [{
    //                 label: 'Receita Acumulada',
    //                 data: dataChart3.data,
    //                 backgroundColor: '#D2135D',
    //                 borderColor: '#D2135D',
    //                 fill: false
    //             }]
    //         }
    //     });
    
    //     // chart4 = new Chart(ctx4, {
    //     //     type: 'bar',
    //     //     data: {
    //     //         labels: dataChart4.labels,
    //     //         datasets: [{
    //     //             label: 'Média de Clientes Avaliados',
    //     //             data: dataChart4.data,
    //     //             backgroundColor: '#D2135D',
    //     //         }]
    //     //     }
    //     // });
    // }
    

    //createCharts();

    

    // window.addEventListener('resize', function () {
    //     createCharts();
    // });
});

