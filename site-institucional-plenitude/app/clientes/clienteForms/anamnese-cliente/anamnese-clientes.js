document.addEventListener("DOMContentLoaded", function () {
  // Obtém o idUsuario da URL
  const params = new URLSearchParams(window.location.search);
  const idUsuario = params.get("idUsuario");
  const clienteNome = localStorage.getItem("clienteNome");

  if (!idUsuario) {
    console.error("ID do usuário não encontrado na URL.");
    return;
  }

  if (clienteNome) {
    document.querySelector(
      "header h1"
    ).textContent = `Mais informações de: ${clienteNome}`;
  }

  // Função para buscar e exibir perguntas e respostas
  function carregarPerguntasRespostas() {
    fetch(
      `http://localhost:8080/api/ficha-anamnese/filtro?idUsuario=${idUsuario}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao buscar fichas de anamnese.");
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          const perguntasRespostasContainer = document.createElement("div");
          perguntasRespostasContainer.classList.add(
            "perguntas-respostas-container"
          );

          // Agrupar as perguntas e respostas em conjuntos de três
          let row;
          data[0].perguntasRespostas.forEach((item, index) => {
            if (index % 3 === 0) {
              row = document.createElement("div");
              row.classList.add("perguntas-respostas-row");
              perguntasRespostasContainer.appendChild(row);
            }

            const perguntaRespostaDiv = document.createElement("div");
            perguntaRespostaDiv.classList.add("pergunta-resposta");

            perguntaRespostaDiv.innerHTML = `
              <p><strong>Pergunta:</strong> ${item.pergunta}</p>
              <p><strong>Resposta:</strong> ${item.resposta}</p>
            `;

            row.appendChild(perguntaRespostaDiv);
          });

          document.querySelector(".actions").after(perguntasRespostasContainer);
        } else {
          console.log("Nenhuma ficha de anamnese encontrada para o usuário.");
        }
      })
      .catch((error) => console.error(error));
  }

  carregarPerguntasRespostas();
});

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idUsuario = params.get("idUsuario");

  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }

  document.getElementById("dadosBtn").addEventListener("click", function () {
    // Redireciona para a página de edição de cliente com o idUsuario na URL
    window.location.href = `../editar-cliente/editar-cliente.html?idUsuario=${idUsuario}`;
  });

  document
    .getElementById("agendamentoBtn")
    .addEventListener("click", function () {
      // Redireciona para a página de agendamentos com o idUsuario na URL
      window.location.href = `../agendamentos-cliente/agendamento-clientes.html?idUsuario=${idUsuario}`;
    });
    new window.VLibras.Widget('https://vlibras.gov.br/app');
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

// Carrega a imagem automaticamente quando a página termina de carregar
window.onload = carregarImagem2;