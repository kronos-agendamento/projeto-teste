// Função para normalizar strings (remover acentos e converter para minúsculas)
function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Evento que aguarda o DOM ser completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  const increaseFontBtn = document.getElementById("increase-font");
  const decreaseFontBtn = document.getElementById("decrease-font");
  const rootElement = document.documentElement;

  // Definir tamanho de fonte padrão ou carregar do localStorage
  let currentFontSize = localStorage.getItem("fontSize") || "16px";
  rootElement.style.setProperty("--font-size-default", currentFontSize);
  document.body.style.fontSize = currentFontSize; // Aplicar o tamanho de fonte ao body

  let increaseClicks = 0;
  let decreaseClicks = 0;
  const maxClicks = 2; // Limitar o número de vezes que o tamanho da fonte pode ser alterado

  // Função para aumentar o tamanho da fonte
  increaseFontBtn?.addEventListener("click", function () {
    if (increaseClicks < maxClicks) {
      let newSize = parseFloat(currentFontSize) + 1; // Aumentar 1px
      currentFontSize = `${newSize}px`;
      rootElement.style.setProperty("--font-size-default", currentFontSize);
      document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
      localStorage.setItem("fontSize", currentFontSize);

      increaseClicks++; // Incrementar o contador de cliques para aumentar
      decreaseClicks = 0; // Resetar o contador de diminuir para permitir novo ciclo
    }
  });

  // Função para diminuir o tamanho da fonte
  decreaseFontBtn?.addEventListener("click", function () {
    if (decreaseClicks < maxClicks) {
      let newSize = parseFloat(currentFontSize) - 1; // Diminuir 1px
      if (newSize >= 12) {
        // Limitar o tamanho mínimo da fonte
        currentFontSize = `${newSize}px`;
        rootElement.style.setProperty("--font-size-default", currentFontSize);
        document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
        localStorage.setItem("fontSize", currentFontSize);

        decreaseClicks++; // Incrementar o contador de cliques para diminuir
        increaseClicks = 0; // Resetar o contador de aumentar para permitir novo ciclo
      }
    }
  });

  // Função para popular o select com os meses do ano até o mês atual
  function populateMonthSelect() {
    const selectMes = document.getElementById("selectMes");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() retorna de 0 a 11, então adicionamos +1

    // Limpa as opções existentes no <select>
    selectMes.innerHTML = "";

    // Adiciona os meses de janeiro até o mês atual
    for (let month = 1; month <= currentMonth; month++) {
      const monthString = month.toString().padStart(2, "0"); // Garante que o mês tenha 2 dígitos (ex: '01')
      const option = document.createElement("option");
      option.value = `${currentYear}-${monthString}`;
      option.text = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
        new Date(currentYear, month - 1)
      ); // Nome do mês em português
      selectMes.appendChild(option);
    }

    // Define o mês atual como o selecionado por padrão
    selectMes.value = `${currentYear}-${currentMonth
      .toString()
      .padStart(2, "0")}`;
  }

  // Chama a função para popular o <select> com os meses ao carregar a página
  populateMonthSelect();

  // Pega o ID do usuário do localStorage
  const idUsuario = localStorage.getItem("idUsuario");
  if (!idUsuario) {
    console.error("ID do usuário não encontrado no localStorage.");
    return;
  }

  // Captura o mês selecionado no <select> e chama o fetch
  document.getElementById("selectMes")?.addEventListener("change", function () {
    const selectedMonth = this.value; // Pega o mês selecionado no formato YYYY-MM
    fetchProcedimentosPorUsuarioEMes(idUsuario, selectedMonth); // Faz o fetch com o mês selecionado
  });

  // Inicializa o gráfico com o mês atual ao carregar a página
  const defaultMonth = document.getElementById("selectMes")?.value; // Pega o mês atual do <select>
  fetchProcedimentosPorUsuarioEMes(idUsuario, defaultMonth); // Faz o fetch inicial
});

