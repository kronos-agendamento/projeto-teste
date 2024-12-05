let seconds = 0;
let timer = null;

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
  const apiUrlClientes = "http://localhost:8080/usuarios";
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
  const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";
  const apiUrlCriarAgendamento = "http://localhost:8080/api/agendamentos";

  const clientesSelect = document.getElementById("clientes");
  const procedimentosSelect = document.getElementById("procedimentos");
  const especificacoesSelect = document.getElementById("especificacoes");
  const localidadeSelect = document.getElementById("localidade");
  const tipoAgendamentoSelect = document.getElementById("tipo-atendimento");
  const dataInput = document.getElementById("data");
  const dataSelecionadaP = document.getElementById("data-selecionada");
  const horariosContainer = document.getElementById("horarios-disponiveis");
  const saveButton = document.getElementById("save-agendamento-button");
  const enderecoGroup = document.getElementById("endereco-group");
  const taxaTotalDiv = document.getElementById("taxa-total");
  const calcularTaxaButton = document.getElementById("calcular-taxa-button");
  const valorTaxaSpan = document.getElementById("valor-taxa");
  const totalKmSpan = document.getElementById("total-km");
  const enderecoInput = document.getElementById("endereco");
  const origem = "Rua das Gilias, 361 - Vila Bela, São Paulo, SP";

  const gasolina = 4;
  const maoObra = 30 * 0.5;

  let especificacoes = [];

  async function carregarClientes() {
    try {
      const response = await fetch(apiUrlClientes);
      const clientes = await response.json();
      clientes.forEach((cliente) => {
        const option = document.createElement("option");
        option.value = cliente.idUsuario;
        option.textContent = cliente.nome;
        clientesSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
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
        console.error("Erro ao carregar procedimentos:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao carregar procedimentos:", error);
    }
  }

  async function carregarEspecificacoes() {
    try {
      const response = await fetch(apiUrlEspecificacoes);
      if (response.ok) {
        especificacoes = await response.json();
      } else {
        console.error("Erro ao carregar especificações:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao carregar especificações:", error);
    }
  }

  localidadeSelect.addEventListener("change", function () {
    const cepGroup = document.getElementById("cep-group");
    if (localidadeSelect.value === "Homecare") {
      // Exibe o campo de CEP quando Homecare é selecionado
      cepGroup.classList.remove("hidden");
    } else {
      // Esconde o campo de CEP e limpa o valor
      cepGroup.classList.add("hidden");
      document.getElementById("cep").value = "";
      document.getElementById("endereco-group").classList.add("hidden");
    }
  });

  // Função que atualiza o select de localidade com base na especificação
  function atualizarLocalidadeComBaseNaEspecificacao(especificacao) {
    if (especificacao && especificacao.homecare) {
      // Se homecare é true, permite as opções Presencial e Homecare
      localidadeSelect.removeAttribute("disabled");
      localidadeSelect.innerHTML = `
      <option value="">Selecione a localidade</option>
      <option value="Presencial">Presencial</option>
      <option value="Homecare">Homecare</option>
    `;
    } else {
      // Se homecare é false, apenas Presencial
      localidadeSelect.removeAttribute("disabled");
      localidadeSelect.innerHTML = `
      <option value="">Selecione a localidade</option>
      <option value="Presencial">Presencial</option>
    `;
    }
  }

  // Função de filtro de especificações
  function filtrarEspecificacoes(procedimentoId, tipoAgendamento) {
    especificacoesSelect.innerHTML =
      '<option value="">Selecione uma especificação</option>';

    const especificacoesFiltradas = especificacoes.filter((especificacao) => {
      const procedimentoMatch =
        especificacao.procedimento.idProcedimento == procedimentoId;

      let tipoAgendamentoMatch = false;
      switch (tipoAgendamento) {
        case "Colocação":
          tipoAgendamentoMatch = especificacao.colocacao === true;
          break;
        case "Manutenção":
          tipoAgendamentoMatch = especificacao.manutencao === true;
          break;
        case "Retirada":
          tipoAgendamentoMatch = especificacao.retirada === true;
          break;
      }

      return procedimentoMatch && tipoAgendamentoMatch;
    });

    especificacoesFiltradas.forEach((especificacao) => {
      let preco = 0;
      switch (tipoAgendamento) {
        case "Colocação":
          preco = especificacao.precoColocacao;
          break;
        case "Manutenção":
          preco = especificacao.precoManutencao;
          break;
        case "Retirada":
          preco = especificacao.precoRetirada;
          break;
      }

      const option = document.createElement("option");
      option.value = especificacao.idEspecificacaoProcedimento;
      option.textContent = `${especificacao.especificacao} - R$ ${preco.toFixed(
        2
      )}`;
      option.dataset.homecare = especificacao.homecare; // Armazena o valor do homecare no dataset
      especificacoesSelect.appendChild(option);
    });

    if (especificacoesFiltradas.length > 0) {
      especificacoesSelect.removeAttribute("disabled");
      especificacoesSelect.classList.remove("disabled-select");
    } else {
      especificacoesSelect.setAttribute("disabled", "disabled");
      especificacoesSelect.classList.add("disabled-select");
    }

    // Desabilitar localidade por padrão ao alterar especificações
    localidadeSelect.setAttribute("disabled", "disabled");
    localidadeSelect.innerHTML =
      '<option value="">Selecione a localidade</option>';
  }

  // Listener para habilitar o select de localidade com base na especificação selecionada
  especificacoesSelect.addEventListener("change", function () {
    const selectedOption =
      especificacoesSelect.options[especificacoesSelect.selectedIndex];
    const homecare = selectedOption
      ? selectedOption.dataset.homecare === "true"
      : false;

    if (selectedOption && especificacoesSelect.value) {
      localidadeSelect.removeAttribute("disabled");
      if (homecare) {
        // Homecare permitido: mostrar as duas opções
        localidadeSelect.innerHTML = `
        <option value="">Selecione a localidade</option>
        <option value="Presencial">Presencial</option>
        <option value="Homecare">Homecare</option>
      `;
      } else {
        // Apenas presencial permitido
        localidadeSelect.innerHTML = `
        <option value="">Selecione a localidade</option>
        <option value="Presencial">Presencial</option>
      `;
      }
    } else {
      // Desabilita localidade caso nenhuma especificação válida seja selecionada
      localidadeSelect.setAttribute("disabled", "disabled");
      localidadeSelect.innerHTML =
        '<option value="">Selecione a localidade</option>';
    }
  });

  procedimentosSelect.addEventListener("change", function () {
    const procedimentoId = procedimentosSelect.value;
    const tipoAgendamento = tipoAgendamentoSelect.value;
    if (procedimentoId && tipoAgendamento) {
      filtrarEspecificacoes(procedimentoId, tipoAgendamento);
    }
  });

  tipoAgendamentoSelect.addEventListener("change", function () {
    const procedimentoId = procedimentosSelect.value;
    const tipoAgendamento = tipoAgendamentoSelect.value;
    if (procedimentoId && tipoAgendamento) {
      filtrarEspecificacoes(procedimentoId, tipoAgendamento);
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
      const tipoAgendamento = tipoAgendamentoSelect.value;

      carregarHorariosDisponiveis(
        dataInput.value,
        procedimentoId,
        especificacaoId,
        tipoAgendamento
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

  async function buscarEnderecoPorCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (response.ok) {
        const data = await response.json();
        if (data.erro) throw new Error("CEP não encontrado.");
        return `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
      } else {
        throw new Error("Erro ao buscar o CEP.");
      }
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      return null;
    }
  }

  document.getElementById("cep").addEventListener("input", async function () {
    const cepInput = this;
    const cep = cepInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cep.length === 8) {
      const endereco = await buscarEnderecoPorCep(cep);
      if (endereco) {
        document.getElementById("endereco").value = endereco;
        document.getElementById("endereco-group").classList.remove("hidden");
        document.getElementById("numero-group").classList.remove("hidden"); // Exibe o campo de número
        await calcularTaxa(); // Calcula a taxa automaticamente
        atualizarValorTotal(); // Atualiza o valor total incluindo a taxa
      } else {
        showNotification("CEP inválido ou não encontrado.", true);
        document.getElementById("endereco-group").classList.add("hidden");
        document.getElementById("numero-group").classList.add("hidden");
      }
    } else {
      // Formata o CEP enquanto o usuário digita (ex: 12345-678)
      cepInput.value = cep.replace(/(\d{5})(\d{1,3})/, "$1-$2");
      document.getElementById("endereco-group").classList.add("hidden");
      document.getElementById("numero-group").classList.add("hidden");
    }
  });

  async function calcularDistancia(endereco) {
    return new Promise((resolve, reject) => {
      const origem =
        "Rua das Gílias, 361, Vila Prudente, São Paulo - SP, 03201-070";
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origem],
          destinations: [endereco],
          travelMode: "DRIVING",
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === "OK") {
            resolve(response.rows[0].elements[0].distance.value / 1000); // Retorna a distância em km
          } else {
            reject("Erro ao calcular a distância.");
          }
        }
      );
    });
  }

  async function calcularTaxa() {
    const endereco = document.getElementById("endereco").value;
    const gasolina = 6; // Preço médio atualizado da gasolina
    const maoObra = 30 * 0.5; // Mão de obra fixa

    if (endereco) {
      try {
        const km = await calcularDistancia(endereco);
        const taxa = km * gasolina + maoObra;
        valorTaxaSpan.textContent = `R$ ${taxa.toFixed(2)}`;
        totalKmSpan.textContent = `${km.toFixed(2)} km`;
        taxaTotalDiv.classList.remove("hidden");
        return taxa;
      } catch (error) {
        console.error("Erro ao calcular taxa:", error);
        showNotification("Erro ao calcular taxa. Verifique o endereço.", true);
      }
    }
    return 0;
  }

  function calcularValorTotal() {
    const especificacaoId = especificacoesSelect.value;
    const tipoAgendamento = tipoAgendamentoSelect.value;
    const homecare = localidadeSelect.value === "Homecare";

    if (!especificacaoId || !tipoAgendamento) {
      return 0; // Retorna 0 se os campos obrigatórios não estiverem preenchidos
    }

    // Busca a especificação selecionada no array `especificacoes`
    const especificacao = especificacoes.find(
      (item) => item.idEspecificacaoProcedimento == especificacaoId
    );

    if (!especificacao) {
      return 0;
    }

    let valorEspecificacao = 0;
    switch (tipoAgendamento) {
      case "Colocação":
        valorEspecificacao = especificacao.precoColocacao;
        break;
      case "Manutenção":
        valorEspecificacao = especificacao.precoManutencao;
        break;
      case "Retirada":
        valorEspecificacao = especificacao.precoRetirada;
        break;
    }

    let valorTaxa = 0;
    if (homecare) {
      // Garante que a taxa seja capturada corretamente
      valorTaxa =
        parseFloat(valorTaxaSpan.textContent.replace("R$", "").trim()) || 0;
    }

    const valorTotal = valorEspecificacao + valorTaxa;
    return { valorTotal, valorEspecificacao, valorTaxa };
  }

  function atualizarValorTotal() {
    const { valorTotal, valorEspecificacao, valorTaxa } = calcularValorTotal();
    const valorTotalText = document.getElementById("valor-total-text");
    const homecare = localidadeSelect.value === "Homecare";

    if (homecare) {
      valorTotalText.textContent = `Valor Total + Taxa: R$ ${valorTotal.toFixed(
        2
      )} (R$ ${valorEspecificacao.toFixed(2)} + R$ ${valorTaxa.toFixed(2)})`;
    } else {
      valorTotalText.textContent = `Valor Total: R$ ${valorTotal.toFixed(2)}`;
    }
  }

  // Atualiza o valor total ao alterar os campos
  especificacoesSelect.addEventListener("change", atualizarValorTotal);
  tipoAgendamentoSelect.addEventListener("change", atualizarValorTotal);
  localidadeSelect.addEventListener("change", atualizarValorTotal);
  document.getElementById("cep").addEventListener("input", atualizarValorTotal);

  saveButton.addEventListener("click", async function () {
    console.log("Início do processamento do agendamento");

    const clienteId = clientesSelect.value;
    const procedimentoId = procedimentosSelect.value;
    const tipoAgendamento = tipoAgendamentoSelect.value;
    const especificacaoId = especificacoesSelect.value;
    const data = dataInput.value; // Data selecionada
    const horarioButton = document.querySelector(".horario-button.selected");
    const horario = horarioButton ? horarioButton.textContent : null;

    // Captura os novos campos
    const cep = document.getElementById("cep").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const logradouro = document.getElementById("endereco").value.trim();

    // Cálculo do valor total
    const { valorTotal } = calcularValorTotal();

    // Combine a data e o horário no formato ISO
    const dataHorarioStr = `${data}T${horario}`;
    let dataHorario;
    try {
      dataHorario = new Date(dataHorarioStr);
      if (isNaN(dataHorario)) {
        throw new Error("Data ou horário inválido.");
      }

      // Subtrair 3 horas do horário selecionado
      dataHorario.setHours(dataHorario.getHours() - 3);
    } catch (error) {
      console.error("Erro ao processar data e horário:", error);
      showNotification(
        "Erro ao processar data e horário. Por favor, revise os valores.",
        true
      );
      return;
    }

    // Validação dos campos obrigatórios
    if (
      localidadeSelect.value === "Homecare" &&
      (!cep || !logradouro || !numero)
    ) {
      showNotification(
        "Para Homecare, CEP, endereço e número devem ser preenchidos.",
        true
      );
      return;
    }

    try {
      const response = await fetch(apiUrlCriarAgendamento, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fk_usuario: parseInt(clienteId),
          fk_procedimento: parseInt(procedimentoId),
          fk_especificacao: parseInt(especificacaoId),
          tipoAgendamento,
          dataHorario: dataHorario.toISOString(),
          homecare: localidadeSelect.value === "Homecare",
          valor: valorTotal, // Inclui o valor total calculado
          fk_status: 1,
          cep,
          logradouro,
          numero,
        }),
      });

      if (response.ok) {
        showNotification("Agendamento criado com sucesso!");
        setTimeout(() => {
          window.location.href = "../../agendamento.html";
        }, 2000); // Redireciona após 2 segundos
      } else {
        showNotification("Erro ao criar agendamento.", true);
      }
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      showNotification("Erro ao criar agendamento.", true);
    }
  });

  carregarClientes();
  carregarProcedimentos();
  carregarEspecificacoes();

  new window.VLibras.Widget("https://vlibras.gov.br/app");
});
