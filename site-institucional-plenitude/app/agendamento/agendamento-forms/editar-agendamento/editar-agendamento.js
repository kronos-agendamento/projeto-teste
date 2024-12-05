document.addEventListener("DOMContentLoaded", function () {
  const apiUrlClientes = "http://localhost:8080/usuarios";
  const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
  const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
  const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";

  const elements = {
    clientesSelect: document.getElementById("clientes"),
    procedimentosSelect: document.getElementById("procedimentos"),
    especificacoesSelect: document.getElementById("especificacoes"),
    tipoAgendamentoSelect: document.getElementById("tipo-atendimento"),
    dataInput: document.getElementById("data"),
    dataSelecionadaP: document.getElementById("data-selecionada"),
    horariosContainer: document.getElementById("horarios-disponiveis"),
    saveButton: document.getElementById("save-agendamento-button"),
    localidadeSelect: document.getElementById("localidade"),
    enderecoFields: document.getElementById("endereco-group"),
    cepInput: document.getElementById("cep"),
    logradouroInput: document.getElementById("endereco"),
    numeroInput: document.getElementById("numero"),
    notification: document.getElementById("notification"),
    notificationMessage: document.getElementById("notification-message"),
    perfilImage: document.getElementById("perfilImage"),
    userName: document.getElementById("userName"),
    userInsta: document.getElementById("userInsta"),
    taxaTotalDiv: document.getElementById("taxa-total"),
    calcularTaxaButton: document.getElementById("calcular-taxa-button"),
    valorTaxaSpan: document.getElementById("valor-taxa"),
    totalKmSpan: document.getElementById("total-km"),
    enderecoInput: document.getElementById("endereco"),
    origem: "Rua das Gilias, 361 - Vila Bela, São Paulo, SP",
  };

  let especificacoes = [];
  let agendamentoData;

  async function fetchData(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(response.statusText);
      return await response.json();
    } catch (error) {
      console.error(`Erro ao carregar dados de ${url}:`, error);
      return null;
    }
  }

  async function carregarClientes() {
    const clientes = await fetchData(apiUrlClientes);
    if (clientes) {
      clientes.forEach((cliente) => {
        const option = document.createElement("option");
        option.value = cliente.idUsuario;
        option.textContent = cliente.nome;
        elements.clientesSelect.appendChild(option);
      });
    }
  }

  async function carregarProcedimentos() {
    const procedimentos = await fetchData(apiUrlProcedimentos);
    if (procedimentos) {
      elements.procedimentosSelect.innerHTML = ""; // Limpa o select antes de adicionar novos procedimentos
      procedimentos.forEach((procedimento) => {
        const option = document.createElement("option");
        option.value = procedimento.idProcedimento;
        option.text = procedimento.tipo;
        elements.procedimentosSelect.appendChild(option);
      });
      console.log("Procedimentos carregados:", procedimentos);
    }
  }

  elements.especificacoesSelect.addEventListener("change", function () {
    const especificacaoId = elements.especificacoesSelect.value;
    const especificacao = especificacoes.find(
      (item) => item.idEspecificacaoProcedimento == especificacaoId
    );

    if (especificacao) {
      if (especificacao.homecare) {
        // Se homecare é true, permite as opções Presencial e Homecare
        elements.localidadeSelect.removeAttribute("disabled");
        elements.localidadeSelect.innerHTML = `
        <option value="">Selecione a localidade</option>
        <option value="Presencial">Presencial</option>
        <option value="Homecare">Homecare</option>
      `;
      } else {
        // Se homecare é false, apenas Presencial
        elements.localidadeSelect.removeAttribute("disabled");
        elements.localidadeSelect.innerHTML = `
        <option value="">Selecione a localidade</option>
        <option value="Presencial">Presencial</option>
      `;
      }
    } else {
      // Desabilita localidade caso nenhuma especificação válida seja selecionada
      elements.localidadeSelect.setAttribute("disabled", "disabled");
      elements.localidadeSelect.innerHTML =
        '<option value="">Selecione a localidade</option>';
    }
  });

  elements.localidadeSelect.addEventListener("change", function () {
    const cepGroup = document.getElementById("cep-group");
    const numeroGroup = document.getElementById("numero-group");
    const enderecoGroup = document.getElementById("endereco-group");

    console.log("Localidade selecionada:", elements.localidadeSelect.value);

    if (elements.localidadeSelect.value === "Homecare") {
      // Exibe os campos de CEP, número e endereço quando Homecare é selecionado
      console.log("Exibindo campos de CEP, número e endereço");
      cepGroup.classList.remove("hidden");
      numeroGroup.classList.remove("hidden");
      enderecoGroup.classList.remove("hidden");
    } else {
      // Esconde os campos de CEP, número e endereço quando Presencial é selecionado
      console.log("Escondendo campos de CEP, número e endereço");
      console.log("Escondendo cepGroup");
      cepGroup.classList.add("hidden");
      console.log("Escondendo numeroGroup");
      numeroGroup.classList.add("hidden");
      console.log("Escondendo enderecoGroup");
      enderecoGroup.classList.add("hidden");
      enderecoGroup.style.display = ""; // Remove o estilo display
      elements.cepInput.value = "";
      elements.numeroInput.value = "";
      elements.enderecoInput.value = "";
      elements.taxaTotalDiv.classList.add("hidden"); // Esconde a taxa total
    }
    atualizarValorTotal(); // Atualiza o valor total quando a localidade é alterada
  });

  async function carregarEspecificacoes() {
    especificacoes = await fetchData(apiUrlEspecificacoes);
    console.log("Especificações carregadas:", especificacoes);
  }

  function filtrarEspecificacoesPorProcedimento(procedimentoId) {
    elements.especificacoesSelect.innerHTML =
      '<option value="">Selecione uma especificação</option>';
    const especificacoesFiltradas = especificacoes.filter((especificacao) => {
      const procedimentoMatch =
        especificacao.procedimento.idProcedimento == procedimentoId;
      let tipoAgendamentoMatch = false;
      switch (elements.tipoAgendamentoSelect.value) {
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
      switch (elements.tipoAgendamentoSelect.value) {
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
      option.text = `${especificacao.especificacao} - R$ ${preco.toFixed(2)}`;
      elements.especificacoesSelect.appendChild(option);
    });

    if (especificacoesFiltradas.length > 0) {
      elements.especificacoesSelect.removeAttribute("disabled");
      elements.especificacoesSelect.classList.remove("disabled-select");
    } else {
      elements.especificacoesSelect.setAttribute("disabled", "disabled");
      elements.especificacoesSelect.classList.add("disabled-select");
    }

    console.log("Especificações filtradas:", especificacoesFiltradas);
  }

  elements.tipoAgendamentoSelect.addEventListener("change", function () {
    const procedimentoId = elements.procedimentosSelect.value;
    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
    }
  });

  elements.procedimentosSelect.addEventListener("change", function () {
    const procedimentoId = elements.procedimentosSelect.value;
    const tipoAgendamento = elements.tipoAgendamentoSelect.value;
    if (procedimentoId && tipoAgendamento) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
    } else {
      elements.especificacoesSelect.setAttribute("disabled", "disabled");
      elements.especificacoesSelect.classList.add("disabled-select");
    }
  });

  elements.dataInput.addEventListener("change", function () {
    const dataSelecionada = new Date(elements.dataInput.value + "T00:00:00");
    if (!isNaN(dataSelecionada)) {
      const dia = dataSelecionada.getDate();
      const mes = dataSelecionada.toLocaleString("default", { month: "long" });
      const diaSemana = dataSelecionada.toLocaleString("default", {
        weekday: "long",
      });
      elements.dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;
      const procedimentoId = elements.procedimentosSelect.value;
      const especificacaoId = elements.especificacoesSelect.value;
      const tipoAtendimento = elements.tipoAgendamentoSelect.value;
      carregarHorariosDisponiveis(
        elements.dataInput.value,
        procedimentoId,
        especificacaoId,
        tipoAtendimento
      );
    } else {
      elements.dataSelecionadaP.textContent = "";
      elements.horariosContainer.innerHTML = "";
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
      const dataFormatada = data.slice(0, 10);
      url.searchParams.append("data", dataFormatada);
      const response = await fetch(url);
      if (response.ok) {
        const horariosDisponiveis = await response.json();
        elements.horariosContainer.innerHTML = "";
        const horarioAgendamento = data.slice(11, 19);
        if (horariosDisponiveis.length === 0) {
          console.log("Nenhum horário disponível.");
        }
        horariosDisponiveis.forEach((horario) => {
          if (horario) {
            const button = document.createElement("button");
            button.textContent = horario;
            button.classList.add("horario-button");
            elements.horariosContainer.appendChild(button);
            button.addEventListener("click", function () {
              document
                .querySelectorAll(".horario-button")
                .forEach((btn) => btn.classList.remove("selected"));
              button.classList.add("selected");
            });
          }
        });
        const agendamentoButton = document.createElement("button");
        agendamentoButton.textContent = horarioAgendamento;
        agendamentoButton.classList.add("horario-button", "selected");
        elements.horariosContainer.appendChild(agendamentoButton);
        agendamentoButton.addEventListener("click", function () {
          document
            .querySelectorAll(".horario-button")
            .forEach((btn) => btn.classList.remove("selected"));
          agendamentoButton.classList.add("selected");
        });
      } else {
        console.error(
          "Erro ao buscar horários disponíveis:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao buscar horários disponíveis:", error);
    }
  }

  async function buscarEnderecoViaCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error("CEP inválido ou não encontrado");
      }
      const data = await response.json();
      if (data.erro) {
        throw new Error("CEP não encontrado");
      }
      elements.logradouroInput.value = data.logradouro || "";
      elements.enderecoFields.style.display = "block";
    } catch (error) {
      console.error("Erro ao buscar o CEP:", error);
      showNotification(
        "Erro ao buscar o CEP. Verifique o número do CEP.",
        true
      );
    }
  }

  elements.cepInput.addEventListener("blur", function () {
    const cep = elements.cepInput.value.replace(/\D/g, "");
    if (cep.length === 8) {
      buscarEnderecoViaCep(cep);
    } else {
      showNotification(
        "CEP inválido. Certifique-se de inserir 8 dígitos.",
        true
      );
    }
  });

  // Adicione as novas funções ao final do arquivo
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
    console.log(endereco);
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
            console.log(response);
            console.log(response.rows[0].elements[0].distance.value);
            resolve(response.rows[0].elements[0].distance.value / 1000); // Retorna a distância em km
          } else {
            reject("Erro ao calcular a distância.");
          }
        }
      );
    });
  }

  async function calcularTaxa() {
    const endereco = elements.enderecoInput.value;
    const gasolina = 6; // Preço médio atualizado da gasolina
    const maoObra = 30 * 0.5; // Mão de obra fixa

    if (endereco) {
      try {
        const km = await calcularDistancia(endereco);
        const taxa = km * gasolina + maoObra;
        elements.valorTaxaSpan.textContent = `R$ ${taxa.toFixed(2)}`;
        elements.totalKmSpan.textContent = `${km.toFixed(2)} km`;
        elements.taxaTotalDiv.classList.remove("hidden");
        return taxa;
      } catch (error) {
        console.error("Erro ao calcular taxa:", error);
        showNotification("Erro ao calcular taxa. Verifique o endereço.", true);
      }
    }
    return 0;
  }

  function calcularValorTotal() {
    const especificacaoId = elements.especificacoesSelect.value;
    const tipoAgendamento = elements.tipoAgendamentoSelect.value;
    const homecare = elements.localidadeSelect.value === "Homecare";

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
        parseFloat(
          elements.valorTaxaSpan.textContent.replace("R$", "").trim()
        ) || 0;
    }

    const valorTotal = valorEspecificacao + valorTaxa;
    return { valorTotal, valorEspecificacao, valorTaxa };
  }

  function atualizarValorTotal() {
    const { valorTotal, valorEspecificacao, valorTaxa } = calcularValorTotal();
    const valorTotalText = document.getElementById("valor-total-text");
    const homecare = elements.localidadeSelect.value === "Homecare";

    if (homecare) {
      valorTotalText.textContent = `Valor Total + Taxa: R$ ${valorTotal.toFixed(
        2
      )} (R$ ${valorEspecificacao.toFixed(2)} + R$ ${valorTaxa.toFixed(2)})`;
    } else {
      valorTotalText.textContent = `Valor Total: R$ ${valorTotal.toFixed(2)}`;
    }
  }

  // Modifique a função carregarEspecificacoes para incluir a chamada de calcularTaxa e atualizarValorTotal
  async function carregarEspecificacoes() {
    especificacoes = await fetchData(apiUrlEspecificacoes);
    await calcularTaxa(); // Calcula a taxa automaticamente
    atualizarValorTotal(); // Atualiza o valor total incluindo a taxa
  }

  // Atualize os eventos de input e change para chamar as novas funções
  elements.procedimentosSelect.addEventListener("change", function () {
    const procedimentoId = elements.procedimentosSelect.value;
    if (procedimentoId) {
      filtrarEspecificacoesPorProcedimento(procedimentoId);
      atualizarValorTotal(); // Atualiza o valor total quando o procedimento é alterado
    } else {
      elements.especificacoesSelect.setAttribute("disabled", "disabled");
      elements.especificacoesSelect.classList.add("disabled-select");
    }
  });

  elements.dataInput.addEventListener("change", function () {
    const dataSelecionada = new Date(elements.dataInput.value + "T00:00:00");
    if (!isNaN(dataSelecionada)) {
      const dia = dataSelecionada.getDate();
      const mes = dataSelecionada.toLocaleString("default", { month: "long" });
      const diaSemana = dataSelecionada.toLocaleString("default", {
        weekday: "long",
      });
      elements.dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;
      const procedimentoId = elements.procedimentosSelect.value;
      const especificacaoId = elements.especificacoesSelect.value;
      const tipoAtendimento = elements.tipoAgendamentoSelect.value;
      carregarHorariosDisponiveis(
        elements.dataInput.value,
        procedimentoId,
        especificacaoId,
        tipoAtendimento
      );
      atualizarValorTotal(); // Atualiza o valor total quando a data é alterada
    } else {
      elements.dataSelecionadaP.textContent = "";
      elements.horariosContainer.innerHTML = "";
    }
  });

  elements.localidadeSelect.addEventListener("change", function () {
    atualizarValorTotal(); // Atualiza o valor total quando a localidade é alterada
  });

  elements.saveButton.addEventListener("click", async function () {
    const clienteId = elements.clientesSelect.value;
    const tipoAtendimento = elements.tipoAgendamentoSelect.value;
    const data = elements.dataInput.value;
    const horarioButton = document.querySelector(".horario-button.selected");
    const horario = horarioButton ? horarioButton.textContent : null;
    const procedimentoId = elements.procedimentosSelect.value;
    const especificacaoId = elements.especificacoesSelect.value;
    const params = new URLSearchParams(window.location.search);
    const agendamentoId = params.get("idAgendamento");

    if (!agendamentoId) {
      showNotification("ID do agendamento não encontrado", true);
      return;
    }

    try {
      const urlBuscarAgendamento = `${apiUrlAgendamentos}/buscar/${agendamentoId}`;
      const responseBuscar = await fetch(urlBuscarAgendamento);
      if (!responseBuscar.ok) {
        throw new Error("Erro ao buscar dados do agendamento");
      }
      agendamentoData = await responseBuscar.json();
    } catch (error) {
      showNotification("Erro ao buscar dados do agendamento", true);
      return;
    }

    const usuarioId = clienteId || agendamentoData.fkUsuario;

    if (
      !usuarioId ||
      !procedimentoId ||
      !tipoAtendimento ||
      !especificacaoId ||
      !data ||
      !horario
    ) {
      showNotification("Todos os campos são obrigatórios", true);
      return;
    }

    const especificacao = especificacoes.find(
      (especificacao) =>
        especificacao.idEspecificacaoProcedimento == especificacaoId
    );

    if (!especificacao) {
      showNotification("Especificação não encontrada", true);
      return;
    }

    const homecare = elements.localidadeSelect.value === "Homecare";
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

    const agendamento = {
      fk_usuario: parseInt(usuarioId),
      fk_procedimento: parseInt(procedimentoId),
      fk_especificacao: parseInt(especificacaoId),
      tipoAgendamento: tipoAtendimento,
      dataHorario: dataHorario.toISOString(),
      homecare,
      valor: valorTotal,
      fk_status: 1,
      cep: elements.cepInput.value,
      logradouro: elements.logradouroInput.value,
      numero: elements.numeroInput.value,
    };

    try {
      const apiUrlEditarAgendamento = `${apiUrlAgendamentos}/atualizar/${agendamentoId}`;
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
        showNotification(
          "Erro ao atualizar o agendamento. Verifique se os dados estão corretos.",
          true
        );
      }
    } catch (error) {
      showNotification("Erro ao atualizar agendamento", true);
    }
  });

  async function preencherFormulario(data) {
    console.log("Dados do agendamento:", data);

    // Preencher o select de clientes
    const optionCliente = document.createElement("option");
    optionCliente.value = data.usuarioId;
    optionCliente.text = data.usuario;
    optionCliente.selected = true;
    elements.clientesSelect.appendChild(optionCliente);

    // Preencher o select de procedimentos
    elements.procedimentosSelect.value = data.fkProcedimento;

    // Preencher o select de tipo de agendamento
    elements.tipoAgendamentoSelect.value = data.tipoAgendamento;

    // Preencher o select de especificações
    filtrarEspecificacoesPorProcedimento(data.fkProcedimento);
    elements.especificacoesSelect.value = data.fkEspecificacao;
    elements.especificacoesSelect.disabled = false;

    // Adicionar a formatação do preço na especificação selecionada
    const especificacao = especificacoes.find(
      (item) => item.idEspecificacaoProcedimento == data.fkEspecificacao
    );
    if (especificacao) {
      let preco = 0;
      switch (data.tipoAgendamento) {
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
      const option = elements.especificacoesSelect.querySelector(
        `option[value="${data.fkEspecificacao}"]`
      );
      if (option) {
        option.text = `${especificacao.especificacao} - R$ ${preco.toFixed(2)}`;
      }

      // Verificar se a especificação possui homecare
      if (especificacao.homecare) {
        elements.localidadeSelect.removeAttribute("disabled");
        elements.localidadeSelect.innerHTML = `
          <option value="">Selecione a localidade</option>
          <option value="Presencial">Presencial</option>
          <option value="Homecare">Homecare</option>
        `;
      } else {
        elements.localidadeSelect.removeAttribute("disabled");
        elements.localidadeSelect.innerHTML = `
          <option value="">Selecione a localidade</option>
          <option value="Presencial">Presencial</option>
        `;
      }
    }

    // Preencher a data
    elements.dataInput.value = data.dataHorario.slice(0, 10);

    // Carregar horários disponíveis
    carregarHorariosDisponiveis(
      data.dataHorario,
      data.fkProcedimento,
      data.fkEspecificacao,
      data.tipoAgendamento
    );

    // Preencher o horário
    const horarioAgendamento = data.dataHorario.slice(11, 19);

    if (data.homecare) {
      elements.localidadeSelect.value = "Homecare";
      elements.localidadeSelect.disabled = false;
      if (elements.cepInput) elements.cepInput.value = data.cep || "";
      if (elements.logradouroInput)
        elements.logradouroInput.value = data.logradouro || "";
      if (elements.numeroInput) elements.numeroInput.value = data.numero || "";
      elements.enderecoFields.style.display = "block";
      document.getElementById("cep-group").classList.remove("hidden");
      document.getElementById("numero-group").classList.remove("hidden");
      document.getElementById("endereco-group").classList.remove("hidden");
    } else {
      elements.localidadeSelect.value = "Presencial";
      elements.localidadeSelect.disabled = true;
      elements.enderecoFields.style.display = "none";
      document.getElementById("cep-group").classList.add("hidden");
      document.getElementById("numero-group").classList.add("hidden");
      document.getElementById("endereco-group").classList.add("hidden");
    }
  }

  function showNotification(message, isError = false) {
    elements.notificationMessage.textContent = message;
    if (isError) {
      elements.notification.classList.add("error");
    } else {
      elements.notification.classList.remove("error");
    }
    elements.notification.classList.add("show");
    setTimeout(() => {
      elements.notification.classList.remove("show");
    }, 3000);
  }

  async function carregarImagem2() {
    const cpf = localStorage.getItem("cpf");

    if (!cpf) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        elements.perfilImage.src = imageUrl;
        elements.perfilImage.alt = "Foto do usuário";
        elements.perfilImage.style.width = "20vh";
        elements.perfilImage.style.height = "20vh";
        elements.perfilImage.style.borderRadius = "300px";
      } else {
        console.error(
          "Erro ao carregar imagem do usuário:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao carregar imagem do usuário:", error);
    }
  }

  const params = new URLSearchParams(window.location.search);
  const agendamentoId = params.get("idAgendamento");

  if (agendamentoId) {
    const url = `${apiUrlAgendamentos}/buscar/${agendamentoId}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Agendamento não encontrado");
        }
        return response.json();
      })
      .then((data) => {
        carregarProcedimentos().then(() => {
          carregarEspecificacoes().then(() => {
            preencherFormulario(data);
          });
        });
      })
      .catch((error) => {
        console.error("Erro ao buscar agendamento:", error);
      });
  } else {
    carregarProcedimentos();
    carregarEspecificacoes();
  }

  carregarClientes();
  carregarProcedimentos();
  carregarEspecificacoes();
  carregarImagem2();

  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    elements.userName.textContent = nome;
    elements.userInsta.textContent = instagram;
  }

  new window.VLibras.Widget("https://vlibras.gov.br/app");
});
