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

  // Verificar se os botões de aumento/diminuição de fonte existem antes de adicionar eventos
  if (increaseFontBtn) {
    increaseFontBtn.addEventListener("click", function () {
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
  }

  if (decreaseFontBtn) {
    decreaseFontBtn.addEventListener("click", function () {
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
  }

  // Configuração da busca com lupa
  const lupaIcon = document.getElementById("lupa-icon");
  const closeIcon = document.getElementById("close-icon");
  const searchInput = document.getElementById("searchInput");

  // Verificar se os elementos existem antes de adicionar eventos
  if (lupaIcon && closeIcon && searchInput) {
    lupaIcon.addEventListener("click", function () {
      lupaIcon.style.display = "none";
      searchInput.style.display = "block";
      closeIcon.style.display = "block";
      searchInput.focus(); // Focar no input
    });

    closeIcon.addEventListener("click", function () {
      closeIcon.style.display = "none";
      searchInput.style.display = "none";
      lupaIcon.style.display = "block";
      searchInput.value = "";
      document.getElementById("resultados").innerHTML = "";
    });
  }

  // Eventos de busca e seleção do datalist
  searchInput?.addEventListener("input", filtrarEspecificacoes);
  searchInput?.addEventListener("change", salvarIdsNoLocalStorage);

  // Chamar a função para carregar as especificações ao iniciar a página
  carregarEspecificacoes();

  // Função para popular o select com os meses do ano até o mês atual
  function populateMonthSelect() {
    const selectMes = document.getElementById("selectMes");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() retorna de 0 a 11, então adicionamos +1

    selectMes.innerHTML = ""; // Limpa as opções existentes no <select>

    for (let month = 1; month <= currentMonth; month++) {
      const monthString = month.toString().padStart(2, "0");
      const option = document.createElement("option");
      option.value = `${currentYear}-${monthString}`;
      let monthName = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
      }).format(new Date(currentYear, month - 1));
      monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
      option.text = monthName;
      selectMes.appendChild(option);
    }

    selectMes.value = `${currentYear}-${currentMonth
      .toString()
      .padStart(2, "0")}`;
  }
  populateMonthSelect();

  // Pega o ID do usuário do localStorage
  const idUsuario = localStorage.getItem("idUsuario");
  if (!idUsuario) {
    console.error("ID do usuário não encontrado no localStorage.");
    return;
  }

  document.getElementById("selectMes")?.addEventListener("change", function () {
    const selectedMonth = this.value;
    fetchProcedimentosPorUsuarioEMes(idUsuario, selectedMonth);
  });

  const defaultMonth = document.getElementById("selectMes")?.value;
  fetchProcedimentosPorUsuarioEMes(idUsuario, defaultMonth);
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

// Função para criar e atualizar o gráfico de perfil
function updateChartProcedimentosUsuarioMes(data) {
  const labels = Object.keys(data);
  const dataChart = Object.values(data);
  createChartProcedimentosUsuarioMes(labels, dataChart);
}

// Função para exibir o gráfico de perfil
function createChartProcedimentosUsuarioMes(labels, dataChart) {
  const ctx = document
    .getElementById("chartProcedimentosUsuarioMes")
    .getContext("2d");

  if (window.chartProcedimentosUsuarioMes instanceof Chart) {
    window.chartProcedimentosUsuarioMes.destroy();
  }

  window.chartProcedimentosUsuarioMes = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Quantidade de Procedimentos",
          data: dataChart,
          backgroundColor: ["#f9b4c4", "#c4145a", "#e99fb8"],
          borderColor: ["#f9b4c4", "#c4145a", "#e99fb8"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantidade",
            font: { family: "Poppins, sans-serif", size: 18, weight: "bold" },
          },
        },
        x: {
          ticks: {x
            maxRotation: 35,
            minRotation: 35,
            font: { size: 12, weight: "bold", family: "Poppins, sans-serif" },
          },
          title: {
            display: true,
            text: "Procedimentos",
            font: { family: "Poppins, sans-serif", size: 18, weight: "bold" },
          },
        },
      },
    },
  });
}

// Função para carregar as especificações no datalist
function carregarEspecificacoes() {
  fetch("http://localhost:8080/api/especificacoes")
    .then((response) => (response.ok ? response.json() : []))
    .then((data) => {
      const dataList = document.getElementById("especificacoesList");
      dataList.innerHTML = "";

      data.sort((a, b) =>
        normalizeString(
          `${a.especificacao} - ${a.procedimento.tipo}`
        ).localeCompare(
          normalizeString(`${b.especificacao} - ${b.procedimento.tipo}`)
        )
      );

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

// Função para salvar IDs no localStorage e redirecionar
function salvarIdsNoLocalStorage() {
  const input = document.getElementById("searchInput");
  const selectedOption = Array.from(
    document.getElementById("especificacoesList").options
  ).find((option) => option.value === input.value);

  if (selectedOption) {
    localStorage.setItem(
      "idEspecificacao",
      selectedOption.dataset.idEspecificacao
    );
    localStorage.setItem(
      "idProcedimento",
      selectedOption.dataset.idProcedimento
    );
    window.location.href = "../agendamento-mobile/agendamento-mobile.html";
  }
}

// Função de busca binária para filtrar o datalist
function buscaBinaria(arr, x) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);
    const midVal = arr[mid].dataset.normalized;

    if (midVal.includes(x)) return mid;
    midVal < x ? (start = mid + 1) : (end = mid - 1);
  }

  return -1;
}

// Função para filtrar opções usando busca binária
function filtrarEspecificacoes() {
  const input = document.getElementById("searchInput");
  const filter = normalizeString(input.value);
  const options = Array.from(
    document.getElementById("especificacoesList").options
  );

  options.sort((a, b) =>
    a.dataset.normalized.localeCompare(b.dataset.normalized)
  );

  const index = buscaBinaria(options, filter);

  options.forEach((option, i) => {
    option.style.display =
      i === index || option.dataset.normalized.includes(filter) ? "" : "none";
  });
}
