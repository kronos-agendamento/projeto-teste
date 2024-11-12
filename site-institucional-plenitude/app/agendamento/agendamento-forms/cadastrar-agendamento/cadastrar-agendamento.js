let seconds = 0;
let timer = null;

document.addEventListener("DOMContentLoaded", function () {
  const apiUrlClientes = "http://localhost:8080/usuarios";
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
  const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";
  const apiUrlCriarAgendamento = "http://localhost:8080/api/agendamentos";

  const clientesSelect = document.getElementById("clientes");
  const procedimentosSelect = document.getElementById("procedimentos");
  const especificacoesSelect = document.getElementById("especificacoes");
  const procedimentoSelect = document.getElementById("procedimento");
  const localidadeSelect = document.getElementById("localidade");
  const tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
  const tipoAgendamentoSelect = document.getElementById("tipo-atendimento");
  const dataInput = document.getElementById("data");
  const dataSelecionadaP = document.getElementById("data-selecionada");
  const horariosContainer = document.getElementById("horarios-disponiveis");
  const saveButton = document.getElementById("save-agendamento-button");
  const enderecoGroup = document.getElementById("endereco-group"); // Div de endereço
  const taxaTotalDiv = document.getElementById("taxa-total"); // Div de taxa total
  const calcularTaxaButton = document.getElementById("calcular-taxa-button"); // Botão de calcular taxa
  const valorTaxaSpan = document.getElementById("valor-taxa");
  const totalKmSpan = document.getElementById("total-km");
  const gasolina = 4; // Valor fixo médio da gasolina (exemplo)
  const enderecoInput = document.getElementById("endereco");
  const mediaValor = 30; // Valor por hora
  const hora = 0.5; // Horas
  const maoObra = mediaValor * hora; // Cálculo da mão de obra
  const origem =
    "Rua das Gilias, 361 - Vila Bela, São Paulo - State of São Paulo, Brazil";

  let especificacoes = []; // Array para armazenar todas as especificações

  async function carregarClientes() {
    try {
      const response = await fetch(apiUrlClientes);
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

  function filtrarEspecificacoes(procedimentoId, tipoAtendimento, localidade) {
    especificacoesSelect.innerHTML =
      '<option value="">Selecione uma especificação</option>'; // Reseta as opções

    const especificacoesFiltradas = especificacoes.filter((especificacao) => {
      const procedimentoMatch =
        especificacao.procedimento.idProcedimento == procedimentoId;
      const homecareMatch =
        localidade !== "Homecare" || especificacao.homecare === true;

      return procedimentoMatch && homecareMatch;
    });

    especificacoesFiltradas.forEach((especificacao) => {
      let preco;
      switch (tipoAtendimento) {
        case "Colocação":
          preco = especificacao.precoColocacao;
          break;
        case "Manutenção":
          preco = especificacao.precoManutencao;
          break;
        case "Retirada":
          preco = especificacao.precoRetirada;
          break;
        default:
          preco = 0;
      }

      const option = document.createElement("option");
      option.value = especificacao.idEspecificacaoProcedimento;
      option.text = `${especificacao.especificacao} - R$ ${preco.toFixed(2)}`;
      especificacoesSelect.appendChild(option);
    });

    if (especificacoesFiltradas.length > 0) {
      especificacoesSelect.removeAttribute("disabled");
      especificacoesSelect.classList.remove("disabled-select");
    } else {
      especificacoesSelect.setAttribute("disabled", "disabled");
      especificacoesSelect.classList.add("disabled-select");
    }

    // Habilitar/desabilitar localidade com base na primeira especificação filtrada
    if (
      especificacoesFiltradas.length > 0 &&
      especificacoesFiltradas.some((esp) => esp.homecare === true)
    ) {
      localidadeSelect.removeAttribute("disabled");
    } else {
      localidadeSelect.setAttribute("disabled", "disabled");
      localidadeSelect.value = ""; // Reseta o valor se for desabilitado
    }
  }

  // Event listeners atualizados
  procedimentosSelect.addEventListener("change", function () {
    verificarFiltros();
  });

  especificacoesSelect.addEventListener("change", function () {
    const especificacaoSelecionada = especificacoes.find(
      (esp) => esp.idEspecificacaoProcedimento == especificacoesSelect.value
    );

    if (especificacaoSelecionada && especificacaoSelecionada.homecare) {
      localidadeSelect.removeAttribute("disabled");
    } else {
      localidadeSelect.setAttribute("disabled", "disabled");
      localidadeSelect.value = "Presencial"; // Padrão para casos não-Homecare
    }
  });

  tipoAtendimentoSelect.addEventListener("change", function () {
    const tipoAtendimento = tipoAtendimentoSelect.value;

    if (tipoAtendimento === "Homecare" || tipoAtendimento === "Evento") {
      localidadeSelect.removeAttribute("disabled");
    } else {
      localidadeSelect.setAttribute("disabled", "disabled");
      localidadeSelect.value = "Presencial"; // Padrão para casos não-Homecare
      verificarFiltros();
    }
  });

  localidadeSelect.addEventListener("change", function () {
    verificarFiltros();
  });

  function verificarFiltros() {
    const procedimentoId = procedimentosSelect.value;
    const tipoAtendimento = tipoAtendimentoSelect.value;
    const localidade = localidadeSelect.value;
    const especificacaoAtual = especificacoesSelect.value;

    if (procedimentoId && tipoAtendimento && localidade) {
      const especificacoesFiltradas = especificacoes.filter((especificacao) => {
        const procedimentoMatch =
          especificacao.procedimento.idProcedimento == procedimentoId;
        const homecareMatch =
          localidade !== "Homecare" || especificacao.homecare === true;

        return procedimentoMatch && homecareMatch;
      });

      // Verifica se a especificação atual ainda é válida
      const especificacaoValida = especificacoesFiltradas.some(
        (especificacao) =>
          especificacao.idEspecificacaoProcedimento == especificacaoAtual
      );

      // Atualiza o select de especificações apenas se necessário
      if (!especificacaoValida) {
        especificacoesSelect.innerHTML =
          '<option value="">Selecione uma especificação</option>'; // Reseta as opções

        especificacoesFiltradas.forEach((especificacao) => {
          let preco;
          switch (tipoAtendimento) {
            case "Colocação":
              preco = especificacao.precoColocacao;
              break;
            case "Manutenção":
              preco = especificacao.precoManutencao;
              break;
            case "Retirada":
              preco = especificacao.precoRetirada;
              break;
            default:
              preco = 0;
          }

          const option = document.createElement("option");
          option.value = especificacao.idEspecificacaoProcedimento;
          option.text = `${especificacao.especificacao} - R$ ${preco.toFixed(
            2
          )}`;
          especificacoesSelect.appendChild(option);
        });

        especificacoesSelect.value = ""; // Limpa o valor selecionado se não for válido
      } else {
        especificacoesSelect.value = especificacaoAtual; // Mantém a especificação atual
      }

      if (especificacoesFiltradas.length > 0) {
        especificacoesSelect.removeAttribute("disabled");
        especificacoesSelect.classList.remove("disabled-select");
      } else {
        especificacoesSelect.setAttribute("disabled", "disabled");
        especificacoesSelect.classList.add("disabled-select");
      }
    } else {
      especificacoesSelect.setAttribute("disabled", "disabled");
      especificacoesSelect.classList.add("disabled-select");
    }
  }

  // Chamada inicial para carregar as especificações
  carregarEspecificacoes();

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

  // Mostrar div de endereço somente se o tipo de atendimento for "Homecare" ou "Evento"
  tipoAtendimentoSelect.addEventListener("change", function () {
    const tipoAtendimento = tipoAtendimentoSelect.value;

    if (tipoAtendimento === "Homecare" || tipoAtendimento === "Evento") {
      enderecoGroup.classList.remove("hidden"); // Mostra o endereço
    } else {
      enderecoGroup.classList.add("hidden"); // Esconde o endereço
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

  saveButton.addEventListener("click", async function () {
    const clienteId = clientesSelect.value;
    console.log(clienteId);
    const procedimentoId = procedimentosSelect.value;
    console.log(procedimentoId);
    const tipoAtendimento = tipoAgendamentoSelect.value;
    const especificacaoId = especificacoesSelect.value;
    const data = dataInput.value;
    const horarioButton = document.querySelector(".horario-button.selected");
    const horario = horarioButton ? horarioButton.textContent : null;

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

    const dataHorario = new Date(`${data}T${horario}.000Z`).toISOString();
    console.log(seconds + "antes do const");
    const agendamento = {
      fk_usuario: parseInt(clienteId, 10),
      fk_procedimento: parseInt(procedimentoId, 10),
      fk_especificacao: parseInt(especificacaoId, 10),
      fk_status: 1,
      tempoAgendar: seconds,
      tipoAgendamento: tipoAtendimento,
      dataHorario: dataHorario,
    };

    try {
      console.log(seconds + " segundos aí rapaiz");
      const response = await fetch(apiUrlCriarAgendamento, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agendamento),
      });

      if (response.ok) {
        console.log(response);
        console.log(agendamento);
        showNotification("Agendamento criado com sucesso!");
        setTimeout(() => {
          window.location.href = "../../agendamento.html";
        }, 1000);
      } else {
        const errorMsg = await response.text();
        console.error("Erro ao criar agendamento: " + errorMsg);
        showNotification(
          "Já existe um agendamento para essa data e horário",
          true
        );
      }
    } catch (error) {
      console.error("Erro ao criar agendamento: ", error);
      showNotification("Erro ao criar agendamento", true);
    }
  });

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

  // Função para calcular a taxa total
  async function calcularTaxa() {
    const endereco = enderecoInput.value;

    if (endereco) {
      try {
        const kmLoc = await calcularDistancia(endereco);
        if (kmLoc !== null) {
          const taxaLoc = gasolina * kmLoc; // Taxa de locomoção
          const taxaTotal = taxaLoc + maoObra; // Taxa total incluindo mão de obra

          valorTaxaSpan.textContent = `R$ ${taxaTotal.toFixed(2)}`;
          totalKmSpan.textContent = `${kmLoc.toFixed(2)} km de distância`;
          taxaTotalDiv.classList.remove("hidden");

          return taxaTotal; // Retorna o valor da taxa
        } else {
          valorTaxaSpan.textContent = "Distância não encontrada.";
          taxaTotalDiv.classList.remove("hidden");
        }
      } catch (error) {
        console.error("Erro ao calcular a distância:", error);
        valorTaxaSpan.textContent = "Erro ao calcular a distância.";
        taxaTotalDiv.classList.remove("hidden");
      }
    } else {
      taxaTotalDiv.classList.add("hidden");
    }
    return 0; // Retorna zero se não houver taxa
  }

  // Event listener para o botão de calcular taxa
  calcularTaxaButton.addEventListener("click", calcularTaxa);

  carregarClientes();
  carregarProcedimentos();
  carregarEspecificacoes(); // Carrega todas as especificações no início

  async function buscarOrcamento() {
    const fkProcedimento = procedimentosSelect.value;
    const fkEspecificacao = especificacoesSelect.value;
    const tipoAgendamento = tipoAtendimentoSelect.value;
    const horarioButton = document.querySelector(".horario-button.selected");

    if (
      !fkProcedimento ||
      !fkEspecificacao ||
      !tipoAgendamento ||
      !horarioButton
    ) {
      document.getElementById("orcamento-container").classList.add("hidden");
      return;
    }

    try {
      let taxa = 0;
      // Calcula a taxa se o tipo de atendimento for Homecare ou Evento
      if (tipoAgendamento === "Homecare" || tipoAgendamento === "Evento") {
        taxa = await calcularTaxa();
      } else {
        valorTaxaSpan.textContent = "R$ 0.00"; // Define a taxa como zero para outros tipos
      }

      let orcamentoBase = 0;

      // URL do endpoint do orçamento
      const url = `http://localhost:8080/api/agendamentos/calcular-orcamento?fkProcedimento=${fkProcedimento}&fkEspecificacao=${fkEspecificacao}&tipoAgendamento=${tipoAgendamento}`;
      const response = await fetch(url);

      if (response.ok) {
        orcamentoBase = await response.json();
      } else if (response.status === 404) {
        console.warn("Orçamento base não encontrado.");
        showNotification(
          "Orçamento base não disponível. Considerando apenas a taxa.",
          true
        );
      } else {
        console.error("Erro ao obter o orçamento:", response.status);
        showNotification(
          "Erro ao calcular o orçamento. Tente novamente.",
          true
        );
        return;
      }

      // Soma a taxa ao orçamento base, se aplicável
      const orcamentoTotal = orcamentoBase + taxa;

      // Atualiza o valor no elemento `id="orcamento"`
      document.getElementById(
        "orcamento"
      ).textContent = `R$ ${orcamentoTotal.toFixed(2)}`;
      document.getElementById(
        "orcamento-detalhe"
      ).textContent = `Valor do procedimento: R$ ${orcamentoBase.toFixed(2)}, 
         taxa adicional: R$ ${taxa.toFixed(2)}, 
         total: R$ ${orcamentoTotal.toFixed(2)}`;

      // Exibe o contêiner do orçamento
      document.getElementById("orcamento-container").classList.remove("hidden");
    } catch (error) {
      console.error("Erro ao buscar orçamento:", error);
      showNotification("Erro ao buscar orçamento. Tente novamente.", true);
    }
  }

  // Evento para calcular taxa e exibir endereço apenas para Homecare ou Evento
  tipoAtendimentoSelect.addEventListener("change", async function () {
    const tipoAtendimento = tipoAtendimentoSelect.value;

    if (tipoAtendimento === "Homecare" || tipoAtendimento === "Evento") {
      enderecoGroup.classList.remove("hidden");
      await calcularTaxa();
    } else {
      enderecoGroup.classList.add("hidden");
      valorTaxaSpan.textContent = "R$ 0.00";
    }
  });

  // Evento de mudança na data para carregar horários e calcular o orçamento
  dataInput.addEventListener("change", function () {
    const dataSelecionada = dataInput.value;
    if (dataSelecionada) {
      carregarHorariosDisponiveis(dataSelecionada);
    }
  });

  // Evento para calcular o orçamento após selecionar o horário
  horariosContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("horario-button")) {
      document
        .querySelectorAll(".horario-button")
        .forEach((btn) => btn.classList.remove("selected"));
      event.target.classList.add("selected");
      buscarOrcamento(); // Chama a função de orçamento após selecionar o horário
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

  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }

  // timer para o marcar tempo que leva para realizar um agendamento!

  // Variável que irá armazenar o intervalo

  // Função que será executada quando o valor do select mudar
  document
    .getElementById("procedimentos")
    .addEventListener("change", function () {
      const selectedValue = this.value;

      if (selectedValue !== "") {
        // Se o valor selecionado não for vazio
        if (!timer) {
          // Verifica se o timer já está rodando
          timer = setInterval(() => {
            seconds++; // Incrementa a variável a cada segundo
            console.log(`Segundos: ${seconds}`);
          }, 1000); // 1000 ms = 1 segundo
        }
      }
    });

  document
    .getElementById("save-agendamento-button")
    .addEventListener("click", function () {
      if (timer) {
        clearInterval(timer); // Para o timer
        timer = null; // Reseta o timer
        console.log(`Contagem parada em: ${seconds} segundos`);
      }
    });

  new window.VLibras.Widget("https://vlibras.gov.br/app");

  //     function sendSecondsToServer() {
  //         fetch('http://localhost:8080/api/agendamentos/', { // Substitua pela URL do seu servidor
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
        }
      );

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

  window.onload = function () {
    carregarImagem2();
  };
});
