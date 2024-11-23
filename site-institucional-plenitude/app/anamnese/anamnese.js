document.addEventListener("DOMContentLoaded", function () {
  let perguntaIdGlobal = null; // Variável global para armazenar o ID da pergunta

  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

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

function showForm() {
  const modal = document.getElementById("questionModal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("questionModal");
  modal.style.display = "none";
}

function showForm2() {
  const modal2 = document.getElementById("modalDesativadas");
  modal2.style.display = "block";
}

function showEditForm(perguntaId) {
  fetch(`${baseUrl}/api/perguntas/${perguntaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        showNotification("Erro ao buscar pergunta.", true); // Notificação de erro
        throw new Error("Erro ao buscar pergunta.");
      }
    })
    .then((data) => {
      document.getElementById("editDescricaoPergunta").value = data.pergunta;
      document.getElementById("editTipoPergunta").value = data.tipo;
      document
        .getElementById("edit-save-button")
        .setAttribute("data-id", perguntaId);
      const modal = document.getElementById("editQuestionModal");
      modal.style.display = "block";
    })
    .catch((error) => {
      console.error("Erro ao buscar pergunta:", error);
    });
}

function atualizarPergunta() {
  const perguntaId = document
    .getElementById("edit-save-button")
    .getAttribute("data-id");
  const descricaoPergunta = document.getElementById(
    "editDescricaoPergunta"
  ).value;
  const tipoPergunta = document.getElementById("editTipoPergunta").value;

  const perguntaData = {
    pergunta: descricaoPergunta,
    tipo: tipoPergunta,
    ativa: true,
  };

  fetch(`${baseUrl}/api/perguntas/${perguntaId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(perguntaData),
  })
    .then((response) => {
      if (response.ok) {
        showNotification("Pergunta atualizada com sucesso!"); // Notificação de sucesso
        return response.json();
      } else {
        showNotification("Erro ao atualizar pergunta.", true); // Notificação de erro
        throw new Error("Erro ao atualizar pergunta.");
      }
    })
    .then((data) => {
      closeEditModal();
      listarTodasPerguntasAtivas();
    })
    .catch((error) => {
      showNotification("Erro ao atualizar pergunta. Tente novamente.", true); // Notificação de erro
      console.error("Erro ao atualizar pergunta:", error);
    });
}

function closeEditModal() {
  const modal = document.getElementById("editQuestionModal");
  modal.style.display = "none";
}

function closeModal2() {
  const modal2 = document.getElementById("modalDesativadas");
  modal2.style.display = "none";
}

function showForm3(perguntaId, textoPergunta, tipoPergunta) {
  perguntaIdGlobal = perguntaId; // Armazena o ID da pergunta globalmente

  // Mapeia o tipo da pergunta para o texto desejado
  const tipoFormatado = mapearTipoPergunta(tipoPergunta);

  // Preenche o modal com o texto da pergunta e o tipo formatado
  document.getElementById(
    "perguntaTexto"
  ).textContent = `Pergunta: ${textoPergunta}`;
  document.getElementById(
    "perguntaTipo"
  ).textContent = `Tipo: ${tipoFormatado}`;

  const modal3 = document.getElementById("modalDeletar");
  modal3.style.display = "block";
}

function closeModal3() {
  const modal3 = document.getElementById("modalDeletar");
  modal3.style.display = "none";
}

// URL base da API
const baseUrl = "http://localhost:8080";

function criarPergunta() {
  const descricaoPergunta = document.getElementById("descricaoPergunta").value;
  const tipoPergunta = document.getElementById("tipoPergunta").value;

  const perguntaData = {
    pergunta: descricaoPergunta,
    ativa: true,
    tipo: tipoPergunta,
  };

  fetch(`${baseUrl}/api/perguntas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(perguntaData),
  })
    .then((response) => {
      if (response.ok) {
        showNotification("Pergunta cadastrada com sucesso!"); // Notificação de sucesso
        return response.json();
      } else {
        return response.json().then((data) => {
          showNotification(data.message || "Erro ao cadastrar pergunta", true); // Notificação de erro
          throw new Error(data.message || "Erro ao cadastrar pergunta");
        });
      }
    })
    .then((data) => {
      listarTodasPerguntasAtivas();
    })
    .catch((error) => {
      showNotification("Erro ao cadastrar pergunta. Tente novamente", true); // Notificação de erro
      console.error("Erro ao cadastrar pergunta:", error);
    });
}

function obterPrimeirasPerguntasAtivas() {
  return fetch(`${baseUrl}/api/perguntas/ativas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erro ao obter as primeiras perguntas ativas:", error);
      throw error;
    });
}

function listarTodasPerguntasAtivas() {
  obterPrimeirasPerguntasAtivas()
    .then((perguntas) => {
      if (perguntas.length === 0) {
        console.log("Nenhuma pergunta ativa encontrada");
        return;
      }

      const contentBox = document.querySelector(".content-box");
      contentBox.innerHTML = ""; // Limpa o conteúdo anterior

      let row;
      perguntas.forEach((pergunta, index) => {
        if (index % 3 === 0) {
          row = document.createElement("div");
          row.classList.add("row");
          contentBox.appendChild(row);
        }

        const formGroup = document.createElement("div");
        formGroup.classList.add("form-group", "form-input");

        const labelElement = document.createElement("label");
        labelElement.setAttribute("for", `idResposta${index + 1}`);
        labelElement.id = `pergunta${index + 1}Label`;
        labelElement.textContent = pergunta.pergunta;

        const inputContent = document.createElement("div");
        inputContent.classList.add("input-content");

        let inputElement;
        switch (pergunta.tipo) {
          case "Input":
            inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.id = `idResposta${index + 1}`;
            inputElement.name = `resposta${index + 1}`;
            inputElement.placeholder = "Digite sua resposta aqui...";
            break;
          case "Select":
            inputElement = document.createElement("select");
            inputElement.id = `idResposta${index + 1}`;
            inputElement.name = `resposta${index + 1}`;
            const optionYes = document.createElement("option");
            optionYes.value = "Sim";
            optionYes.textContent = "Sim";
            const optionNo = document.createElement("option");
            optionNo.value = "Não";
            optionNo.textContent = "Não";
            inputElement.appendChild(optionYes);
            inputElement.appendChild(optionNo);
            break;
          default:
            inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.id = `idResposta${index + 1}`;
            inputElement.name = `resposta${index + 1}`;
            inputElement.placeholder = "Digite sua resposta aqui...";
        }

        function addTooltip(element, text) {
          const tooltip = document.createElement("span");
          tooltip.classList.add("tooltip-40");
          tooltip.innerText = text;
          element.appendChild(tooltip);

          element.addEventListener("mouseover", () => {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
          });

          element.addEventListener("mouseout", () => {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
          });
        }

        const editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.id = `openStatusModalBtn${index + 2}`;
        editButton.innerHTML =
          '<img src="../../assets/icons/pen.png" alt="Editar" />';
        addTooltip(editButton, "Editar");
        editButton.onclick = function () {
          showEditForm(pergunta.idPergunta);
        };

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.id = `openStatusModalBtn${index + 3}`;
        deleteButton.setAttribute(
          "onclick",
          `showForm3(${pergunta.idPergunta}, "${pergunta.pergunta}", "${pergunta.tipo}")`
        );
        deleteButton.innerHTML =
          '<img src="../../assets/icons/excluir.png" alt="Excluir">';
        addTooltip(deleteButton, "Excluir");

        inputContent.appendChild(inputElement);
        inputContent.appendChild(editButton);
        inputContent.appendChild(deleteButton);

        formGroup.appendChild(labelElement);
        formGroup.appendChild(inputContent);

        row.appendChild(formGroup);
      });
    })
    .catch((error) => {
      console.error("Erro ao listar perguntas ativas:", error);
    });
}


document.addEventListener("DOMContentLoaded", () => {
  listarTodasPerguntasAtivas();
});

function getDesativadas() {
  fetch(`${baseUrl}/api/perguntas/desativadas`)
    .then((response) => {
      if (response.status === 204) {
        // Caso venha um 204, exibe a mensagem que não há perguntas desativadas
        document.getElementById("tabelaDesativadas").innerHTML = `
          <tr>
            <td colspan="3" style="text-align: center;">Nenhuma pergunta desativada encontrada</td>
          </tr>
        `;
        return []; // Retorna um array vazio
      }
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      return response.json();
    })
    .then((perguntasDesativadas) => {
      preencherTabelasDesativadas(perguntasDesativadas); // Preenche a tabela com os dados
    })
    .catch((error) => {
      console.error("Erro ao listar perguntas desativadas:", error);
    });
}

function preencherTabelasDesativadas(perguntasDesativadas) {
  const tabelaDesativadas = document.getElementById("tabelaDesativadas");

  // Limpa o conteúdo anterior
  tabelaDesativadas.innerHTML = "";

  // Verifica se há perguntas desativadas
  if (perguntasDesativadas && perguntasDesativadas.length > 0) {
    perguntasDesativadas.forEach((pergunta) => {
      const novaLinha = document.createElement("tr");

      // Coluna 1: Pergunta
      const perguntaCelula = document.createElement("td");
      perguntaCelula.textContent = pergunta.pergunta;
      novaLinha.appendChild(perguntaCelula);

      // Coluna 2: Tipo da pergunta (onde será criado o nome e o input, select, etc.)
      const tipoCelula = document.createElement("td");

      let tipoElemento;
      const tipoFormatado = mapearTipoPergunta(pergunta.tipo); // Mapeia o tipo da pergunta

      switch (pergunta.tipo) {
        case "Input":
          tipoElemento = document.createElement("div");
          tipoElemento.innerHTML = `
          <div style="display: flex; flex-direction: row;">
            <span>${tipoFormatado}: </span>
            <input type="text" style="margin-left: 10px; width: 50px;" />
          </div>
          `;
          break;
        case "Select":
          tipoElemento = document.createElement("div");
          tipoElemento.innerHTML = `
          <div style="display: flex; flex-direction: row;">
            <span>${tipoFormatado}: </span>
            <select style="margin-left: 10px; width: 50px;">
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          `;
          break;
        // case "Check Box":
        //   tipoElemento = document.createElement("div");
        //   tipoElemento.innerHTML = `
        //   <div style="display: flex; flex-direction: row;">
        //     <span>${tipoFormatado}: </span>
        //     <input type="checkbox"/>
        //   </div>
        //   `;
        //   break;
        default:
          tipoElemento = document.createElement("span");
          tipoElemento.textContent = "Tipo não suportado";
      }

      tipoCelula.appendChild(tipoElemento);
      novaLinha.appendChild(tipoCelula);

      // Coluna 3: Ações (Ativar e Excluir)
      const acaoCelula = document.createElement("td");

      // Cria uma div para os botões e aplica o display flex
      const acoesDiv = document.createElement("div");
      acoesDiv.style.display = "flex";
      acoesDiv.style.flexDirection = "row";
      acoesDiv.style.gap = "10px"; // Espaçamento entre os botões

      // Botão de ativar
      const ativarButton = document.createElement("button");
      ativarButton.classList.add("btn", "btn-ativar");
      ativarButton.textContent = "Ativar";
      ativarButton.onclick = function () {
        ativarPergunta(pergunta.idPergunta); // Chama a função de ativar passando o ID da pergunta
      };
      acoesDiv.appendChild(ativarButton);

      // Botão de excluir
      const excluirButton = document.createElement("button");
      excluirButton.classList.add("btn", "btn-excluir");
      excluirButton.textContent = "Excluir";
      excluirButton.onclick = function () {
        showExcluirModal(pergunta.idPergunta, pergunta.pergunta, pergunta.tipo); // Mostra o modal de exclusão
      };
      acoesDiv.appendChild(excluirButton);

      // Adiciona a div com os botões na célula
      acaoCelula.appendChild(acoesDiv);

      novaLinha.appendChild(acaoCelula);

      // Adiciona a nova linha na tabela
      tabelaDesativadas.appendChild(novaLinha);
    });
  } else {
    // Caso não haja perguntas desativadas
    const linhaVazia = document.createElement("tr");
    const celulaVazia = document.createElement("td");
    celulaVazia.colSpan = 3;
    celulaVazia.textContent = "Nenhuma pergunta desativada encontrada";
    linhaVazia.appendChild(celulaVazia);
    tabelaDesativadas.appendChild(linhaVazia);
  }
}

function desativarPergunta(perguntaId) {
  fetch(`${baseUrl}/api/perguntas/desativar/${perguntaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        showNotification("Pergunta desativada com sucesso!"); // Notificação de sucesso
        listarTodasPerguntasAtivas();
      } else if (response.status === 404) {
        showNotification("Pergunta não encontrada", true); // Notificação de erro
      } else {
        throw new Error("Erro ao desativar a pergunta.");
      }
    })
    .catch((error) => {
      showNotification("Erro ao desativar pergunta. Tente novamente", true); // Notificação de erro
      console.error("Erro ao desativar pergunta:", error);
    });
}

function mostrarExemplo() {
  const tipoPergunta = document.getElementById("tipoPergunta").value;
  const exemploDiv = document.getElementById("exemploTipoPergunta");

  // Limpa o conteúdo anterior
  exemploDiv.innerHTML = "";

  // Cria a pergunta de exemplo
  const perguntaExemplo = document.createElement("p");
  perguntaExemplo.textContent = "Exemplo de Pergunta:";

  // Cria o contêiner para a resposta de exemplo
  const respostaExemploContainer = document.createElement("div");
  respostaExemploContainer.style.display = "flex";
  respostaExemploContainer.style.alignItems = "center";
  respostaExemploContainer.style.gap = "10px";

  // Cria o texto "Exemplo de resposta:"
  const textoExemplo = document.createElement("span");
  textoExemplo.textContent = "Exemplo de resposta:";

  // Cria o elemento de exemplo com base no tipo de pergunta
  let exemploElemento;
  switch (tipoPergunta) {
    case "Input":
      exemploElemento = document.createElement("input");
      exemploElemento.type = "text";
      exemploElemento.placeholder = "Digite sua resposta aqui...";
      break;
    case "Select":
      exemploElemento = document.createElement("select");
      const optionYes = document.createElement("option");
      optionYes.value = "Sim";
      optionYes.textContent = "Sim";
      const optionNo = document.createElement("option");
      optionNo.value = "Não";
      optionNo.textContent = "Não";
      exemploElemento.appendChild(optionYes);
      exemploElemento.appendChild(optionNo);
      break;
    // case "Check Box":
    //   exemploElemento = document.createElement("input");
    //   exemploElemento.type = "checkbox";
    //   break;
    default:
      exemploElemento = document.createTextNode("");
  }

  // Adiciona os elementos ao contêiner de resposta de exemplo
  respostaExemploContainer.appendChild(textoExemplo);
  respostaExemploContainer.appendChild(exemploElemento);

  // Adiciona a pergunta de exemplo e o contêiner de resposta de exemplo ao div principal
  exemploDiv.appendChild(perguntaExemplo);
  exemploDiv.appendChild(respostaExemploContainer);
}

function mostrarExemploEditar() {
  const tipoPergunta = document.getElementById("editTipoPergunta").value;
  const exemploDiv = document.getElementById("exemploTipoPerguntaEditar");

  // Limpa o conteúdo anterior
  exemploDiv.innerHTML = "";

  // Cria a pergunta de exemplo
  const perguntaExemplo = document.createElement("p");
  perguntaExemplo.textContent = "Exemplo de Pergunta:";

  // Cria o contêiner para a resposta de exemplo
  const respostaExemploContainer = document.createElement("div");
  respostaExemploContainer.style.display = "flex";
  respostaExemploContainer.style.alignItems = "center";
  respostaExemploContainer.style.gap = "10px";

  // Cria o texto "Exemplo de resposta:"
  const textoExemplo = document.createElement("span");
  textoExemplo.textContent = "Exemplo de resposta:";

  // Cria o elemento de exemplo com base no tipo de pergunta
  let exemploElemento;
  switch (tipoPergunta) {
    case "Input":
      exemploElemento = document.createElement("input");
      exemploElemento.type = "text";
      exemploElemento.placeholder = "Digite sua resposta aqui...";
      break;
    case "Select":
      exemploElemento = document.createElement("select");
      const optionYes = document.createElement("option");
      optionYes.value = "Sim";
      optionYes.textContent = "Sim";
      const optionNo = document.createElement("option");
      optionNo.value = "Não";
      optionNo.textContent = "Não";
      exemploElemento.appendChild(optionYes);
      exemploElemento.appendChild(optionNo);
      break;
    // case "Check Box":
    //   exemploElemento = document.createElement("input");
    //   exemploElemento.type = "checkbox";
    //   break;
    default:
      exemploElemento = document.createTextNode("");
  }

  // Adiciona os elementos ao contêiner de resposta de exemplo
  respostaExemploContainer.appendChild(textoExemplo);
  respostaExemploContainer.appendChild(exemploElemento);

  // Adiciona a pergunta de exemplo e o contêiner de resposta de exemplo ao div principal
  exemploDiv.appendChild(perguntaExemplo);
  exemploDiv.appendChild(respostaExemploContainer);
}

document.addEventListener("DOMContentLoaded", () => {
  listarTodasPerguntasAtivas();
  mostrarExemplo(); // Chama a função para exibir o exemplo inicial
  new window.VLibras.Widget('https://vlibras.gov.br/app');
});

function ativarPergunta(perguntaId) {
  fetch(`${baseUrl}/api/perguntas/ativar/${perguntaId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        showNotification("Pergunta ativada com sucesso!"); // Notificação de sucesso
        getDesativadas();
        listarTodasPerguntasAtivas();
      } else if (response.status === 404) {
        showNotification("Pergunta não encontrada", true); // Notificação de erro
      } else {
        throw new Error("Erro ao ativar a pergunta.");
      }
    })
    .catch((error) => {
      showNotification("Erro ao ativar pergunta. Tente novamente", true); // Notificação de erro
      console.error("Erro ao ativar pergunta:", error);
    });
}

function excluirPergunta(perguntaId) {
  fetch(`${baseUrl}/api/perguntas/${perguntaId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        showNotification("Pergunta excluída com sucesso!"); // Notificação de sucesso
        getDesativadas();
      } else if (response.status === 404) {
        showNotification("Pergunta não encontrada", true); // Notificação de erro
      } else {
        throw new Error("Erro ao excluir a pergunta.");
      }
    })
    .catch((error) => {
      showNotification("Erro ao excluir pergunta. Tente novamente", true); // Notificação de erro
      console.error("Erro ao excluir pergunta:", error);
    });
}

function showExcluirModal(perguntaId, textoPergunta, tipoPergunta) {
  perguntaIdGlobal = perguntaId; // Armazena o ID da pergunta globalmente

  // Mapeia o tipo da pergunta para o texto desejado
  const tipoFormatado = mapearTipoPergunta(tipoPergunta);

  // Preenche o modal com o texto da pergunta e o tipo formatado
  document.getElementById(
    "perguntaExcluirTexto"
  ).textContent = `Pergunta: ${textoPergunta}`;
  document.getElementById(
    "perguntaExcluirTipo"
  ).textContent = `Tipo: ${tipoFormatado}`;

  const modalExcluir = document.getElementById("modalExcluir");
  modalExcluir.style.display = "block";
}

function confirmarExcluirPergunta() {
  excluirPergunta(perguntaIdGlobal);
  closeExcluirModal(); // Fecha o modal após confirmar a exclusão
}

function mapearTipoPergunta(tipo) {
  switch (tipo) {
    case "Input":
      return "Texto";
    case "Select":
      return "Seleção";
    // case "Check Box":
    //   return "Caixa de Seleção";
    default:
      return tipo; // Retorna o tipo original se não houver correspondência
  }
}

function closeExcluirModal() {
  const modalExcluir = document.getElementById("modalExcluir");
  modalExcluir.style.display = "none";
}

async function carregarImagem2() {
  const cpf = localStorage.getItem("cpf"); // Captura o valor do CPF a cada execução
  const perfilImage = document.getElementById("perfilImage");

  if (!cpf) {
      console.log("CPF não encontrado.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`, {
          method: "GET",
      });

      if (response.ok) {
          const blob = await response.blob(); // Recebe a imagem como Blob
          const imageUrl = URL.createObjectURL(blob); // Cria uma URL temporária para o Blob

          // Define a URL da imagem carregada como src do img
          perfilImage.src = imageUrl;
          perfilImage.alt = "Foto do usuário";
          perfilImage.style.width = "20vh";
          perfilImage.style.height = "20vh";
          perfilImage.style.borderRadius = "300px";
      } else {
          console.log("Imagem não encontrada para o CPF informado.");
      }
  } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
  }
}

