// Função para normalizar strings (remover acentos e converter para minúsculas)
function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Defina a função submitForm fora do DOMContentLoaded para garantir que esteja no escopo global
async function submitForm() {
  const idUsuario = localStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("Usuário não está logado.");
    return;
  }

  const formData = {
    fichaAnamnese: idUsuario,
    usuario: idUsuario,
    respostas: [],
  };

  document.querySelectorAll("input, select").forEach((input) => {
    const perguntaId = input.name.split("_")[1];

    if (!perguntaId) return;

    let resposta;
    if (input.type === "checkbox") {
      resposta = input.checked ? "Sim" : "Não";
    } else {
      resposta = input.value;
    }

    if (resposta.trim() !== "") {
      formData.respostas.push({
        resposta: resposta,
        pergunta: parseInt(perguntaId),
      });
    }
  });

  try {
    const response = await fetch("http://localhost:8080/api/respostas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Respostas enviadas com sucesso!");
    } else {
      alert("Erro ao enviar respostas. Verifique os dados e tente novamente.");
    }
  } catch (error) {
    console.error("Erro no envio das respostas:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const increaseFontBtn = document.getElementById("increase-font");
  const decreaseFontBtn = document.getElementById("decrease-font");
  const rootElement = document.documentElement;

  let currentFontSize = localStorage.getItem("fontSize") || "16px";
  rootElement.style.setProperty("--font-size-default", currentFontSize);
  document.body.style.fontSize = currentFontSize;

  let increaseClicks = 0;
  let decreaseClicks = 0;
  const maxClicks = 2;

  // Eventos para ajustar a fonte
  if (increaseFontBtn) {
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
  }

  if (decreaseFontBtn) {
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
  }

  // Função para buscar perguntas da API
  async function fetchPerguntas() {
    try {
      const response = await fetch("http://localhost:8080/api/perguntas");
      if (response.status === 204) {
        alert("Nenhuma pergunta encontrada.");
        return;
      }

      const perguntas = await response.json();
      renderPerguntas(perguntas);
    } catch (error) {
      console.error("Erro ao buscar perguntas:", error);
    }
  }

  // Função para renderizar perguntas dinamicamente
  function renderPerguntas(perguntas) {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = "";

    perguntas.forEach((pergunta) => {
      const formGroup = document.createElement("div");
      formGroup.classList.add("form-group");
      formGroup.style.marginBottom = "20px";

      const label = document.createElement("label");
      label.textContent = pergunta.pergunta;
      label.style.fontWeight = "bold";
      formGroup.appendChild(label);

      let inputElement = null;

      if (pergunta.tipo === "Input") {
        inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.name = `pergunta_${pergunta.idPergunta}`;
        inputElement.required = true;
        inputElement.style.marginTop = "10px";
        inputElement.style.width = "100%";
      } else if (pergunta.tipo === "Check Box") {
        inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.name = `pergunta_${pergunta.idPergunta}`;
        inputElement.style.marginTop = "10px";
      } else if (pergunta.tipo === "Select") {
        inputElement = document.createElement("select");
        inputElement.name = `pergunta_${pergunta.idPergunta}`;
        inputElement.required = true;
        inputElement.style.marginTop = "10px";

        ["Sim", "Não"].forEach((optionValue) => {
          const option = document.createElement("option");
          option.value = optionValue;
          option.textContent = optionValue;
          inputElement.appendChild(option);
        });
      }

      if (inputElement) formGroup.appendChild(inputElement);
      contentDiv.appendChild(formGroup);
    });
  }

  // Buscar perguntas ao carregar a página
  window.onload = fetchPerguntas;

  // Configuração da busca com lupa
  const lupaIcon = document.getElementById("lupa-icon");
  const closeIcon = document.getElementById("close-icon");
  const searchInput = document.getElementById("searchInput");

  if (lupaIcon && closeIcon && searchInput) {
    lupaIcon.addEventListener("click", function () {
      lupaIcon.style.display = "none";
      searchInput.style.display = "block";
      closeIcon.style.display = "block";
      searchInput.focus();
    });

    closeIcon.addEventListener("click", function () {
      closeIcon.style.display = "none";
      searchInput.style.display = "none";
      lupaIcon.style.display = "block";
      searchInput.value = "";
      document.getElementById("resultados").innerHTML = "";
    });
  }

  searchInput?.addEventListener("input", filtrarEspecificacoes);
  searchInput?.addEventListener("change", salvarIdsNoLocalStorage);
  carregarEspecificacoes();
  new window.VLibras.Widget('https://vlibras.gov.br/app');
});

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
