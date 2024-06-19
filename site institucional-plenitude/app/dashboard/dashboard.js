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
            clientesAtivos: '/usuarios/clientes-ativos',
            clientesInativos: '/usuarios/clientes-inativos',
            clientesFidelizados: '/usuarios/clientes-fidelizados-ultimos-tres-meses',
            receitaAcumulada: '/especificacoes/receita-acumulada',
            receitaAcumuladaLabels: '/especificacoes/receita-acumulada-labels',
        };

        // Chamadas para atualizar os KPIs de clientes
        fetchData(endpoints.clientesAtivos, updateClientesAtivos);
        fetchData(endpoints.clientesInativos, updateClientesInativos);
        fetchData(endpoints.clientesFidelizados, updateClientesFidelizados);

        // Chamadas para atualizar os dados do gráfico
        fetchData(endpoints.receitaAcumuladaLabels, updateReceitaAcumuladaLabels);
        fetchData(endpoints.receitaAcumulada, updateChart3);
    }

    // Inicia a atualização dos KPIs ao carregar a página
    updateKPIs();

    // Função para atualizar o número de clientes ativos
    function updateClientesAtivos(data) {
        const clientesAtivosCount = document.getElementById('clientes-ativos-count');
        clientesAtivosCount.textContent = formatarNumero(data);
    }

    // Função para atualizar o número de clientes inativos
    function updateClientesInativos(data) {
        const clientesInativosCount = document.getElementById('clientes-inativos-count');
        clientesInativosCount.textContent = formatarNumero(data);
    }

    // Função para atualizar o número de clientes fidelizados
    function updateClientesFidelizados(data) {
        const clientesFidelizadosCount = document.getElementById('clientes-fidelizados-count');
        clientesFidelizadosCount.textContent = formatarNumero(data);
    }

    // Função para atualizar os dados do gráfico
    let dataChart3 = null;
    let labelsChart3 = null;
    const ctx3 = document.getElementById('chart3').getContext('2d');
    let chart3;

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
                        text: 'Último Semestre',
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