// Função para buscar os procedimentos por usuário e mês
function fetchProcedimentosPorUsuarioEMes(usuarioId, mesAno) {
  fetch(
    `http://localhost:8080/api/agendamentos/procedimentos-usuario-mes?usuarioId=${usuarioId}&mesAno=${mesAno}`
  )
    .then((response) => response.json())
    .then((data) => {
      updateChartProcedimentosUsuarioMes(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados para o gráfico:", error);
    });
}

// Atualização dos dados do gráfico de perfil
function updateChartProcedimentosUsuarioMes(data) {
  const labels = Object.keys(data); // Os nomes dos procedimentos (ex: Volume Russo, Volume Fio a Fio)
  const dataChart = Object.values(data); // Quantidade de procedimentos (ex: 3, 2, 1)

  // Chama a função para criar ou atualizar o gráfico
  createChartProcedimentosUsuarioMes(labels, dataChart);
}

// Criação do gráfico de perfil
function createChartProcedimentosUsuarioMes(labels, dataChart) {
  const ctx = document
    .getElementById("chartProcedimentosUsuarioMes")
    .getContext("2d");

  // Verifica se o gráfico já existe e o destrói antes de criar um novo
  if (window.chartProcedimentosUsuarioMes instanceof Chart) {
    window.chartProcedimentosUsuarioMes.destroy();
  }

  // Criação do gráfico com Chart.js
  window.chartProcedimentosUsuarioMes = new Chart(ctx, {
    type: "bar", // Tipo de gráfico: barra
    data: {
      labels: labels, // Procedimentos como rótulos (ex: Maquiagem, Sobrancelha)
      datasets: [
        {
          label: "Quantidade de Procedimentos", // Rótulo da barra
          data: dataChart, // Quantidades de procedimentos
          backgroundColor: ["#f9b4c4", "#c4145a", "#e99fb8"], // Cores das barras
          borderColor: "#4B0082", // Cor da borda
          borderWidth: 1, // Largura da borda
        },
      ],
    },
    options: {
      responsive: true, // Responsivo para diferentes tamanhos de tela
      scales: {
        y: {
          beginAtZero: true, // Eixo Y começa no zero
          title: {
            display: true,
            text: "Quantidade",
          },
        },
        x: {
          title: {
            display: true,
            text: "Procedimentos",
          },
        },
      },
    },
  });
}

// Função de saudação
function saudacao() {
  const saudacaoElement1 = document.getElementById("greeting1");
  const saudacaoElement2 = document.getElementById("greeting2");

  const dataAtual = new Date();
  const horaAtual = dataAtual.getHours();
  const diaSemana = dataAtual.getDay();

  let saudacaoTexto;
  let diasDaSemana = [
    { nome: "Domingo", genero: "um", otimo: "ótimo" },
    { nome: "Segunda-feira", genero: "uma", otimo: "ótima" },
    { nome: "Terça-feira", genero: "uma", otimo: "ótima" },
    { nome: "Quarta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Quinta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Sexta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Sábado", genero: "um", otimo: "ótimo" },
  ];

  // Verifica a hora do dia para a saudação
  if (horaAtual >= 0 && horaAtual < 12) {
    saudacaoTexto = "Bom dia";
  } else if (horaAtual >= 12 && horaAtual < 18) {
    saudacaoTexto = "Boa tarde";
  } else {
    saudacaoTexto = "Boa noite";
  }

  // Define o gênero correto para o "um/uma" de acordo com o dia da semana
  const dia = diasDaSemana[diaSemana];
  const genero = dia.genero;
  const otimo = dia.otimo;

  // Exibe a saudação com o dia da semana e o gênero correto
  saudacaoElement1.textContent = `${saudacaoTexto}`;
  saudacaoElement2.textContent = `Aqui você pode gerenciar suas atividades!`;
}

// Função que faz a chamada à API e insere o resultado no <h2>
async function gapUltimoAgendamento() {
  let idUsuario = localStorage.getItem("idUsuario");

  try {
    const response = await fetch(
      `http://localhost:8080/api/agendamentos/count-dias-ultimo-agendamento/${idUsuario}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      document.querySelector(
        ".descricao-aviso h2"
      ).textContent = `${data} dias`;

      localStorage.setItem("QtdDiaUltimoAgendamento", data);
    } else {
      console.error("Erro na resposta:", response.status);
      document.querySelector(".descricao-aviso h2").textContent =
        "Erro ao obter dados";
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    document.querySelector(".descricao-aviso h2").textContent =
      "Erro ao obter dados";
  }
}

// Chama ambas as funções ao carregar a página
window.onload = function () {
  saudacao();
  gapUltimoAgendamento();
  carregarEspecificacoes();
};

// Função para buscar o dia mais agendado
function getDiaMaisAgendado() {
  const idUsuario = localStorage.getItem("idUsuario");

  if (!idUsuario) {
    console.error("ID do usuário não encontrado no localStorage");
    document.getElementById("dMaisAgendados").innerText =
      "ID do usuário não encontrado";
    return;
  }

  fetch(`http://localhost:8080/api/agendamentos/dia-mais-agendado/${idUsuario}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na requisição, status " + response.status);
      }
      return response.text(); // Lendo a resposta como texto
    })
    .then((data) => {
      document.getElementById("dMaisAgendados").innerText = data;
    })
    .catch((error) => {
      console.error("Erro ao buscar o dia mais agendado:", error);
      document.getElementById("dMaisAgendados").innerText = "Erro ao carregar";
    });
}

getDiaMaisAgendado();

// Função para buscar o horário mais agendado
function getHorarioMaisAgendado() {
  const idUsuario = localStorage.getItem("idUsuario");

  if (!idUsuario) {
    console.error("ID do usuário não encontrado no localStorage");
    document.getElementById("horarioMaisAgendado").innerText =
      "ID do usuário não encontrado";
    return;
  }

  fetch(
    `http://localhost:8080/api/agendamentos/usuarios/${idUsuario}/intervalo-mais-agendado`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao buscar o horário mais agendado");
      }
      return response.text(); // A resposta será texto (o intervalo de tempo)
    })
    .then((data) => {
      document.getElementById("horarioMaisAgendado").innerText = data;
    })
    .catch((error) => {
      console.error("Erro:", error);
      document.getElementById("horarioMaisAgendado").innerText =
        "Erro ao carregar";
    });
}

