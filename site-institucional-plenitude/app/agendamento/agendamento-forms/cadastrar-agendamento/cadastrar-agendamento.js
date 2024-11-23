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
  const localidadeSelect = document.getElementById("localidade");
  const tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
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
  const maoObra = 30 * 0.5; // Custo fixo de mão de obra (30 por hora, 0.5h)

  let especificacoes = []; // Armazena todas as especificações

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

  function filtrarEspecificacoes(procedimentoId, tipoAtendimento) {
    console.log(
      "Filtrando especificações para:",
      procedimentoId,
      tipoAtendimento
    );

    especificacoesSelect.innerHTML =
      '<option value="">Selecione uma especificação</option>';

    const especificacoesFiltradas = especificacoes.filter((especificacao) => {
      const procedimentoMatch =
        especificacao.procedimento.idProcedimento == procedimentoId;

      let tipoAtendimentoMatch = false;
      switch (tipoAtendimento) {
        case "Colocação":
          tipoAtendimentoMatch = especificacao.colocacao === true;
          break;
        case "Manutenção":
          tipoAtendimentoMatch = especificacao.manutencao === true;
          break;
        case "Retirada":
          tipoAtendimentoMatch = especificacao.retirada === true;
          break;
      }

      return procedimentoMatch && tipoAtendimentoMatch;
    });

    especificacoesFiltradas.forEach((especificacao) => {
      let preco = 0;
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
      }

      const option = document.createElement("option");
      option.value = especificacao.idEspecificacaoProcedimento;
      option.textContent = `${especificacao.especificacao} - R$ ${preco.toFixed(
        2
      )}`;
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
    const tipoAtendimento = tipoAtendimentoSelect.value;
    if (procedimentoId && tipoAtendimento) {
      filtrarEspecificacoes(procedimentoId, tipoAtendimento);
    }
  });

  tipoAtendimentoSelect.addEventListener("change", function () {
    const procedimentoId = procedimentosSelect.value;
    const tipoAtendimento = tipoAtendimentoSelect.value;
    if (procedimentoId && tipoAtendimento) {
      filtrarEspecificacoes(procedimentoId, tipoAtendimento);
    }
  });

  especificacoesSelect.addEventListener("change", function () {
    const especificacaoSelecionada = especificacoes.find(
      (esp) => esp.idEspecificacaoProcedimento == especificacoesSelect.value
    );

    if (especificacaoSelecionada && especificacaoSelecionada.homecare) {
      localidadeSelect.removeAttribute("disabled");
    } else {
      localidadeSelect.setAttribute("disabled", "disabled");
      localidadeSelect.value = "Presencial"; // Padrão
    }
  });

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
    const cep = this.value.replace(/\D/g, "");
    if (cep.length === 8) {
      const endereco = await buscarEnderecoPorCep(cep);
      if (endereco) {
        enderecoInput.value = endereco;
        calcularTaxa();
      } else {
        showNotification("CEP inválido ou não encontrado.", true);
      }
    }
  });

  async function calcularDistancia(endereco) {
    return new Promise((resolve, reject) => {
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
            resolve(response.rows[0].elements[0].distance.value / 1000);
          } else {
            reject("Erro ao calcular a distância.");
          }
        }
      );
    });
  }

  async function calcularTaxa() {
    const endereco = enderecoInput.value;
    if (endereco) {
      const km = await calcularDistancia(endereco);
      const taxa = km * gasolina + maoObra;
      valorTaxaSpan.textContent = `R$ ${taxa.toFixed(2)}`;
      totalKmSpan.textContent = `${km.toFixed(2)} km`;
      taxaTotalDiv.classList.remove("hidden");
      return taxa;
    }
    return 0;
  }

  saveButton.addEventListener("click", async function () {
    const clienteId = clientesSelect.value;
    const procedimentoId = procedimentosSelect.value;
    const tipoAtendimento = tipoAtendimentoSelect.value;
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
      showNotification("Todos os campos são obrigatórios.", true);
      return;
    }

    const dataHorario = new Date(`${data}T${horario}:00.000Z`).toISOString();
    const taxa =
      localidadeSelect.value === "Homecare" ? await calcularTaxa() : 0;

    try {
      const response = await fetch(apiUrlCriarAgendamento, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fk_usuario: parseInt(clienteId),
          fk_procedimento: parseInt(procedimentoId),
          fk_especificacao: parseInt(especificacaoId),
          tipoAtendimento,
          dataHorario,
          homecare: localidadeSelect.value === "Homecare",
          valor: taxa,
        }),
      });

      if (response.ok) showNotification("Agendamento criado com sucesso!");
      else showNotification("Erro ao criar agendamento.", true);
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
