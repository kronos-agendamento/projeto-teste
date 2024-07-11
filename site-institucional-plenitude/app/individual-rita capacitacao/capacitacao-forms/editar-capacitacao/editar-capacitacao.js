document.addEventListener("DOMContentLoaded", async function () {
    const apiUrlClientes = "http://localhost:8080/usuarios";
    const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos/listar";
    const apiUrlEspecificacoes = "http://localhost:8080/especificacoes";

    const clientesSelect = document.getElementById("clientes");
    const procedimentosSelect = document.getElementById("procedimentos");
    const especificacoesSelect = document.getElementById("especificacoes");

    const clienteId = document.body.dataset.clienteId;
    const procedimentoId = document.body.dataset.procedimentoId;
    const especificacaoId = document.body.dataset.especificacaoId;
    const dataAgendamento = document.body.dataset.dataAgendamento;

    async function carregarClientes() {
        try {
            const response = await fetch(apiUrlClientes);
            if (response.ok) {
                const clientes = await response.json();
                clientes.forEach(cliente => {
                    const option = document.createElement("option");
                    option.value = cliente.codigo;
                    option.text = cliente.nome;
                    if (cliente.codigo == clienteId) {
                        option.selected = true;
                    }
                    clientesSelect.appendChild(option);
                });
            } else {
                console.error("Erro ao buscar clientes: " + response.statusText);
            }
        } catch (error) {
            console.error("Erro ao buscar clientes: ", error);
        }
    }

    async function carregarProcedimentos() {
        try {
            const response = await fetch(apiUrlProcedimentos);
            if (response.ok) {
                const procedimentos = await response.json();
                procedimentos.forEach(procedimento => {
                    const option = document.createElement("option");
                    option.value = procedimento.tipo;
                    option.text = procedimento.tipo;
                    if (procedimento.tipo == procedimentoId) {
                        option.selected = true;
                    }
                    procedimentosSelect.appendChild(option);
                });
            } else {
                console.error("Erro ao buscar procedimentos: " + response.statusText);
            }
        } catch (error) {
            console.error("Erro ao buscar procedimentos: ", error);
        }
    }

    async function carregarEspecificacoes() {
        try {
            const response = await fetch(apiUrlEspecificacoes);
            if (response.ok) {
                const especificacoes = await response.json();
                especificacoes.forEach(especificacao => {
                    const option = document.createElement("option");
                    option.value = especificacao.idEspecificacaoProcedimento;
                    option.text = especificacao.especificacao;
                    if (especificacao.idEspecificacaoProcedimento == especificacaoId) {
                        option.selected = true;
                    }
                    especificacoesSelect.appendChild(option);
                });
            } else {
                console.error("Erro ao buscar especificações: " + response.statusText);
            }
        } catch (error) {
            console.error("Erro ao buscar especificações: ", error);
        }
    }

    carregarClientes();
    carregarProcedimentos();
    carregarEspecificacoes();

    // Preenche o campo de data
    const dataInput = document.getElementById("data");
    const dataSelecionadaP = document.getElementById("data-selecionada");

    if (dataAgendamento) {
        dataInput.value = dataAgendamento;
        const dataSelecionada = new Date(dataAgendamento);
        if (!isNaN(dataSelecionada)) {
            const dia = dataSelecionada.getDate();
            const mes = dataSelecionada.toLocaleString('default', { month: 'long' });
            const diaSemana = dataSelecionada.toLocaleString('default', { weekday: 'long' });
            dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;
        }
    }

    dataInput.addEventListener("change", function () {
        const dataSelecionada = new Date(dataInput.value);
        if (!isNaN(dataSelecionada)) {
            const dia = dataSelecionada.getDate();
            const mes = dataSelecionada.toLocaleString('default', { month: 'long' });
            const diaSemana = dataSelecionada.toLocaleString('default', { weekday: 'long' });
            dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;
        } else {
            dataSelecionadaP.textContent = "";
        }
    });
});
