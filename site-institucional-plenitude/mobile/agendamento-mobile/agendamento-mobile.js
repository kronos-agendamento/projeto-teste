document.addEventListener("DOMContentLoaded", function () {
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
  const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";
  const apiUrlCriarAgendamento = "http://localhost:8080/api/agendamentos";

  const procedimentoSelect = document.getElementById("procedimento");
  const opcaoEspecificacaoDiv = document.getElementById("opcao-especificacao");
  const especificacaoSelect = document.getElementById("especificacao");
  const tipoAtendimentoDiv = document.getElementById("tipo-atendimento");
  const tipoAtendimentoSelect = document.getElementById(
    "tipo-atendimento-select"
  );
  const dataInputDiv = document.getElementById("data-div");
  const dataInput = document.getElementById("data");
  const horariosDiv = document.getElementById("horarios-div");
  const horariosContainer = document.getElementById("horarios-disponiveis");
  const botaoAgendarDiv = document.getElementById("botaoAgendarDiv");
  const botaoAgendar = document.getElementById("save-agendamento-button");

  let especificacoes = [];

  // Inicialmente, ocultar todos os campos exceto o procedimento
  opcaoEspecificacaoDiv.classList.add("hidden");
  tipoAtendimentoDiv.classList.add("hidden");
  dataInputDiv.classList.add("hidden");
  horariosDiv.classList.add("hidden");
  botaoAgendarDiv.classList.add("hidden");

  // Carregar Procedimentos
  async function carregarProcedimentos() {
    try {
      const response = await fetch(apiUrlProcedimentos);
      if (response.ok) {
        const procedimentos = await response.json();
        procedimentos.forEach((procedimento) => {
          const option = document.createElement("option");
          option.value = procedimento.idProcedimento;
          option.textContent = procedimento.tipo;
          procedimentoSelect.appendChild(option);
        });

        // Verificar se há valores no localStorage e preencher automaticamente
        const idProcedimento = localStorage.getItem("idProcedimento");
        const idEspecificacao = localStorage.getItem("idEspecificacao");

        if (idProcedimento) {
          procedimentoSelect.value = idProcedimento;
          filtrarEspecificacoesPorProcedimento(idProcedimento, idEspecificacao);
        }
      } else {
        console.error(
          "Erro ao buscar procedimentos: " +
            response.status +
            " " +
            response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar procedimentos: ", error);
    }
  }

  async function carregarEspecificacoes() {
    try {
      const response = await fetch(apiUrlEspecificacoes);
      if (response.ok) {
        especificacoes = await response.json();
        console.log(especificacoes); // Adicione este log
      } else {
        console.error(
          "Erro ao buscar especificações: " +
            response.status +
            " " +
            response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar especificações: ", error);
    }
  }

  // Filtrar Especificações pelo Procedimento selecionado
  function filtrarEspecificacoesPorProcedimento(
    procedimentoId,
    idEspecificacao = null
  ) {
    especificacaoSelect.innerHTML =
      '<option value="">Selecione a especificação</option>';

    const especificacoesFiltradas = especificacoes.filter(
      (especificacao) =>
        especificacao.procedimento.idProcedimento == procedimentoId
    );

    especificacoesFiltradas.forEach((especificacao) => {
      const option = document.createElement("option");
      option.value = especificacao.idEspecificacaoProcedimento;
      option.textContent = especificacao.especificacao;
      especificacaoSelect.appendChild(option);
    });

    // Mostrar campo de especificações
    if (especificacoesFiltradas.length > 0) {
      opcaoEspecificacaoDiv.classList.remove("hidden");
    } else {
      opcaoEspecificacaoDiv.classList.add("hidden");
    }

    // Preencher automaticamente a especificação se o idEspecificacao estiver presente
    if (idEspecificacao) {
      console.log("Preenchendo automaticamente a especificação");
      especificacaoSelect.value = idEspecificacao;
      console.log(idEspecificacao);
      opcaoEspecificacaoDiv.classList.remove("hidden");
      opcaoEspecificacaoDiv.disabled = false; // Ativar o dropdown de tipo de atendimento
      especificacaoSelect.value = idEspecificacao;
    }

    // Resetar campos subsequentes
    dataInputDiv.classList.add("hidden");
    horariosDiv.classList.add("hidden");
    botaoAgendarDiv.classList.add("hidden");
  }

  // Evento ao selecionar Procedimento
  procedimentoSelect.addEventListener("change", function () {
    const procedimentoId = procedimentoSelect.value;
    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
    } else {
      // Ocultar campos subsequentes
      opcaoEspecificacaoDiv.classList.add("hidden");
      tipoAtendimentoDiv.classList.add("hidden");
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

  // Evento ao selecionar Especificação
  especificacaoSelect.addEventListener("change", function () {
    const especificacaoId = especificacaoSelect.value;
    if (especificacaoId) {
      tipoAtendimentoDiv.classList.remove("hidden");
      tipoAtendimentoSelect.disabled = false; // Ativar o dropdown de tipo de atendimento
    } else {
      // Ocultar campos subsequentes
      tipoAtendimentoDiv.classList.add("hidden");
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

  // Evento ao selecionar Tipo de Atendimento
  tipoAtendimentoSelect.addEventListener("change", function () {
    const tipoAtendimento = tipoAtendimentoSelect.value;
    if (tipoAtendimento) {
      dataInputDiv.classList.remove("hidden");
    } else {
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

  // Evento ao selecionar Data
  dataInput.addEventListener("change", function () {
    const data = dataInput.value;
    if (data) {
      carregarHorariosDisponiveis(data);
    } else {
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

  // Carregar Horários Disponíveis
  async function carregarHorariosDisponiveis(data) {
    try {
      const empresaId = 1;

      const url = new URL(apiUrlAgendamentos + "/horarios-disponiveis");
      url.searchParams.append("empresaId", empresaId);
      url.searchParams.append("data", data);

      const response = await fetch(url);
      if (response.ok) {
        const horariosDisponiveis = await response.json();
        horariosContainer.innerHTML = "";

        horariosDisponiveis.forEach((horario) => {
          // Supondo que horario é uma string no formato "HH:MM:SS"
          const [hour, minute] = horario.split(":");
          const formattedTime = `${hour.padStart(2, "0")}:${minute.padStart(
            2,
            "0"
          )}`;

          const button = document.createElement("button");
          button.textContent = formattedTime;
          button.classList.add("horario-button");
          horariosContainer.appendChild(button);

          button.addEventListener("click", function () {
            document
              .querySelectorAll(".horario-button")
              .forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");
          });
        });

        if (horariosDisponiveis.length > 0) {
          horariosDiv.classList.remove("hidden");
          botaoAgendarDiv.classList.remove("hidden");
        } else {
          horariosDiv.classList.add("hidden");
          botaoAgendarDiv.classList.add("hidden");
          alert("Não há horários disponíveis para esta data.");
        }
      } else {
        console.error(
          "Erro ao buscar horários disponíveis: " + response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis: ", error);
    }
  }

  // Salvar Agendamento
  botaoAgendar.addEventListener("click", async function () {
    const procedimentoId = procedimentoSelect.value;
    const especificacaoId = especificacaoSelect.value;
    const tipoAtendimento = tipoAtendimentoSelect.value;
    const data = dataInput.value;
    const horarioButton = document.querySelector(".horario-button.selected");
    const horario = horarioButton ? horarioButton.textContent : null;

    if (
      !procedimentoId ||
      !especificacaoId ||
      !tipoAtendimento ||
      !data ||
      !horario
    ) {
      alert("Todos os campos são obrigatórios");
      return;
    }

    const dataHorario = new Date(`${data}T${horario}`).toISOString();
    const idUsuario = localStorage.getItem("idUsuario");

    if (!idUsuario) {
      alert("Usuário não encontrado. Por favor, faça login novamente.");
      return;
    }

    const agendamento = {
      fk_procedimento: parseInt(procedimentoId, 10),
      fk_especificacao: parseInt(especificacaoId, 10),
      fk_status: 1,
      tipoAgendamento: tipoAtendimento,
      dataHorario: dataHorario,
      fk_usuario: parseInt(idUsuario, 10),
    };

    try {
      const response = await fetch(apiUrlCriarAgendamento, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamento),
      });

      if (response.ok) {
        alert("Agendamento criado com sucesso!");
        window.location.href = "../agendamento-mobile/agendamento-mobile.html";
      } else {
        console.error("Erro ao criar agendamento: " + response.statusText);
        alert("Já existe um agendamento para essa data e horário.");
      }
    } catch (error) {
      console.error("Erro ao criar agendamento: ", error);
      alert("Erro ao criar agendamento.");
    }
  });

  // Carregar dados na inicialização
  carregarProcedimentos();
  carregarEspecificacoes();

  // Verificar se há valores no localStorage e preencher automaticamente
  const idProcedimento = localStorage.getItem("idProcedimento");
  const idEspecificacao = localStorage.getItem("idEspecificacao");

  if (idProcedimento && idEspecificacao) {
    procedimentoSelect.value = idProcedimento;
    especificacaoSelect.value = idEspecificacao;
    filtrarEspecificacoesPorProcedimento(idProcedimento, idEspecificacao);
    tipoAtendimentoDiv.classList.remove("hidden");
    tipoAtendimentoSelect.disabled = false; // Ativar o dropdown de tipo de atendimento
  }
});
