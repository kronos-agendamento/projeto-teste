let procedimentos = [];

document.addEventListener("DOMContentLoaded", function () {
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
  let procedimentoParaDeletar = null;

  // Função para mostrar notificações
  function showNotification(message, isError = false, duration = 3000) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    notificationMessage.textContent = message;
    notification.classList.toggle("error", isError);
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, duration);
  }

  // Função para buscar dados de KPIs
  function fetchData(endpoint, id) {
    fetch(baseUrl + endpoint)
      .then((response) => response.json())
      .then((data) => {
        document.getElementById(id).textContent =
          data?.tipo || "Não disponível";
      })
      .catch(() => {
        document.getElementById(id).textContent = "Erro ao carregar";
      });
  }

  function updateKPIs() {
    const endpoints = {
      maisAgendado: "/procedimentos/mais-agendado",
      menosAgendado: "/procedimentos/menos-agendado",
      melhorAvaliado: "/procedimentos/melhor-nota",
    };

    Object.entries(endpoints).forEach(([key, endpoint]) => {
      fetchData(endpoint, key);
    });
  }

  // Formatar duração
  function formatDuration(duration) {
    const [hours, minutes] = duration.split(":").map(Number);
    return `${hours}h ${minutes} min`;
  }

  // Carregar procedimentos da API
  async function fetchProcedures() {
    try {
      const response = await fetch(`${baseUrl}/especificacoes`);
      return await response.json();
    } catch {
      return [];
    }
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
      const homecare = procedure.homecare;
      const procedimentoId = procedure.procedimento.idProcedimento; // ID do procedimento
      const especificacaoId = procedure.idEspecificacaoProcedimento; // ID da especificação

      // Determinar o ícone de homecare
      const homecareIcon = homecare
        ? '<div style="color: green; border-radius: 50%; background-color: green; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; margin-left:30px;"><span style="color: white;">✔</span></div>'
        : '<div style="color: red; border-radius: 50%; background-color: red; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; margin-left:30px;"><span style="color: white;">✘</span></div>';

      row.innerHTML = `
              <td>${nome}</td>
              <td>${preco}</td>
              <td>${duracao}</td>
              <td>${especificacao}</td>
              <td style="text-align: center;">${homecareIcon}</td> 
              <td>
                  <!-- Botão de Editar com tooltip -->
                  <div class="tooltip-wrapper">
                      <button class="edit-btn" data-id-especificacao="${especificacaoId}" data-id-procedimento="${procedimentoId}" style="border: none; background: transparent; cursor: pointer;">
                          <img src="../../assets/icons/editar.png" alt="Editar" style="width: 20px; height: 20px;">
                      </button>
                      <div class="tooltip11">Editar</div>
                  </div>
          
                  <!-- Botão de Excluir com tooltip -->
                  <div class="tooltip-wrapper">
                      <button class="delete-btn" data-id-especificacao="${especificacaoId}" data-id-procedimento="${procedimentoId}" data-tipo="${nome}" data-especificacao="${especificacao}" style="border: none; background: transparent; cursor: pointer;">
                          <img src="../../assets/icons/excluir.png" alt="Excluir" style="width: 20px; height: 20px;">
                      </button>
                      <div class="tooltip11">Excluir</div>
                  </div>
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

  function updatePagination(totalItems) {
    currentPageSpan.textContent = currentPage;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    totalPagesSpan.textContent = totalPages;

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  async function deleteProcedimento(idEspecificacao, idProcedimento) {
    try {
      await fetch(`${baseUrl}/especificacoes/${idEspecificacao}`, {
        method: "DELETE",
      });
      await fetch(`${baseUrl}/procedimentos/${idProcedimento}`, {
        method: "DELETE",
      });
      showNotification("Procedimento deletado com sucesso!");
    } catch {
      showNotification("Erro ao deletar procedimento.", true);
    }
  }

  function showModal(tipo, especificacao) {
    modalProcedimento.textContent = `Procedimento: ${tipo}`;
    document.getElementById(
      "especificacao"
    ).textContent = `Especificação: ${especificacao}`;
    modal.style.display = "block";
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function setupPagination() {
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
  }

  function setupButtons() {
    btnYes.addEventListener("click", async () => {
      if (procedimentoParaDeletar) {
        const { idEspecificacao, idProcedimento } = procedimentoParaDeletar;
        await deleteProcedimento(idEspecificacao, idProcedimento);
        procedimentos = await fetchProcedures();
        renderTable(procedimentos, currentPage);
        closeModal();
      }
    });

    proceduresTbody.addEventListener("click", (event) => {
      const editBtn = event.target.closest(".edit-btn");
      const deleteBtn = event.target.closest(".delete-btn");

      if (editBtn) {
        const idEspecificacao = editBtn.dataset.idEspecificacao;
        const idProcedimento = editBtn.dataset.idProcedimento;
        window.location.href = `procedimento-forms/editar-procedimento/editar-procedimento.html?idEspecificacao=${idEspecificacao}&idProcedimento=${idProcedimento}`;
      }

      if (deleteBtn) {
        procedimentoParaDeletar = {
          idEspecificacao: deleteBtn.dataset.idEspecificacao,
          idProcedimento: deleteBtn.dataset.idProcedimento,
        };
        showModal(deleteBtn.dataset.tipo, deleteBtn.dataset.especificacao);
      }
    });
  }

  async function init() {
    procedimentos = await fetchProcedures();
    renderTable(procedimentos, currentPage);
    setupPagination();
    setupButtons();
    updateKPIs();
  }

  init();
});

// Exibir informações do usuário
document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

// Carregar imagem de perfil do usuário
async function carregarImagem2() {
  const cpf = localStorage.getItem("cpf");
  if (!cpf) return;

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

window.onload = carregarImagem2;
