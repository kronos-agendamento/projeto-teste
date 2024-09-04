document.addEventListener("DOMContentLoaded", function () {
  // Função para exibir notificação
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

  // Função para carregar procedimentos no dropdown
  function loadProcedimentos() {
    fetch("http://localhost:8080/api/procedimentos")
      .then((response) => response.json())
      .then((data) => {
        const procedimentoDropdown = document.getElementById(
          "procedimento-dropdown"
        );
        procedimentoDropdown.innerHTML = ""; // Limpa o dropdown antes de adicionar os novos procedimentos
        data.forEach((procedimento) => {
          const option = document.createElement("option");
          option.value = procedimento.idProcedimento; // Certifique-se de que 'idProcedimento' é o campo correto para o ID do procedimento
          option.textContent = procedimento.tipo;
          procedimentoDropdown.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Erro ao carregar procedimentos:", error);
        showNotification(
          "Erro ao carregar procedimentos: " + error.message,
          true
        );
      });
  }

  // Carregar procedimentos ao iniciar a página
  loadProcedimentos();

  document
    .getElementById("save-procedimento-button")
    .addEventListener("click", function () {
      const nome = document.getElementById("nome").value;
      const descricao = document.getElementById("descricao").value;

      const procedimentoData = {
        tipo: nome,
        descricao: descricao,
      };

      fetch("http://localhost:8080/api/procedimentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(procedimentoData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          showNotification("Procedimento salvo com sucesso!");
          loadProcedimentos(); // Atualizar o dropdown após salvar o procedimento
        })
        .catch((error) => {
          console.error("Erro ao salvar procedimento:", error);
          showNotification("Erro ao salvar procedimento!", true);
        });
    });
  document
    .getElementById("save-especificacao-button")
    .addEventListener("click", function () {
      const especificacao = document.getElementById("especificacao").value;

      let duracaoColocacaoHoras = document.getElementById(
        "duracao-colocacao-horas"
      ).value;
      let duracaoColocacaoMinutos = document.getElementById(
        "duracao-colocacao-minutos"
      ).value;

      let duracaoManutencaoHoras = document.getElementById(
        "duracao-manutencao-horas"
      ).value;
      let duracaoManutencaoMinutos = document.getElementById(
        "duracao-manutencao-minutos"
      ).value;

      let duracaoRetiradaHoras = document.getElementById(
        "duracao-retirada-horas"
      ).value;
      let duracaoRetiradaMinutos = document.getElementById(
        "duracao-retirada-minutos"
      ).value;

      // Padronizar horas e minutos para dois dígitos
      duracaoColocacaoHoras = duracaoColocacaoHoras.padStart(2, "0");
      duracaoColocacaoMinutos = duracaoColocacaoMinutos.padStart(2, "0");

      duracaoManutencaoHoras = duracaoManutencaoHoras.padStart(2, "0");
      duracaoManutencaoMinutos = duracaoManutencaoMinutos.padStart(2, "0");

      duracaoRetiradaHoras = duracaoRetiradaHoras.padStart(2, "0");
      duracaoRetiradaMinutos = duracaoRetiradaMinutos.padStart(2, "0");

      const especificacaoData = {
        especificacao: especificacao,
        precoColocacao: parseFloat(
          document.getElementById("valor-colocacao").value
        ),
        precoManutencao: parseFloat(
          document.getElementById("valor-manutencao").value
        ),
        precoRetirada: parseFloat(
          document.getElementById("valor-retirada").value
        ),
        procedimento: document.getElementById("procedimento-dropdown").value,
        tempoColocacao: `${duracaoColocacaoHoras}:${duracaoColocacaoMinutos}`,
        tempoManutencao: `${duracaoManutencaoHoras}:${duracaoManutencaoMinutos}`,
        tempoRetirada: `${duracaoRetiradaHoras}:${duracaoRetiradaMinutos}`,
      };

      return fetch("http://localhost:8080/api/especificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(especificacaoData),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((especificacaoResponse) => {
      showNotification("Especificação salva com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao salvar especificação:", error);
      showNotification("Erro ao salvar especificação!", true);
    });
});

// nav
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // Ação para os botões de navegação
    });
  });
});

const list = document.querySelectorAll(".list");
function activeLink() {
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}
list.forEach((item) => item.addEventListener("click", activeLink));

document.addEventListener("DOMContentLoaded", function () {
  const uploadFotoInput = document.getElementById("upload-foto");
  const customUploadButton = document.getElementById("custom-upload-button");
  const fileNameSpan = document.getElementById("file-name");

  customUploadButton.addEventListener("click", function () {
    uploadFotoInput.click();
  });

  uploadFotoInput.addEventListener("change", function () {
    if (uploadFotoInput.files.length > 0) {
      fileNameSpan.textContent = uploadFotoInput.files[0].name;
    } else {
      fileNameSpan.textContent = "Nenhum arquivo escolhido";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const email = localStorage.getItem("email");

  if (nome && email) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userEmail").textContent = email;
  }
});
