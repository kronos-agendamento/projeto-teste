document.addEventListener('DOMContentLoaded', function () {

    const baseUrl = 'http://localhost:8080';

    function getLastFiveMonths() {
        const result = [];
        const today = new Date();

        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio",
            "Junho", "Julho", "Agosto", "Setembro", "Outubro",
            "Novembro", "Dezembro"
        ];

        for (let i = 0; i < 5; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthName = monthNames[date.getMonth()];  // Obtem o nome do mês
            result.push(monthName);
        }

        return result;
    }
    const lastFiveMonths = getLastFiveMonths();

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

    function buscarDadosPorGrafico(url, startDateId, endDateId, callback) {
        const startDateInput = document.getElementById(startDateId);
        const endDateInput = document.getElementById(endDateId);

        // Verifica se os elementos de data existem
        if (!startDateInput || !endDateInput) {
            console.error(`Elementos com IDs ${startDateId} ou ${endDateId} não foram encontrados.`);
            return;
        }

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
            

            

            // Prossiga com a lógica da requisição
            fetchData2(url, { startDate, endDate }, callback);
        
    }



    // Função genérica para buscar dados com parâmetros dinâmicos
    function fetchData2(url, params = {}, callback) {
        // Monta a URL com os parâmetros
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${url}?${queryString}`;

        // Faz a requisição
        fetch(baseUrl + fullUrl)
            .then((response) => response.json())
            .then((data) => {
                callback(data); // Executa a função de callback com os dados
            })
            .catch((error) => {
                console.error("Erro ao buscar dados para o gráfico:", error);
            });
    }



    // Atualiza os KPIs e os gráficos
    function updateKPIs() {
        const endpoints = {

            // KPI's - Gerencial
            clientesAtivos: '/usuarios/clientes-ativos',
            clientesInativos: '/usuarios/clientes-inativos',
            clientesFidelizados: '/usuarios/clientes-fidelizados-ultimos-tres-meses',
            agendamentosRealizados: '/api/agendamentos/agendamentos-realizados',

            // KPI's - Usabilidade - ok
            tempoAgendamento: '/api/agendamentos/tempo-para-agendar',
            retornoLogin: '/login-logoff/retorno-usuarios-login',

            // KPI's - Operacional
            totalAgendamentosHoje: '/api/agendamentos/total-agendamentos-hoje',
            totalAgendamentosFuturos: '/api/agendamentos/futuros',
            notasFeedbacks: '/api/feedbacks/media-notas-single',
            tempoMedio: '/api/agendamentos/tempo-para-agendar',

            // Gráfico 1 - Gerencial
            listarTop3Indicacoes: '/usuarios/buscar-top3-indicacoes',
            listarNumeroIndicacoes: '/usuarios/buscar-numeros-indicacoes',

            // Gráfico 2 - Gerencial
            listarClientesConcluidosUltimosCincoMeses: '/usuarios/clientes-concluidos-ultimos-cinco-meses',
            listarClientesFidelizadosUltimosCincoMeses: '/usuarios/clientes-fidelizados-ultimos-cinco-meses',

            // Gráfico 33 - Gerencial
            listarProcedimentosBemAvaliados: '/api/procedimentos/listar-bem-avaliados',
            buscarMediaNotas: '/api/feedbacks/buscar-media-notas',

            // Gráfico 4 - Gerencial
            receitaAcumulada: '/api/especificacoes/receita-acumulada',
            receitaAcumuladaLabels: '/api/especificacoes/receita-acumulada-labels',

            // Gráfico 2 - Gerencial
            agendamentosProcedimentosLabels: '/api/especificacoes/nomes',
            agendamentosProcedimentos: '/api/procedimentos/quantidade-agendamentos-procedimentos',

            // Gráfico 1 - Operacional
            agendamentosStatus: '/api/agendamentos/agendamento-status',
            agendamentosReceitaUltimosTresMeses: '/api/agendamentos/receita-ultimos-tres-meses',
            agendamentosTempoGastoUltimoMes: '/api/agendamentos/tempo-gasto-ultimo-mes',
            agendamentosProcedimentosRealizadosTrimestre: '/api/agendamentos/procedimentos-realizados-trimestre',
            agendamentosValorTotalUltimoMes: '/api/agendamentos/valor-total-ultimo-mes',

            // Gráfico 1 - Usabilidade - ok
            ultimosAgendamentosRealizados5Meses: '/api/agendamentos/agendamentos-realizados-ultimos-cinco-meses'
        };

        // Chamada específica para o gráfico de usabilidade com startDate e endDate automáticos
        const endDateDiaAtual = new Date().toISOString().split("T")[0];

        const startDate1 = new Date();
        startDate1.setMonth(startDate1.getMonth() - 1);

        const startDate3 = new Date();
        startDate3.setMonth(startDate3.getMonth() - 3);

        const startDate12 = new Date();
        startDate12.setMonth(startDate12.getMonth() - 12);

        const startDateString1MesesAtras = startDate1.toISOString().split("T")[0];
        const startDateString3MesesAtras = startDate3.toISOString().split("T")[0];
        const startDateString12MesesAtras = startDate12.toISOString().split("T")[0];

        // Chamadas para atualizar os KPIs de clientes - Gerencial
        fetchData2(endpoints.clientesAtivos, {},updateClientesAtivos); // ok
        fetchData2(endpoints.clientesInativos, {},updateClientesInativos); // ok
        fetchData2(endpoints.clientesFidelizados, {},updateClientesFidelizados); // ok
        fetchData2(endpoints.agendamentosRealizados, {},updateAgendamentosRealizados); // ok

        // Chamadas para atualizar os KPI's de - Usabilidade - ok
        fetchData2(endpoints.tempoAgendamento, {}, updateTempoAgendamento); // ok
        fetchData2(endpoints.retornoLogin, { startDate: startDateString12MesesAtras, endDate: endDateDiaAtual }, updateRetornoLogin); // ok

        // Chamadas para atualizar os KPI's de - Operacional
        fetchData(endpoints.totalAgendamentosHoje, updateTotalAgendamentosHoje);
        fetchData(endpoints.totalAgendamentosFuturos, updateTotalAgendamentosFuturos);
        fetchData(endpoints.notasFeedbacks, updateNotaSingle);
        fetchData(endpoints.tempoMedio, updateTempoMedio);

        // Chamadas para atualizar os dados do gráfico 1 - Gerencial
        fetchData(endpoints.listarTop3Indicacoes, updateListarTop3Indicacoes);
        fetchData(endpoints.listarNumeroIndicacoes, updateChart1)

        // Chamadas para atualizar os dados do gráfico 2 - Gerencial
        fetchData(endpoints.listarClientesConcluidosUltimosCincoMeses, updateChart2_1);
        fetchData(endpoints.listarClientesFidelizadosUltimosCincoMeses, updateChart2_2);

        // Chamadas para atualizar os dados do gráfico 3 - Gerencial
        fetchData(endpoints.receitaAcumuladaLabels, updateReceitaAcumuladaLabels);
        fetchData(endpoints.receitaAcumulada, updateChart3);

        // Chamadas para atualizar os dados do gráfico 33 - Gerencial
        fetchData(endpoints.listarProcedimentosBemAvaliados, updateChart33Labels)
        fetchData(endpoints.buscarMediaNotas, updateChart33);

        // Chamadas para atualizar os dados do gráfico 4 - Gerencial
        fetchData(endpoints.agendamentosProcedimentosLabels, updateChart4Labels);
        fetchData(endpoints.agendamentosProcedimentos, updateChart4);

        // Chamada para atualizar os dados do gráfico 1 - Operacional
        fetchData(endpoints.agendamentosStatus, updateChartOperacional1);
        fetchData(endpoints.agendamentosReceitaUltimosTresMeses, updateChartReceitaProcedimentosOperacional4);
        fetchData(endpoints.agendamentosTempoGastoUltimoMes, updateChartTempoGastoOperacional2);
        fetchData(endpoints.agendamentosProcedimentosRealizadosTrimestre, updateChartProcedimentoRealizadosTrimestreOperacional3);
        fetchData(endpoints.agendamentosValorTotalUltimoMes, updateChartValorTotalUltimoMesOperacional5);

        // Chamada para atualiazar o gráfico de usabilidade - Usabilidade
        fetchData2(
            endpoints.ultimosAgendamentosRealizados5Meses,
            { startDate: startDateString3MesesAtras, endDate: endDateDiaAtual },
            updateChartUsabilidade1
        );
    }
    function addFilterListener(buttonId, url, startDateId, endDateId, callback) {
        document.getElementById(buttonId).addEventListener("click", function () {
            buscarDadosPorGrafico(url, startDateId, endDateId, callback);
        });
    }
    // Atualização dos botões da página de usabilidade
    addFilterListener(
        "buscarUsabilidadeGrafico1Button",                                     // ID do botão
        "/api/agendamentos/agendamentos-realizados-ultimos-cinco-meses", // URL da API
        "startDateUsabilidade1",                            // ID do campo de data de início
        "endDateUsabilidade1",                              // ID do campo de data de término
        updateChartUsabilidade1                  // Callback específico para atualizar o gráfico 1
    );
    addFilterListener(
        "buscarUsabilidadeKPI1Button",                                  // Outro botão
        "/login-logoff/retorno-usuarios-login",                      // Outra URL da API
        "startDateUsabilidadeKPI1",                                     // ID do campo de data de início
        "endDateUsabilidadeKPI1",                                       // ID do campo de data de término
        updateRetornoLogin                                  // Callback específico do KPI
    );
    addFilterListener(
        "buscarUsabilidadeKPI2Button",
        "/api/agendamentos/tempo-para-agendar",
        "startDateUsabilidadeKPI2",
        "endDateUsabilidadeKPI2",
        updateTempoAgendamento
    );
    // atualização dos botões da página Gerencial
    addFilterListener(
        "buscarGerencialKPI1Button",
        "/usuarios/clientes-ativos",
        "startDateGerencialKPI1",
        "endDateGerencialKPI1",
        updateClientesAtivos
    );
    addFilterListener(
        "buscarGerencialKPI2Button",
        "/usuarios/clientes-inativos",
        "startDateGerencialKPI2",
        "endDateGerencialKPI2",
        updateClientesInativos
    );
    addFilterListener(
        "buscarGerencialKPI3Button",
        "/api/agendamentos/agendamentos-realizados",
        "startDateGerencialKPI3",
        "endDateGerencialKPI3",
        updateAgendamentosRealizados
    );
    addFilterListener(
        "buscarGerencialKPI4Button",
        "/usuarios/clientes-fidelizados-ultimos-tres-meses",
        "startDateGerencialKPI4",
        "endDateGerencialKPI4",
        updateClientesFidelizados
    );
    


    // Funções que atualizam as KPI's do gerencial
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
    // Funções que atualizam as KPI's de usabilidade
    function updateTempoAgendamento(data) {
         /*cálculo para somar a "lista" chegando ->*/ const total = data.reduce((acc, num) => acc + num, 0);


        const tempoMedioCount = document.getElementById('tempo-medio-conclusao');
        tempoMedioCount.textContent = data;
    }
    function updateRetornoLogin(data) {
        const retornoLoginCount = document.getElementById('retorno-login-count');
        retornoLoginCount.textContent = data;
    }

    // Funções que atualizam as KPI's de operacional
    function updateTotalAgendamentosHoje(data) {
        const totalAgendamentosHoje = document.getElementById('total-agendamentos-hoje');
        totalAgendamentosHoje.textContent = data;
    }
    function updateTotalAgendamentosFuturos(data) {
        const totalAgendamentosFuturos = document.getElementById('total-agendamentos-futuros');
        totalAgendamentosFuturos.textContent = data;
    }
    function updateNotaSingle(data) {
        const totalNotaSingle = document.getElementById('total-nota-single');
        totalNotaSingle.textContent = data;
    }
    function updateTempoMedio(data) {
        const tempoMedioHoje = document.getElementById('tempo-medio-hoje');
        tempoMedioHoje.textContent = data;
    }



    // Constantes dos gráficos

    let dataChart2_2 = null
    let dataChart2_1 = null;
    let labelsChart2 = lastFiveMonths;
    const ctx2 = document.getElementById('chart2').getContext('2d');
    let chart2;

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

    // constantes dos gráficos de usabilidade
    let dataChartUsabilidade1 = null;
    let labelsChartUsabilidade1 = null;
    const ctxUsabilidade1 = document.getElementById('chartUsabilidade1').getContext('2d');
    let chartUsabilidade1;

    // constantes dos gráficos operacionais
    let dataChartOperacional1 = null;
    const ctxOperacional1 = document.getElementById('chartOperacional1').getContext('2d');
    let chartOperacional1;

    let dataChartOperacional4 = null;
    const ctxOperacional4 = document.getElementById('chartReceitaProcedimentosOperacional4').getContext('2d');
    let chartReceitaProcedimentosOperacional4;

    let dataChartOperacional2 = null;
    const ctxOperacional2 = document.getElementById('chartTempoGastoProcedimentosOperacional2').getContext('2d');
    let chartTempoGastoProcedimentos;

    let dataChartOperacional3 = null;
    const ctxOperacional3 = document.getElementById('chartProcedimentosRealizadosTrimestreOperacional3').getContext('2d');
    let chartProcedimentosRealizadosTrimestreOperacional3;

    let dataChartOperacional5 = null;
    const ctxOperacional5 = document.getElementById('chartValorTotalUltimoMesOperacional5').getContext('2d');
    let chartValorTotalUltimoMesOperacional5;




    // Funções para atualização operacional
    function updateChartOperacional1(data) {
        // Mapeia os dados de status a partir do objeto
        const statusAgendamentos = {
            agendados: data.agendados || 0,  // Valor padrão caso a propriedade não esteja presente
            confirmados: data.confirmados || 0,
            realizados: data.realizados || 0,
            cancelados: data.cancelados || 0,
            reagendados: data.reagendados || 0
        };

        // Atualiza os dados do gráfico na ordem desejada, independentemente da ordem de chegada
        dataChartOperacional1 = [
            statusAgendamentos.agendados,
            statusAgendamentos.confirmados,
            statusAgendamentos.realizados,
            statusAgendamentos.cancelados,
            statusAgendamentos.reagendados
        ];

        // Chama a função para criar/atualizar o gráfico
        createChartOperacional1();
    }
    function updateChartReceitaProcedimentosOperacional4(data) {
        // Usando Object.entries() para obter as chaves (procedimentos) e valores (receita)
        const labels = Object.keys(data);  // Isso pega as chaves: ["Maquiagem", "Sobrancelha", "Cilios"]
        const dataChartReceita = Object.values(data);  // Isso pega os valores: [4550, 2540, 1720]

        // Agora você pode passar os 'labels' e 'dataChartReceita' para a função de criação do gráfico
        createChartReceitaProcedimentosOperacional4(labels, dataChartReceita);
    }
    function updateChartTempoGastoOperacional2(data) {
        // Mapeia os dados recebidos (objeto) para labels e valores do gráfico
        const labels = Object.keys(data);  // Procedimentos (ex: Maquiagem, Sobrancelha, etc.)
        const dataChart = Object.values(data);  // Tempos totais (ex: 350, 120, etc.)

        // Se o gráfico já foi criado, apenas atualiza os dados e rótulos

        // Se o gráfico ainda não existe, cria-o pela primeira vez
        createChartTempoGastoProcedimentosOperacional2(labels, dataChart);

    }
    function updateChartProcedimentoRealizadosTrimestreOperacional3(data) {
        // Mapeia os dados recebidos (objeto) para labels e valores do gráfico
        const labels = Object.keys(data);  // Procedimentos (ex: Maquiagem, Sobrancelha, etc.)
        const dataChart = Object.values(data);  // Tempos totais (ex: 350, 120, etc.)

        // Se o gráfico já foi criado, apenas atualiza os dados e rótulos

        // Se o gráfico ainda não existe, cria-o pela primeira vez
        createChartProcedimentosRealizadosTrimestreOperacional3(labels, dataChart);
    }
    function updateChartValorTotalUltimoMesOperacional5(data) {
        // Mapeia os dados recebidos (objeto) para labels e valores do gráfico
        const labels = Object.keys(data);  // Procedimentos (ex: Maquiagem, Sobrancelha, etc.)
        const dataChart = Object.values(data);  // Tempos totais (ex: 350, 120, etc.)

        // Se o gráfico já foi criado, apenas atualiza os dados e rótulos

        // Se o gráfico ainda não existe, cria-o pela primeira vez
        createChartValorTotalUltimoMesOperacional5(labels, dataChart);
    }

    // Funções para atualização gerencial e usabilidade
    function updateChart2_1(data) {
        dataChart2_1 = data;

        if (dataChart2_1) {
            createChart2();
        }
    }
    function updateChart2_2(data) {
        dataChart2_2 = data;

        if (dataChart2_2) {
            createChart2();
        }
    }
    function updateChart1(data) {
        dataChart1 = data;
        createChart1();
    }
    function updateListarTop3Indicacoes(data) {
        labelsChart1 = data
        if (dataChart1) {
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
    function updateChartUsabilidade1(data) {
        labelsChartUsabilidade1 = data.map(item => {
            const [year, month] = item[0].split("-"); // Divide "YYYY-MM-DD" em [year, month, day]
            const date = new Date(year, month - 1);   // Cria uma data usando ano e mês (mês é zero-based)
            return date.toLocaleDateString("pt-BR", { month: "long" }).charAt(0).toUpperCase() +
                date.toLocaleDateString("pt-BR", { month: "long" }).slice(1);
        });

        dataChartUsabilidade1 = data.map(item => item[1]);


        createChartUsabilidade1();
    }



    // Criação de gráficos - Gerencial
    function createChart1() {
        if (!dataChart1 || !labelsChart1) return;

        if (chart1) chart1.destroy();

        chart1 = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: labelsChart1,
                datasets: [{
                    label: 'Quantidade',
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

    function createChart2() {
        if (!dataChart2_1 || !dataChart2_2 || !labelsChart2) return;

        if (chart2) chart2.destroy();

        chart2 = new Chart(ctx2,
            {
                type: 'line',
                data: {
                    labels: labelsChart2,
                    datasets: [{
                        label: 'Clientes',
                        data: dataChart2_1,
                        backgroundColor: '#D2135D',
                        borderColor: '#D2135D',
                        fill: false
                    },
                    {
                        label: 'Clientes fidelizados',
                        data: dataChart2_2,
                        backgroundColor: '#F59DBF',
                        borderColor: '#F59DBF',
                        fill: false
                    }
                    ]

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
            }
        );
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

    function createChart33() {
        if (!dataChart33 || !labelsChart33) return;

        if (chart33) chart33.destroy();

        chart33 = new Chart(ctx33, {
            type: 'bar',
            data: {
                labels: labelsChart33,
                datasets: [{
                    label: 'Média',
                    data: dataChart33,
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false, // Permite ajustar a proporção do gráfico
                aspectRatio: 2,
                plugins: {
                    subtitle: {
                        display: true,
                        text: '',
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        display: true, // Mostra a legenda
                        position: 'top', // Posição da legenda (topo, neste caso)
                        align: 'center', // Alinha a legenda ao centro
                        title: {
                            display: true
                        }
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    function createChart4() {
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
                        display: true, // Mostra a legenda
                        position: 'top', // Posição da legenda (topo, neste caso)
                        align: 'center', // Alinha a legenda ao centro
                        title: {
                            display: true
                        }
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
    // Criação de gráficos - Usabilidade
    function createChartUsabilidade1() {
        if (!dataChartUsabilidade1 || !labelsChartUsabilidade1) return;

        if (chartUsabilidade1) chartUsabilidade1.destroy();

        chartUsabilidade1 = new Chart(ctxUsabilidade1, {
            type: 'bar',
            data: {
                labels: labelsChartUsabilidade1,
                datasets: [{
                    label: 'Qtd Agendamentos',
                    data: dataChartUsabilidade1,
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
            }
        });
    }

    // Criação de gráficos - Operacional
    function createChartOperacional1() {
        if (!dataChartOperacional1) return;

        if (chartOperacional1) chartOperacional1.destroy();

        chartOperacional1 = new Chart(ctxOperacional1, {
            type: 'bar',
            data: {
                labels: ['Agendados', 'Confirmados', 'Realizados', 'Cancelados', 'Reagendados'],
                datasets: [{
                    label: 'Qtd Agendamentos',
                    data: dataChartOperacional1,
                    backgroundColor: ['#FF6384', '#D2135D', '#E84E8A', '#D94F4F', '#C13584']

                    ,
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    function createChartReceitaProcedimentosOperacional4(labels, dataChartReceita) {
        const ctx = document.getElementById('chartReceitaProcedimentosOperacional4').getContext('2d');

        // Criação do novo gráfico
        window.chartReceitaProcedimentosOperacional4 = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels, // Passando os nomes dos procedimentos como labels
                datasets: [{
                    label: 'Receita Total (R$)',
                    data: dataChartReceita, // Passando as receitas como dados
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],
                    borderColor: ['#D2135D', '#E84E8A', '#F59DBF'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    // Função para criar o gráfico pela primeira vez
    function createChartTempoGastoProcedimentosOperacional2(labels, dataChart) {
        const ctxOperacional2 = document.getElementById('chartTempoGastoProcedimentosOperacional2').getContext('2d');

        // Criação do gráfico com Chart.js
        chartTempoGastoProcedimentos = new Chart(ctxOperacional2, {
            type: 'bar',  // Tipo de gráfico (barras)
            data: {
                labels: labels,  // Procedimentos como rótulos (ex: Maquiagem, Sobrancelha)
                datasets: [{
                    label: 'Tempo Total Gasto (minutos)',  // Título do gráfico
                    data: dataChart,  // Tempos totais como dados
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],  // Cores para as barras
                    borderColor: ['#D2135D', '#E84E8A', '#F59DBF'],  // Cor da borda
                    borderWidth: 1  // Largura da borda
                }]
            },
            options: {
                responsive: true,  // Responsivo para diferentes tamanhos de tela
                scales: {
                    y: {
                        beginAtZero: true  // Eixo Y começa no zero
                    }
                }
            }
        });
    }
    function createChartProcedimentosRealizadosTrimestreOperacional3(labels, dataChart) {
        const ctx = document.getElementById('chartProcedimentosRealizadosTrimestreOperacional3').getContext('2d');

        // Criação do gráfico com Chart.js
        window.chartProcedimentosRealizadosTrimestreOperacional3 = new Chart(ctx, {
            type: 'bar',  // Tipo de gráfico: barra
            data: {
                labels: labels,  // Procedimentos como rótulos (ex: Maquiagem, Sobrancelha)
                datasets: [{
                    label: 'Quantidade de Procedimentos Realizados',  // Rótulo da barra
                    data: dataChart,  // Quantidade total de procedimentos realizados
                    backgroundColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cores das barras
                    borderColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cor da borda
                    borderWidth: 1  // Largura da borda
                }]
            },
            options: {
                responsive: true,  // Responsivo para diferentes tamanhos de tela
                scales: {
                    y: {
                        beginAtZero: true  // Eixo Y começa no zero
                    }
                }
            }
        });
    }
    // Função para criar o gráfico de valor total por procedimento no último mês
    function createChartValorTotalUltimoMesOperacional5(labels, dataChart) {
        const ctxOperacional5 = document.getElementById('chartValorTotalUltimoMesOperacional5').getContext('2d');

        // Criação do gráfico com Chart.js
        window.chartValorTotalUltimoMesOperacional5 = new Chart(ctxOperacional5, {
            type: 'bar',  // Tipo de gráfico: barra
            data: {
                labels: labels,  // Procedimentos como rótulos (ex: Maquiagem, Sobrancelha)
                datasets: [{
                    label: 'Valor Total em R$ no Último Mês',  // Rótulo do gráfico
                    data: dataChart,  // Valores totais em dinheiro para cada procedimento
                    backgroundColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cores das barras
                    borderColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cor da borda
                    borderWidth: 1  // Largura da borda
                }]
            },
            options: {
                responsive: true,  // Responsivo para diferentes tamanhos de tela
                scales: {
                    y: {
                        beginAtZero: true,  // Eixo Y começa no zero
                        title: {
                            display: true,
                            text: 'Valor em R$'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Procedimentos'
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

    new window.VLibras.Widget('https://vlibras.gov.br/app');
});

document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem("nome");
    const instagram = localStorage.getItem("instagram");


    if (nome && instagram) {
        document.getElementById("userName").textContent = nome;
        document.getElementById("userInsta").textContent = instagram;
    }

    showContent(usabilidadeContent);
    usabilidadeBtn.classList.add('active');
});




// // timer para o marcar tempo que leva para realizar um agendamento!

//     let seconds = 0; // Variável para armazenar o tempo em segundos

//     const timer = setInterval(() => {
//       seconds++; // Incrementa a variável a cada segundo
//       console.log(`Segundos: ${seconds}`);
//     }, 1000); // 1000 ms = 1 segundo

//     // Para parar o timer depois de um tempo, por exemplo, após 10 segundos:
//     setTimeout(() => {
//       clearInterval(timer); // Para o timer
//       console.log("Timer parado");
//     }, 10000); // 10000 ms = 10 segundos



//     function sendSecondsToServer() {
//         fetch('http://localhost:8080/api/agendamentos/atualizar-status/${selectedAgendamentoId}?statusId=3', { // Substitua pela URL do seu servidor
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json' // Define que o conteúdo é JSON
//             },
//             body: JSON.stringify({ time: seconds }) // Envia o valor dos segundos
//         })
//         .then(response => response.json())
//         .then(data => console.log('Sucesso:', data))
//         .catch(error => console.error('Erro:', error));
//     }


async function carregarImagem2() {
    const cpf = localStorage.getItem("cpf"); // Captura o valor do CPF a cada execução
    const perfilImage = document.getElementById("perfilImage");

    if (!cpf) {
        console.log("CPF não encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/usuarios/busca-imagem-usuario/${cpf}`, {
            method: "GET",
        });

        if (response.ok) {
            const blob = await response.blob(); // Recebe a imagem como Blob
            const imageUrl = URL.createObjectURL(blob); // Cria uma URL temporária para o Blob

            // Define a URL da imagem carregada como src do img
            perfilImage.src = imageUrl;
            perfilImage.alt = "Foto do usuário";
            perfilImage.style.width = "20vh";
            perfilImage.style.height = "20vh";
            perfilImage.style.borderRadius = "300px";
        } else {
            console.log("Imagem não encontrada para o CPF informado.");
        }
    } catch (error) {
        console.error("Erro ao buscar a imagem:", error);
    }
}

// Carrega a imagem automaticamente quando a página termina de carregar
window.onload = carregarImagem2;