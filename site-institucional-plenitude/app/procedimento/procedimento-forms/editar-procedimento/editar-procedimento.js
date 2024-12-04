document.addEventListener("DOMContentLoaded", async function () {
  const baseUrl = "http://localhost:8080/api";
  const urlParams = new URLSearchParams(window.location.search);
  const idProcedimento = urlParams.get("idProcedimento");
  const idEspecificacao = urlParams.get("idEspecificacao");

  // Função para habilitar ou desabilitar campos com base no checkbox
  function toggleFields(checkbox, fields) {
    fields.forEach((field) => {
      field.disabled = !checkbox.checked;
      if (!checkbox.checked) {
        field.value = ""; // Limpa o valor do campo se desabilitado
      }
    });
  }

  // Identificadores de campos e checkboxes
  const colocacaoCheckbox = document.getElementById("colocacao");
  const manutencaoCheckbox = document.getElementById("manutencao");
  const retiradaCheckbox = document.getElementById("retirada");

  const valorColocacao = document.getElementById("valor-colocacao");
  const duracaoColocacaoHoras = document.getElementById(
    "duracao-colocacao-horas"
  );
  const duracaoColocacaoMinutos = document.getElementById(
    "duracao-colocacao-minutos"
  );

  const valorManutencao = document.getElementById("valor-manutencao");
  const duracaoManutencaoHoras = document.getElementById(
    "duracao-manutencao-horas"
  );
  const duracaoManutencaoMinutos = document.getElementById(
    "duracao-manutencao-minutos"
  );

  const valorRetirada = document.getElementById("valor-retirada");
  const duracaoRetiradaHoras = document.getElementById(
    "duracao-retirada-horas"
  );
  const duracaoRetiradaMinutos = document.getElementById(
    "duracao-retirada-minutos"
  );

  // Inicializa os campos desabilitados
  toggleFields(colocacaoCheckbox, [
    valorColocacao,
    duracaoColocacaoHoras,
    duracaoColocacaoMinutos,
  ]);
  toggleFields(manutencaoCheckbox, [
    valorManutencao,
    duracaoManutencaoHoras,
    duracaoManutencaoMinutos,
  ]);
  toggleFields(retiradaCheckbox, [
    valorRetirada,
    duracaoRetiradaHoras,
    duracaoRetiradaMinutos,
  ]);

  // Adiciona eventos de mudança aos checkboxes
  colocacaoCheckbox.addEventListener("change", () => {
    toggleFields(colocacaoCheckbox, [
      valorColocacao,
      duracaoColocacaoHoras,
      duracaoColocacaoMinutos,
    ]);
  });

  manutencaoCheckbox.addEventListener("change", () => {
    toggleFields(manutencaoCheckbox, [
      valorManutencao,
      duracaoManutencaoHoras,
      duracaoManutencaoMinutos,
    ]);
  });

  retiradaCheckbox.addEventListener("change", () => {
    toggleFields(retiradaCheckbox, [
      valorRetirada,
      duracaoRetiradaHoras,
      duracaoRetiradaMinutos,
    ]);
  });

  // Carregar dados do procedimento
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

    // Define os valores iniciais dos checkboxes
    colocacaoCheckbox.checked = procedimento.colocacao;
    manutencaoCheckbox.checked = procedimento.manutencao;
    retiradaCheckbox.checked = procedimento.retirada;
    document.getElementById("homecare").checked = procedimento.homecare;

    // Atualiza os campos de acordo com os checkboxes
    toggleFields(colocacaoCheckbox, [
      valorColocacao,
      duracaoColocacaoHoras,
      duracaoColocacaoMinutos,
    ]);
    toggleFields(manutencaoCheckbox, [
      valorManutencao,
      duracaoManutencaoHoras,
      duracaoManutencaoMinutos,
    ]);
    toggleFields(retiradaCheckbox, [
      valorRetirada,
      duracaoRetiradaHoras,
      duracaoRetiradaMinutos,
    ]);

    // Preenche os valores dos campos habilitados
    valorColocacao.value = procedimento.precoColocacao
      .toFixed(2)
      .replace(".", ",");
    duracaoColocacaoHoras.value = procedimento.tempoColocacao.split(":")[0];
    duracaoColocacaoMinutos.value = procedimento.tempoColocacao.split(":")[1];

    valorManutencao.value = procedimento.precoManutencao
      .toFixed(2)
      .replace(".", ",");
    duracaoManutencaoHoras.value = procedimento.tempoManutencao.split(":")[0];
    duracaoManutencaoMinutos.value = procedimento.tempoManutencao.split(":")[1];

    valorRetirada.value = procedimento.precoRetirada
      .toFixed(2)
      .replace(".", ",");
    duracaoRetiradaHoras.value = procedimento.tempoRetirada.split(":")[0];
    duracaoRetiradaMinutos.value = procedimento.tempoRetirada.split(":")[1];
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

      const especificacao = {
        especificacao: document.getElementById("especificacao").value,
        precoColocacao: parseValue(valorColocacao.value),
        precoManutencao: parseValue(valorManutencao.value),
        precoRetirada: parseValue(valorRetirada.value),
        tempoColocacao: colocacaoCheckbox.checked
          ? `${formatTime(duracaoColocacaoHoras.value)}:${formatTime(
              duracaoColocacaoMinutos.value
            )}`
          : "00:00",
        tempoManutencao: manutencaoCheckbox.checked
          ? `${formatTime(duracaoManutencaoHoras.value)}:${formatTime(
              duracaoManutencaoMinutos.value
            )}`
          : "00:00",
        tempoRetirada: retiradaCheckbox.checked
          ? `${formatTime(duracaoRetiradaHoras.value)}:${formatTime(
              duracaoRetiradaMinutos.value
            )}`
          : "00:00",
        colocacao: colocacaoCheckbox.checked,
        manutencao: manutencaoCheckbox.checked,
        retirada: retiradaCheckbox.checked,
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

function parseValue(value) {
  const parsedValue = parseFloat(
    value.replace("R$", "").replace(",", ".").trim()
  );
  return isNaN(parsedValue) ? 0 : parsedValue;
}

function formatTime(value) {
  return value ? value.toString().padStart(2, "0") : "00";
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
  new window.VLibras.Widget("https://vlibras.gov.br/app");
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
