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
  const mediaValor = 50; // Valor por hora
  const hora = 0.5; // Horas
  const maoObra = mediaValor * hora; // Cálculo da mão de obra
  const origem = "Rua das Gilias, 361 - Vila Bela, São Paulo - State of São Paulo, Brazil";

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
          travelMode: 'DRIVING', // Aqui define o modo de transporte
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status === 'OK') {
            const resultado = response.rows[0].elements[0];
            const distanciaKm = resultado.distance.value / 1000; // Distância em quilômetros
            resolve(distanciaKm);
          } else {
            reject('Erro ao calcular a distância: ' + status);
          }
        }
      );
    });
  }

 // Função para calcular a taxa total
async function calcularTaxa() {
  const endereco = enderecoInput.value; // Captura o valor do endereço

  if (endereco) {
    try {
      const kmLoc = await calcularDistancia(endereco); // Calcula a distância

      // Se a distância for calculada corretamente
      if (kmLoc !== null) {
        const taxaLoc = gasolina * kmLoc; // Cálculo da taxa de locomoção
        const taxaTotal = taxaLoc + maoObra; // Soma da taxa de locomoção e mão de obra

        valorTaxaSpan.textContent = `R$ ${taxaTotal.toFixed(2)}`; // Exibe o valor da taxa
        totalKmSpan.textContent = `${kmLoc.toFixed(2)} km de distância`; // Exibe a distância total

        // Mostra a div da taxa total
        taxaTotalDiv.classList.remove("hidden"); 
      } else {
        valorTaxaSpan.textContent = "Distância não encontrada para o endereço.";
        taxaTotalDiv.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Erro ao calcular a distância:", error);
      valorTaxaSpan.textContent = "Erro ao calcular a distância. Tente novamente.";
      taxaTotalDiv.classList.remove("hidden"); // Mostra a mensagem de erro
    }
  } else {
    // Se o campo de endereço estiver vazio, oculta a div de taxa total
    taxaTotalDiv.classList.add("hidden");
  }
}

// Event listener para o botão de calcular taxa
calcularTaxaButton.addEventListener("click", calcularTaxa);

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

// timer para o marcar tempo que leva para realizar um agendamento!

// Função que será executada quando o valor do select mudar
document.addEventListener("DOMContentLoaded", function () {
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

});

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
