document.addEventListener("DOMContentLoaded", function () {
  const apiUrlClientes = "http://localhost:8080/usuarios";
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos/listar";
  const apiUrlEspecificacoes = "http://localhost:8080/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";
  const apiUrlCriarAgendamento = `${apiUrlAgendamentos}/criar`;

  const clientesSelect = document.getElementById("clientes");
  const procedimentosSelect = document.getElementById("procedimentos");
  const especificacoesSelect = document.getElementById("especificacoes");
  const tipoAgendamentoSelect = document.getElementById("tipo-atendimento");
  const dataInput = document.getElementById("data");
  const dataSelecionadaP = document.getElementById("data-selecionada");
  const horariosContainer = document.getElementById("horarios-disponiveis");
  const saveButton = document.getElementById("save-agendamento-button");

  const urlParams = new URLSearchParams(window.location.search);
  const agendamentoId = urlParams.get('id');

  async function carregarClientes() {
    try {
      const response = await fetch(apiUrlClientes);
      if (response.ok) {
        const clientes = await response.json();
        clientes.forEach(cliente => {
          const option = document.createElement("option");
          option.value = cliente.id;
          option.textContent = cliente.nome;
          clientesSelect.appendChild(option);
        });
      } else {
        console.error("Erro ao carregar clientes.");
      }
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  }

  async function carregarProcedimentos() {
    try {
      const response = await fetch(apiUrlProcedimentos);
      if (response.ok) {
        const procedimentos = await response.json();
        procedimentos.forEach(procedimento => {
          const option = document.createElement("option");
          option.value = procedimento.idProcedimento;
          option.textContent = procedimento.tipo;
          procedimentosSelect.appendChild(option);
        });
      } else {
        console.error("Erro ao carregar procedimentos.");
      }
    } catch (error) {
      console.error("Erro ao carregar procedimentos:", error);
    }
  }

  async function carregarEspecificacoes() {
    try {
      const response = await fetch(apiUrlEspecificacoes);
      if (response.ok) {
        const especificacoes = await response.json();
        especificacoes.forEach(especificacao => {
          const option = document.createElement("option");
          option.value = especificacao.id;
          option.textContent = especificacao.especificacao;
          especificacoesSelect.appendChild(option);
        });
      } else {
        console.error("Erro ao carregar especificações.");
      }
    } catch (error) {
      console.error("Erro ao carregar especificações:", error);
    }
  }

  async function carregarDadosAgendamento(id) {
    try {
      const response = await fetch(`${apiUrlAgendamentos}/buscar/${id}`);
      if (response.ok) {
        const agendamento = await response.json();
        clientesSelect.value = agendamento.usuario.codigo;
        procedimentosSelect.value = agendamento.procedimento.idProcedimento;
        tipoAgendamentoSelect.value = agendamento.tipoAgendamento;
        especificacoesSelect.value = agendamento.especificacao.idEspecificacaoProcedimento;

        const dataHora = new Date(agendamento.dataHorario);
        console.log("Data e hora recebida:", agendamento.dataHorario);
        console.log("Data e hora convertida:", dataHora);

        if (!isNaN(dataHora.getTime())) {
          dataInput.value = dataHora.toISOString().split("T")[0];
          dataSelecionadaP.textContent = `Data Selecionada: ${dataHora.toLocaleDateString()}`;

          await carregarHorariosDisponiveis(dataInput.value);

          const horaFormatada = dataHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const horarioButton = document.querySelector(`.horario-button[data-hora="${horaFormatada}"]`);
          if (horarioButton) {
            horarioButton.classList.add("selected");
          } else {
            console.error(`Horário ${horaFormatada} não encontrado entre os horários disponíveis.`);
          }
        } else {
          console.error("Data e hora inválidas no agendamento.");
        }
      } else {
        console.error("Erro ao carregar dados do agendamento.");
      }
    } catch (error) {
      console.error("Erro ao carregar dados do agendamento:", error);
    }
  }


  async function carregarHorariosDisponiveis(data) {
    try {
      const response = await fetch(`${apiUrlAgendamentos}/listar`);
      if (response.ok) {
        const agendamentos = await response.json();
        console.log("Agendamentos recebidos:", agendamentos);

        // Extrai a data escolhida
        const dataEscolhida = new Date(data);
        dataEscolhida.setHours(0, 0, 0, 0);

        // Gera horários entre 09:00 e 18:00
        const horariosParaExibir = [];
        for (let h = 9; h < 18; h++) {
          const hora = h.toString().padStart(2, '0') + ":00";
          horariosParaExibir.push(hora);
        }

        // Filtra agendamentos do dia escolhido
        const agendamentosNoDia = agendamentos.filter(agendamento => {
          const dataAgendamento = new Date(agendamento.dataHorario);
          dataAgendamento.setHours(0, 0, 0, 0);
          return dataAgendamento.getTime() === dataEscolhida.getTime();
        });

        // Remove horários ocupados
        agendamentosNoDia.forEach(agendamento => {
          const horaAgendamento = new Date(agendamento.dataHorario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const index = horariosParaExibir.indexOf(horaAgendamento);
          if (index > -1) {
            horariosParaExibir.splice(index, 1);
          }
        });

        const horariosContainer = document.getElementById("horariosContainer");
        horariosContainer.innerHTML = "";

        horariosParaExibir.forEach(horario => {
          const button = document.createElement("button");
          button.classList.add("horario-button");
          button.textContent = horario;
          button.dataset.hora = horario;
          horariosContainer.appendChild(button);
        });
      } else {
        console.error("Erro ao carregar agendamentos.");
      }
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    }
  }


  async function salvarAgendamento() {
    const clienteId = clientesSelect.value;
    const procedimentoId = procedimentosSelect.value;
    const especificacaoId = especificacoesSelect.value;
    const tipo = tipoAgendamentoSelect.value;
    const data = dataInput.value;
    const horarioSelecionado = document.querySelector(".horario-button.selected")?.textContent;

    if (!clienteId || !procedimentoId || !especificacaoId || !tipo || !data || !horarioSelecionado) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const dataHora = new Date(`${data}T${horarioSelecionado}`);

    const agendamento = {
      clienteId,
      procedimentoId,
      especificacaoId,
      tipo,
      dataHora: dataHora.toISOString()
    };

    try {
      const response = await fetch(`${apiUrlAgendamentos}/atualizar/${agendamentoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agendamento)
      });
      if (response.ok) {
        exibirNotificacao("Agendamento atualizado com sucesso!");
      } else {
        console.error("Erro ao atualizar agendamento.");
      }
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
    }
  }


  function exibirNotificacao(mensagem) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    notificationMessage.textContent = mensagem;
    notification.style.display = "block";
    setTimeout(() => {
      notification.style.display = "none";
    }, 3000);
  }

  dataInput.addEventListener("change", () => {
    const data = dataInput.value;
    if (data) {
      carregarHorariosDisponiveis(data);
      dataSelecionadaP.textContent = `Data Selecionada: ${new Date(data).toLocaleDateString()}`;
    }
  });

  saveButton.addEventListener("click", salvarAgendamento);

  carregarClientes();
  carregarProcedimentos();
  carregarEspecificacoes();

  if (agendamentoId) {
    carregarDadosAgendamento(agendamentoId);
  }
});
