// Função para buscar e preencher o formulário com dados já respondidos
async function preencherFormularioComRespostas(idUsuario) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/ficha-anamnese/${idUsuario}`
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar respostas preenchidas");
    }

    const ficha = await response.json();

    if (ficha.perguntasRespostas && ficha.perguntasRespostas.length > 0) {
      // Se houver respostas, salvar o status "Respondido" no localStorage
      localStorage.setItem("statusFormulario", "Respondido");
      renderPerguntas(ficha.perguntasRespostas); // Renderiza perguntas e respostas preenchidas
    } else {
      // Se não houver respostas, carrega perguntas em branco
      await fetchPerguntas();
    }
  } catch (error) {
    console.error("Erro ao preencher o formulário:", error);
  }
}

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

    // Verificar os dados da pergunta e da resposta
    console.log("Renderizando pergunta:", {
      idPergunta: idPergunta,
      pergunta: perguntaResposta.pergunta,
      tipo: perguntaResposta.perguntaTipo,
      resposta: resposta,
    });

    if (perguntaResposta.perguntaTipo === "Input") {
      inputElement = document.createElement("input");
      inputElement.type = "text";
      inputElement.name = `pergunta_${idPergunta}`;
      inputElement.value = resposta || "";
      inputElement.required = true;
      inputElement.style.marginTop = "10px";
      inputElement.style.display = "block";
      inputElement.style.width = "100%";
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
      alert("Nenhuma pergunta encontrada.");
      return;
    }

    const perguntas = await response.json();
    renderPerguntas(
      perguntas.map((pergunta) => ({
        pergunta: pergunta.pergunta,
        perguntaTipo: pergunta.tipo,
        perguntaId: pergunta.idPergunta,
        resposta: "", // Campo vazio para perguntas ainda não respondidas
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error);
  }
}

// Função para enviar o formulário com as respostas preenchidas
async function submitForm() {
  const idUsuario = localStorage.getItem("idUsuario");
  if (!idUsuario) {
    alert("Usuário não está logado.");
    return;
  }

  const statusFormulario = localStorage.getItem("statusFormulario");

  // Define o formData para o POST em /api/respostas e PATCH em /api/ficha-anamnese/{idUsuario}
  const formData = {
    fichaAnamnese: parseInt(idUsuario, 10), // Usando o idUsuario como o id da ficha de anamnese
    usuario: parseInt(idUsuario, 10),
    respostas: [], // Respostas no formato esperado pelo backend
  };

  console.log("formData inicial:", formData);

  // Preenche as respostas do formulário
  document.querySelectorAll("input, select").forEach((input) => {
    // Verifica o ID da pergunta no nome do input (ex: pergunta_1)
    const perguntaIdStr = input.name.split("_")[1];
    const perguntaId = parseInt(perguntaIdStr, 10);

    if (isNaN(perguntaId)) {
      console.warn("idPergunta inválido encontrado:", perguntaIdStr);
      return; // Ignora se o id da pergunta não estiver presente
    }

    let resposta;
    if (input.type === "checkbox") {
      resposta = input.checked ? "Sim" : "Não";
    } else {
      resposta = input.value;
    }

    // Adiciona resposta se houver conteúdo válido
    if (resposta.trim() !== "") {
      formData.respostas.push({
        resposta: resposta,
        pergunta: perguntaId,
      });
      console.log("Adicionando resposta ao formData:", {
        idPergunta: perguntaId,
        resposta: resposta,
      });
    }
  });

  // Verifica o formData final antes do envio
  console.log(
    "formData final (antes do envio):",
    JSON.stringify(formData, null, 2)
  );

  try {
    // Define o método e a URL com base no status do formulário
    const method = statusFormulario === "Respondido" ? "PATCH" : "POST";
    const url =
      method === "PATCH"
        ? `http://localhost:8080/api/ficha-anamnese/${formData.fichaAnamnese}`
        : "http://localhost:8080/api/respostas";

    console.log(`Enviando requisição para URL: ${url}, com método: ${method}`);

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Respostas enviadas com sucesso!");
    } else {
      console.error("Erro na resposta do servidor. Status:", response.status);
      alert("Erro ao enviar respostas. Verifique os dados e tente novamente.");
    }
  } catch (error) {
    console.error("Erro no envio das respostas:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const idUsuario = localStorage.getItem("idUsuario");

  // Carrega a ficha pelo ID ao carregar a página e define o status de formulário
  preencherFormularioComRespostas(idUsuario);

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
});

document.addEventListener("DOMContentLoaded", function () {
  const idUsuario = localStorage.getItem("idUsuario");

  // Carrega a ficha pelo ID ao carregar a página e define o status de formulário
  preencherFormularioComRespostas(idUsuario);

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
});
