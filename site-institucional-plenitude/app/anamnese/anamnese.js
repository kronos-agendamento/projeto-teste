document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

// var btn = document.getElementsByClassName("planilha-btn")[0];
// var modal = document.getElementsByTagName("dialog")[0];
// btn.onclick = function () {
//  modal.showModal();
// };

// const cirurgia = document.getElementById("cirugia").value;
// const descricaoCirurgia = document.getElementById("descricao").value;

//Cria o objeto de dados para enviar
// const requestData = {
//  cirugia: cirurgia,
//  descricao: descricao,
// };

//Fazendo a requisição POST
// fetch("http://localhost:8080/api/anamnese", {
//  method: "POST",
//  headers: {
//    "Content-Type": "application/json",
//  },
//  body: JSON.stringify(requestData),
// })
//  .then((data) => {
//    // Exibe mensagem de sucesso
//    document.getElementById("notification-message").textContent =
//      "Ficha de anamnese salva com sucesso!";
//  })
//  .catch((error) => {
//    console.error("Erro ao salvar ficha:", error);
//    document.getElementById("notification-message").textContent =
//      "Erro ao salvar agendamento. Tente novamente";
//  });


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

function salvarPergunta() {
  // Captura o valor da descrição da pergunta
  const descricaoPergunta = document.getElementById("descricao").value;

  // Estrutura dos dados que serão enviados
  const perguntaData = {
    pergunta: descricaoPergunta,
    ativa: true // Sempre true por padrão
  };

  // URL base da API
  const baseUrl = "http://localhost:8080";

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