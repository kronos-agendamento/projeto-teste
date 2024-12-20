document.addEventListener("DOMContentLoaded", function () {
  // Função para exibir notificação
  function showNotification(message, isError = false, duration = 3000) {
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
    }, duration);
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
      const homecare = document.getElementById("homecare").checked;
      const colocacao = document.getElementById("colocacao").checked;
      const manutencao = document.getElementById("manutencao").checked;
      const retirada = document.getElementById("retirada").checked;

      let duracaoColocacaoHoras =
        document.getElementById("duracao-colocacao-horas").value || "00";
      let duracaoColocacaoMinutos =
        document.getElementById("duracao-colocacao-minutos").value || "00";

      let duracaoManutencaoHoras =
        document.getElementById("duracao-manutencao-horas").value || "00";
      let duracaoManutencaoMinutos =
        document.getElementById("duracao-manutencao-minutos").value || "00";

      let duracaoRetiradaHoras =
        document.getElementById("duracao-retirada-horas").value || "00";
      let duracaoRetiradaMinutos =
        document.getElementById("duracao-retirada-minutos").value || "00";

      // Padroniza os campos para formato HH:MM
      duracaoColocacaoHoras = duracaoColocacaoHoras.padStart(2, "0");
      duracaoColocacaoMinutos = duracaoColocacaoMinutos.padStart(2, "0");

      duracaoManutencaoHoras = duracaoManutencaoHoras.padStart(2, "0");
      duracaoManutencaoMinutos = duracaoManutencaoMinutos.padStart(2, "0");

      duracaoRetiradaHoras = duracaoRetiradaHoras.padStart(2, "0");
      duracaoRetiradaMinutos = duracaoRetiradaMinutos.padStart(2, "0");

      const especificacaoData = {
        especificacao: especificacao,
        precoColocacao:
          parseFloat(document.getElementById("valor-colocacao").value) || 0,
        precoManutencao:
          parseFloat(document.getElementById("valor-manutencao").value) || 0,
        precoRetirada:
          parseFloat(document.getElementById("valor-retirada").value) || 0,
        tempoColocacao: `${duracaoColocacaoHoras}:${duracaoColocacaoMinutos}`,
        tempoManutencao: `${duracaoManutencaoHoras}:${duracaoManutencaoMinutos}`,
        tempoRetirada: `${duracaoRetiradaHoras}:${duracaoRetiradaMinutos}`,
        homecare: homecare,
        colocacao: colocacao,
        manutencao: manutencao,
        retirada: retirada,
        procedimento: parseInt(
          document.getElementById("procedimento-dropdown").value,
          10
        ),
      };

      fetch("http://localhost:8080/api/especificacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(especificacaoData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((especificacaoResponse) => {
          showNotification("Especificação salva com sucesso!", false, 5000);
        })
        .catch((error) => {
          console.error("Erro ao salvar especificação:", error);
          showNotification("Erro ao salvar especificação!", true);
        });
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
  new window.VLibras.Widget("https://vlibras.gov.br/app");
});

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
    const response = await fetch(
      `http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`,
      {
        method: "GET",
      }
    );

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

document.addEventListener("DOMContentLoaded", function () {
  const colocacaoCheckbox = document.getElementById("colocacao");
  const manutencaoCheckbox = document.getElementById("manutencao");
  const retiradaCheckbox = document.getElementById("retirada");

  const duracaoColocacaoHoras = document.getElementById(
    "duracao-colocacao-horas"
  );
  const duracaoColocacaoMinutos = document.getElementById(
    "duracao-colocacao-minutos"
  );
  const valorColocacao = document.getElementById("valor-colocacao");

  const duracaoManutencaoHoras = document.getElementById(
    "duracao-manutencao-horas"
  );
  const duracaoManutencaoMinutos = document.getElementById(
    "duracao-manutencao-minutos"
  );
  const valorManutencao = document.getElementById("valor-manutencao");

  const duracaoRetiradaHoras = document.getElementById(
    "duracao-retirada-horas"
  );
  const duracaoRetiradaMinutos = document.getElementById(
    "duracao-retirada-minutos"
  );
  const valorRetirada = document.getElementById("valor-retirada");

  function toggleFields(checkbox, fields) {
    fields.forEach((field) => {
      field.disabled = !checkbox.checked;
      if (!checkbox.checked) {
        field.value = ""; // Limpa o valor se desativado
      }
    });
  }

  // Inicializar campos desativados
  toggleFields(colocacaoCheckbox, [
    duracaoColocacaoHoras,
    duracaoColocacaoMinutos,
    valorColocacao,
  ]);
  toggleFields(manutencaoCheckbox, [
    duracaoManutencaoHoras,
    duracaoManutencaoMinutos,
    valorManutencao,
  ]);
  toggleFields(retiradaCheckbox, [
    duracaoRetiradaHoras,
    duracaoRetiradaMinutos,
    valorRetirada,
  ]);

  // Adicionar eventos aos checkboxes
  colocacaoCheckbox.addEventListener("change", function () {
    toggleFields(colocacaoCheckbox, [
      duracaoColocacaoHoras,
      duracaoColocacaoMinutos,
      valorColocacao,
    ]);
  });

  manutencaoCheckbox.addEventListener("change", function () {
    toggleFields(manutencaoCheckbox, [
      duracaoManutencaoHoras,
      duracaoManutencaoMinutos,
      valorManutencao,
    ]);
  });

  retiradaCheckbox.addEventListener("change", function () {
    toggleFields(retiradaCheckbox, [
      duracaoRetiradaHoras,
      duracaoRetiradaMinutos,
      valorRetirada,
    ]);
  });
});
