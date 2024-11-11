// URL da API que retorna a lista de usuários
const apiUrlUsuarios = "http://localhost:8080/usuarios";

// URL da API que retorna as fichas de anamnese com base no nome do usuário
const apiUrlFichas = "http://localhost:8080/api/ficha-anamnese/filtro¢¢¬²";

// Função para preencher o select com os nomes dos usuários
async function carregarUsuarios() {
  try {
    const response = await fetch(apiUrlUsuarios);
    if (response.ok) {
      const usuarios = await response.json();

      // Seleciona o elemento select
      const selectNome = document.getElementById("selectNome");

      // Limpa qualquer opção que já esteja no select
      selectNome.innerHTML = "";

      // Adiciona uma opção vazia
      const optionVazia = document.createElement("option");
      optionVazia.value = "";
      optionVazia.textContent = "Selecione um Nome";
      selectNome.appendChild(optionVazia);

      // Adiciona os nomes dos usuários ao select
      usuarios.forEach((usuario) => {
        const option = document.createElement("option");
        option.value = usuario.nome; // Usaremos o nome como filtro na próxima requisição
        option.textContent = usuario.nome;
        selectNome.appendChild(option);
      });

      // Adicionar um evento de mudança (change) ao select
      selectNome.addEventListener("change", (event) => {
        const nomeSelecionado = event.target.value;
        if (nomeSelecionado) {
          buscarFichaAnamnesePorNome(nomeSelecionado);
          document.getElementById("mainContent").style.display = "block"; // Exibe o main-content quando um usuário é selecionado
        } else {
          document.getElementById("mainContent").style.display = "none"; // Esconde o main-content se nenhum usuário for selecionado
        }
      });
    } else {
      console.error("Erro ao carregar usuários:", response.statusText);
    }
  } catch (error) {
    console.error("Erro ao carregar usuários:", error);
  }
}

