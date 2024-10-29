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

    document.getElementById("procedimento").value =
      procedimento.procedimento.tipo;
    document.getElementById("descricao").value =
      procedimento.procedimento.descricao;
    document.getElementById("especificacao").value = procedimento.especificacao;
    document.getElementById(
      "valor-colocacao"
    ).value = `${procedimento.precoColocacao.toFixed(2).replace(".", ",")}`;
    document.getElementById(
      "valor-retirada"
    ).value = `${procedimento.precoRetirada.toFixed(2).replace(".", ",")}`;
    document.getElementById(
      "valor-manutencao"
    ).value = `${procedimento.precoManutencao.toFixed(2).replace(".", ",")}`;

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

  document.addEventListener("DOMContentLoaded", function () {
    function formatValue(value) {
      return `${parseFloat(value).toFixed(2).replace(".", ",")}`;
    }

    function parseValue(value) {
      const parsedValue = parseFloat(
        value.replace("R$", "").replace(",", ".").trim()
      );
      return isNaN(parsedValue) ? 0 : parsedValue;
    }

    const valorColocacaoInput = document.getElementById("valor-colocacao");

    valorColocacaoInput.addEventListener("input", function () {
      const numericValue = parseValue(valorColocacaoInput.value);
      if (isNaN(numericValue)) {
        valorColocacaoInput.value = formatValue(0);
      } else {
        valorColocacaoInput.value = formatValue(numericValue);
      }
    });

    document
      .querySelector(".save-button")
      .addEventListener("click", async function (event) {
        event.preventDefault();

        const especificacao = {
          especificacao: document.getElementById("especificacao").value,
          precoColocacao:
            parseValue(document.getElementById("valor-colocacao").value) || 0,
          precoManutencao:
            parseValue(document.getElementById("valor-manutencao").value) || 0,
          precoRetirada:
            parseValue(document.getElementById("valor-retirada").value) || 0,
          tempoColocacao: tempoColocacao,
          tempoManutencao: tempoManutencao,
          tempoRetirada: tempoRetirada,
          procedimento: idProcedimento,
        };

        try {
          const response = await fetch(
            `${baseUrl}/especificacoes/${idEspecificacao}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(especificacao),
            }
          );

          if (response.ok) {
            showNotification("Especificação atualizada com sucesso!");
          } else {
            const errorData = await response.json();
            console.error("Server response:", errorData);
            showNotification(
              "Erro ao atualizar especificação! Verifique os campos.",
              true
            );
          }
        } catch (error) {
          console.error("Erro ao atualizar a especificação:", error);
          showNotification("Erro ao salvar especificação!", true);
        }
      });
  });

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
            .value.replace("", "")
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
        const [especificacaoResponse, procedimentoResponse] = await Promise.all(
          [updateEspecificacao, updateProcedimento]
        );

        const messages = [];
        if (especificacaoResponse.ok)
          messages.push("Especificação atualizada com sucesso!");
        if (procedimentoResponse.ok)
          messages.push("Procedimento atualizado com sucesso!");

        if (messages.length === 2) {
          showNotification("Todos os dados foram atualizados com sucesso!");
          setTimeout(() => {
            window.location.href = "../../procedimento.html"; // Redireciona para o arquivo HTML desejado após 3 segundos
          }, 1000);
        } else {
          messages.forEach((message) => showNotification(message));
          if (messages.length < 2) {
            showNotification("Nem todos os dados foram atualizados!", true);
          }
        }
      } catch (error) {
        console.error("Erro ao atualizar o procedimento:", error);
        showNotification("Erro ao salvar procedimento!", true);
      }
    });
});

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
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

new window.VLibras.Widget('https://vlibras.gov.br/app');
