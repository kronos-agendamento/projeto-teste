document.addEventListener("DOMContentLoaded", function () {
  const apiUrlClientes = "http://localhost:8080/usuarios";
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos/listar";
  const apiUrlEspecificacoes = "http://localhost:8080/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos/listar";
  const apiUrlCriarAgendamento = "http://localhost:8080/api/agendamentos/criar";

  const clientesSelect = document.getElementById("clientes");
  const procedimentosSelect = document.getElementById("procedimentos");
  const especificacoesSelect = document.getElementById("especificacoes");
  const tipoAgendamentoSelect = document.getElementById("tipo-atendimento");
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
        procedimentos.forEach((procedimento) => {
          const option = document.createElement("option");
          option.value = procedimento.idProcedimento;
          option.text = procedimento.tipo; // Atualize para exibir a descrição
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

  async function carregarHorariosDisponiveis(data) {
    try {
      const response = await fetch(apiUrlAgendamentos);
      if (response.ok) {
        const agendamentos = await response.json();
        const horariosOcupados = agendamentos
          .filter(agendamento => agendamento.data && agendamento.data.startsWith(data))
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
        showNotification("Agendamento criado com sucesso!");
        setTimeout(() => {
          window.location.href = "../../agendamento.html";
        }, 1000);
      } else {
        console.error("Erro ao criar agendamento: " + response.statusText);
        showNotification("Já existe um agendamento para essa data e horário", true);
      }
    } catch (error) {
      console.error("Erro ao criar agendamento: ", error);
      showNotification("Erro ao criar agendamento", true);
    }
  }


  saveButton.addEventListener("click", function () {
    const clienteId = clientesSelect.value;
    const procedimentoId = procedimentosSelect.value;
    const tipoAtendimento = tipoAgendamentoSelect.value;
    const especificacaoId = especificacoesSelect.value;
    const data = dataInput.value;
    const horarioButton = document.querySelector(".horario-button.selected");
    const horario = horarioButton ? horarioButton.textContent.split(":")[0] : null;

    if (!clienteId || !procedimentoId || !tipoAtendimento || !especificacaoId || !data || !horario) {
      showNotification("Todos os campos são obrigatórios", true);
      return;
    }

    // Combine data e horário
    const dataHora = new Date(`${data}T${horario}:00:00Z`).toISOString();

    const agendamento = {
      dataHorario: dataHora, // Inclua a data e o horário combinados
      tipoAgendamento: tipoAtendimento,
      fk_usuario: parseInt(clienteId),
      fk_procedimento: parseInt(procedimentoId),
      fk_especificacao: parseInt(especificacaoId),
      fk_status: 1,
    };

    criarAgendamento(agendamento);
  });

  carregarClientes();
  carregarProcedimentos();
  carregarEspecificacoes();
});

function showNotification(message, isError = false) {
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  notificationMessage.textContent = message;
  if (isError) {
    notification.classList.add("error");
  } else {
    notification.classList.remove("error");
  }
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const email = localStorage.getItem("email");

  if (nome && email) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userEmail").textContent = email;
  }
});