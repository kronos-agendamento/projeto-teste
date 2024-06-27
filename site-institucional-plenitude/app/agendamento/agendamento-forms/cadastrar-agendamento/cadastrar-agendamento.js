document.addEventListener("DOMContentLoaded", function () {
    const apiUrlClientes = "http://localhost:8080/usuarios";
    const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos/listar";
    const apiUrlEspecificacoes = "http://localhost:8080/especificacoes";

    const clientesSelect = document.getElementById("clientes");
    const procedimentosSelect = document.getElementById("procedimentos");
    const especificacoesSelect = document.getElementById("especificacoes");

    async function carregarClientes() {
        try {
            const response = await fetch(apiUrlClientes);
            if (response.ok) {
                const clientes = await response.json();
                clientes.forEach(cliente => {
                    const option = document.createElement("option");
                    option.value = cliente.codigo;
                    option.text = cliente.nome;
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
                const tiposSet = new Set();
                procedimentos.forEach(procedimento => {
                    tiposSet.add(procedimento.tipo);
                });
                tiposSet.forEach(tipo => {
                    const option = document.createElement("option");
                    option.value = tipo;
                    option.text = tipo;
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
});

document.addEventListener("DOMContentLoaded", function () {
    const dataInput = document.getElementById("data");
    const dataSelecionadaP = document.getElementById("data-selecionada");

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