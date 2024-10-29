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
    console.log("Ficha recebida:", ficha);

    if (ficha.perguntasRespostas && ficha.perguntasRespostas.length > 0) {
      // Verifique se `idPergunta` está presente em cada objeto
      ficha.perguntasRespostas.forEach((item, index) => {
        console.log(
          `Pergunta ${index + 1} - ID: ${item.idPergunta}, Tipo: ${
            item.perguntaTipo
          }`
        );
      });

      localStorage.setItem("statusFormulario", "Respondido");
      renderPerguntas(ficha.perguntasRespostas); // Renderiza perguntas e respostas preenchidas
    } else {
      console.log(
        "Nenhuma resposta encontrada, carregando perguntas em branco."
      );
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

    // Verificar se o ID da pergunta está presente
    if (!idPergunta) {
      console.warn(
        "ID da pergunta está undefined para a pergunta:",
        perguntaResposta.pergunta
      );
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
    console.log("Perguntas carregadas:", perguntas);

    renderPerguntas(
      perguntas.map((pergunta) => ({
        pergunta: pergunta.pergunta,
        perguntaTipo: pergunta.tipo,
        idPergunta: pergunta.idPergunta, // Certifique-se de que `idPergunta` é capturado aqui
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

  const formData = {
    fichaAnamnese: parseInt(idUsuario, 10),
    usuario: parseInt(idUsuario, 10),
    respostas: [], // Respostas no formato esperado pelo backend
  };

  console.log("formData inicial:", formData);

  // Preenche as respostas do formulário
  document.querySelectorAll("input, select").forEach((input) => {
    const perguntaIdStr = input.name.split("_")[1];
    const perguntaId = parseInt(perguntaIdStr, 10);

    if (isNaN(perguntaId)) {
      console.warn("idPergunta inválido encontrado:", perguntaIdStr);
      return;
    }

    let resposta;
    if (input.type === "checkbox") {
      resposta = input.checked ? "Sim" : "Não";
    } else {
      resposta = input.value;
    }

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

  console.log(
    "formData final (antes do envio):",
    JSON.stringify(formData, null, 2)
  );

  try {
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
  preencherFormularioComRespostas(idUsuario);
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
