document.addEventListener("DOMContentLoaded", function () {
  const url = "http://localhost:8080/api/agendamentos/listar";
  const itemsPerPage = 5;
  let currentPage = 1;
  let agendamentos = [];
  let totalAgendamentos = 0;
  let confirmados = 0;
  let agendamentoIdToDelete = null;

  async function fetchAgendamentos() {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao carregar os agendamentos.");
      }
      const data = await response.json();
      agendamentos = data;

      // Ordenar agendamentos por data, do mais recente ao mais antigo
      agendamentos.sort((a, b) => new Date(b.dataHorario) - new Date(a.dataHorario));

      totalAgendamentos = agendamentos.length;
      confirmados = agendamentos.filter(
        (agendamento) => agendamento.statusAgendamento.nome === "Concluído"
      ).length;

      atualizarProgressBar(confirmados, totalAgendamentos);
      renderTable();
    } catch (error) {
      console.error("Erro ao buscar os agendamentos:", error);
    }
  }

  function renderTable() {
    const tbody = document.getElementById("procedures-tbody");
    tbody.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    agendamentos.slice(startIndex, endIndex).forEach((agendamento) => {
      const tr = document.createElement("tr");

      // Ajustar para UTC
      const dataHora = new Date(agendamento.dataHorario);
      const dia = String(dataHora.getUTCDate()).padStart(2, '0');
      const mes = String(dataHora.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
      const horas = String(dataHora.getUTCHours()).padStart(2, '0');
      const minutos = String(dataHora.getUTCMinutes()).padStart(2, '0');
      const dataHoraFormatada = `${dia}/${mes} - ${horas}:${minutos}`;

      const dataHoraTd = document.createElement("td");
      dataHoraTd.textContent = dataHoraFormatada;
      tr.appendChild(dataHoraTd);

      const clienteTd = document.createElement("td");
      clienteTd.textContent = agendamento.usuario.nome;
      tr.appendChild(clienteTd);

      const procedimentoTd = document.createElement("td");
      procedimentoTd.textContent = agendamento.procedimento.tipo;
      tr.appendChild(procedimentoTd);

      const especificacaoTd = document.createElement("td");
      especificacaoTd.textContent = agendamento.especificacao.especificacao;
      tr.appendChild(especificacaoTd);

      // Cria uma td para o status
      const statusTd = document.createElement("td");

      // Cria a div com a cor do status
      const statusColorDiv = document.createElement("div");
      statusColorDiv.style.backgroundColor = agendamento.statusAgendamento.cor;
      statusColorDiv.style.width = "10px";
      statusColorDiv.style.height = "10px";
      statusColorDiv.style.borderRadius = "100px";
      statusColorDiv.style.display = "inline-block";
      statusColorDiv.style.marginRight = "5px"; // Espaço entre a bolinha e o nome do status

      // Cria um span para o nome do status
      const statusNomeSpan = document.createElement("span");
      statusNomeSpan.textContent = agendamento.statusAgendamento.nome;

      // Adiciona o div de cor e o span de nome à td de status
      statusTd.appendChild(statusColorDiv);
      statusTd.appendChild(statusNomeSpan);
      tr.appendChild(statusTd);

      const acoesTd = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.classList.add("edit-btn");
      editButton.dataset.id = agendamento.idAgendamento;
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.addEventListener("click", () => editarAgendamento(agendamento.idAgendamento));

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-btn");
      deleteButton.dataset.id = agendamento.idAgendamento;
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.addEventListener("click", () => excluirAgendamento(agendamento.idAgendamento));

      acoesTd.appendChild(editButton);
      acoesTd.appendChild(deleteButton);
      tr.appendChild(acoesTd);

      tbody.appendChild(tr);
    });

    const totalPages = Math.ceil(totalAgendamentos / itemsPerPage);
    document.getElementById("current-page").textContent = currentPage;
    document.getElementById("total-pages").textContent = totalPages;

    document.getElementById("prev-page-btn").disabled = currentPage === 1;
    document.getElementById("next-page-btn").disabled = currentPage === totalPages;
  }


  function atualizarProgressBar(confirmados, total) {
    const progress = document.getElementById("progress");
    const percentage = total === 0 ? 0 : (confirmados / total) * 100;
    progress.style.width = `${percentage}%`;

    document.getElementById("progress-label").textContent = `Atendimentos Concluídos: ${confirmados}`;
    document.getElementById("total-label").textContent = `Atendimentos Totais: ${total}`;
  }

  document.getElementById("prev-page-btn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  document.getElementById("next-page-btn").addEventListener("click", () => {
    const totalPages = Math.ceil(agendamentos.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  window.editarAgendamento = function (id) {
    window.location.href = `agendamento-forms/editar-agendamento/editar-agendamento.html?id=${id}`;
  };

  window.excluirAgendamento = function (id) {
    agendamentoIdToDelete = id;
    document.getElementById("procedimento").textContent = `ID do agendamento: ${id}`;
    document.getElementById("modal").style.display = "block";
  };

  window.closeModal = function () {
    document.getElementById("modal").style.display = "none";
  };

  window.confirmDeletion = async function () {
    if (agendamentoIdToDelete !== null) {
      try {
        const response = await fetch(`http://localhost:8080/api/agendamentos/excluir/${agendamentoIdToDelete}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao excluir o agendamento.');
        await fetchAgendamentos();
        agendamentoIdToDelete = null;
        closeModal();
        showNotification("Agendamento excluído com sucesso!");
      } catch (error) {
        console.error('Erro ao excluir o agendamento:', error);
        showNotification('Erro ao excluir o agendamento!', true);
      }
    }
  };

  function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    notificationMessage.textContent = message;
    if (isError) {
      notification.classList.add('error');
    } else {
      notification.classList.remove('error');
    }
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }

  fetchAgendamentos();

  function salvarStatus() {
    // Obter os valores dos inputs
    const nome = document.getElementById('edit-nome').value;
    const cor = document.getElementById('edit-cor').value;

    // Validar os dados antes de enviar
    if (!nome || !cor) {
      showNotification("Por favor, preencha todos os campos!", true);
      return;
    }

    // Preparar o corpo da requisição
    const statusData = {
      nome: nome,
      cor: cor,
      motivo: '' // Enviar motivo vazio por enquanto
    };

    // Fazer a requisição POST
    fetch('http://localhost:8080/status-agendamento/cadastro-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusData)
    })
      .then(response => {
        // Verificar o tipo de conteúdo da resposta
        const contentType = response.headers.get('Content-Type');

        if (contentType && contentType.includes('application/json')) {
          return response.json(); // Se for JSON, parse como JSON
        } else {
          return response.text(); // Caso contrário, trate como texto
        }
      })
      .then(data => {
        // Exibir a mensagem de sucesso retornada pelo servidor
        showNotification("Status cadastrado com sucesso!");
        document.getElementById('save-modal').style.display = 'none'; // Fechar o modal após o sucesso
      })
      .catch(error => {
        console.error('Erro ao salvar o status:', error);
        showNotification("Ocorreu um erro ao salvar o status!", true);
      });
  }

  document.getElementById('open-save-modal-btn').addEventListener('click', () => {
    document.getElementById('save-modal').style.display = 'block';
  });

  document.getElementById('save-button').addEventListener('click', salvarStatus);

  document.getElementById('open-status-modal-btn').addEventListener('click', () => {
    document.getElementById('status-modal').style.display = 'block';
  });

  document.getElementById('open-filter-modal-btn').addEventListener('click', () => {
    document.getElementById('filter-modal').style.display = 'block';
  });
  document.getElementById('close-save-modal').addEventListener('click', () => {
    document.getElementById('save-modal').style.display = 'none';
  });

  document.getElementById('close-status-modal').addEventListener('click', () => {
    document.getElementById('status-modal').style.display = 'none';
  });

  document.getElementById('close-filter-modal').addEventListener('click', () => {
    document.getElementById('filter-modal').style.display = 'none';
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Função para carregar os status ao abrir o modal
  function carregarStatus() {
    fetch('http://localhost:8080/status-agendamento')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 204) {
          throw new Error("Nenhum status cadastrado ainda.");
        } else {
          throw new Error("Erro ao buscar os status.");
        }
      })
      .then(data => {
        const tbody = document.getElementById("status-tbody");
        tbody.innerHTML = ""; // Limpa o conteúdo existente

        data.forEach(status => {
          const row = document.createElement("tr");
          row.innerHTML = `
                      <td>${status.nome}</td>
                      <td><div class="color-box" style="background-color: ${status.cor}; width: 20px; height: 20px;"></div></td>
                      <td>
                          <button class="edit-btn" data-id="${status.id}"><i class="fas fa-edit"></i></button>
                          <button class="delete-btn" data-id="${status.id}"><i class="fas fa-trash"></i></button>
                      </td>
                  `;
          tbody.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Erro:", error.message);
        alert(error.message);
      });
    attachEventListeners();

  }

  // Exemplo: carregar status ao abrir o modal
  const statusModal = document.getElementById("status-modal");
  statusModal.addEventListener("show", carregarStatus); // Se o modal tiver um evento de exibição
  // Ou chame carregarStatus() em outro ponto adequado, como ao clicar em um botão
  carregarStatus();
});

document.addEventListener("DOMContentLoaded", function () {
  const statusModal = document.getElementById("status-modal");
  const closeModalButton = document.getElementById("close-modal");

  // Função para fechar o modal
  function fecharModal() {
    statusModal.style.display = "none";
  }

  // Evento de clique no botão "X" para fechar o modal
  closeModalButton.addEventListener("click", fecharModal);

  // Exemplo: abrir o modal para teste
  function abrirModal() {
    statusModal.style.display = "block";
  }

  // Simulando a abertura do modal para testes
  abrirModal();
});

function attachEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteStatusId = e.target.closest("button").getAttribute("data-id");
      const status = allStatuses.find((status) => status.id == deleteStatusId);
      procedimentoText.innerText = status.nome;
      openDeleteModal();
    });
  });

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      editStatusId = e.target.closest("button").getAttribute("data-id");
      const status = allStatuses.find((status) => status.id == editStatusId);
      editNome.value = status.nome;
      editCor.value = status.cor;
      openEditModal();
    });
  });
}

function openDeleteModal() {
  modal.style.display = "block";
}

function closeDeleteModal() {
  modal.style.display = "none";
  deleteStatusId = null;
}

function openEditModal() {
  editModal.style.display = "block";
}

function closeEditModal() {
  editModal.style.display = "none";
  editStatusId = null;
}