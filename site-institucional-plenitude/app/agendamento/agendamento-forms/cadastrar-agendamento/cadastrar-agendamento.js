document.addEventListener("DOMContentLoaded", function () {
    const apiUrlClientes = "http://localhost:8080/usuarios";
    const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos/listar";
    const apiUrlEspecificacoes = "http://localhost:8080/especificacoes";
    const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos/listar";
    const apiUrlCriarAgendamento = "http://localhost:8080/api/agendamentos/criar";

    const clientesSelect = document.getElementById("clientes");
    const procedimentosSelect = document.getElementById("procedimentos");
    const especificacoesSelect = document.getElementById("especificacoes");
    const tipoAgendamentosSelect = document.getElementById("tipo-agendamentos");
    const dataInput = document.getElementById("data");
    const dataSelecionadaP = document.getElementById("data-selecionada");
    const horariosContainer = document.getElementById("horarios-disponiveis");
    const saveButton = document.getElementById("save-agendamento-button");

  async function carregarClientes() {
    try {
      const response = await fetch(apiUrlClientes);
      if (response.ok) {
        const clientes = await response.json();
        clientes.forEach((cliente) => {
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
        procedimentos.forEach((procedimento) => {
          tiposSet.add(procedimento.tipo);
        });
        tiposSet.forEach((tipo) => {
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
        especificacoes.forEach((especificacao) => {
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

    async function carregarTiposAgendamentos() {
        try {
            const response = await fetch(apiUrlAgendamentos);
            if (response.ok) {
                const agendamentos = await response.json();
                const tiposSet = new Set();
                agendamentos.forEach(agendamento => {
                    tiposSet.add(agendamento.tipoAgendamento);
                });
                tiposSet.forEach(tipo => {
                    const option = document.createElement("option");
                    option.value = tipo;
                    option.text = tipo;
                    tipoAgendamentosSelect.appendChild(option);
                });
            } else {
                console.error("Erro ao buscar agendamentos: " + response.statusText);
            }
        } catch (error) {
            console.error("Erro ao buscar agendamentos: ", error);
        }
    }

    async function carregarHorariosDisponiveis(data) {
        try {
            const response = await fetch(apiUrlAgendamentos);
            if (response.ok) {
                const agendamentos = await response.json();
                const horariosOcupados = agendamentos
                    .filter(agendamento => agendamento.data === data)
                    .map(agendamento => new Date(agendamento.horario).getHours());

                const horariosDisponiveis = [];
                for (let i = 9; i <= 18; i++) {
                    if (!horariosOcupados.includes(i)) {
                        horariosDisponiveis.push(i);
                    }
                }

                horariosContainer.innerHTML = "";
                horariosDisponiveis.forEach(horario => {
                    const button = document.createElement("button");
                    button.textContent = `${horario}:00`;
                    button.classList.add("horario-button");
                    horariosContainer.appendChild(button);

                    button.addEventListener("click", function () {
                        document.querySelectorAll(".horario-button").forEach(btn => btn.classList.remove("selected"));
                        button.classList.add("selected");
                    });
                });
            } else {
                console.error("Erro ao buscar agendamentos: " + response.statusText);
            }
        } catch (error) {
            console.error("Erro ao buscar agendamentos: ", error);
        }
    }

    dataInput.addEventListener("change", function () {
        const dataSelecionada = new Date(dataInput.value + 'T00:00:00');
        if (!isNaN(dataSelecionada)) {
            const dia = dataSelecionada.getDate();
            const mes = dataSelecionada.toLocaleString('default', { month: 'long' });
            const diaSemana = dataSelecionada.toLocaleString('default', { weekday: 'long' });
            dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;

            carregarHorariosDisponiveis(dataInput.value);
        } else {
            dataSelecionadaP.textContent = "";
            horariosContainer.innerHTML = "";
        }
    });

    async function criarAgendamento(agendamento) {
        try {
            const response = await fetch(apiUrlCriarAgendamento, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(agendamento),
            });

            if (response.ok) {
                const notificationMessage = document.getElementById('notification-message');
                notificationMessage.textContent = "Agendamento criado com sucesso!";
                notificationMessage.style.color = "green";
                document.getElementById('notification').style.display = "block";
            } else {
                console.error("Erro ao criar agendamento: " + response.statusText);
                alert("Erro ao criar agendamento: " + response.statusText);
            }
        } catch (error) {
            console.error("Erro ao criar agendamento: ", error);
            alert("Erro ao criar agendamento: " + error.message);
        }
    }

    saveButton.addEventListener("click", function () {
        const clienteId = clientesSelect.value;
        const procedimentoId = procedimentosSelect.value;
        const tipoAgendamento = tipoAgendamentosSelect.value;
        const especificacaoId = especificacoesSelect.value;
        const data = dataInput.value;
        const horarioButton = document.querySelector(".horario-button.selected");
        const horario = horarioButton ? horarioButton.textContent : null;

        if (!clienteId || !procedimentoId || !tipoAgendamento || !especificacaoId || !data || !horario) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        const agendamento = {
            data: new Date(`${data}T00:00:00Z`).toISOString(),
            horario: new Date(`${data}T${horario.split(":")[0]}:00:00Z`).toISOString(),
            tipoAgendamento: tipoAgendamento,
            fk_usuario: parseInt(clienteId),
            fk_procedimento: parseInt(procedimentoId),
            fk_status: 1, // Você pode ajustar esse valor conforme necessário
        };

        criarAgendamento(agendamento);
    });
    

    carregarClientes();
    carregarProcedimentos();
    carregarEspecificacoes();
    carregarTiposAgendamentos();
});