// Função para buscar as fichas de anamnese com base no nome do usuário
async function buscarFichaAnamnesePorNome(nomeUsuario) {
  try {
    const response = await fetch(`${apiUrlFichas}?nomeUsuario=${nomeUsuario}`);
    if (response.ok) {
      const fichas = await response.json();

      // Seleciona o elemento onde as perguntas e respostas serão exibidas
      const perguntasRespostasUl =
        document.getElementById("perguntasRespostas");
      perguntasRespostasUl.innerHTML = ""; // Limpa os dados anteriores

      // Preenche os campos de CPF e Data de Preenchimento
      if (fichas.length > 0) {
        const ficha = fichas[0]; // Pegue a primeira ficha (ou ajuste conforme necessário)

        // Preenche o campo de CPF
        const inputCPF = document.getElementById("inputCPF");
        inputCPF.value = ficha.usuarioCpf;

        // Preenche o campo de Data de Preenchimento
        const inputPreenchimento =
          document.getElementById("inputPreenchimento");
        const dataPreenchimento = new Date(ficha.dataPreenchimento);
        inputPreenchimento.value = dataPreenchimento
          .toISOString()
          .substring(0, 10); // Formata para yyyy-MM-dd

        // Adiciona perguntas e respostas no HTML
        let rowDiv = document.createElement("div");
        rowDiv.className = "row"; // Adiciona a classe para a row

        ficha.perguntasRespostas.forEach((perguntaResposta, index) => {
          const formGroupDiv = document.createElement("div");
          formGroupDiv.className = "form-group"; // Define a div com 33% de largura

          const label = document.createElement("label");
          label.setAttribute("for", perguntaResposta.pergunta);
          label.textContent = perguntaResposta.pergunta;

          const inputContentDiv = document.createElement("div");
          inputContentDiv.className = "input-content";

          // Aqui exibimos a resposta como texto
          const respostaDiv = document.createElement("div");
          respostaDiv.className = "resposta-text";
          respostaDiv.innerHTML = `R: ${perguntaResposta.resposta}`; // Exibe o prefixo "R:" antes da resposta

          // Adiciona ícones de check, X e botão amarelo
          const checkIcon = document.createElement("i");
          checkIcon.className = "fas fa-check-circle"; // Ícone de check
          checkIcon.style.color = "green";
          checkIcon.style.cursor = "pointer";
          checkIcon.onclick = function () {
            // Alterna a borda verde
            if (respostaDiv.style.borderColor === "green") {
              respostaDiv.style.borderColor = "transparent"; // Remove a borda
              respostaDiv.style.borderWidth = "0px"; // Remove a largura da borda
            } else {
              respostaDiv.style.borderColor = "green"; // Adiciona borda verde
              respostaDiv.style.borderWidth = "3px"; // Define a largura da borda
              respostaDiv.style.borderStyle = "solid"; // Define a borda como sólida
              respostaDiv.style.borderRadius = "10px"; // Define a borda arredondada
            }
          };

          const xIcon = document.createElement("i");
          xIcon.className = "fas fa-times-circle"; // Ícone de X
          xIcon.style.color = "red";
          xIcon.style.cursor = "pointer";
          xIcon.onclick = function () {
            // Alterna a borda vermelha
            if (respostaDiv.style.borderColor === "red") {
              respostaDiv.style.borderColor = "transparent"; // Remove a borda
              respostaDiv.style.borderWidth = "0px"; // Remove a largura da borda
            } else {
              respostaDiv.style.borderColor = "red"; // Adiciona borda vermelha
              respostaDiv.style.borderWidth = "3px"; // Define a largura da borda
              respostaDiv.style.borderStyle = "solid"; // Define a borda como sólida
              respostaDiv.style.borderRadius = "10px"; // Define a borda arredondada
            }
          };

          const yellowIcon = document.createElement("i");
          yellowIcon.className = "fas fa-exclamation-circle"; // Ícone de alerta (amarelo)
          yellowIcon.style.color = "orange";
          yellowIcon.style.cursor = "pointer";
          yellowIcon.onclick = function () {
            // Alterna a borda amarela
            if (respostaDiv.style.borderColor === "orange") {
              respostaDiv.style.borderColor = "transparent"; // Remove a borda
              respostaDiv.style.borderWidth = "0px"; // Remove a largura da borda
            } else {
              respostaDiv.style.borderColor = "orange"; // Adiciona borda amarela
              respostaDiv.style.borderWidth = "3px"; // Define a largura da borda
              respostaDiv.style.borderStyle = "solid"; // Define a borda como sólida
              respostaDiv.style.borderRadius = "10px"; // Define a borda arredondada
            }
          };

          // Adiciona o div de resposta e os ícones à div de conteúdo
          inputContentDiv.appendChild(respostaDiv);
          inputContentDiv.appendChild(checkIcon);
          inputContentDiv.appendChild(yellowIcon); // Adiciona o ícone amarelo
          inputContentDiv.appendChild(xIcon);

          formGroupDiv.appendChild(label);
          formGroupDiv.appendChild(inputContentDiv);

          rowDiv.appendChild(formGroupDiv);

          // Após 3 perguntas adicionadas, crie uma nova row
          if ((index + 1) % 3 === 0) {
            perguntasRespostasUl.appendChild(rowDiv);
            rowDiv = document.createElement("div");
            rowDiv.className = "row"; // Cria uma nova row
          }
        });

        // Caso tenha menos de 3 perguntas na última row, ainda adiciona a row
        if (rowDiv.children.length > 0) {
          perguntasRespostasUl.appendChild(rowDiv);
        }
      } else {
        perguntasRespostasUl.innerHTML =
          "<li>Nenhuma ficha encontrada para este usuário.</li>";
      }
    } else {
      perguntasRespostasUl.innerHTML =
        "<li>Nenhuma ficha encontrada para este usuário.</li>";
    }
  } catch (error) {
    console.error("Erro ao buscar fichas de anamnese:", error);
  }
}

// Chama a função para carregar os usuários quando a página é carregada
window.onload = carregarUsuarios;

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

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
