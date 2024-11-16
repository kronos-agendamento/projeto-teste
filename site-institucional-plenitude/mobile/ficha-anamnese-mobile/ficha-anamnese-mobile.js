// Função para normalizar strings (remover acentos e converter para minúsculas)
function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Função para exibir notificações
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

// Função para buscar e preencher o formulário com dados já respondidos
async function preencherFormularioComRespostas(idUsuario) {
  try {
    const response = await fetch(`http://localhost:8080/api/ficha-anamnese/${idUsuario}`);
    if (!response.ok) throw new Error("Erro ao buscar respostas preenchidas");

    const ficha = await response.json();
    console.log("Ficha recebida:", ficha);

    if (ficha.perguntasRespostas && ficha.perguntasRespostas.length > 0) {
      ficha.perguntasRespostas.forEach((item, index) => {
        console.log(`Pergunta ${index + 1} - ID: ${item.idPergunta}, Tipo: ${item.perguntaTipo}`);
      });
      localStorage.setItem("statusFormulario", "Respondido");
      renderPerguntas(ficha.perguntasRespostas);
    } else {
      console.log("Nenhuma resposta encontrada, carregando perguntas em branco.");
      localStorage.setItem("statusFormulario", "Não Respondido");
      await fetchPerguntas();
    }
  } catch (error) {
    console.error("Erro ao preencher o formulário:", error);
  }
}

// Função para renderizar as perguntas dinamicamente e preencher as respostas, caso existam
function renderPerguntas(perguntasRespostas) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = ""; // Limpar o conteúdo atual

  perguntasRespostas.forEach((perguntaResposta) => {
    const formGroup = document.createElement("div");
    formGroup.classList.add("form-group");
    formGroup.style.marginBottom = "20px";

    const label = document.createElement("label");
    label.textContent = perguntaResposta.pergunta;
    label.style.fontWeight = "bold";
    formGroup.appendChild(label);

    let inputElement = null;
    const resposta = perguntaResposta.resposta;
    const idPergunta = perguntaResposta.idPergunta;

    if (!idPergunta) {
      console.warn("ID da pergunta está undefined para a pergunta:", perguntaResposta.pergunta);
    }

    console.log("Renderizando pergunta:", {
      idPergunta: idPergunta,
      pergunta: perguntaResposta.pergunta,
      tipo: perguntaResposta.perguntaTipo,
      resposta: resposta,
    });

    // Renderizar o tipo de input correto
    if (perguntaResposta.perguntaTipo === "Input") {
      inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.name = `pergunta_${idPergunta}`;
      inputElement.value = resposta || "";
      inputElement.required = true;
      inputElement.style.marginTop = "10px";
      inputElement.style.display = "block";
      inputElement.style.width = "95%";
    } else if (perguntaResposta.perguntaTipo === "Check Box") {
      inputElement = document.createElement("input");
      inputElement.type = "checkbox";
      inputElement.name = `pergunta_${idPergunta}`;
      inputElement.checked = resposta === "Sim";
      inputElement.style.marginTop = "10px";
    } else if (perguntaResposta.perguntaTipo === "Select") {
      inputElement = document.createElement("select");
      inputElement.name = `pergunta_${idPergunta}`;
      inputElement.required = true;
      inputElement.style.marginTop = "10px";

      const optionSim = document.createElement("option");
      optionSim.value = "Sim";
      optionSim.textContent = "Sim";
      optionSim.selected = resposta === "Sim";

      const optionNao = document.createElement("option");
      optionNao.value = "Não";
      optionNao.textContent = "Não";
      optionNao.selected = resposta === "Não";

      inputElement.appendChild(optionSim);
      inputElement.appendChild(optionNao);
    }

    if (inputElement) {
      formGroup.appendChild(inputElement);
    }
    contentDiv.appendChild(formGroup);
  });
}

