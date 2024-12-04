document.addEventListener('DOMContentLoaded', function () {

    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    // Calcula a data de 3 meses atrás
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const startDateString = startDate.toISOString().split("T")[0];

    // Preenche todos os campos de data automaticamente
    const startDateFields = document.querySelectorAll('input[type="date"][id^="startDate"]');
    const endDateFields = document.querySelectorAll('input[type="date"][id^="endDate"]');

    startDateFields.forEach(field => {
        field.value = startDateString;
    });

    endDateFields.forEach(field => {
        field.value = endDate;
    });


    // Função de atualização geral dos filtros
    document.getElementById("atualizarTodosOsFiltrosButton").addEventListener("click", function () {
        const startDateId = "startDateGlobal"; // ID do campo de data de início global
        const endDateId = "endDateGlobal"; // ID do campo de data de término global
        atualizarTodosOsFiltros(startDateId, endDateId);
    });

    function atualizarTodosOsFiltros(startDateId, endDateId) {
        const startDateInput = document.getElementById(startDateId);
        const endDateInput = document.getElementById(endDateId);

        // Pega as datas selecionadas
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        // Atualizar todos os campos de data nos filtros individuais
        atualizarCamposData(startDate, endDate);

        // Funções para buscar os dados de todos os gráficos e KPIs
        // Página de Usabilidade
        buscarDadosPorGrafico("/api/agendamentos/agendamentos-realizados-ultimos-cinco-meses", startDateId, endDateId, updateChartUsabilidade1);
        buscarDadosPorGrafico("/login-logoff/retorno-usuarios-login", startDateId, endDateId, updateRetornoLogin);
        buscarDadosPorGrafico("/api/agendamentos/tempo-para-agendar", startDateId, endDateId, updateTempoAgendamento);

        // Página Gerencial
        buscarDadosPorGrafico("/usuarios/clientes-ativos", startDateId, endDateId, updateClientesAtivos);
        buscarDadosPorGrafico("/usuarios/clientes-inativos", startDateId, endDateId, updateClientesInativos);
        buscarDadosPorGrafico("/api/agendamentos/agendamentos-realizados", startDateId, endDateId, updateAgendamentosRealizados);
        buscarDadosPorGrafico("/usuarios/clientes-fidelizados-ultimos-tres-meses", startDateId, endDateId, updateClientesFidelizados);

        // Página Operacional
        buscarDadosPorGrafico("/api/agendamentos/total-agendamentos-hoje", startDateId, endDateId, updateTotalAgendamentosHoje);
        buscarDadosPorGrafico("/api/agendamentos/futuros", startDateId, endDateId, updateTotalAgendamentosFuturos);
        buscarDadosPorGrafico("/api/agendamentos/media-tempo-entre-agendamentos", startDateId, endDateId, updateTempoMedio);
        buscarDadosPorGrafico("/api/feedbacks/media-notas-single", startDateId, endDateId, updateNotaSingle);
        buscarDadosPorGrafico("/api/agendamentos/agendamento-status", startDateId, endDateId, updateChartOperacional1);
        buscarDadosPorGrafico("/api/agendamentos/procedimentos-realizados-trimestre", startDateId, endDateId, updateChartProcedimentoRealizadosTrimestreOperacional3);
        buscarDadosPorGrafico("/api/agendamentos/tempo-gasto-ultimo-mes", startDateId, endDateId, updateChartTempoGastoOperacional2);
        buscarDadosPorGrafico("/api/agendamentos/receita-ultimos-tres-meses", startDateId, endDateId, updateChartReceitaProcedimentosOperacional4);
        buscarDadosPorGrafico("/api/agendamentos/valor-total-ultimo-mes", startDateId, endDateId, updateChartValorTotalUltimoMesOperacional5);
    }

    function atualizarCamposData(startDate, endDate) {
        // Atualiza os campos de data de todos os filtros
        const filtrosData = [
            "startDateUsabilidade1", "endDateUsabilidade1",
            "startDateUsabilidadeKPI1", "endDateUsabilidadeKPI1",
            "startDateUsabilidadeKPI2", "endDateUsabilidadeKPI2",
            "startDateGerencialKPI1", "endDateGerencialKPI1",
            "startDateGerencialKPI2", "endDateGerencialKPI2",
            "startDateGerencialKPI3", "endDateGerencialKPI3",
            "startDateGerencialKPI4", "endDateGerencialKPI4",
            "startDateGerencialGrafico1", "endDateGerencialGrafico1",
            "startDateGerencialGrafico2", "endDateGerencialGrafico2",
            "startDateGerencialGrafico3", "endDateGerencialGrafico3",
            "startDateGerencialGrafico4", "endDateGerencialGrafico4",
            "startDateOperacionalKPI1", "endDateOperacionalKPI1",
            "startDateOperacionalKPI2", "endDateOperacionalKPI2",
            "startDateOperacionalKPI3", "endDateOperacionalKPI3",
            "startDateOperacionalKPI4", "endDateOperacionalKPI4",
            "startDateOperacionalGrafico1", "endDateOperacionalGrafico1",
            "startDateOperacionalGrafico2", "endDateOperacionalGrafico2",
            "startDateOperacionalGrafico3", "endDateOperacionalGrafico3",
            "startDateOperacionalGrafico4", "endDateOperacionalGrafico4",
            "startDateOperacionalGrafico5", "endDateOperacionalGrafico5"
        ];

        // Atualiza o valor dos campos de data
        filtrosData.forEach(function (id) {
            const input = document.getElementById(id);
            if (input) {
                input.value = id.includes("startDate") ? startDate : endDate;
            }
        });
    }

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

    function capturarMetricasOperacional() {
        return [
            {
                titulo: "Agendamentos Marcados",
                dado: document.getElementById("total-agendamentos-hoje").innerText || "N/A",
                dataInicio: document.getElementById("startDateOperacionalKPI1").value || "N/A"
            },
            {
                titulo: "Agendamentos Futuros",
                dado: document.getElementById("total-agendamentos-futuros").innerText || "N/A",
                dataInicio: document.getElementById("startDateOperacionalKPI2").value || "N/A",
                dataFim: document.getElementById("endDateOperacionalKPI2").value || "N/A"
            },
            {
                titulo: "Tempo Médio Entre Atendimentos",
                dado: document.getElementById("tempo-medio-hoje").innerText || "N/A",
                dataInicio: document.getElementById("startDateOperacionalKPI3").value || "N/A",
                dataFim: document.getElementById("endDateOperacionalKPI3").value || "N/A"
            },
            {
                titulo: "Média de Avaliação dos Atendimentos",
                dado: document.getElementById("total-nota-single").innerText || "N/A",
                dataInicio: document.getElementById("startDateOperacionalKPI4").value || "N/A",
                dataFim: document.getElementById("endDateOperacionalKPI4").value || "N/A"
            }
        ];
    }


    function capturarGraficosOperacional() {
        return [
            {
                titulo: "Agendamentos",
                dataInicio: document.getElementById("startDateOperacionalGrafico1").value || "N/A",
                dataFim: "N/A", // Esse gráfico não tem data de término
                valores: obterDadosDoGrafico("chartOperacional1")
            },
            {
                titulo: "Procedimentos Realizados",
                dataInicio: document.getElementById("startDateOperacionalGrafico2").value || "N/A",
                dataFim: document.getElementById("endDateOperacionalGrafico2").value || "N/A",
                valores: obterDadosDoGrafico("chartProcedimentosRealizadosTrimestreOperacional3")
            },
            {
                titulo: "Tempo Médio de Atendimento",
                dataInicio: document.getElementById("startDateOperacionalGrafico3").value || "N/A",
                dataFim: document.getElementById("endDateOperacionalGrafico3").value || "N/A",
                valores: obterDadosDoGrafico("chartTempoGastoProcedimentosOperacional2")
            },
            {
                titulo: "Receita Média Gerada",
                dataInicio: document.getElementById("startDateOperacionalGrafico4").value || "N/A",
                dataFim: document.getElementById("endDateOperacionalGrafico4").value || "N/A",
                valores: obterDadosDoGrafico("chartReceitaProcedimentosOperacional4")
            },
            {
                titulo: "Valor da Hora de Procedimento",
                dataInicio: document.getElementById("startDateOperacionalGrafico5").value || "N/A",
                dataFim: document.getElementById("endDateOperacionalGrafico5").value || "N/A",
                valores: obterDadosDoGrafico("chartValorTotalUltimoMesOperacional5")
            }
        ];
    }


    function capturarMetricasGerencial() {
        return [
            {
                titulo: "Clientes Ativos",
                dado: document.getElementById("clientes-ativos-count").innerText || "N/A",
                dataInicio: document.getElementById("startDateGerencialKPI1").value || "N/A",
                dataFim: document.getElementById("endDateGerencialKPI1").value || "N/A"
            },
            {
                titulo: "Clientes Inativos",
                dado: document.getElementById("clientes-inativos-count").innerText || "N/A",
                dataInicio: document.getElementById("startDateGerencialKPI2").value || "N/A",
                dataFim: document.getElementById("endDateGerencialKPI2").value || "N/A"
            },
            {
                titulo: "Agendamentos Realizados",
                dado: document.getElementById("agendamentos-realizados-count").innerText || "N/A",
                dataInicio: document.getElementById("startDateGerencialKPI3").value || "N/A",
                dataFim: document.getElementById("endDateGerencialKPI3").value || "N/A"
            },
            {
                titulo: "Clientes Fidelizados",
                dado: document.getElementById("clientes-fidelizados-count").innerText || "N/A",
                dataInicio: document.getElementById("startDateGerencialKPI4").value || "N/A",
                dataFim: document.getElementById("endDateGerencialKPI4").value || "N/A"
            }
        ];
    }

    function capturarGraficosGerencial() {
        return [
            {
                titulo: "Conversão de Clientes",
                dataInicio: document.getElementById("startDateGerencialGrafico1").value || "N/A",
                dataFim: document.getElementById("endDateGerencialGrafico1").value || "N/A",
                valores: obterDadosDoGrafico("chart2")
            },
            {
                titulo: "Procedimentos Mais Realizados",
                dataInicio: document.getElementById("startDateGerencialGrafico2").value || "N/A",
                dataFim: document.getElementById("endDateGerencialGrafico2").value || "N/A",
                valores: obterDadosDoGrafico("chart4")
            },
            {
                titulo: "Procedimentos com Melhor Avaliação",
                dataInicio: document.getElementById("startDateGerencialGrafico3").value || "N/A",
                dataFim: document.getElementById("endDateGerencialGrafico3").value || "N/A",
                valores: obterDadosDoGrafico("chart33")
            },
            {
                titulo: "Receita Acumulada",
                dataInicio: document.getElementById("startDateGerencialGrafico4").value || "N/A",
                dataFim: document.getElementById("endDateGerencialGrafico4").value || "N/A",
                valores: obterDadosDoGrafico("chart3")
            },
            {
                titulo: "Canais de Divulgação",
                dataInicio: "N/A", // Sem campo de data
                dataFim: "N/A", // Sem campo de data
                valores: obterDadosDoGrafico("chart1")
            }
        ];
    }


    function capturarMetricasUsabilidade() {
        return [
            {
                titulo: "Tempo Médio de Conclusão de Agendamento",
                dado: document.getElementById("tempo-medio-conclusao").innerText || "N/A",
                dataInicio: document.getElementById("startDateUsabilidadeKPI2").value || "N/A",
                dataFim: document.getElementById("endDateUsabilidadeKPI2").value || "N/A"
            },
            {
                titulo: "Quantidade de Usuários Retornando ao Sistema",
                dado: document.getElementById("retorno-login-count").innerText || "N/A",
                dataInicio: document.getElementById("startDateUsabilidadeKPI1").value || "N/A",
                dataFim: document.getElementById("endDateUsabilidadeKPI1").value || "N/A"
            }
        ];
    }

    function capturarGraficosUsabilidade() {
        return [
            {
                titulo: "Taxa do uso do Sistema de Agendamento",
                dataInicio: document.getElementById("startDateUsabilidade1").value || "N/A",
                dataFim: document.getElementById("endDateUsabilidade1").value || "N/A",
                valores: obterDadosDoGrafico("chartUsabilidade1")
            }
        ];
    }


    // Função auxiliar
    function obterValorPorId(id) {
        const element = document.getElementById(id);
        return element ? parseInt(element.innerText) || 0 : 0;
    }

    // Função auxiliar
    function obterDadosDoGrafico(chartId) {
        const chart = Chart.getChart(chartId); // Reutilizando o gráfico Chart.js
        if (!chart) return [];

        return chart.data.labels.map((label, index) => ({
            categoria: label,
            quantidade: chart.data.datasets[0].data[index] || 0
        }));
    }



    document.getElementById("exportCsvButton").addEventListener("click", function () {
        const page = document.getElementById("pageSelect").value;

        let metricas = [];
        let graficos = [];

        switch (page) {
            case "operacional":
                metricas = capturarMetricasOperacional();
                graficos = capturarGraficosOperacional();
                break;

            case "gerencial":
                metricas = capturarMetricasGerencial();
                graficos = capturarGraficosGerencial();
                break;

            case "usabilidade":
                metricas = capturarMetricasUsabilidade();
                graficos = capturarGraficosUsabilidade();
                break;

            case "todas":
                // Captura dados de todas as páginas
                metricas = [
                    ...capturarMetricasOperacional(),
                    ...capturarMetricasGerencial(),
                    ...capturarMetricasUsabilidade()
                ];
                graficos = [
                    ...capturarGraficosOperacional(),
                    ...capturarGraficosGerencial(),
                    ...capturarGraficosUsabilidade()
                ];
                break;

            default:
                console.error("Página selecionada não é válida!");
                return;
        }

        const dadosParaExportacao = { metricas, graficos };

        fetch("http://localhost:8080/export/csv", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosParaExportacao)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao exportar CSV");
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${page}-export.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(error => {
                console.error("Erro ao exportar CSV:", error);
            });
    });

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

    function buscarDadosPorGrafico2(url, startDateId, callback) {
        const startDateInput = document.getElementById(startDateId);
        console.log(`Oii, sou a data do startDate ${startDateInput}`)
        // Verifica se os elementos de data existem
        if (!startDateInput) {

            console.error(`Elemento com ID ${startDateId}não foi encontrado.`);
            return;
        }

        const startDate = startDateInput.value;
        const endDate = null



        // Prossiga com a lógica da requisição
        fetchData2(url, { startDate, endDate }, callback);

    }



    // Função genérica para buscar dados com parâmetros dinâmicos
    function fetchData2(url, params = {}, callback) {
        try {
            // Verifica se os parâmetros estão corretos
            if (!url) {
                throw new Error("A URL é obrigatória.");
            }

            // Monta a URL com os parâmetros
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = `${baseUrl}${url}${queryString ? `?${queryString}` : ''}`;

            console.log(`URL de requisição: ${fullUrl}`); // Log da URL completa

            // Faz a requisição
            fetch(fullUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro na resposta da requisição: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Dados recebidos:", data); // Log dos dados recebidos
                    if (typeof callback === "function") {
                        callback(data); // Executa a função de callback com os dados
                    } else {
                        console.warn("Callback fornecido não é uma função.");
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar dados para o gráfico:", error);
                });
        } catch (error) {
            console.error("Erro no fetchData2:", error);
        }
    }




    // Atualiza os KPIs e os gráficos
    function updateKPIs() {

        const today = new Date();
        const endDate = today.toISOString().split("T")[0];

        // Calcula a data de 3 meses atrás
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3);
        const startDateString = startDate.toISOString().split("T")[0];

        const endpoints = {

            // KPI's - Gerencial
            clientesAtivos: '/usuarios/clientes-ativos',
            clientesInativos: '/usuarios/clientes-inativos',
            clientesFidelizados: '/usuarios/clientes-fidelizados-ultimos-tres-meses',
            agendamentosRealizados: '/api/agendamentos/agendamentos-realizados',

            // KPI's - Usabilidade
            tempoAgendamento: '/api/agendamentos/tempo-para-agendar',
            retornoLogin: '/login-logoff/retorno-usuarios-login',

            // KPI's - Operacional
            totalAgendamentosHoje: '/api/agendamentos/total-agendamentos-hoje',
            totalAgendamentosFuturos: '/api/agendamentos/futuros',
            notasFeedbacks: '/api/feedbacks/media-notas-single',
            tempoMedio: '/api/agendamentos/media-tempo-entre-agendamentos',

            // Gráfico 1 - Gerencial
            listarNumeroIndicacoes: '/usuarios/buscar-numeros-indicacoes',

            // Gráfico 2 - Gerencial
            listarClientesConcluidosUltimosCincoMeses: '/usuarios/clientes-concluidos-ultimos-cinco-meses',
            listarClientesFidelizadosUltimosCincoMeses: '/usuarios/clientes-fidelizados-ultimos-cinco-meses',

            // Gráfico 33 - Gerencial
            listarProcedimentosBemAvaliados: '/api/procedimentos/listar-bem-avaliados',

            // Gráfico 4 - Gerencial
            receitaAcumulada: '/api/especificacoes/receita-acumulada',

            // Gráfico 2 - Gerencial
            agendamentosProcedimentos: '/api/procedimentos/quantidade-agendamentos-especificacao',

            // Gráfico 1 - Operacional
            agendamentosStatus: '/api/agendamentos/agendamento-status',

            // Gráfico 4 - Operacional
            agendamentosReceitaUltimosTresMeses: '/api/agendamentos/receita-ultimos-tres-meses',

            // Gráfico 3 - Operacional
            agendamentosTempoGastoUltimoMes: '/api/agendamentos/tempo-gasto-ultimo-mes',

            // Gráfico 2 - Operacional
            agendamentosProcedimentosRealizadosTrimestre: '/api/agendamentos/procedimentos-realizados-trimestre',

            // Gráfico 5 - Operacional
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
        fetchData2(endpoints.clientesAtivos, { startDate, endDate }, updateClientesAtivos); // ok
        fetchData2(endpoints.clientesInativos, { startDate, endDate }, updateClientesInativos); // ok
        fetchData2(endpoints.clientesFidelizados, { startDate, endDate }, updateClientesFidelizados); // ok
        fetchData2(endpoints.agendamentosRealizados, { startDate, endDate }, updateAgendamentosRealizados); // ok

        // Chamadas para atualizar os KPI's de - Usabilidade - ok
        fetchData2(endpoints.tempoAgendamento, { startDate, endDate }, updateTempoAgendamento); // ok
        //  fetchData2(endpoints.retornoLogin, { startDate: startDateString12MesesAtras, endDate: endDateDiaAtual }, updateRetornoLogin); // ok
        fetchData2(endpoints.retornoLogin, { startDate, endDate }, updateRetornoLogin); // ok

        // Chamadas para atualizar os KPI's de - Operacional
        fetchData2(endpoints.totalAgendamentosHoje, { startDate, endDate }, updateTotalAgendamentosHoje);
        fetchData2(endpoints.totalAgendamentosFuturos, { startDate, endDate }, updateTotalAgendamentosFuturos);
        fetchData2(endpoints.notasFeedbacks, { startDate, endDate }, updateNotaSingle);
        fetchData2(endpoints.tempoMedio, { startDate, endDate }, updateTempoMedio);

        // Chamadas para atualizar os dados do gráfico 1 - Gerencial
        fetchData(endpoints.listarNumeroIndicacoes, updateChart1)

        // Chamadas para atualizar os dados do gráfico 2 - Gerencial
        fetchData2(endpoints.listarClientesConcluidosUltimosCincoMeses, { startDate, endDate }, updateChart2_1);
        fetchData2(endpoints.listarClientesFidelizadosUltimosCincoMeses, { startDate, endDate }, updateChart2_2);

        // Chamadas para atualizar os dados do gráfico 3 - Gerencial
        fetchData2(endpoints.receitaAcumulada, { startDate, endDate }, updateChart3);

        // Chamadas para atualizar os dados do gráfico 33 - Gerencial
        fetchData2(endpoints.listarProcedimentosBemAvaliados, { startDate, endDate }, updateChart33Labels);


        // Chamadas para atualizar os dados do gráfico 4 - Gerencial
        fetchData2(endpoints.agendamentosProcedimentos, { startDate, endDate }, updateChart4);

        // Chamada para atualizar os dados do gráfico 1 - Operacional
        fetchData2(endpoints.agendamentosStatus, { startDate, endDate }, updateChartOperacional1);

        // Chamada para atualizar os dados do gráfico 4 - Operacional
        fetchData2(endpoints.agendamentosReceitaUltimosTresMeses, { startDate, endDate }, updateChartReceitaProcedimentosOperacional4);

        // Chamada para atualizar os dados do gráfico 3 - Operacional
        fetchData2(endpoints.agendamentosTempoGastoUltimoMes, { startDate, endDate }, updateChartTempoGastoOperacional2);

        // Chamada para atualizar os dados do gráfico 2 - Operacional
        fetchData2(endpoints.agendamentosProcedimentosRealizadosTrimestre, { startDate, endDate }, updateChartProcedimentoRealizadosTrimestreOperacional3);

        // Chamada para atualizar os dados do gráfico 5 - Operacional
        fetchData2(endpoints.agendamentosValorTotalUltimoMes, { startDate, endDate }, updateChartValorTotalUltimoMesOperacional5);

        // Chamada para atualiazar o gráfico de usabilidade - Usabilidade
        fetchData2(
            endpoints.ultimosAgendamentosRealizados5Meses,
            { startDate: startDateString3MesesAtras, endDate: endDateDiaAtual },
            updateChartUsabilidade1
        );
    }

    // Funções que atualizam as KPI's do gerencial
    updateKPIs();

    function addFilterListener(buttonId, url, startDateId, endDateId, callback) {
        document.getElementById(buttonId).addEventListener("click", function () {
            buscarDadosPorGrafico(url, startDateId, endDateId, callback);
        });
    }
    function addFilterListener2(buttonId, url, startDateId, callback) { // esse diferentemente do primeiro addFilterListener não possui o endDateId
        document.getElementById(buttonId).addEventListener("click", function () {
            buscarDadosPorGrafico2(url, startDateId, callback);
        });
    }
    function addFilterListener3(buttonId, url) {
        document.getElementById(buttonId).addEventListener("click", function () {
            fetch(url, updateChart1);
        });
    }


    // Atualização dos botões de filtro da página de usabilidade
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


    // atualização dos botões de filtro da página Gerencial
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

    document.getElementById("buscarGerencialGrafico1Button").addEventListener("click", function () {
        buscarDadosPorGrafico(
            "/usuarios/clientes-concluidos-ultimos-cinco-meses",
            "startDateGerencialGrafico1",
            "endDateGerencialGrafico1",
            updateChart2_1
        );

        buscarDadosPorGrafico(
            "/usuarios/clientes-fidelizados-ultimos-cinco-meses",
            "startDateGerencialGrafico1",
            "endDateGerencialGrafico1",
            updateChart2_2
        );
    });

    addFilterListener(
        "buscarGerencialGrafico2Button",                                     // ID do botão
        "/api/procedimentos/quantidade-agendamentos-especificacao", // URL da API
        "startDateGerencialGrafico2",                            // ID do campo de data de início
        "endDateGerencialGrafico2",                              // ID do campo de data de término
        updateChart4                 // Callback específico para atualizar o gráfico 1
    );
    addFilterListener(
        "buscarGerencialGrafico3Button",                                     // ID do botão
        "/api/procedimentos/listar-bem-avaliados", // URL da API
        "startDateGerencialGrafico3",                            // ID do campo de data de início
        "endDateGerencialGrafico3",                              // ID do campo de data de término
        updateChart33Labels           // Callback específico para atualizar o gráfico 1
    );
    addFilterListener(
        "buscarGerencialGrafico4Button",                                     // ID do botão
        "/api/especificacoes/receita-acumulada", // URL da API
        "startDateGerencialGrafico4",                            // ID do campo de data de início
        "endDateGerencialGrafico4",                              // ID do campo de data de término
        updateChart3         // Callback específico para atualizar o gráfico 1
    );


    // atualização dos botões de filtro da página Operacional
    addFilterListener2(
        "buscarOperacionalKPI1Button",
        "/api/agendamentos/total-agendamentos-hoje",
        "startDateOperacionalKPI1",
        updateTotalAgendamentosHoje
    );
    addFilterListener(
        "buscarOperacionalKPI2Button",
        "/api/agendamentos/futuros",
        "startDateOperacionalKPI2",
        "endDateOperacionalKPI2",
        updateTotalAgendamentosFuturos
    );
    addFilterListener(
        "buscarOperacionalKPI3Button",
        "/api/agendamentos/media-tempo-entre-agendamentos",
        "startDateOperacionalKPI3",
        "endDateOperacionalKPI3",
        updateTempoMedio
    );
    addFilterListener(
        "buscarOperacionalKPI4Button",
        "/api/feedbacks/media-notas-single",
        "startDateOperacionalKPI4",
        "endDateOperacionalKPI4",
        updateNotaSingle
    );
    addFilterListener2(
        "buscarOperacionalGrafico1Button",                                     // ID do botão
        "/api/agendamentos/agendamento-status", // URL da API
        "startDateOperacionalGrafico1",                            // ID do campo de data de início                             // ID do campo de data de término
        updateChartOperacional1        // Callback específico para atualizar o gráfico 1
    );
    addFilterListener(
        "buscarOperacionalGrafico2Button",
        "/api/agendamentos/procedimentos-realizados-trimestre",
        "startDateOperacionalGrafico2",
        "endDateOperacionalGrafico2",
        updateChartProcedimentoRealizadosTrimestreOperacional3
    );
    addFilterListener(
        "buscarOperacionalGrafico3Button",
        "/api/agendamentos/tempo-gasto-ultimo-mes",
        "startDateOperacionalGrafico3",
        "endDateOperacionalGrafico3",
        updateChartTempoGastoOperacional2
    );
    addFilterListener(
        "buscarOperacionalGrafico4Button",
        "/api/agendamentos/receita-ultimos-tres-meses",
        "startDateOperacionalGrafico4",
        "endDateOperacionalGrafico4",
        updateChartReceitaProcedimentosOperacional4
    );
    addFilterListener(
        "buscarOperacionalGrafico5Button",
        "/api/agendamentos/valor-total-ultimo-mes",
        "startDateOperacionalGrafico5",
        "endDateOperacionalGrafico5",
        updateChartValorTotalUltimoMesOperacional5
    );





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
        totalAgendamentosHoje.textContent = formatarNumero(data);
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
    let labelsChartUsabilidade1 = lastFiveMonths;
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
        // Mapeia os labels (chaves do objeto) e os dados (valores do objeto)
        const labels = Object.keys(data);  // Procedimentos (ex: Maquiagem, Sobrancelha)
        const dataChart = Object.values(data);  // Quantidade total de procedimentos realizados

        // Cria um novo gráfico com os dados atualizados
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

    function updateChart1(data) {
        // Mapeando os meios de indicação como labels e suas frequências como dados
        labelsChart1 = data.map(item => item.meio_indicacao); // Extrai os meios de indicação
        dataChart1 = data.map(item => item.frequencia); // Extrai as frequências

        createChart1(); // Atualiza o gráfico com os novos dados
    }


    function updateChart3(data) {
        // Mapeando os labels (mes_ano) e os dados (receita_total) do retorno da API
        labelsChart3 = data.map(item => item.mes_ano); // Extrai os meses
        dataChart3 = data.map(item => item.receita_total); // Extrai os valores de receita

        // Verifica se ambos os valores estão presentes e chama a função de criação do gráfico
        createChart3();
    }

    function updateChart33Labels(data) {
        // Mapeando os dados recebidos para extrair labels e valores
        labelsChart33 = data.map(item => item.nome_procedimento || item.tipo_procedimento || 'Sem Nome');
        dataChart33 = data.map(item => item.nota_media || 0); // Extrai a média das notas; usa 0 se a nota for null

        // Verifica se os dados estão prontos e chama a função de criação do gráfico
        if (dataChart33 && labelsChart33) {
            createChart33(); // Chama a função para recriar o gráfico com os novos dados e labels
        }
    }

    function updateChart4(data) {
        // Mapeando os labels e os dados do callback `data`
        labelsChart4 = data.map(item => item.nome_especificacao); // Extrai os nomes das especificações como labels
        dataChart4 = data.map(item => item.quantidade_agendamentos); // Extrai as quantidades como dados

        // Chama a função que cria o gráfico
        createChart4();
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
        if (!dataChart1 || !labelsChart1) return; // Certifica-se de que os dados estão disponíveis

        if (chart1) chart1.destroy(); // Destroi o gráfico existente para recriar

        chart1 = new Chart(ctx1, {
            type: 'line', // Gráfico de linha
            data: {
                labels: labelsChart1, // Labels baseados nos meios de indicação
                datasets: [{
                    data: dataChart1, // Dados das frequências
                    backgroundColor: 'rgba(210, 19, 93, 0.2)', // Fundo da linha
                    borderColor: '#D2135D', // Cor da linha
                    borderWidth: 2, // Espessura da linha
                    tension: 0.3, // Suavidade na linha
                    fill: true // Preenchimento abaixo da linha
                }]
            },
            options: {
                responsive: true, // Habilita o redimensionamento
                maintainAspectRatio: false, // Permite ajustar a altura e largura do gráfico
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    
                    legend: {
                        display: false,
                        position: 'top' // Legenda no topo
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Meios de Indicação'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Quantidade de Indicações'
                        }
                    }
                }
            }
        });
    }


    // Função para criar o gráfico
    function createChart2() {
        // Garante que os dados necessários estão disponíveis antes de criar o gráfico
        if (!dataChart2_1 || !dataChart2_2 || !labelsChart2) return;

        // Destroi o gráfico anterior, se existir
        if (chart2) chart2.destroy();

        // Cria o gráfico com os novos dados e labels
        chart2 = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: labelsChart2, // Labels dinâmicos de mês e ano
                datasets: [
                    {
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
                responsive: true, // Habilita o redimensionamento
                maintainAspectRatio: false, // Permite ajustar a altura e largura do gráfico
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                // plugins: {
                //     subtitle: {
                //         display: true,
                //         text: 'Evolução de Clientes e Fidelizações',
                //         font: {
                //             size: 14
                //         }
                //     }
                // },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Período (Mês e Ano)' // Nome do eixo X
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Quantidade de Clientes' // Nome do eixo Y
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Função para atualizar os dados do primeiro conjunto (Clientes)
    function updateChart2_1(data) {
        const labels = data.map(item => item.periodo); // Mês e ano
        const valores = data.map(item => item.QTD_CLIENTES); // Quantidade de clientes

        labelsChart2 = labels; // Atualiza as labels globais
        dataChart2_1 = valores; // Atualiza os dados globais para o conjunto 1

        // Garante que todos os dados estão disponíveis antes de criar o gráfico
        if (dataChart2_1 && dataChart2_2 && labelsChart2) {
            createChart2();
        }
    }

    // Função para atualizar os dados do segundo conjunto (Clientes Fidelizados)
    function updateChart2_2(data) {
        const labels = data.map(item => item.periodo); // Mês e ano
        const valores = data.map(item => item.QTD_CLIENTES); // Quantidade de clientes

        labelsChart2 = labels; // Atualiza as labels globais
        dataChart2_2 = valores; // Atualiza os dados globais para o conjunto 2

        // Garante que todos os dados estão disponíveis antes de criar o gráfico
        if (dataChart2_1 && dataChart2_2 && labelsChart2) {
            createChart2();
        }
    }



    function createChart3() {
        if (!dataChart3 || !labelsChart3) return; // Certifica-se de que os dados estão disponíveis

        if (chart3) chart3.destroy(); // Destroi o gráfico existente para recriar

        chart3 = new Chart(ctx3, {
            type: 'line', // Gráfico de linha
            data: {
                labels: labelsChart3, // Labels dos meses
                datasets: [{
                    data: dataChart3, // Dados das receitas acumuladas
                    backgroundColor: 'rgba(210, 19, 93, 0.2)', // Fundo das linhas (transparente)
                    borderColor: '#D2135D', // Cor da linha
                    borderWidth: 2, // Espessura da linha
                    tension: 0.3, // Curvatura da linha (deixa um pouco suave)
                    fill: true // Preenche abaixo da linha para destacar a curva
                }]
            },
            options: {
                responsive: true, // Habilita o redimensionamento
                maintainAspectRatio: false, // Permite ajustar a altura e largura do gráfico
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Período (Mês e Ano)'  // Título do eixo X
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Receita Acumulada (R$)'  // Título do eixo Y
                        }
                    }
                }
            }
        });
        
    }


    function createChart33() {
        if (!dataChart33 || !labelsChart33) return; // Garante que labels e dados existam

        if (chart33) chart33.destroy(); // Destroi o gráfico existente para recriar

        chart33 = new Chart(ctx33, {
            type: 'bar',
            data: {
                labels: labelsChart33, // Labels mapeados
                datasets: [{
                    data: dataChart33, // Dados mapeados (nota média)
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF', '#FF85A1', '#FFD6E3', '#F0A6CA'], // Mais cores para diferentes barras
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                indexAxis: 'y', // Gráfico horizontal
                responsive: true,
                maintainAspectRatio: false, // Permite ajustar a proporção do gráfico
                aspectRatio: 2, // Define a proporção do gráfico
                plugins: {
                    subtitle: {
                        display: true,
                        text: '',
                        font: {
                            size: 14
                        }
                    },
                    legend: {
                        display: false, // Mostra a legenda
                        position: 'top', // Posição no topo
                        align: 'center', // Alinha a legenda ao centro
                        title: {
                            display: true
                        }
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true, // Começa o eixo Y do zero
                        title: {
                            display: true,
                            text: 'Procedimentos'  // Título do eixo X
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Avaliação (0 a 5)'  // Título do eixo X
                        }
                    }
                }
            }
        });
    }

    function createChart4() {
        if (!dataChart4 || !labelsChart4) return;

        if (chart4) chart4.destroy(); // Destroi o gráfico existente antes de recriar

        chart4 = new Chart(ctx4, {
            type: 'pie', // Gráfico de pizza
            data: {
                labels: labelsChart4, // Labels mapeados
                datasets: [{
                    label: 'Vezes Agendadas',
                    data: dataChart4, // Dados mapeados
                    backgroundColor: [
                        '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFC300',
                        '#C70039', '#900C3F', '#DAF7A6', '#581845', '#AF7AC5'
                    ], // Paleta mais variada
                    borderColor: '#FFFFFF', // Cor das bordas das fatias
                    borderWidth: 1, // Largura da borda
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true, // Exibe a legenda
                    position: 'top', // Posição no topo
                    align: 'center', // Centraliza a legenda
                },
                plugins: {
                    legend: {
                        display: false, // Exibe a legenda
                        position: 'top', // Posição no topo
                        align: 'center', // Centraliza a legenda
                    },
                    title: {
                        display: false // Remove o título do gráfico
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                let value = tooltipItem.raw || 0;
                                return `${tooltipItem.label}: ${value} agendamentos`;
                            }
                        }
                    }
                }
            }
        });
    }


    // Criação de gráficos - Usabilidade
    function createChartUsabilidade1() {
        if (!dataChartUsabilidade1  || !labelsChartUsabilidade1) return;

        if (chartUsabilidade1) chartUsabilidade1.destroy();

        chartUsabilidade1 = new Chart(ctxUsabilidade1, {
            type: 'bar',
            data: {
                labels: labelsChartUsabilidade1,
                datasets: [{
                    data: dataChartUsabilidade1,
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                responsive: true, // Habilita o redimensionamento
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,  // Desativa a legenda
                    }
                },

                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Meses'  // Título do eixo X
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Agendamentos'  // Título do eixo Y
                        }
                    }
                }
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
                    data: dataChartOperacional1,
                    backgroundColor: ['#FF6384',  '#D2135D', '#E84E8A', '#D94F4F','#C13584']

                    ,
                    borderColor: '#D2135D',
                    fill: false
                }]
            },
            options: {
                responsive: true, // Habilita o redimensionamento
                maintainAspectRatio: false, // Permite ajustar a altura e largura do gráfico
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,  // Exibe o título do eixo X
                            text: 'Quantidade'  // Título do eixo X
                        }
                    },
                    x: {
                        title: {
                            display: true,  // Exibe o título do eixo X
                            text: 'Procedimentos'  // Título do eixo X
                        }
                    }
                },
            plugins: {
                legend: {
                    display: false,  // Desativa a legenda
                }
            }
            }
        });
    }
    function createChartReceitaProcedimentosOperacional4(labels, dataChartReceita) {
        const ctx = document.getElementById('chartReceitaProcedimentosOperacional4').getContext('2d');

        if (chartReceitaProcedimentosOperacional4) chartReceitaProcedimentosOperacional4.destroy();

        // Criação do novo gráfico
        chartReceitaProcedimentosOperacional4 = new Chart(ctx, {
            type: 'bar',  // Tipo de gráfico: barra
            data: {
                labels: labels,  // Passando os nomes dos procedimentos como labels
                datasets: [{
                    // Remover label no dataset
                    data: dataChartReceita,  // Passando as receitas como dados
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],  // Cores das barras
                    borderColor: ['#D2135D', '#E84E8A', '#F59DBF'],  // Cor da borda
                    borderWidth: 1  // Largura da borda
                }]
            },
            options: {
                responsive: true,  // Responsivo para diferentes tamanhos de tela
                scales: {
                    y: {
                        beginAtZero: true,  // Eixo Y começa no zero
                        title: {
                            display: true,  // Exibe o título do eixo Y
                            text: 'Receita (R$)'  // Título do eixo Y
                        }
                    },
                    x: {
                        title: {
                            display: true,  // Exibe o título do eixo X
                            text: 'Procedimentos'  // Título do eixo X
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,  // Desativa a legenda
                    }
                }
            }
        });
        
    }
    // Função para criar o gráfico pela primeira vez
    function createChartTempoGastoProcedimentosOperacional2(labels, dataChart) {
    const ctxOperacional2 = document.getElementById('chartTempoGastoProcedimentosOperacional2').getContext('2d');


        if (chartTempoGastoProcedimentos) chartTempoGastoProcedimentos.destroy();

        // Criação do gráfico com Chart.js
        chartTempoGastoProcedimentos = new Chart(ctxOperacional2, {
            type: 'bar',  // Tipo de gráfico (barras)
            data: {
                labels: labels,  // Procedimentos como rótulos (ex: Maquiagem, Sobrancelha)
                datasets: [{
                    data: dataChart,  // Tempos totais como dados
                    backgroundColor: ['#D2135D', '#E84E8A', '#F59DBF'],  // Cores para as barras
                    borderColor: ['#D2135D', '#E84E8A', '#F59DBF'],  // Cor da borda
                    borderWidth: 1  // Largura da borda
                }]
            },
            options: {
                responsive: true, // Habilita o redimensionamento
                maintainAspectRatio: false, // Permite ajustar a altura e largura do gráfico
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,  // Exibe o título do eixo Y
                            text: 'Tempo (ms)'  // Título do eixo Y
                        }
                    },
                    x: {
                        title: {
                            display: true,  // Exibe o título do eixo X
                            text: 'Procedimentos'  // Título do eixo X
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,  // Desativa a legenda
                    }
                }
            }
        });
    }
    function createChartProcedimentosRealizadosTrimestreOperacional3(labels, dataChart) {
        const ctx = document.getElementById('chartProcedimentosRealizadosTrimestreOperacional3').getContext('2d');

        if (chartProcedimentosRealizadosTrimestreOperacional3) chartProcedimentosRealizadosTrimestreOperacional3.destroy();

        // Criação do gráfico com Chart.js
        chartProcedimentosRealizadosTrimestreOperacional3 = new Chart(ctx, {
            type: 'bar',  // Tipo de gráfico: barra
            data: {
                labels: labels,  // Procedimentos como rótulos (ex: Maquiagem, Sobrancelha)
                datasets: [{
                    // Removido o label do dataset
                    data: dataChart,  // Quantidade total de procedimentos realizados
                    backgroundColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cores das barras
                    borderColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cor da borda
                    borderWidth: 1  // Largura da borda
                }]
            },
            options: {
                responsive: true,  // Responsivo para diferentes tamanhos de tela
                maintainAspectRatio: false,  // Mantém proporção ajustada
                scales: {
                    y: {
                        beginAtZero: true,  // Eixo Y começa no zero
                        title: {
                            display: true,
                            text: 'Quantidade'  // Título do eixo Y
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Procedimentos'  // Título do eixo X
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false,  // Desativa a legenda
                        position: 'top'  // Legenda no topo
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return ` ${tooltipItem.label}: ${tooltipItem.raw}`; // Exibe o label e o valor na tooltip
                            }
                        }
                    }
                }
            }
        });
        
    }

    // Função para criar o gráfico de valor total por procedimento no último mês
    function createChartValorTotalUltimoMesOperacional5(labels, dataChart) {
        const ctxOperacional5 = document.getElementById('chartValorTotalUltimoMesOperacional5').getContext('2d');

        if (chartValorTotalUltimoMesOperacional5) chartValorTotalUltimoMesOperacional5.destroy();


        // Criação do gráfico com Chart.js
        chartValorTotalUltimoMesOperacional5 = new Chart(ctxOperacional5, {
            type: 'bar',  // Tipo de gráfico: barra
            data: {
                labels: labels,  // Procedimentos como rótulos (ex: Maquiagem, Sobrancelha)
                datasets: [{
                    data: dataChart,  // Valores totais em dinheiro para cada procedimento
                    backgroundColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cores das barras
                    borderColor: ['#FF6384', '#D2135D', '#E84E8A', '#C13584', '#D94F4F'],  // Cor da borda
                    borderWidth: 1  // Largura da borda
                }]
            },
            options: {
                    responsive: true, // Habilita o redimensionamento
                    maintainAspectRatio: false, // Permite ajustar a altura e largura do gráfico
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
                },
                plugins: {
                    legend: {
                        display: false,  // Desativa a legenda
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
    window.recarregarKPIs = function () {
        updateKPIs(); // Chama a função que atualiza os KPIs
    } // Exemplo de atualização a cada 30 segundos

  new window.VLibras.Widget('https://vlibras.gov.br/app');
});

document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem("nome");
    const instagram = localStorage.getItem("instagram");


    if (nome && instagram) {
        document.getElementById("userName").textContent = nome;
        document.getElementById("userInsta").textContent = instagram;
    }

    showContent(operacionalContent);
    operacionalBtn.classList.add('active');
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
        const response = await fetch(`http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`, {
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