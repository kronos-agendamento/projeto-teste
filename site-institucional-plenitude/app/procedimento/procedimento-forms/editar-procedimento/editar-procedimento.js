document.addEventListener("DOMContentLoaded", async function () {
  const baseUrl = "http://localhost:8080/api";
  const urlParams = new URLSearchParams(window.location.search);
  const idProcedimento = urlParams.get("idProcedimento");
  const idEspecificacao = urlParams.get("idEspecificacao");

  if (!idProcedimento || !idEspecificacao) {
    console.error("ID do procedimento ou especificação não encontrado na URL.");
    return;
  }

  try {
    const response = await fetch(
      `${baseUrl}/especificacoes/${idEspecificacao}`
    );
    const procedimento = await response.json();

    // Preenche os campos com os dados recebidos
    document.getElementById("procedimento").value =
      procedimento.procedimento.tipo;
    document.getElementById("descricao").value =
      procedimento.procedimento.descricao;
    document.getElementById("especificacao").value = procedimento.especificacao;
    document.getElementById("valor-colocacao").value =
      procedimento.precoColocacao.toFixed(2).replace(".", ",");
    document.getElementById("valor-retirada").value = procedimento.precoRetirada
      .toFixed(2)
      .replace(".", ",");
    document.getElementById("valor-manutencao").value =
      procedimento.precoManutencao.toFixed(2).replace(".", ",");
    document.getElementById("homecare").checked = procedimento.homecare;

    function parseTempoMinutos(tempo) {
      const [horas, minutos] = tempo.split(":").map(Number);
      return { horas, minutos };
    }

    const colocacao = parseTempoMinutos(procedimento.tempoColocacao);
    document.getElementById("duracao-colocacao-horas").value = colocacao.horas;
    document.getElementById("duracao-colocacao-minutos").value =
      colocacao.minutos;

    const manutencao = parseTempoMinutos(procedimento.tempoManutencao);
    document.getElementById("duracao-manutencao-horas").value =
      manutencao.horas;
    document.getElementById("duracao-manutencao-minutos").value =
      manutencao.minutos;

    const retirada = parseTempoMinutos(procedimento.tempoRetirada);
    document.getElementById("duracao-retirada-horas").value = retirada.horas;
    document.getElementById("duracao-retirada-minutos").value =
      retirada.minutos;
  } catch (error) {
    console.error("Erro ao buscar dados do procedimento:", error);
    showNotification("Erro ao carregar procedimento!", true);
  }

  // Listener para salvar os dados
  document
    .querySelector(".save-button")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const procedimento = {
        tipo: document.getElementById("procedimento").value,
        descricao: document.getElementById("descricao").value,
      };

      const tempoColocacao = `${formatTime(
        document.getElementById("duracao-colocacao-horas").value
      )}:${formatTime(
        document.getElementById("duracao-colocacao-minutos").value
      )}`;
      const tempoManutencao = `${formatTime(
        document.getElementById("duracao-manutencao-horas").value
      )}:${formatTime(
        document.getElementById("duracao-manutencao-minutos").value
      )}`;
      const tempoRetirada = `${formatTime(
        document.getElementById("duracao-retirada-horas").value
      )}:${formatTime(
        document.getElementById("duracao-retirada-minutos").value
      )}`;

      const especificacao = {
        especificacao: document.getElementById("especificacao").value,
        precoColocacao: parseValue(
          document.getElementById("valor-colocacao").value
        ),
        precoManutencao: parseValue(
          document.getElementById("valor-manutencao").value
        ),
        precoRetirada: parseValue(
          document.getElementById("valor-retirada").value
        ),
        tempoColocacao: tempoColocacao,
        tempoManutencao: tempoManutencao,
        tempoRetirada: tempoRetirada,
        homecare: document.getElementById("homecare").checked,
        procedimento: idProcedimento,
      };

      try {
        const [especificacaoResponse, procedimentoResponse] = await Promise.all(
          [
            fetch(`${baseUrl}/especificacoes/${idEspecificacao}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(especificacao),
            }),
            fetch(`${baseUrl}/procedimentos/${idProcedimento}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(procedimento),
            }),
          ]
        );

        if (especificacaoResponse.ok && procedimentoResponse.ok) {
          showNotification("Todos os dados foram atualizados com sucesso!");
          setTimeout(() => {
            window.location.href = "../../procedimento.html"; // Redireciona após salvar
          }, 1000);
        } else {
          showNotification("Erro ao atualizar os dados!", true);
        }
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
        showNotification("Erro ao salvar os dados!", true);
      }
    });
});

function formatTime(value) {
  return value.toString().padStart(2, "0");
}

function parseValue(value) {
  const parsedValue = parseFloat(
    value.replace("R$", "").replace(",", ".").trim()
  );
  return isNaN(parsedValue) ? 0 : parsedValue;
}

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

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

new window.VLibras.Widget("https://vlibras.gov.br/app");

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
