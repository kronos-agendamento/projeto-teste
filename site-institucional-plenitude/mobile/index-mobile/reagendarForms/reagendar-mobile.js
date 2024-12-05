document.addEventListener("DOMContentLoaded", function () {
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
  const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";

  const procedimentosSelect = document.getElementById("procedimentos");
  const especificacoesSelect = document.getElementById("especificacoes");
  const tipoAgendamentoSelect = document.getElementById("tipo-atendimento");
  const dataInput = document.getElementById("data");
  const dataSelecionadaP = document.getElementById("data-selecionada");
  const horariosContainer = document.getElementById("horarios-disponiveis");
  const saveButton = document.getElementById("save-agendamento-button");
  const enderecoInput = document.getElementById("endereco");
  const taxaTotalDiv = document.getElementById("taxa-total");
  const valorTaxaSpan = document.getElementById("valor-taxa");
  const totalKmSpan = document.getElementById("total-km");
  let especificacoes = [];

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
        especificacoes = await response.json();
      } else {
        console.error("Erro ao buscar especificações: " + response.statusText);
      }
    } catch (error) {
      console.error("Erro ao buscar especificações: ", error);
    }
  }

  function filtrarEspecificacoesPorProcedimento(procedimentoId) {
    especificacoesSelect.innerHTML =
      '<option value="">Selecione uma especificação</option>';

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

  procedimentosSelect.addEventListener("change", function () {
    const procedimentoId = procedimentosSelect.value;
    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
    } else {
      especificacoesSelect.setAttribute("disabled", "disabled");
      especificacoesSelect.classList.add("disabled-select");
    }
  });

  // Captura o ID do agendamento da URL
  const params = new URLSearchParams(window.location.search);
  const agendamentoId = params.get("id"); // Pega o ID da URL

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
      console.log("Agendamento encontrado:", data);
    })
    .catch((error) => {
      console.error("Erro ao buscar agendamento:", error);
    });

  function preencherFormulario(data) {
    // Preencher o select de procedimentos
    const procedimentosSelect = document.getElementById("procedimentos");
    const optionProcedimento = document.createElement("option");
    optionProcedimento.value = data.fkProcedimento; // Usar o ID do procedimento
    optionProcedimento.text = data.procedimento; // Mostrar o nome
    optionProcedimento.selected = true;
    procedimentosSelect.appendChild(optionProcedimento);

    // Preencher o select de tipo de atendimento
    const tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
    tipoAtendimentoSelect.value = data.tipoAgendamento;

    // Preencher o select de especificações
    const especificacoesSelect = document.getElementById("especificacoes");
    const optionEspecificacao = document.createElement("option");
    optionEspecificacao.value = data.fkEspecificacao; // Usar o ID da especificação
    optionEspecificacao.text = data.especificacao; // Mostrar o nome
    optionEspecificacao.selected = true;
    especificacoesSelect.appendChild(optionEspecificacao);
    especificacoesSelect.disabled = false;

    // Preencher o campo de data
    const dataInput = document.getElementById("data");
    dataInput.value = data.dataHorario.split("T")[0];

    // Preencher campos de endereço se homecare for true
    const localidadeSelect = document.getElementById("localidade");
    if (data.homecare) {
      localidadeSelect.value = "Homecare";
      document.getElementById("endereco-group").classList.remove("hidden");
      document.getElementById("cep").value = data.cep || "";
      document.getElementById("endereco").value = data.logradouro || "";
      document.getElementById("numero").value = data.numero || "";
    } else {
      localidadeSelect.value = "Presencial";
      document.getElementById("endereco-group").classList.add("hidden");
    }

    // Carregar horários disponíveis ao preencher o formulário
    carregarHorariosDisponiveis(
      data.dataHorario.split("T")[0],
      data.fkProcedimento,
      data.fkEspecificacao,
      data.tipoAgendamento
    );
  }

  async function carregarHorariosDisponiveis(
    data,
    procedimentoId,
    especificacaoId,
    tipoAgendamento
  ) {
    try {
      const empresaId = localStorage.getItem("empresa");

      const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";
      const horariosContainer = document.getElementById("horarios-disponiveis");

      const url = new URL(apiUrlAgendamentos + "/horarios-disponiveis");
      url.searchParams.append("empresaId", empresaId);
      url.searchParams.append("data", data);

      const response = await fetch(url);
      if (response.ok) {
        const horariosDisponiveis = await response.json();
        horariosContainer.innerHTML = "";

        // Adiciona o horário atual do agendamento como selecionado
        const params = new URLSearchParams(window.location.search);
        const agendamentoId = params.get("id");
        const urlBuscarAgendamento = `http://localhost:8080/api/agendamentos/buscar/${agendamentoId}`;
        const responseBuscar = await fetch(urlBuscarAgendamento);
        let horarioAgendamento = null;
        if (responseBuscar.ok) {
          const agendamentoData = await responseBuscar.json();
          horarioAgendamento = agendamentoData.dataHorario
            .split("T")[1]
            .substring(0, 8); // Formato HH:mm:ss
        }

        horariosDisponiveis.forEach((horario) => {
          const button = document.createElement("button");
          button.textContent = horario;
          button.classList.add("horario-button");
          if (horario === horarioAgendamento) {
            button.classList.add("selected");
          }
          horariosContainer.appendChild(button);

          button.addEventListener("click", function () {
            document
              .querySelectorAll(".horario-button")
              .forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");
          });
        });

        if (
          horarioAgendamento &&
          !horariosDisponiveis.includes(horarioAgendamento)
        ) {
          const button = document.createElement("button");
          button.textContent = horarioAgendamento;
          button.classList.add("horario-button", "selected");
          horariosContainer.appendChild(button);

          button.addEventListener("click", function () {
            document
              .querySelectorAll(".horario-button")
              .forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");
          });
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

  dataInput.addEventListener("change", function () {
    const dataSelecionada = new Date(dataInput.value + "T00:00:00");
    if (!isNaN(dataSelecionada)) {
      const dia = dataSelecionada.getDate();
      const mes = dataSelecionada.toLocaleString("default", { month: "long" });
      const diaSemana = dataSelecionada.toLocaleString("default", {
        weekday: "long",
      });
      dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;

      const procedimentoId =
        procedimentosSelect.value || params.get("fkProcedimento");
      const especificacaoId =
        especificacoesSelect.value || params.get("fkEspecificacao");
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

  function calcularValorTotal() {
    const especificacaoId = document.getElementById("especificacoes").value;
    const tipoAgendamento = document.getElementById("tipo-atendimento").value;
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
      const valorTaxaElement = document.getElementById("valor-taxa");
      if (valorTaxaElement) {
        valorTaxa =
          parseFloat(valorTaxaElement.textContent.replace("R$", "").trim()) ||
          0;
      }
    }

    const valorTotal = valorEspecificacao + valorTaxa;
    return { valorTotal, valorEspecificacao, valorTaxa };
  }

  saveButton.addEventListener("click", async function () {
    const procedimentoId = procedimentosSelect.value;
    const tipoAgendamento = tipoAgendamentoSelect.value;
    const especificacaoId = especificacoesSelect.value;
    const data = dataInput.value;
    const horarioButton = document.querySelector(".horario-button.selected");
    const horario = horarioButton ? horarioButton.textContent : null;

    if (
      !procedimentoId ||
      !tipoAgendamento ||
      !especificacaoId ||
      !data ||
      !horario
    ) {
      showNotification("Todos os campos são obrigatórios", true);
      return;
    }

    // Log do horário selecionado
    console.log("Horário selecionado:", horario);

    // Ajuste para garantir que o horário seja salvo corretamente
    const [hours, minutes, seconds] = horario.split(":");
    const dataHorario = new Date(`${data}T${horario}`);

    // Subtrair 3 horas do horário selecionado
    dataHorario.setHours(dataHorario.getHours() - 3);

    // Log do horário combinado
    console.log("Data e horário combinados:", dataHorario);

    if (isNaN(dataHorario.getTime())) {
      showNotification("Erro: Data e horário inválidos.", true);
      return;
    }

    // Captura os novos campos
    const cep = document.getElementById("cep").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const logradouro = document.getElementById("endereco").value.trim();

    // Cálculo do valor total
    const { valorTotal } = calcularValorTotal();

    // Salvar os dados puros no agendamentoData
    window.agendamentoData = {
      procedimentoId,
      especificacaoId,
      tipoAgendamento,
      dataHorario: dataHorario.toISOString(),
      cep,
      logradouro,
      numero,
      valorTotal,
    };

    // Log do horário enviado
    console.log("Horário enviado (ISO):", window.agendamentoData.dataHorario);

    // Preencher os detalhes do modal usando os nomes diretamente
    const agendamentoDetalhes = `
          <p><strong>Procedimento:</strong> ${
            procedimentosSelect.options[procedimentosSelect.selectedIndex].text
          }</p>
          <p><strong>Especificação:</strong> ${
            especificacoesSelect.options[especificacoesSelect.selectedIndex]
              .text
          }</p>
          <p><strong>Tipo de Atendimento:</strong> ${tipoAgendamento}</p>
          <p><strong>Data e Horário:</strong> ${new Date(
            window.agendamentoData.dataHorario
          ).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}</p>
      `;
    document.getElementById("agendamentoDetalhes").innerHTML =
      agendamentoDetalhes;

    // Exibir o modal de confirmação
    document.getElementById("deleteModal").style.display = "block";
  });

  document
    .getElementById("confirmDeleteButton")
    .addEventListener("click", async function () {
      if (!window.agendamentoData || !window.agendamentoData.dataHorario) {
        console.error("Dados de agendamento ou dataHorario ausentes.");
        showNotification("Erro: Dados de agendamento ausentes.", true);
        return;
      }

      console.log(
        "Confirmando com dataHorario:",
        window.agendamentoData.dataHorario
      );

      const params = new URLSearchParams(window.location.search);
      const agendamentoId = params.get("id");
      const apiUrlEditarAgendamento = `http://localhost:8080/api/agendamentos/atualizar/${agendamentoId}`;

      try {
        const agendamento = {
          fk_usuario: parseInt(params.get("idUsuario"), 10),
          fk_procedimento: parseInt(window.agendamentoData.procedimentoId, 10),
          fk_especificacao: parseInt(
            window.agendamentoData.especificacaoId,
            10
          ),
          fk_status: 1,
          tipoAgendamento: window.agendamentoData.tipoAgendamento,
          dataHorario: new Date(
            window.agendamentoData.dataHorario
          ).toISOString(),
          tempoAgendar: 0,
          homecare: document.getElementById("localidade").value === "Homecare",
          valor: window.agendamentoData.valorTotal,
          cep: window.agendamentoData.cep,
          logradouro: window.agendamentoData.logradouro,
          numero: window.agendamentoData.numero,
        };

        console.log("Enviando agendamento:", agendamento);

        const response = await fetch(apiUrlEditarAgendamento, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamento),
        });

        if (response.ok) {
          showNotification("Alterações realizadas com sucesso!");
          setTimeout(() => {
            window.location.href = "../index-mobile.html";
          }, 1000);
        } else {
          const errorMsg = await response.text();
          console.error("Erro ao reagendar:", errorMsg);
          showNotification("Erro ao reagendar. Tente novamente.", true);
        }
      } catch (error) {
        console.error("Erro ao reagendar:", error);
        showNotification("Erro ao reagendar. Tente novamente.", true);
      } finally {
        fecharModalDecisao();
      }
    });

  document
    .getElementById("confirmDeleteButton")
    .addEventListener("click", async function () {
      if (!window.agendamentoData || !window.agendamentoData.dataHorario) {
        console.error("Dados de agendamento ou dataHorario ausentes.");
        showNotification("Erro: Dados de agendamento ausentes.", true);
        return;
      }

      console.log(
        "Confirmando com dataHorario:",
        window.agendamentoData.dataHorario
      );

      const params = new URLSearchParams(window.location.search);
      const agendamentoId = params.get("id");
      const apiUrlEditarAgendamento = `http://localhost:8080/api/agendamentos/atualizar/${agendamentoId}`;

      try {
        const agendamento = {
          fk_usuario: parseInt(params.get("idUsuario"), 10),
          fk_procedimento: parseInt(window.agendamentoData.procedimentoId, 10),
          fk_especificacao: parseInt(
            window.agendamentoData.especificacaoId,
            10
          ),
          fk_status: 1,
          tipoAgendamento: window.agendamentoData.tipoAgendamento,
          dataHorario: new Date(
            window.agendamentoData.dataHorario
          ).toISOString(),
          tempoAgendar: 0,
          homecare: document.getElementById("localidade").value === "Homecare",
          valor: window.agendamentoData.valorTotal,
          cep: window.agendamentoData.cep,
          logradouro: window.agendamentoData.logradouro,
          numero: window.agendamentoData.numero,
        };

        console.log("Enviando agendamento:", agendamento);

        const response = await fetch(apiUrlEditarAgendamento, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamento),
        });

        if (response.ok) {
          showNotification("Alterações realizadas com sucesso!");
          setTimeout(() => {
            window.location.href = "../index-mobile.html";
          }, 1000);
        } else {
          const errorMsg = await response.text();
          console.error("Erro ao reagendar:", errorMsg);
          showNotification("Erro ao reagendar. Tente novamente.", true);
        }
      } catch (error) {
        console.error("Erro ao reagendar:", error);
        showNotification("Erro ao reagendar. Tente novamente.", true);
      } finally {
        fecharModalDecisao();
      }
    });

  carregarProcedimentos();
  carregarEspecificacoes(); // Carrega todas as especificações no início
});

function fecharModalDecisao() {
  document.getElementById("deleteModal").style.display = "none";
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

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("localidade").addEventListener("change", function () {
    const localidade = this.value;
    if (localidade === "Homecare") {
      document.getElementById("endereco-group").classList.remove("hidden");
    } else {
      document.getElementById("endereco-group").classList.add("hidden");
    }
  });
});
