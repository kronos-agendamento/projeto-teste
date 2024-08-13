document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'http://localhost:8080';

    // Função para realizar a requisição e obter os dados
    function fetchData(endpoint, callback) {
        fetch(baseUrl + endpoint)
            .then(response => response.json())
            .then(data => {
                if (data !== null && data !== undefined) {
                    callback(data);
                } else {
                    console.error('Dados não disponíveis para endpoint:', endpoint);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados para endpoint:', endpoint, error);
            });
    }

    // Atualiza os KPIs dos clientes ativos, inativos e fidelizados
    function updateKPIs() {
        const endpoints = {
            // KPI's
            clientesAtivos: '/usuarios/clientes-ativos',
            clientesInativos: '/usuarios/clientes-inativos',
            clientesFidelizados: '/usuarios/clientes-fidelizados-ultimos-tres-meses',
            agendamentosRealizados:'/api/agendamentos/agendamentos-realizados',

            // Gráfico 4
            receitaAcumulada: '/especificacoes/receita-acumulada',
            receitaAcumuladaLabels: '/especificacoes/receita-acumulada-labels',
            
            // Gráfico 2
            agendamentosProcedimentosLabels: '/especificacoes/nomes',
            agendamentosProcedimentos: '/api/procedimentos/quantidade-agendamentos-procedimentos',
        };

        // Chamadas para atualizar os KPIs de clientes
        fetchData(endpoints.clientesAtivos, updateClientesAtivos);
        fetchData(endpoints.clientesInativos, updateClientesInativos);
        fetchData(endpoints.clientesFidelizados, updateClientesFidelizados);
        fetchData(endpoints.agendamentosRealizados, updateAgendamentosRealizados);

        // Chamadas para atualizar os dados do gráfico 2
        fetchData(endpoints.receitaAcumuladaLabels, updateReceitaAcumuladaLabels);
        fetchData(endpoints.receitaAcumulada, updateChart3);

        // Chamadas para atualizar os dados do gráfico 4
        fetchData(endpoints.agendamentosProcedimentosLabels, updateChart4Labels);
        fetchData(endpoints.agendamentosProcedimentos, updateChart4);


    }

    // Funções que atualizam as KPI's
    updateKPIs();
    function updateClientesAtivos(data) {
        const clientesAtivosCount = document.getElementById('clientes-ativos-count');
        clientesAtivosCount.textContent = formatarNumero(data);
    }
    function updateClientesInativos(data) {
        const clientesInativosCount = document.getElementById('clientes-inativos-count');
        clientesInativosCount.textContent = formatarNumero(data);
    }
    function updateClientesFidelizados(data) {
        const clientesFidelizadosCount = document.getElementById('clientes-fidelizados-count');
        clientesFidelizadosCount.textContent = formatarNumero(data);
    }
    function updateAgendamentosRealizados(data) {
        const agendamentosRealizadosCount = document.getElementById('agendamentos-realizados-count');
        agendamentosRealizadosCount.textContent = formatarNumero(data);
    }

    // Funções que atualizam os gráficos
    let dataChart3 = null;
    let labelsChart3 = null;
    const ctx3 = document.getElementById('chart3').getContext('2d');
    let chart3;

    let dataChart4 = null;
    let labelsChart4 = null;
    const ctx4 = document.getElementById('chart4').getContext('2d');
    let chart4;

    function updateChart3(data) {
        dataChart3 = data;
        createChart3();
    }
    function updateReceitaAcumuladaLabels(data) {
        labelsChart3 = data;
        if (dataChart3) {
            createChart3();
        }
    }

    function updateChart4(data) {
        dataChart4 = data;
        createChart4();
    }
    function updateChart4Labels(data) {
        labelsChart4 = data;
        if (dataChart4) {
            createChart4();
        }
    }

    // Criação de gráficos
    function createChart3() {
        if (!dataChart3 || !labelsChart3) return;

        if (chart3) chart3.destroy();

        chart3 = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: labelsChart3,
                datasets: [{
                    label: 'Receita Acumulada',
                    data: dataChart3,
                    backgroundColor: '#D2135D',
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                plugins: {
                    subtitle: {
                        display: true,
                        text: '',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        });
    }

    function createChart4 () {
        if (!dataChart4 || !labelsChart4) return;

        if (chart4) chart4.destroy();

        chart4 = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: [10, 20, 30, 40, 50], 
                datasets: [{
                    label: labelsChart4,
                    data: dataChart4,
                    backgroundColor: '#D2135D',
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                plugins: {
                    subtitle: {
                        display: true,
                        text: '',
                        font: {
                            size: 14
                        }
                    }
                }
            }
        });
    }


    // Função para formatar o número exibido
    function formatarNumero(valor) {
        return valor.toFixed(0); // Formata o número para exibir como inteiro
    }

    // Atualiza os KPIs e gráficos em intervalos regulares (opcional)
    setInterval(updateKPIs, 30000); // Exemplo de atualização a cada 30 segundos

    
});

document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }
});