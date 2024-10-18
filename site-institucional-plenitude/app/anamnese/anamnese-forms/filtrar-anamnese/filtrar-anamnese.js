// URL da API que retorna a lista de usuários
const apiUrlUsuarios = "http://localhost:8080/usuarios";

// URL da API que retorna as fichas de anamnese com base no nome do usuário
const apiUrlFichas = "http://localhost:8080/api/ficha-anamnese/fichas-anamnese";

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

      // Adiciona perguntas e respostas no HTML
      if (fichas.length > 0) {
        fichas.forEach((ficha) => {
          ficha.perguntasRespostas.forEach((perguntaResposta) => {
            const formGroupDiv = document.createElement("div");
            formGroupDiv.className = "form-group form-input m"; // Adiciona a classe "m" aqui

            const label = document.createElement("label");
            label.setAttribute("for", perguntaResposta.pergunta);
            label.textContent = perguntaResposta.pergunta;

            const inputContentDiv = document.createElement("div");
            inputContentDiv.className = "input-content m";

            const input = document.createElement("input");
            input.type = "text";
            input.id = perguntaResposta.pergunta;
            input.name = perguntaResposta.pergunta;
            input.value = perguntaResposta.resposta;
            input.className = "resposta-input";

            inputContentDiv.appendChild(input);
            formGroupDiv.appendChild(label);
            formGroupDiv.appendChild(inputContentDiv);
            perguntasRespostasUl.appendChild(formGroupDiv);
          });
        });
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
