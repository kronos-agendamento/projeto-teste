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

            // Gráfico 1
            listarTop3Indicacoes: '/usuarios/buscar-top3-indicacoes',
            listarNumeroIndicacoes: '/usuarios/buscar-numeros-indicacoes',

            // Gráfico 33
            listarProcedimentosBemAvaliados: '/api/procedimentos/listar-bem-avaliados',
            buscarMediaNotas: '/api/feedbacks/buscar-media-notas',

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

        // Chamadas para atualizar os dados do gráfico 1
        fetchData(endpoints.listarTop3Indicacoes, updateListarTop3Indicacoes);
        fetchData(endpoints.listarNumeroIndicacoes, updateChart1)

        // Chamadas para atualizar os dados do gráfico 2
        fetchData(endpoints.receitaAcumuladaLabels, updateReceitaAcumuladaLabels);
        fetchData(endpoints.receitaAcumulada, updateChart3);

        // Chamadas para atualizar os dados do gráfico 3
        fetchData(endpoints.listarProcedimentosBemAvaliados, updateChart33Labels)
        fetchData(endpoints.buscarMediaNotas, updateChart33);

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

    let dataChart33 = null;
    let labelsChart33 = null;
    const ctx33 = document.getElementById('chart33').getContext('2d');
    let chart33;

    let dataChart1 = null;
    let labelsChart1 = null;
    const ctx1 = document.getElementById('chart1').getContext('2d');
    let chart1;

    // console.log(dataChart33)
    // console.log(labelsChart33)


    function updateChart1(data) {
        dataChart1 = data;
        createChart1();
    }
    function updateListarTop3Indicacoes(data){
        labelsChart1 = data
        if(dataChart1) {
            createChart1();
        }
    }
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

    function updateChart33(data) {
        dataChart33 = data;
        createChart33();
    }

    function updateChart33Labels(data) {
        labelsChart33 = data;
        if (dataChart33) {
            createChart33();
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
    function createChart1() {
        if (!dataChart1 || !labelsChart1) return;

        if (chart1) chart1.destroy();

        chart1 = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: labelsChart1,
                datasets: [{
                    label: 'oi tchau',
                    data: dataChart1,
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

    function createChart33 () {
        if (!dataChart33 || !labelsChart33) return;

        if (chart33) chart33.destroy();

        chart33 = new Chart(ctx33, {
            type: 'bar',
            data: {
                labels: labelsChart33, 
                datasets: [{
                    label: 'caiu sinal da tim',
                    data: dataChart33,
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                indexAxis: 'y',
            responsive: true,
                plugins: {
                    subtitle: {
                        display: true,
                        text: '',
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
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
                labels: labelsChart4, 
                datasets: [{
                    label: 'Vezes Agendadas',
                    data: dataChart4,
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                indexAxis: 'y',
            responsive: true,
                plugins: {
                    subtitle: {
                        display: true,
                        text: '',
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
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