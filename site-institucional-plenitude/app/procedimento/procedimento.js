document.addEventListener("DOMContentLoaded", function () {
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

  const baseUrl = "http://localhost:8080/api";
  const proceduresTbody = document.getElementById("procedures-tbody");
  const prevPageBtn = document.getElementById("prev-page-btn");
  const nextPageBtn = document.getElementById("next-page-btn");
  const currentPageSpan = document.getElementById("current-page");
  const totalPagesSpan = document.getElementById("total-pages");
  const modal = document.getElementById("modal");
  const modalProcedimento = document.getElementById("procedimento");
  const btnYes = document.querySelector(".btn-yes");
  let currentPage = 1;
  const itemsPerPage = 5;
  let procedimentos = [];
  let procedimentoParaDeletar = null;

  function fetchData(endpoint, id) {
    fetch(baseUrl + endpoint)
      .then((response) => response.json())
      .then((data) => {
        const elemento = document.getElementById(id);
        if (data && data.tipo) {
          elemento.textContent = data.tipo;
        } else {
          elemento.textContent = "Não disponível";
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        document.getElementById(id).textContent = "Erro ao carregar";
      });
  }

  function updateKPIs() {
    const endpoints = {
      maisAgendado: "/procedimentos/mais-agendado",
      menosAgendado: "/procedimentos/menos-agendado",
      melhorAvaliado: "/procedimentos/melhor-nota",
    };

    const ids = {
      maisAgendado: "mais-agendado",
      menosAgendado: "menos-agendado",
      melhorAvaliado: "melhor-avaliado",
    };

    fetchData(endpoints.maisAgendado, ids.maisAgendado);
    fetchData(endpoints.menosAgendado, ids.menosAgendado);
    fetchData(endpoints.melhorAvaliado, ids.melhorAvaliado);
  }

  updateKPIs();

  async function fetchProcedures() {
    try {
      const response = await fetch(`${baseUrl}/especificacoes`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao carregar procedimentos:", error);
      return [];
    }
  }

  function formatDuration(duration) {
    const [hours, minutes] = duration.split(":").map(Number);
    return `${hours}h ${minutes} min`;
  }

  function renderTable(procedures, page) {
    proceduresTbody.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedProcedures = procedures.slice(start, end);

    paginatedProcedures.forEach((procedure) => {
      const row = document.createElement("tr");

      const nome = procedure.procedimento.tipo;
      const preco = `R$${procedure.precoColocacao
        .toFixed(2)
        .replace(".", ",")}`;
      const duracao = formatDuration(procedure.tempoColocacao);
      const especificacao = procedure.especificacao;
      const procedimentoId = procedure.procedimento.idProcedimento; // ID do procedimento
      const especificacaoId = procedure.idEspecificacaoProcedimento; // ID da especificação

      row.innerHTML = `
                <td>${nome}</td>
                <td>${preco}</td>
                <td>${duracao}</td>
                <td>${especificacao}</td>
                <td>
                    <button class="edit-btn" data-id-especificacao="${especificacaoId}" data-id-procedimento="${procedimentoId}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id-especificacao="${especificacaoId}" data-id-procedimento="${procedimentoId}" data-tipo="${nome}" data-especificacao="${especificacao}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
      proceduresTbody.appendChild(row);
    });

    currentPageSpan.textContent = page;
    const totalPages = Math.ceil(procedures.length / itemsPerPage);
    totalPagesSpan.textContent = totalPages;

    // Desativar ou ativar botões de página
    prevPageBtn.classList.toggle("button-disabled", page === 1);
    nextPageBtn.classList.toggle("button-disabled", page === totalPages);

    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = page === totalPages;

    document.querySelectorAll(".delete-btn").forEach((button) => {
      const especificacaoId = button.getAttribute("data-id-especificacao");
      const procedimentoId = button.getAttribute("data-id-procedimento");
      const tipo = button.getAttribute("data-tipo");
      const especificacao = button.getAttribute("data-especificacao");

      button.addEventListener("click", (e) => {
        procedimentoParaDeletar = {
          idEspecificacao: especificacaoId,
          idProcedimento: procedimentoId,
        };
        if (procedimentoParaDeletar.idEspecificacao) {
          showModal(tipo, especificacao);
        } else {
          console.error("ID do procedimento é indefinido.");
        }
      });
    });

    // Atualização da função de clique no botão de edição
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const especificacaoId = e.currentTarget.getAttribute(
          "data-id-especificacao"
        );
        const procedimentoId = e.currentTarget.getAttribute(
          "data-id-procedimento"
        );
        // Corrigir a URL para enviar ambos os IDs
        window.location.href = `procedimento-forms/editar-procedimento/editar-procedimento.html?idEspecificacao=${especificacaoId}&idProcedimento=${procedimentoId}`;
      });
    });
  }

  async function init() {
    procedimentos = await fetchProcedures();
    renderTable(procedimentos, currentPage);

    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable(procedimentos, currentPage);
      }
    });

    nextPageBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(procedimentos.length / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderTable(procedimentos, currentPage);
      }
    });

    btnYes.addEventListener("click", async () => {
      if (procedimentoParaDeletar !== null) {
        await deleteProcedimento(
          procedimentoParaDeletar.idEspecificacao,
          procedimentoParaDeletar.idProcedimento
        );
        procedimentos = await fetchProcedures();
        renderTable(procedimentos, currentPage);
        closeModal();
      }
    });
  }

  async function deleteProcedimento(idEspecificacao, idProcedimento) {
    try {
      console.log(`Tentando deletar especificação com ID: ${idEspecificacao}`);

      // Tentar deletar a especificação primeiro
      const response = await fetch(
        `${baseUrl}/especificacoes/${idEspecificacao}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        showNotification(
          `Erro ao deletar a especificação: ${errorData.message}`,
          true
        );
        throw new Error("Erro ao deletar a especificação.");
      }

      console.log(
        `Especificação com ID: ${idEspecificacao} deletada com sucesso`
      );

      // Agora tentar deletar o procedimento
      const response2 = await fetch(
        `${baseUrl}/procedimentos/${idProcedimento}`,
        {
          method: "DELETE",
        }
      );

      if (response2.ok) {
        console.log(
          `Procedimento com ID: ${idProcedimento} deletado com sucesso`
        );
        showNotification("Procedimento e especificação deletados com sucesso!");
      } else {
        const errorData = await response2.json();
        if (response2.status === 500) {
          // Se o procedimento não for deletado devido a outras especificações, mostrar mensagem adequada
          showNotification(
            "Especificação deletada com sucesso, mas o procedimento não pôde ser deletado pois ainda está associado a outras especificações.",
            false,
            5000 // Duração maior para esta notificação específica
          );
        } else {
          // Outros erros
          showNotification(
            `Erro ao deletar o procedimento: ${errorData.message}`,
            true
          );
        }
      }
    } catch (error) {
      console.error("Erro ao deletar o procedimento:", error);
      showNotification(
        "Erro ao deletar o procedimento. Tente novamente mais tarde.",
        true
      );
    }
  }

  function showModal(tipoProcedimento, especificacao) {
    modalProcedimento.textContent = `Procedimento: ${tipoProcedimento}`;
    document.getElementById(
      "especificacao"
    ).textContent = `Especificação: ${especificacao}`;
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  window.showModal = showModal;
  window.closeModal = closeModal;

  init();
});

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

document.querySelector(".planilha-btn").addEventListener("click", function () {
  exportTableToExcel("procedures-table", "Procedimentos.xlsx");
});

function exportTableToExcel(tableId, filename = "") {
  var table = document.getElementById(tableId);

  // Create a temporary table to remove the "Ações" column
  var tempTable = table.cloneNode(true);

  // Remove the last column (Ações) from the header
  var tempThead = tempTable.querySelector("thead");
  var tempHeaderRow = tempThead.rows[0];
  tempHeaderRow.deleteCell(-1); // Deletes the last cell from header

  // Remove the last column (Ações) from all rows in the body
  var tempTbody = tempTable.querySelector("tbody");
  for (var i = 0; i < tempTbody.rows.length; i++) {
    tempTbody.rows[i].deleteCell(-1); // Deletes the last cell from each row
  }

  // Convert the temporary table to Excel workbook and download
  var wb = XLSX.utils.table_to_book(tempTable, { sheet: "Sheet1" });
  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    filename
  );
}
