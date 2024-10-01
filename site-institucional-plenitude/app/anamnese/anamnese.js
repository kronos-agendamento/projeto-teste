document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});



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
  modal2.style.display = "block"

}

function closeModal2() {
  const modal2 = document.getElementById("modalDesativadas");
  modal2.style.display = "none";
}


// URL base da API
const baseUrl = "http://localhost:8080";

function criarPergunta() {
  // Captura o valor da descrição da pergunta
  const descricaoPergunta = document.getElementById("descricaoPergunta").value;

  // Estrutura dos dados que serão enviados
  const perguntaData = {
    pergunta: descricaoPergunta,
    ativa: true // Sempre true por padrão
  };


  // Faz a requisição POST para salvar a pergunta
  fetch(`${baseUrl}/api/perguntas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(perguntaData)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(data => {
          throw new Error(data.message || "Erro ao cadastrar pergunta");
        });
      }
    })
    .then(data => {
      // Exibe mensagem de sucesso
      document.getElementById("notification-message").textContent = "Pergunta cadastrada com sucesso!";
      console.log("Resposta da API:", data);
    })
    .catch(error => {
      // Exibe mensagem de erro
      console.error("Erro ao cadastrar pergunta:", error);
      document.getElementById("notification-message").textContent = "Erro ao cadastrar pergunta. Tente novamente";
    });
}



function getDesativadas() {

  fetch(`${baseUrl}/api/perguntas/desativadas`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }
        return response.json();
    })
    .then(perguntasDesativadas => {
        console.log("Dados recebidos:", perguntasDesativadas);  // Log dos dados recebidos
        preencherTabelasDesativadas(perguntasDesativadas);
    })
    .catch(error => {
        console.error('Erro ao listar perguntas desativadas:', error);
    });

}

function preencherTabelasDesativadas(perguntasDesativadas) {
  const descricaoTd = document.getElementById("descricaoDesativada");

  // Limpa o conteúdo anterior
  descricaoTd.innerHTML = "";

  // Verifica se há perguntas desativadas
  if (perguntasDesativadas && perguntasDesativadas.length > 0) {
      perguntasDesativadas.forEach(pergunta => {
          const descricao = pergunta.pergunta ? pergunta.pergunta : "Descrição não disponível";

          // Cria novos elementos para exibir as perguntas
          const novaLinha = document.createElement("tr");
          const descricaoCelula = document.createElement("td");

          descricaoCelula.textContent = descricao;

          novaLinha.appendChild(descricaoCelula);

          // Adiciona a nova linha na tabela
          descricaoTd.appendChild(novaLinha);
      });
  } else {
      descricaoTd.innerHTML = "Nenhuma pergunta desativada encontrada";
  }
}


