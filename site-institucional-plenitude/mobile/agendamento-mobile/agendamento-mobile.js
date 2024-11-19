document.addEventListener("DOMContentLoaded", function () {
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
  const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";
  const apiUrlCriarAgendamento = "http://localhost:8080/api/agendamentos";

  const procedimentoSelect = document.getElementById("procedimento");
  const opcaoEspecificacaoDiv = document.getElementById("opcao-especificacao");
  const especificacaoSelect = document.getElementById("especificacao");
  const tipoAtendimentoDiv = document.getElementById("tipo-atendimento");
  const tipoAtendimentoSelect = document.getElementById("tipo-atendimento-select");
  const dataInputDiv = document.getElementById("data-div");
  const procedimentoId = procedimentoSelect.value;
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

  function atualizarOpcoesTipoAtendimento(procedimentoId) {
    const options = tipoAtendimentoSelect.options; // Obtenha as opções do select

    // console.log("Atualizando opções para procedimento:", procedimentoId);

    // Habilitar ou desabilitar opções com base no procedimento
    for (let i = 0; i < options.length; i++) {
      // console.log(`Verificando opção: ${options[i].value}`); // Log para verificação
      if (procedimentoId == 1) {
        // Supondo que "1" seja o ID de Maquiagem
        options[i].disabled = !["Homecare", "Estudio", "Evento"].includes(
          options[i].value
        );
      } else {
        options[i].disabled = !["Colocação", "Manutenção", "Retirada"].includes(
          options[i].value
        );
      }
    }

    tipoAtendimentoDiv.classList.remove("hidden"); // Mostrar a div do tipo de atendimento
  }

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

  // Carregar Especificações
  async function carregarEspecificacoes() {
    try {
      const response = await fetch(apiUrlEspecificacoes);
      if (response.ok) {
        especificacoes = await response.json();
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

    if (especificacoesFiltradas.length > 0) {
      opcaoEspecificacaoDiv.classList.remove("hidden");
    } else {
      opcaoEspecificacaoDiv.classList.add("hidden");
    }

    // Preencher automaticamente a especificação se o idEspecificacao estiver presente
    if (idEspecificacao) {
      especificacaoSelect.value = idEspecificacao;
    }
  }

  // Evento ao selecionar Procedimento
  procedimentoSelect.addEventListener("change", function () {
    const procedimentoId = procedimentoSelect.value;

    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
      atualizarOpcoesTipoAtendimento(procedimentoId); // Atualiza as opções com base no procedimento
    } else {
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
      tipoAtendimentoSelect.disabled = false;
    } else {
      tipoAtendimentoDiv.classList.add("hidden");
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

  // Inicializar
  async function inicializar() {
    await carregarProcedimentos();
    await carregarEspecificacoes();

    const idProcedimento = localStorage.getItem("idProcedimento");
    const idEspecificacao = localStorage.getItem("idEspecificacao");

    if (idProcedimento && idEspecificacao) {
      procedimentoSelect.value = idProcedimento;
      filtrarEspecificacoesPorProcedimento(idProcedimento, idEspecificacao);

      tipoAtendimentoDiv.classList.remove("hidden");
      tipoAtendimentoSelect.disabled = false;

      localStorage.removeItem("idProcedimento");
      localStorage.removeItem("idEspecificacao");
      console.log("IDs removidos do localStorage");
    }
  }

  // Chama a função de inicialização
  inicializar();

  const mediaValor = 30; // Valor por hora
  const hora = 0.5; // Horas
  const maoObra = mediaValor * hora; // Cálculo da mão de obra
  const origem =
    "Rua das Gilias, 361 - Vila Bela, São Paulo - State of São Paulo, Brazil";
  const gasolina = 4; // Valor fixo médio da gasolina (exemplo)
  const enderecoInput = document.getElementById("endereco");
  const taxaTotalDiv = document.getElementById("taxa-total");
  const valorTaxaSpan = document.getElementById("valor-taxa");
  const totalKmSpan = document.getElementById("total-km");
  const calcularTaxaButton = document.getElementById("calcular-taxa-button");

  // Função para calcular a distância
  async function calcularDistancia(endereco) {
    return new Promise((resolve, reject) => {
      const service = new google.maps.DistanceMatrixService();

      service.getDistanceMatrix(
        {
          origins: [origem],
          destinations: [endereco],
          travelMode: "DRIVING", // Aqui define o modo de transporte
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === "OK") {
            const resultado = response.rows[0].elements[0];
            const distanciaKm = resultado.distance.value / 1000; // Distância em quilômetros
            resolve(distanciaKm);
          } else {
            reject("Erro ao calcular a distância: " + status);
          }
        }
      );
    });
  }

  // Função para calcular a taxa total e retornar o valor da taxa
  async function calcularTaxa() {
    const endereco = enderecoInput.value;

    if (endereco) {
      try {
        const kmLoc = await calcularDistancia(endereco);
        if (kmLoc !== null) {
          const taxaLoc = gasolina * kmLoc; // Calcula a taxa de locomoção
          const taxaTotal = taxaLoc + maoObra; // Taxa total com mão de obra

          valorTaxaSpan.textContent = `R$ ${taxaTotal.toFixed(2)}`;
          totalKmSpan.textContent = `${kmLoc.toFixed(2)} km de distância`;
          taxaTotalDiv.classList.remove("hidden");

          return taxaTotal; // Retorna o valor da taxa para ser usada no orçamento
        } else {
          valorTaxaSpan.textContent = "Distância não encontrada para o endereço.";
          taxaTotalDiv.classList.remove("hidden");
        }
      } catch (error) {
        console.error("Erro ao calcular a distância:", error);
        valorTaxaSpan.textContent = "Erro ao calcular a distância. Tente novamente.";
        taxaTotalDiv.classList.remove("hidden");
      }
    } else {
      taxaTotalDiv.classList.add("hidden");
    }

    return 0; // Retorna zero se não houver taxa
  }

  // Event listener para o botão de calcular taxa
  calcularTaxaButton.addEventListener("click", calcularTaxa);

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


  // Carregar Especificações
  async function carregarEspecificacoes() {
    try {
      const response = await fetch(apiUrlEspecificacoes);
      if (response.ok) {
        especificacoes = await response.json();
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

    if (especificacoesFiltradas.length > 0) {
      opcaoEspecificacaoDiv.classList.remove("hidden");
    } else {
      opcaoEspecificacaoDiv.classList.add("hidden");
    }

    // Preencher automaticamente a especificação se o idEspecificacao estiver presente
    if (idEspecificacao) {
      especificacaoSelect.value = idEspecificacao;
    }
  }

  // Evento ao selecionar Procedimento
  procedimentoSelect.addEventListener("change", function () {
    const procedimentoId = procedimentoSelect.value;
    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
    } else {
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
      tipoAtendimentoSelect.disabled = false;
    } else {
      tipoAtendimentoDiv.classList.add("hidden");
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

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

    console.log(tipoAtendimento);

    if (tipoAtendimento) {
      dataInputDiv.classList.remove("hidden"); // Mostrar dataInputDiv
    } else {
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }

    // Verifica se o tipo de atendimento é Homecare ou Evento
    if (tipoAtendimento === "Homecare" || tipoAtendimento === "Evento") {
      // Mostrar o campo de endereço
      document.getElementById("endereco-group").classList.remove("hidden");
    } else {
      // Ocultar o campo de endereço se não for Homecare ou Evento
      document.getElementById("endereco-group").classList.add("hidden");
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
            buscarOrcamento();
          });
        });

        if (horariosDisponiveis.length > 0) {
          horariosDiv.classList.remove("hidden");
          botaoAgendarDiv.classList.remove("hidden");
        } else {
          horariosDiv.classList.add("hidden");
          botaoAgendarDiv.classList.add("hidden");
          showNotification("Não há horários disponíveis para esta data.", true);
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
      showNotification("Todos os campos são obrigatórios", true);
      return;
    }

    const dataHorario = new Date(`${data}T${horario}`).toISOString();
    const idUsuario = localStorage.getItem("idUsuario");

    if (!idUsuario) {
      showNotification(
        "Usuário não encontrado. Por favor, faça login novamente.",
        true
      );
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
        showNotification("Agendamento criado com sucesso!");
        
        setTimeout(() => {
          window.location.href = "../index-mobile/index-mobile.html";
      }, 5000); // 5000 milissegundos = 5 segundos
      } else {
        console.error("Erro ao criar agendamento: " + response.statusText);
        showNotification("Erro ao criar agendamento", true);
      }
    } catch (error) {
      console.error("Erro ao criar agendamento: ", error);
      showNotification("Erro ao criar agendamento", true);
    }
  });
  

// Função para calcular e exibir o orçamento
async function buscarOrcamento() {
  const fkProcedimento = procedimentoSelect.value;
  const fkEspecificacao = especificacaoSelect.value;
  let tipoAgendamento = tipoAtendimentoSelect.value;
  const horarioButton = document.querySelector(".horario-button.selected");

  if (!fkProcedimento || !fkEspecificacao || !tipoAgendamento || !horarioButton) {
    document.getElementById("orcamento-container").classList.add("hidden");
    return;
  }

  // Força o tipoAgendamento para "Colocação" se o procedimento for "Maquiagem" (ID = 1)
  if (fkProcedimento === "1") { // Verifique o ID correto para "Maquiagem" no seu sistema
    tipoAgendamento = "Colocacao";
  }

  try {
    // Obtém a taxa do elemento HTML "valor-taxa"
    let taxa = parseFloat(document.getElementById("valor-taxa").textContent.replace("R$ ", "").replace(",", "."));
    if (isNaN(taxa)) taxa = 0;

    // Faz a chamada ao back-end para obter o valor base do orçamento
    const url = `http://localhost:8080/api/agendamentos/calcular-orcamento?fkProcedimento=${fkProcedimento}&fkEspecificacao=${fkEspecificacao}&tipoAgendamento=${tipoAgendamento}`;
    const response = await fetch(url);

    let orcamentoBase = 0; // Inicializa o orçamento base como 0

    if (response.ok) {
      orcamentoBase = await response.json(); // Obtém o valor base do orçamento
    } else if (response.status === 404) {
      console.warn("Valor base do orçamento não encontrado para o tipo de atendimento:", tipoAgendamento);
      showNotification(`Orçamento base não disponível para ${tipoAgendamento}. Considerando apenas a taxa.`, true);
    } else {
      console.error("Erro ao obter o valor base do orçamento:", response.status);
      showNotification("Não foi possível calcular o orçamento. Tente novamente.", true);
      return; // Sai da função em caso de erro não esperado
    }

    // Calcula o orçamento total
    const orcamentoTotal = orcamentoBase + taxa;

    // Atualiza o conteúdo dos elementos no HTML
    document.getElementById("orcamento").textContent = `R$ ${orcamentoTotal.toFixed(2)}`;
    document.getElementById("orcamento-detalhe").textContent = 
      `Valor do procedimento: R$ ${orcamentoBase.toFixed(2)}, 
       taxa adicional: R$ ${taxa.toFixed(2)}, 
       total: R$ ${orcamentoTotal.toFixed(2)}`;

    // Exibe o contêiner do orçamento na interface
    document.getElementById("orcamento-container").classList.remove("hidden");
  } catch (error) {
    console.error("Erro ao buscar orçamento:", error);
    showNotification("Erro ao buscar orçamento. Tente novamente.", true);
  }
}

  // Funções para controlar visibilidade e chamadas de orçamento
  procedimentoSelect.addEventListener("change", buscarOrcamento);
  especificacaoSelect.addEventListener("change", buscarOrcamento);
  tipoAtendimentoSelect.addEventListener("change", buscarOrcamento);
  dataInput.addEventListener("change", function () {
    if (dataInput.value) {
      carregarHorariosDisponiveis(dataInput.value);
    }
  });

  horariosContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("horario-button")) {
      document.querySelectorAll(".horario-button").forEach(btn => btn.classList.remove("selected"));
      event.target.classList.add("selected");
      buscarOrcamento();
    }
  });

  const increaseFontBtn = document.getElementById("increase-font");
  const decreaseFontBtn = document.getElementById("decrease-font");
  const rootElement = document.documentElement;

  let currentFontSize = localStorage.getItem("fontSize") || "16px";
  rootElement.style.setProperty("--font-size-default", currentFontSize);
  document.body.style.fontSize = currentFontSize;

  let increaseClicks = 0;
  let decreaseClicks = 0;
  const maxClicks = 2;

  increaseFontBtn.addEventListener("click", function () {
    if (increaseClicks < maxClicks) {
      let newSize = parseFloat(currentFontSize) + 1;
      currentFontSize = `${newSize}px`;
      rootElement.style.setProperty("--font-size-default", currentFontSize);
      document.body.style.fontSize = currentFontSize;
      localStorage.setItem("fontSize", currentFontSize);

      increaseClicks++;
      decreaseClicks = 0;
    }
  });

  decreaseFontBtn.addEventListener("click", function () {
    if (decreaseClicks < maxClicks) {
      let newSize = parseFloat(currentFontSize) - 1;
      if (newSize >= 12) {
        currentFontSize = `${newSize}px`;
        rootElement.style.setProperty("--font-size-default", currentFontSize);
        document.body.style.fontSize = currentFontSize;
        localStorage.setItem("fontSize", currentFontSize);

        decreaseClicks++;
        increaseClicks = 0;
      }
    }
  });
  new window.VLibras.Widget('https://vlibras.gov.br/app');
});