// Função para buscar perguntas em branco ao carregar a página
async function fetchPerguntas() {
  try {
    const response = await fetch("http://localhost:8080/api/perguntas");
    if (response.status === 204) {
      showNotification("Nenhuma pergunta encontrada.", true);
      return;
    }

    const perguntas = await response.json();
    console.log("Perguntas carregadas:", perguntas);

    renderPerguntas(
      perguntas.map((pergunta) => ({
        pergunta: pergunta.pergunta,
        perguntaTipo: pergunta.tipo,
        idPergunta: pergunta.idPergunta,
        resposta: "",
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("submit-button");
  const modalPrimeiraAnamnese = document.getElementById("modalPrimeiraAnamnese");
  const modalConfirmacaoAnamnese = document.getElementById("modalConfirmacaoAnamnese");
  const confirmarEnvioPrimeira = document.getElementById("confirmarEnvioPrimeiraAnamnese");
  const cancelarEnvioPrimeira = document.getElementById("cancelarEnvioPrimeiraAnamnese");
  const confirmarEnvio = document.getElementById("confirmarEnvioAnamnese");
  const cancelarEnvio = document.getElementById("cancelarEnvioAnamnese");

  if (!submitButton) {
    console.error("Botão de envio não encontrado.");
    return;
  }

  submitButton.addEventListener("click", function () {
    const statusFormulario = localStorage.getItem("statusFormulario");
    
    if (statusFormulario === "Respondido") {
      modalConfirmacaoAnamnese.style.display = "flex";
    } else {
      modalPrimeiraAnamnese.style.display = "flex";
    }
  });

  // Modal da primeira anamnese
  confirmarEnvioPrimeira.addEventListener("click", function () {
    modalPrimeiraAnamnese.style.display = "none";
    submitForm();
  });

  cancelarEnvioPrimeira.addEventListener("click", function () {
    modalPrimeiraAnamnese.style.display = "none";
  });

  // Modal de confirmação de alteração
  confirmarEnvio.addEventListener("click", function () {
    modalConfirmacaoAnamnese.style.display = "none";
    submitForm();
  });

  cancelarEnvio.addEventListener("click", function () {
    modalConfirmacaoAnamnese.style.display = "none";
  });
});

// Função para enviar o formulário com as respostas preenchidas
async function submitForm() {
  const idUsuario = localStorage.getItem("idUsuario");
  if (!idUsuario) {
    showNotification("Usuário não está logado.", true);
    return;
  }

  const statusFormulario = localStorage.getItem("statusFormulario");
  let formData;
  let method;
  let url;

  if (statusFormulario === "Respondido") {
    formData = { perguntasRespostas: [] };
    method = "PATCH";
    url = `http://localhost:8080/api/ficha-anamnese/${idUsuario}`;
  } else {
    formData = {
      fichaAnamnese: parseInt(idUsuario, 10),
      usuario: parseInt(idUsuario, 10),
      respostas: [],
    };
    method = "POST";
    url = "http://localhost:8080/api/respostas";
  }

  document.querySelectorAll("input, select").forEach((input) => {
    const perguntaIdStr = input.name.split("_")[1];
    const perguntaId = parseInt(perguntaIdStr, 10);

    if (isNaN(perguntaId)) {
      console.warn("idPergunta inválido encontrado:", perguntaIdStr);
      return;
    }

    let resposta = input.type === "checkbox" ? (input.checked ? "Sim" : "Não") : input.value;

    if (resposta.trim() !== "") {
      if (method === "PATCH") {
        formData.perguntasRespostas.push({ idPergunta: perguntaId, resposta: resposta });
      } else {
        formData.respostas.push({ resposta: resposta, pergunta: perguntaId });
      }
      console.log("Adicionando resposta ao formData:", { idPergunta: perguntaId, resposta: resposta });
    }
  });

  console.log("formData final (antes do envio):", JSON.stringify(formData, null, 2));

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      showNotification("Respostas enviadas!");
      setTimeout(() => location.reload(), 2000);
    } else {
      console.error("Erro na resposta do servidor. Status:", response.status);
      showNotification("Erro ao enviar respostas!", true);
    }
  } catch (error) {
    console.error("Erro no envio das respostas:", error);
  }
}


// Carrega o formulário ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  const idUsuario = localStorage.getItem("idUsuario");
  preencherFormularioComRespostas(idUsuario);
});

// Aumentar e diminuir a fonte
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