window.onload = function () {
  carregarImagem2();
};


document.addEventListener("DOMContentLoaded", function () {
  const tooltips = document.querySelectorAll(
    ".tooltip2, .tooltip3, .tooltip4, .tooltip11"
  );

  tooltips.forEach((tooltip) => {
    const targetButton = tooltip.previousElementSibling;

    targetButton.addEventListener("mouseenter", () => {
      tooltip.style.visibility = "hidden"; // Oculta temporariamente para cálculo
      tooltip.style.display = "block"; // Exibe para cálculo
      positionTooltip(tooltip, targetButton);
      tooltip.style.visibility = "visible"; // Mostra após posicionamento
    });j

    targetButton.addEventListener("mouseleave", () => {
      tooltip.style.display = "none"; // Oculta quando sai do hover
    });

    window.addEventListener("resize", () => {
      if (tooltip.style.display === "block") {
        positionTooltip(tooltip, targetButton); // Recalcula posição em redimensionamento
      }
    });
  });

  function positionTooltip(tooltip, target) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Centraliza horizontalmente e posiciona acima do botão
    const topPosition = targetRect.top - tooltipRect.height - 4;
    const leftPosition =
      targetRect.left + targetRect.width / 0 - tooltipRect.width / 0;

    tooltip.style.top = `${topPosition + window.scrollY}px`;
    tooltip.style.left = `${leftPosition + window.scrollX}px`;
  }
});


function openFileSelector() {
  document.getElementById('fileInput').click();
}
