document.addEventListener("DOMContentLoaded", function () {
  const apiUrlClientes = "http://localhost:8080/usuarios";
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
  const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";

  const clientesSelect = document.getElementById("clientes");
  const procedimentosSelect = document.getElementById("procedimentos");
  const especificacoesSelect = document.getElementById("especificacoes");
  const tipoAgendamentoSelect = document.getElementById("tipo-atendimento");
  const dataInput = document.getElementById("data");
  const dataSelecionadaP = document.getElementById("data-selecionada");
  const horariosContainer = document.getElementById("horarios-disponiveis");
  const saveButton = document.getElementById("save-agendamento-button");

  let especificacoes = []; // Array para armazenar todas as especificações

  async function carregarClientes() {
    try {
      const response = await fetch(apiUrlClientes); // Substitua com a URL correta da API
      const clientes = await response.json();

      const clientesSelect = document.getElementById("clientes");
      clientes.forEach((cliente) => {
        const option = document.createElement("option");
        option.value = cliente.idUsuario;
        option.textContent = cliente.nome;
        clientesSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao obter clientes: ", error);
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
          option.text = procedimento.tipo;
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
        especificacoes = await response.json(); // Armazena todas as especificações
      } else {
        console.error("Erro ao buscar especificações: " + response.statusText);
      }
    } catch (error) {
      console.error("Erro ao buscar especificações: ", error);
    }
  }

  // Função para filtrar as especificações com base no procedimento selecionado
  function filtrarEspecificacoesPorProcedimento(procedimentoId) {
    especificacoesSelect.innerHTML =
      '<option value="">Selecione uma especificação</option>'; // Reseta as opções

    const especificacoesFiltradas = especificacoes.filter(
      (especificacao) =>
        especificacao.procedimento.idProcedimento == procedimentoId
    );

    especificacoesFiltradas.forEach((especificacao) => {
      const option = document.createElement("option");
      option.value = especificacao.idEspecificacaoProcedimento;
      option.text = especificacao.especificacao;
      especificacoesSelect.appendChild(option);
    });

    if (especificacoesFiltradas.length > 0) {
      especificacoesSelect.removeAttribute("disabled");
      especificacoesSelect.classList.remove("disabled-select");
    } else {
      especificacoesSelect.setAttribute("disabled", "disabled");
      especificacoesSelect.classList.add("disabled-select");
    }
  }

  // Event listener para habilitar e filtrar especificações com base no procedimento selecionado
  procedimentosSelect.addEventListener("change", function () {
    const procedimentoId = procedimentosSelect.value;
    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
    } else {
      especificacoesSelect.setAttribute("disabled", "disabled");
      especificacoesSelect.classList.add("disabled-select");
    }
  });

  dataInput.addEventListener("change", function () {
    const dataSelecionada = new Date(dataInput.value + "T00:00:00");
    if (!isNaN(dataSelecionada)) {
      const dia = dataSelecionada.getDate();
      const mes = dataSelecionada.toLocaleString("default", { month: "long" });
      const diaSemana = dataSelecionada.toLocaleString("default", {
        weekday: "long",
      });
      dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;

      const procedimentoId = procedimentosSelect.value;
      const especificacaoId = especificacoesSelect.value;
      const tipoAtendimento = tipoAgendamentoSelect.value;

      carregarHorariosDisponiveis(
        dataInput.value,
        procedimentoId,
        especificacaoId,
        tipoAtendimento
      );
    } else {
      dataSelecionadaP.textContent = "";
      horariosContainer.innerHTML = "";
    }
  });

  async function carregarHorariosDisponiveis(
    data,
    procedimentoId,
    especificacaoId,
    tipoAgendamento
  ) {
    try {
      const empresaId = localStorage.getItem("empresa");

      const url = new URL(apiUrlAgendamentos + "/horarios-disponiveis");
      url.searchParams.append("empresaId", empresaId);
      url.searchParams.append("data", data);

      const response = await fetch(url);
      if (response.ok) {
        const horariosDisponiveis = await response.json();
        horariosContainer.innerHTML = "";

        horariosDisponiveis.forEach((horario) => {
          const button = document.createElement("button");
          button.textContent = horario;
          button.classList.add("horario-button");
          horariosContainer.appendChild(button);

          button.addEventListener("click", function () {
            document
              .querySelectorAll(".horario-button")
              .forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");
          });
        });
      } else {
        console.error(
          "Erro ao buscar horários disponíveis: " + response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis: ", error);
    }
  }

  let agendamentoData; // Definido no escopo mais alto, para ser reutilizado

  saveButton.addEventListener("click", async function () {
    const clienteId = clientesSelect.value;
    const tipoAtendimento = tipoAgendamentoSelect.value;
    const data = dataInput.value;
    const horarioButton = document.querySelector(".horario-button.selected");
    const horario = horarioButton ? horarioButton.textContent : null;
    let procedimentoId = procedimentosSelect.value;
    let especificacaoId = especificacoesSelect.value;

    const params = new URLSearchParams(window.location.search);
    const agendamentoId = params.get("idAgendamento"); // Pega o ID do agendamento da URL

    if (!agendamentoId) {
      showNotification("ID do agendamento não encontrado", true);
      return;
    }

    // Se procedimentoId ou especificacaoId não forem selecionados, use os valores originais do agendamento
    try {
      const urlBuscarAgendamento = `http://localhost:8080/api/agendamentos/buscar/${agendamentoId}`;
      const responseBuscar = await fetch(urlBuscarAgendamento);
      if (!responseBuscar.ok) {
        throw new Error("Erro ao buscar dados do agendamento");
      }

      // Agora estamos atribuindo à variável `agendamentoData` do escopo mais alto
      agendamentoData = await responseBuscar.json();
      console.log("Dados do Agendamento:", agendamentoData);
      console.log(
        "Procedimento ID do Agendamento:",
        agendamentoData.fkProcedimento
      );
      console.log(
        "Especificação ID do Agendamento:",
        agendamentoData.fkEspecificacao
      );

      // Log inicial dos IDs
      console.log(
        "Procedimento ID Inicial (capturado do select):",
        procedimentoId
      );
      console.log(
        "Especificação ID Inicial (capturado do select):",
        especificacaoId
      );

      // Atribuir valores do `agendamentoData` caso `procedimentoId` ou `especificacaoId` sejam undefined, null ou uma string vazia
      if (
        !procedimentoId ||
        procedimentoId === "undefined" ||
        procedimentoId === "null"
      ) {
        procedimentoId = agendamentoData.fkProcedimento;
        console.log(
          "Procedimento ID estava vazio ou indefinido, usando valor do agendamentoData:",
          procedimentoId
        );
      }

      if (
        !especificacaoId ||
        especificacaoId === "undefined" ||
        especificacaoId === "null"
      ) {
        especificacaoId = agendamentoData.fkEspecificacao;
        console.log(
          "Especificação ID estava vazio ou indefinida, usando valor do agendamentoData:",
          especificacaoId
        );
      }

      // Verificações adicionais, caso ainda estejam indefinidos
      if (procedimentoId === undefined || procedimentoId === null) {
        procedimentoId = agendamentoData.fkProcedimento;
        console.log("Forçando Procedimento ID novamente:", procedimentoId);
      }

      if (especificacaoId === undefined || especificacaoId === null) {
        especificacaoId = agendamentoData.fkEspecificacao;
        console.log("Forçando Especificação ID novamente:", especificacaoId);
      }

      // Log final dos IDs para conferência
      console.log("Procedimento ID Final:", procedimentoId);
      console.log("Especificação ID Final:", especificacaoId);
    } catch (error) {
      console.error("Erro ao buscar dados do agendamento: ", error);
      showNotification("Erro ao buscar dados do agendamento", true);
      return;
    }

    if (
      !clienteId ||
      !procedimentoId ||
      !tipoAtendimento ||
      !especificacaoId ||
      !data ||
      !horario
    ) {
      showNotification("Todos os campos são obrigatórios", true);
      return;
    }

    // Formatar a data e o horário juntos corretamente
    const dataHorario = `${data}T${horario}:00.000Z`;

    // Agora, `agendamentoData` está acessível aqui, pois foi definido no escopo externo
    const agendamento = {
      fk_usuario: parseInt(clienteId, 10),
      fk_procedimento: procedimentoId, // Usar o procedimentoId já processado
      fk_especificacao: especificacaoId, // Usar a especificacaoId já processada
      fk_status: 1,
      tipoAgendamento: tipoAtendimento,
      dataHorario: dataHorario,
    };

    try {
      // Realiza a requisição PUT para atualizar o agendamento
      const apiUrlEditarAgendamento = `http://localhost:8080/api/agendamentos/atualizar/${agendamentoId}`;
      const response = await fetch(apiUrlEditarAgendamento, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamento),
      });

      if (response.ok) {
        showNotification("Agendamento atualizado com sucesso!");
        setTimeout(() => {
          window.location.href = "../../agendamento.html";
        }, 1000);
      } else {
        const errorMsg = await response.text();
        console.error("Erro ao atualizar agendamento: " + errorMsg);
        showNotification(
          "Erro ao atualizar o agendamento. Verifique se os dados estão corretos.",
          true
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar agendamento: ", error);
      showNotification("Erro ao atualizar agendamento", true);
    }
  });

  carregarClientes();
  carregarProcedimentos();
  carregarEspecificacoes(); // Carrega todas as especificações no início
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
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Captura o ID do agendamento da URL
  const params = new URLSearchParams(window.location.search);
  const agendamentoId = params.get("idAgendamento"); // Pega o ID da URL

  if (!agendamentoId) {
    console.error("ID do agendamento não encontrado na URL");
    return;
  }

  // URL da API com o ID do agendamento capturado
  const url = `http://localhost:8080/api/agendamentos/buscar/${agendamentoId}`;

  // Realiza a requisição GET para obter os dados do agendamento
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Agendamento não encontrado");
      }
      return response.json();
    })
    .then((data) => {
      preencherFormulario(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar agendamento:", error);
    });

  // Função para preencher os campos do formulário com os dados recebidos
  function preencherFormulario(data) {
    // Preencher o select de clientes com o nome do usuário
    const clientesSelect = document.getElementById("clientes");
    const optionCliente = document.createElement("option");
    optionCliente.value = data.fk_usuario; // Usar o ID do usuário
    optionCliente.value = params.get("usuarioId");
    optionCliente.text = data.usuario; // Mostrar o nome
    optionCliente.selected = true;
    clientesSelect.appendChild(optionCliente);

    // Preencher o select de procedimentos
    const procedimentosSelect = document.getElementById("procedimentos");
    const optionProcedimento = document.createElement("option");
    optionProcedimento.value = data.fk_procedimento; // Usar o ID do procedimento
    optionProcedimento.text = data.procedimento; // Mostrar o nome
    optionProcedimento.selected = true;
    procedimentosSelect.appendChild(optionProcedimento);

    // Preencher o select de tipo de atendimento
    const tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
    tipoAtendimentoSelect.value = data.tipoAgendamento;

    // Preencher o select de especificações
    const especificacoesSelect = document.getElementById("especificacoes");
    const optionEspecificacao = document.createElement("option");
    optionEspecificacao.value = data.fk_especificacao; // Usar o ID da especificação
    optionEspecificacao.text = data.especificacao; // Mostrar o nome
    optionEspecificacao.selected = true;
    especificacoesSelect.appendChild(optionEspecificacao);
    especificacoesSelect.disabled = false;

    // Preencher o campo de data
    const dataInput = document.getElementById("data");
    dataInput.value = data.dataHorario.split("T")[0];

    // Exibir horários disponíveis (simulando com o horário do agendamento)
    const horariosDisponiveis = document.getElementById("horarios-disponiveis");
    horariosDisponiveis.innerHTML = ""; // Limpar container

    // Formatar o horário do agendamento
    const horarioAgendamento = data.dataHorario.split("T")[1].substring(0, 5); // Mostra no formato HH:MM

    // Criar um botão para o horário do agendamento e marcá-lo como selecionado
    const button = document.createElement("button");
    button.textContent = horarioAgendamento;
    button.classList.add("horario-button", "selected"); // Marca como selecionado
    horariosDisponiveis.appendChild(button);

    // Adicionar comportamento de seleção de horário ao botão
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".horario-button")
        .forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
    });
  }

  new window.VLibras.Widget('https://vlibras.gov.br/app');
  
});
