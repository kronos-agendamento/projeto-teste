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
  const enderecoInput = document.getElementById("endereco");
  const taxaTotalDiv = document.getElementById("taxa-total");
  const valorTaxaSpan = document.getElementById("valor-taxa");
  const totalKmSpan = document.getElementById("total-km");
  const calcularTaxaButton = document.getElementById("calcular-taxa-button");
  let especificacoes = [];

  // Inicialmente, ocultar todos os campos exceto o procedimento
  opcaoEspecificacaoDiv.classList.add("hidden");
  tipoAtendimentoDiv.classList.add("hidden");
  dataInputDiv.classList.add("hidden");
  horariosDiv.classList.add("hidden");
  botaoAgendarDiv.classList.add("hidden");

  function atualizarOpcoesTipoAtendimento(procedimentoId) {
    const options = tipoAtendimentoSelect.options;

    for (let i = 0; i < options.length; i++) {
      if (procedimentoId == 1) {
        options[i].disabled = !["Homecare", "Estudio", "Evento"].includes(
          options[i].value
        );
      } else {
        options[i].disabled = !["Colocação", "Manutenção", "Retirada"].includes(
          options[i].value
        );
      }
    }

    tipoAtendimentoDiv.classList.remove("hidden");
  }

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

    if (idEspecificacao) {
      especificacaoSelect.value = idEspecificacao;
    }
  }

  procedimentoSelect.addEventListener("change", function () {
    const procedimentoId = procedimentoSelect.value;

    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
      atualizarOpcoesTipoAtendimento(procedimentoId);
    } else {
      opcaoEspecificacaoDiv.classList.add("hidden");
      tipoAtendimentoDiv.classList.add("hidden");
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

  especificacaoSelect.addEventListener("change", function () {
    const especificacaoId = especificacaoSelect.value;
    if (especificacaoId) {
      tipoAtendimentoDiv.classList.remove("hidden");
      tipoAtendimentoSelect.disabled = false;
      document.getElementById("localidade").disabled = false;
    } else {
      tipoAtendimentoDiv.classList.add("hidden");
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
      document.getElementById("localidade").disabled = true;
    }
  });

  tipoAtendimentoSelect.addEventListener("change", function () {
    const tipoAtendimento = tipoAtendimentoSelect.value;

    if (tipoAtendimento) {
      dataInputDiv.classList.remove("hidden");
    } else {
      dataInputDiv.classList.add("hidden");
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }

    if (tipoAtendimento === "Homecare" || tipoAtendimento === "Evento") {
      document.getElementById("endereco-group").classList.remove("hidden");
    } else {
      document.getElementById("endereco-group").classList.add("hidden");
    }
  });

  dataInput.addEventListener("change", function () {
    const data = dataInput.value;
    if (data) {
      carregarHorariosDisponiveis(data);
    } else {
      horariosDiv.classList.add("hidden");
      botaoAgendarDiv.classList.add("hidden");
    }
  });

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

  document.getElementById("cep").addEventListener("blur", async function () {
    const cep = this.value.replace("-", "").trim();
    if (cep.length === 8) {
      const url = `https://viacep.com.br/ws/${cep}/json/`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (!data.erro) {
            document.getElementById("endereco").value = data.logradouro;
            document.getElementById("cidade").value = data.localidade;
            document.getElementById("estado").value = data.uf;
            await calcularTaxa(); // Calcula a taxa automaticamente após preencher o endereço
          } else {
            showNotification("CEP não encontrado.", true);
          }
        } else {
          showNotification("Erro ao buscar CEP.", true);
        }
      } catch (error) {
        console.error("Erro ao buscar CEP: ", error);
        showNotification("Erro ao buscar CEP.", true);
      }
    } else {
      showNotification("CEP inválido.", true);
    }
  });

  async function calcularDistancia(endereco) {
    return new Promise((resolve, reject) => {
      const origem =
        "Rua das Gilias, 361 - Vila Bela, São Paulo - State of São Paulo, Brazil";
      console.log("Origem:", origem);
      console.log("Destino:", endereco);

      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origem],
          destinations: [endereco],
          travelMode: "DRIVING",
          unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          console.log("Response Status:", status);
          console.log("Response:", response);

          if (status === "OK") {
            const element = response.rows[0].elements[0];
            console.log("Element Status:", element.status);
            console.log("Element:", element);

            if (element.status === "OK") {
              resolve(element.distance.value / 1000); // Retorna a distância em km
            } else if (element.status === "NOT_FOUND") {
              reject(
                "Endereço não encontrado. Verifique o endereço e tente novamente."
              );
            } else {
              reject("Erro ao calcular a distância: " + element.status);
            }
          } else {
            reject("Erro ao calcular a distância: " + status);
          }
        }
      );
    });
  }

  async function calcularTaxa() {
    const endereco = document.getElementById("endereco").value;
    const cep = document.getElementById("cep").value;
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    const enderecoCompleto = `${endereco}, ${cidade} - ${estado}, ${cep}`;
    console.log("Endereço completo para cálculo da taxa:", enderecoCompleto);

    const gasolina = 6; // Preço médio atualizado da gasolina
    const maoObra = 30 * 0.5; // Mão de obra fixa

    if (endereco) {
      try {
        const km = await calcularDistancia(enderecoCompleto);
        console.log("Distância calculada (km):", km);

        const taxa = km * gasolina + maoObra;
        console.log("Taxa calculada:", taxa);

        valorTaxaSpan.textContent = `R$ ${taxa.toFixed(2)}`;
        totalKmSpan.textContent = `${km.toFixed(2)} km`;
        taxaTotalDiv.classList.remove("hidden");
      } catch (error) {
        console.error("Erro ao calcular taxa:", error);
        showNotification(error, true);
      }
    }
  }

  document.getElementById("localidade").addEventListener("change", function () {
    const localidade = this.value;
    if (localidade === "Homecare") {
      document.getElementById("endereco-group").classList.remove("hidden");
    } else {
      document.getElementById("endereco-group").classList.add("hidden");
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

  new window.VLibras.Widget("https://vlibras.gov.br/app");

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

  inicializar();

  function calcularValorTotal() {
    const especificacaoId = document.getElementById("especificacao").value;
    const tipoAgendamento = document.getElementById(
      "tipo-atendimento-select"
    ).value;
    const homecare = document.getElementById("localidade").value === "Homecare";

    if (!especificacaoId || !tipoAgendamento) {
      return { valorTotal: 0, valorEspecificacao: 0, valorTaxa: 0 }; // Retorna 0 se os campos obrigatórios não estiverem preenchidos
    }

    // Busca a especificação selecionada no array `especificacoes`
    const especificacao = especificacoes.find(
      (item) => item.idEspecificacaoProcedimento == especificacaoId
    );

    if (!especificacao) {
      return { valorTotal: 0, valorEspecificacao: 0, valorTaxa: 0 };
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

  document
    .getElementById("save-agendamento-button")
    .addEventListener("click", async function () {
      console.log("Início do processamento do agendamento");

      const idUsuario = localStorage.getItem("idUsuario");
      const procedimentoId = document.getElementById("procedimento").value;
      const tipoAgendamento = document.getElementById(
        "tipo-atendimento-select"
      ).value;
      const especificacaoId = document.getElementById("especificacao").value;
      const data = document.getElementById("data").value; // Data selecionada
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
        document.getElementById("localidade").value === "Homecare" &&
        (!cep || !logradouro || !numero)
      ) {
        showNotification(
          "Para Homecare, CEP, endereço e número devem ser preenchidos.",
          true
        );
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/agendamentos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fk_usuario: parseInt(idUsuario),
            fk_procedimento: parseInt(procedimentoId),
            fk_especificacao: parseInt(especificacaoId),
            tipoAgendamento,
            dataHorario: dataHorario.toISOString(),
            homecare:
              document.getElementById("localidade").value === "Homecare",
            valor: valorTotal, // Inclui o valor total calculado
            fk_status: 1,
            cep,
            logradouro,
            numero,
            tempoAgendar: 0, // Adicionei o campo tempoAgendar conforme o corpo do POST
          }),
        });

        if (response.ok) {
          showNotification("Agendamento criado com sucesso!");
          setTimeout(() => {
            window.location.href = "../index-mobile/index-mobile.html";
          }, 2000); // Redireciona após 2 segundos
        } else {
          showNotification("Erro ao criar agendamento.", true);
        }
      } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        showNotification("Erro ao criar agendamento.", true);
      }
    });
});
