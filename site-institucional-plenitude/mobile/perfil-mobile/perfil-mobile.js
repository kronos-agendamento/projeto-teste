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

 // --------------------------------------------------------------------------------------

 function populateYearSelect() {
  const selectAno = document.getElementById("selectAno");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const startYear = 2000; // Ajuste o ano de início conforme necessário

  selectAno.innerHTML = ""; // Limpa as opções existentes no <select>

  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.text = year;
    selectAno.appendChild(option);
  }

  selectAno.value = currentYear; // Define o ano atual como padrão
}

function populateMonthSelect() {
  const selectMes = document.getElementById("selectMes");
  const selectAno = document.getElementById("selectAno");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const selectedYear = parseInt(selectAno.value);

  // Define o último mês a ser exibido
  const lastMonth = selectedYear === currentYear ? currentDate.getMonth() + 1 : 12;

  selectMes.innerHTML = ""; // Limpa as opções existentes no <select>

  for (let month = 1; month <= lastMonth; month++) {
    const monthString = month.toString().padStart(2, "0");
    const option = document.createElement("option");
    option.value = `${selectedYear}-${monthString}`; // Mantém o formato "YYYY-MM"
    
    // Formata o nome do mês em português com a primeira letra maiúscula
    let monthName = new Intl.DateTimeFormat("pt-BR", {
      month: "long",
    }).format(new Date(selectedYear, month - 1));
    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    option.text = monthName;

    selectMes.appendChild(option);
  }

  // Define o mês atual como padrão se o ano for o atual
  if (selectedYear === currentYear) {
    selectMes.value = `${currentYear}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}`;
  } else {
    selectMes.value = `${selectedYear}-01`; // Define o primeiro mês para anos anteriores ao atual
  }
}

// Atualiza os meses quando o ano é alterado
document.getElementById("selectAno").addEventListener("change", populateMonthSelect);

// Inicializa ambos os selects
populateYearSelect();
populateMonthSelect();

  // -------------------------------------------------------------------------------------------------------------------------------
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
  new window.VLibras.Widget('https://vlibras.gov.br/app');
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
  const mensagemSemProcedimentos = document.getElementById("mensagemSemProcedimentos");
  
  if (labels.length === 0 || dataChart.every(value => value === 0)) {
    // Exibe a mensagem se não houver dados
    mensagemSemProcedimentos.style.display = "block";
    document.getElementById("chartProcedimentosUsuarioMes").style.display = "none";
  } else {
    // Oculta a mensagem e exibe o gráfico se houver dados
    mensagemSemProcedimentos.style.display = "none";
    document.getElementById("chartProcedimentosUsuarioMes").style.display = "block";
    createChartProcedimentosUsuarioMes(labels, dataChart);
  }
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
          ticks: {
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
      ).textContent = ` ${data} dias`;

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

async function fetchProcedimentos() { 
  const idUsuario = localStorage.getItem("idUsuario");

  if (!idUsuario) {
      console.error("ID do usuário não encontrado no localStorage.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:8080/api/procedimentos/top3/${idUsuario}`);
      if (!response.ok) {
          throw new Error("Erro na resposta da rede");
      }
      const procedimentos = await response.json();

      const container = document.querySelector(".box-agendamento-container");
      container.innerHTML = ""; // Limpar o conteúdo anterior

      procedimentos.forEach((procedimento) => {
          const tipo_procedimento = procedimento[1]; // Tipo
          const descricao_procedimento = procedimento[2]; // Descrição
          const data_horario = procedimento[4]; // Data e horário mais recente

          // Verifica o tipo de procedimento e ajusta o ícone
          let imgIconSrc = '../../assets/icons/profile.png'; // Ícone padrão

          switch (tipo_procedimento) {
              case 'Maquiagem':
                  imgIconSrc = '../../assets/icons/maquiagem-mobile.png';
                  break;
              case 'Cílios':
                  imgIconSrc = '../../assets/icons/cilios-mobile.png';
                  break;
              case 'Sobrancelha':
                  imgIconSrc = '../../assets/icons/sobrancelha-mobile.png';
                  break;
              default:
                  imgIconSrc = '../../assets/icons/profile.png'; // Ícone padrão
                  break;
          }

          const formattedDateTime = formatDateTime(data_horario);

          // Criar o HTML com o ícone e as informações do agendamento
          const agendamentoHTML = `
              <div class="box-agendamento">
                  <div class="icon-agendamento">
                      <div class="icon-procedimento" style="background-color: #ffffff; border: 2px solid #AD9393; width: 80px; height: 80px; margin-top: 10px; border-radius: 50%;">
                          <img src="${imgIconSrc}" alt="${tipo_procedimento}" >
                      </div>
                  </div>
                  <div class="procedimento-agendamento">
                      <span id="agendamento"><strong style= "font-size: 18px;">${tipo_procedimento}</strong><br></span>
                      <span id="agendamento"><strong>${descricao_procedimento}</strong><br></span>
                      <span id="agendamento">Último agendamento: ${formattedDateTime}</span>
                  </div>
              </div>
          `;
          container.insertAdjacentHTML("beforeend", agendamentoHTML);
      });
  } catch (error) {
      console.error("Erro ao buscar procedimentos:", error);
  }
}

// Chamar a função ao carregar a página
document.addEventListener('DOMContentLoaded', fetchProcedimentos);

// Função para formatar data e horário
function formatDateTime(data_horario) {
  const data = new Date(data_horario);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
         ' às ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
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