getHorarioMaisAgendado();

// Função para formatar a data e hora
function formatDateTime(dateTimeString) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Date(dateTimeString).toLocaleString("pt-BR", options);
}

// Função para buscar os 3 principais procedimentos
async function fetchProcedimentos() {
  const idUsuario = localStorage.getItem("idUsuario");

  if (!idUsuario) {
    console.error("ID do usuário não encontrado em localDate.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/procedimentos/top3/${idUsuario}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const procedimentos = await response.json();

    const container = document.querySelector(".box-agendamento");
    container.innerHTML = ""; // Limpar conteúdo anterior

    procedimentos.forEach((procedimento) => {
      const tipo_procedimento = procedimento[1]; // Tipo
      const descricao_procedimento = procedimento[2]; // Descrição
      const data_horario = procedimento[4]; // Data e horário mais recente
      const foto = "../../assets/icons/profile.png"; // Imagem padrão

      const formattedDateTime = formatDateTime(data_horario);

      const agendamentoHTML = `
                <div class="box-agendamento">
                    <div class="box-agendamento2">
                        <div class="icon-agendamento">
                            <img src="${foto}" width="100" height="100" alt="${tipo_procedimento}">
                        </div>
                        <div class="procedimento-agendamento">
                            <span id="agendamento">${tipo_procedimento}<br> ${descricao_procedimento}</span>
                            <span id="agendamento">Último agendamento: ${formattedDateTime}</span>
                        </div>
                    </div>
                </div>
            `;
      container.insertAdjacentHTML("beforeend", agendamentoHTML);
    });
  } catch (error) {
    console.error("Erro ao buscar procedimentos:", error);
  }
}

fetchProcedimentos();

// Função para carregar as especificações no datalist
function carregarEspecificacoes() {
  fetch("http://localhost:8080/api/especificacoes")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 204) {
        console.log("Nenhuma especificação encontrada.");
        return [];
      } else {
        throw new Error("Erro ao carregar especificações");
      }
    })
    .then((data) => {
      const dataList = document.getElementById("especificacoesList");
      dataList.innerHTML = ""; // Limpa as opções anteriores

      data.sort((a, b) => {
        const normalizedA = normalizeString(
          `${a.especificacao} - ${a.procedimento.tipo}`
        );
        const normalizedB = normalizeString(
          `${b.especificacao} - ${b.procedimento.tipo}`
        );
        return normalizedA.localeCompare(normalizedB);
      });

      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = `${item.especificacao} - ${item.procedimento.tipo}`;
        option.dataset.normalized = normalizeString(option.value);
        option.dataset.idEspecificacao = item.idEspecificacaoProcedimento;
        option.dataset.idProcedimento = item.procedimento.idProcedimento;
        dataList.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

// Função para salvar os IDs no localStorage e redirecionar para a tela de agendamento
function salvarIdsNoLocalStorage() {
  const input = document.getElementById("searchInput");
  const selectedOption = Array.from(
    document.getElementById("especificacoesList").options
  ).find((option) => option.value === input.value);

  if (selectedOption) {
    const idEspecificacao = selectedOption.dataset.idEspecificacao;
    const idProcedimento = selectedOption.dataset.idProcedimento;

    localStorage.setItem("idEspecificacao", idEspecificacao);
    localStorage.setItem("idProcedimento", idProcedimento);

    window.location.href = "../agendamento-mobile/agendamento-mobile.html";
  }
}

// Função de busca binária
function buscaBinaria(arr, x) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    const midVal = arr[mid].dataset.normalized;

    if (midVal.includes(x)) {
      return mid;
    } else if (midVal < x) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return -1;
}

// Função para filtrar as opções do datalist usando busca binária
function filtrarEspecificacoes() {
  const input = document.getElementById("searchInput");
  const filter = normalizeString(input.value);
  const dataList = document.getElementById("especificacoesList");
  const options = Array.from(dataList.getElementsByTagName("option"));

  options.sort((a, b) =>
    a.dataset.normalized.localeCompare(b.dataset.normalized)
  );

  const index = buscaBinaria(options, filter);

  options.forEach((option, i) => {
    option.style.display =
      i === index || option.dataset.normalized.includes(filter) ? "" : "none";
  });
}

// Adiciona eventos de interação aos elementos de busca
document.getElementById("lupa-icon")?.addEventListener("click", function () {
  this.style.display = "none";
  const searchInput = document.getElementById("searchInput");
  searchInput.style.display = "block";
  document.getElementById("close-icon").style.display = "block";
  searchInput.focus();
});

document.getElementById("close-icon")?.addEventListener("click", function () {
  this.style.display = "none";
  document.getElementById("searchInput").style.display = "none";
  document.getElementById("lupa-icon").style.display = "block";
  document.getElementById("searchInput").value = "";
  document.getElementById("resultados").innerHTML = "";
});

document
  .getElementById("searchInput")
  ?.addEventListener("input", filtrarEspecificacoes);

document
  .getElementById("searchInput")
  ?.addEventListener("change", salvarIdsNoLocalStorage);
