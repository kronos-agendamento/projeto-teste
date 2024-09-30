document.addEventListener("DOMContentLoaded", function () {
  const increaseFontBtn = document.getElementById("increase-font");
  const decreaseFontBtn = document.getElementById("decrease-font");
  const rootElement = document.documentElement;

  // Definir tamanho de fonte padrão ou carregar do localStorage
  let currentFontSize = localStorage.getItem("fontSize") || "16px";
  rootElement.style.setProperty("--font-size-default", currentFontSize);

  // Função para aumentar o tamanho da fonte
  increaseFontBtn.addEventListener("click", function () {
    let newSize = parseFloat(currentFontSize) + 1;
    currentFontSize = `${newSize}px`;
    rootElement.style.setProperty("--font-size-default", currentFontSize);
    localStorage.setItem("fontSize", currentFontSize);
  });

  // Função para diminuir o tamanho da fonte
  decreaseFontBtn.addEventListener("click", function () {
    let newSize = parseFloat(currentFontSize) - 1;
    if (newSize >= 12) {
      // Limitar tamanho mínimo da fonte
      currentFontSize = `${newSize}px`;
      rootElement.style.setProperty("--font-size-default", currentFontSize);
      localStorage.setItem("fontSize", currentFontSize);
    }
  });

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
    saudacaoElement2.textContent = `Tenha ${genero} ${otimo} ${dia.nome}!`;
  }

  // Função para normalizar strings (remover acentos e converter para minúsculas)
  function normalizeString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  // Função para carregar especificações
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
        console.log("Especificações carregadas:", data);
        const dataList = document.getElementById("especificacoesList");
        dataList.innerHTML = ""; // Limpa as opções anteriores

        // Ordena as especificações antes de adicioná-las ao datalist
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

  // Função para salvar IDs no localStorage e redirecionar para a tela de agendamento
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

      console.log("IDs salvos no localStorage:", {
        idEspecificacao,
        idProcedimento,
      });

      // Redireciona para a tela de agendamento
      window.location.href = "../agendamento-mobile/agendamento-mobile.html";
    }
  }

  // Adiciona evento de mudança para salvar os IDs no localStorage e redirecionar
  document
    .getElementById("searchInput")
    .addEventListener("change", salvarIdsNoLocalStorage);

  // Função para busca binária
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

    // Ordena as opções para garantir que a busca binária funcione corretamente
    options.sort((a, b) =>
      a.dataset.normalized.localeCompare(b.dataset.normalized)
    );

    // Realiza a busca binária
    const index = buscaBinaria(options, filter);

    // Exibe apenas as opções que correspondem ao filtro
    options.forEach((option, i) => {
      if (i === index || option.dataset.normalized.includes(filter)) {
        option.style.display = "";
      } else {
        option.style.display = "none";
      }
    });
  }

  // Chama a função quando a página carregar
  window.onload = function () {
    saudacao();
    carregarEspecificacoes();
  };

  document.getElementById("lupa-icon").addEventListener("click", function () {
    this.style.display = "none";
    const searchInput = document.getElementById("searchInput");
    searchInput.style.display = "block";
    document.getElementById("close-icon").style.display = "block";
    searchInput.focus(); // Foca no input para facilitar a digitação
  });

  document.getElementById("close-icon").addEventListener("click", function () {
    this.style.display = "none";
    document.getElementById("searchInput").style.display = "none";
    document.getElementById("lupa-icon").style.display = "block";
    document.getElementById("searchInput").value = "";
    document.getElementById("resultados").innerHTML = "";
  });

  // Adiciona evento de input para filtrar as opções conforme o usuário digita
  document
    .getElementById("searchInput")
    .addEventListener("input", filtrarEspecificacoes);
});
