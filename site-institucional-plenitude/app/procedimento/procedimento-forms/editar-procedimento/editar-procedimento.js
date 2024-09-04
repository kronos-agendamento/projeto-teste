document.addEventListener("DOMContentLoaded", async function () {
  const baseUrl = "http://localhost:8080/api";

  const urlParams = new URLSearchParams(window.location.search);
  const idProcedimento = urlParams.get("idProcedimento");
  const idEspecificacao = urlParams.get("idEspecificacao");

  if (!idProcedimento || !idEspecificacao) {
    console.error("ID do procedimento não encontrado na URL.");
    return;
  }

  try {
    const response = await fetch(`${baseUrl}/especificacoes/${idEspecificacao}`);
    const procedimento = await response.json();

    document.getElementById("procedimento").value =
      procedimento.procedimento.tipo;
    document.getElementById("descricao").value =
      procedimento.procedimento.descricao;
    document.getElementById("especificacao").value = procedimento.especificacao;
    document.getElementById(
      "valor-colocacao"
    ).value = `R$ ${procedimento.precoColocacao.toFixed(2).replace(".", ",")}`;
    document.getElementById(
      "valor-retirada"
    ).value = `R$ ${procedimento.precoRetirada.toFixed(2).replace(".", ",")}`;
    document.getElementById(
      "valor-manutencao"
    ).value = `R$ ${procedimento.precoManutencao.toFixed(2).replace(".", ",")}`;

    // Função para converter o tempo no formato "HH:MM" em horas e minutos separados
    function parseTempoMinutos(tempo) {
      const [horas, minutos] = tempo.split(":").map(Number);
      return { horas, minutos };
    }

    // Preenchendo os campos de duração de colocação
    const colocacao = parseTempoMinutos(procedimento.tempoColocacao);
    document.getElementById("duracao-colocacao-horas").value = colocacao.horas;
    document.getElementById("duracao-colocacao-minutos").value =
      colocacao.minutos;

    // Preenchendo os campos de duração de manutenção
    const manutencao = parseTempoMinutos(procedimento.tempoManutencao);
    document.getElementById("duracao-manutencao-horas").value =
      manutencao.horas;
    document.getElementById("duracao-manutencao-minutos").value =
      manutencao.minutos;

    // Preenchendo os campos de duração de retirada
    const retirada = parseTempoMinutos(procedimento.tempoRetirada);
    document.getElementById("duracao-retirada-horas").value = retirada.horas;
    document.getElementById("duracao-retirada-minutos").value =
      retirada.minutos;
  } catch (error) {
    console.error("Erro ao buscar dados do procedimento:", error);
    showNotification("Erro ao carregar procedimento!", true);
  }

  document
    .querySelector(".save-button")
    .addEventListener("click", async function (event) {
      event.preventDefault();

      const procedimento = {
        tipo: document.getElementById("procedimento").value,
        descricao: document.getElementById("descricao").value,
      };

      // Capturando os tempos dos inputs corretos de horas e minutos para cada tipo de procedimento
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
        precoColocacao: parseFloat(
          document
            .getElementById("valor-colocacao")
            .value.replace("R$", "")
            .replace(",", ".")
        ),
        precoManutencao: parseFloat(
          document
            .getElementById("valor-manutencao")
            .value.replace("R$", "")
            .replace(",", ".")
        ),
        precoRetirada: parseFloat(
          document
            .getElementById("valor-retirada")
            .value.replace("R$", "")
            .replace(",", ".")
        ),
        tempoColocacao: tempoColocacao,
        tempoManutencao: tempoManutencao,
        tempoRetirada: tempoRetirada,
        procedimento: idProcedimento,
      };

      const updateEspecificacao = fetch(
        `${baseUrl}/especificacoes/${idEspecificacao}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(especificacao),
        }
      );

      const updateProcedimento = fetch(
        `${baseUrl}/procedimentos/${idProcedimento}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(procedimento),
        }
      );

      try {
        const [especificacaoResponse, tempoResponse, procedimentoResponse] =
          await Promise.all([
            updateEspecificacao,
            updateTempo,
            updateProcedimento,
          ]);

        const messages = [];
        if (especificacaoResponse.ok)
          messages.push("Especificação atualizada com sucesso!");
        if (tempoResponse.ok) messages.push("Duração atualizada com sucesso!");
        if (procedimentoResponse.ok)
          messages.push("Procedimento atualizado com sucesso!");

        if (messages.length === 3) {
          showNotification("Todos os dados foram atualizados com sucesso!");
        } else {
          messages.forEach((message) => showNotification(message));
          if (messages.length < 3)
            showNotification("Nem todos os dados foram atualizados!", true);
        }
      } catch (error) {
        console.error("Erro ao atualizar o procedimento:", error);
        showNotification("Erro ao salvar procedimento!", true);
      }
    });
});

function parseTempoMinutos(tempo) {
  const parts = tempo.split(":");
  if (parts.length === 2) {
    const horas = parseInt(parts[0], 10);
    const minutos = parseInt(parts[1], 10);
    return horas * 60 + minutos;
  }
  return 0;
}

function formatTime(value) {
  return value.toString().padStart(2, "0");
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
  const email = localStorage.getItem("email");

  if (nome && email) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userEmail").textContent = email;
  }
});
