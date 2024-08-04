document.addEventListener("DOMContentLoaded", function () {
  const url = "http://localhost:8080/api/agendamentos/listar";
  const itemsPerPage = 5;
  let currentPage = 1;
  let agendamentos = [];
  let totalAgendamentos = 0;
  let confirmados = 0;
  let agendamentoIdToDelete = null;
  let allStatuses = [];
  let editStatusId = null;
  let selectedAgendamentoId = null;

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

  // Filtrar agendamentos
  function filterAgendamentos() {
    const procedimentoValue = document.getElementById('procedimento-filter').value;
    const especificacaoValue = document.getElementById('especificacao-filter').value;
    const clienteValue = document.getElementById('cliente-filter').value;
    const dataValue = document.getElementById('data-filter').value;

    const filteredAgendamentos = agendamentos.filter(agendamento => {
      const matchProcedimento = procedimentoValue === "" || agendamento.procedimento.tipo === procedimentoValue;
      const matchEspecificacao = especificacaoValue === "" || agendamento.especificacao.especificacao === especificacaoValue;
      const matchCliente = clienteValue === "" || agendamento.usuario.nome === clienteValue;
      const matchData = dataValue === "" || agendamento.dataHorario.startsWith(dataValue);

      return matchProcedimento && matchEspecificacao && matchCliente && matchData;
    });

    renderTable(filteredAgendamentos);
  }

  function renderTable(filtro = 'todos') {
    const tbody = document.getElementById("procedures-tbody");
    tbody.innerHTML = "";

    const hoje = new Date();
    const dataHoje = `${hoje.getUTCFullYear()}-${String(hoje.getUTCMonth() + 1).padStart(2, '0')}-${String(hoje.getUTCDate()).padStart(2, '0')}`;

    let agendamentosFiltrados = agendamentos;

    if (filtro === 'hoje') {
      agendamentosFiltrados = agendamentos.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.dataHorario);
        const dataAgendamentoFormatada = `${dataAgendamento.getUTCFullYear()}-${String(dataAgendamento.getUTCMonth() + 1).padStart(2, '0')}-${String(dataAgendamento.getUTCDate()).padStart(2, '0')}`;
        return dataAgendamentoFormatada === dataHoje;
      });
    } else if (filtro === 'custom') {
      const from = document.getElementById("filter-from").value;
      const to = document.getElementById("filter-to").value;
      const client = document.getElementById("filter-client").value.toLowerCase();
      const procedure = document.getElementById("filter-procedure").value.toLowerCase();
      const specification = document.getElementById("filter-specification").value.toLowerCase();

      agendamentosFiltrados = agendamentos.filter(agendamento => {
        const dataAgendamento = new Date(agendamento.dataHorario);
        const dataAgendamentoFormatada = `${dataAgendamento.getUTCFullYear()}-${String(dataAgendamento.getUTCMonth() + 1).padStart(2, '0')}-${String(dataAgendamento.getUTCDate()).padStart(2, '0')}`;

        const isWithinDateRange = (!from || dataAgendamentoFormatada >= from) && (!to || dataAgendamentoFormatada <= to);
        const matchesClient = !client || agendamento.usuario.nome.toLowerCase().includes(client);
        const matchesProcedure = !procedure || agendamento.procedimento.tipo.toLowerCase().includes(procedure);
        const matchesSpecification = !specification || agendamento.especificacao.especificacao.toLowerCase().includes(specification);

        return isWithinDateRange && matchesClient && matchesProcedure && matchesSpecification;
      });
    }

    const totalPages = Math.ceil(agendamentosFiltrados.length / itemsPerPage);
    document.getElementById("current-page").textContent = currentPage;
    document.getElementById("total-pages").textContent = totalPages;

    document.getElementById("prev-page-btn").disabled = currentPage === 1;
    document.getElementById("next-page-btn").disabled = currentPage === totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    agendamentosFiltrados.slice(startIndex, endIndex).forEach((agendamento) => {
      const tr = document.createElement("tr");
      tr.classList.add("clickable-row");

      // Ajustar para UTC
      const dataHora = new Date(agendamento.dataHorario);
      const dia = String(dataHora.getUTCDate()).padStart(2, '0');
      const mes = String(dataHora.getUTCMonth() + 1).padStart(2, '0');
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
      statusColorDiv.style.marginRight = "5px";

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
      editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        editarAgendamento(agendamento.idAgendamento);
      });

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-btn");
      deleteButton.dataset.id = agendamento.idAgendamento;
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        excluirAgendamento(agendamento.idAgendamento);
      });

      acoesTd.appendChild(editButton);
      acoesTd.appendChild(deleteButton);
      tr.appendChild(acoesTd);

      tr.addEventListener("click", () => showDetalhesModal(agendamento.idAgendamento));

      tbody.appendChild(tr);
    });
  }

  function showDetalhesModal(id) {
    const agendamento = agendamentos.find(a => a.idAgendamento === id);

    if (agendamento) {
      selectedAgendamentoId = id; // Define o ID selecionado
      document.getElementById('detalhe-cliente').value = agendamento.usuario.nome;
      document.getElementById('detalhe-celular').value = agendamento.usuario.telefone;
      const dataHora = new Date(agendamento.dataHorario);
      document.getElementById('detalhe-data').value = `${dataHora.getUTCFullYear()}-${String(dataHora.getUTCMonth() + 1).padStart(2, '0')}-${String(dataHora.getUTCDate()).padStart(2, '0')}`;
      document.getElementById('detalhe-inicio').value = `${String(dataHora.getUTCHours()).padStart(2, '0')}:${String(dataHora.getUTCMinutes()).padStart(2, '0')}`;
      document.getElementById('detalhe-fim').value = `${String(dataHora.getUTCHours() + 1).padStart(2, '0')}:${String(dataHora.getUTCMinutes()).padStart(2, '0')}`; // Ajuste conforme necessário
      document.getElementById('detalhe-procedimento').value = agendamento.procedimento.tipo;
      document.getElementById('detalhe-status').value = agendamento.statusAgendamento.nome;

      // Verifica o status do agendamento
      const statusId = agendamento.statusAgendamento.id; // Assumindo que você tem o id no objeto de status
      const clienteFaltouButton = document.getElementById('clienteFaltou');
      const atendimentoConcluidoButton = document.getElementById('atendimentoConcluido');

      // Desabilita ou habilita os botões conforme o status
      if (statusId === 1) { // Status Agendado
        clienteFaltouButton.disabled = false;
        atendimentoConcluidoButton.disabled = false;
        clienteFaltouButton.classList.remove('btn-disabled');
        atendimentoConcluidoButton.classList.remove('btn-disabled');
      } else {
        clienteFaltouButton.disabled = true;
        atendimentoConcluidoButton.disabled = true;
        clienteFaltouButton.classList.add('btn-disabled');
        atendimentoConcluidoButton.classList.add('btn-disabled');
      }

      document.getElementById('detalhes-modal').style.display = 'block';
    }
  }

  window.closeDetalhesModal = function () {
    selectedAgendamentoId = null; // Redefinir o ID selecionado
    document.getElementById('detalhes-modal').style.display = 'none';
  };

  window.clienteFaltou = async function () {
    if (!selectedAgendamentoId) {
      showNotification('Nenhum agendamento selecionado!', true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/agendamentos/atualizar-status/${selectedAgendamentoId}?statusId=2`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error('Erro ao atualizar o status para "Cliente Faltou".');
      await fetchAgendamentos(); // Atualizar a lista de agendamentos
      closeDetalhesModal(); // Fechar o modal de detalhes
      showNotification('Status atualizado para "Cliente Faltou" com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
      showNotification('Erro ao atualizar o status!', true);
    }
  }

  window.atendimentoConcluido = async function () {
    if (!selectedAgendamentoId) {
      showNotification('Nenhum agendamento selecionado!', true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/agendamentos/atualizar-status/${selectedAgendamentoId}?statusId=3`, {
        method: 'PUT'
      });

      if (!response.ok) throw new Error('Erro ao atualizar o status para "Atendimento Concluído".');
      await fetchAgendamentos(); // Atualizar a lista de agendamentos
      closeDetalhesModal(); // Fechar o modal de detalhes
      showNotification('Status atualizado para "Atendimento Concluído" com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar o status:', error);
      showNotification('Erro ao atualizar o status!', true);
    }
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

  window.salvarStatus = function () {
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

  window.carregarStatus = function () {
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
        allStatuses = data; // Guardar os status carregados
        const tbody = document.getElementById("status-tbody");
        tbody.innerHTML = ""; // Limpa o conteúdo existente

        data.forEach(status => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${status.nome}</td>
              <td><div class="color-box" style="background-color: ${status.cor}; width: 20px; height: 20px; border-radius: 100px; margin-left: 35%;"></div></td>
              <td>
                  <button class="edit-btn" data-id="${status.id}"><i class="fas fa-edit"></i></button>
                  <button class="delete-btn" data-id="${status.id}"><i class="fas fa-trash"></i></button>
              </td>
            `;
          tbody.appendChild(row);
        });

        attachEventListeners(); // Reanexar os event listeners
      })
      .catch(error => {
        console.error("Erro:", error.message);
        alert(error.message);
      });
  };

  window.confirmDeletion2 = async function () {
    if (deleteStatusId) {
      try {
        const response = await fetch(`http://localhost:8080/status-agendamento/exclusao-por-id/${deleteStatusId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao excluir o status.');
        await carregarStatus();
        deleteStatusId = null;
        closeDeleteModal();
        showNotification('Status excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir o status:', error);
        showNotification('Erro ao excluir o status!', true);
      }
    }
  };

  window.salvarStatusEditado = async function () {
    if (editStatusId) {
      const nome = document.getElementById('edit-nome2').value;
      const cor = document.getElementById('edit-cor2').value;
      const statusData = {
        nome: nome,
        cor: cor
      };

      try {
        const response = await fetch(`http://localhost:8080/status-agendamento/atualizacao-status/${editStatusId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(statusData)
        });
        if (!response.ok) throw new Error('Erro ao editar o status.');
        await carregarStatus();
        await fetchAgendamentos(); // Adicione esta linha para atualizar a tabela de agendamentos
        editStatusId = null;
        closeEditModal();
        showNotification('Status editado com sucesso!');
      } catch (error) {
        console.error('Erro ao editar o status:', error);
        showNotification('Erro ao editar o status!', true);
      }
    }
  };

  function attachEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', e => {
        deleteStatusId = e.target.closest('button').getAttribute('data-id');
        const status = allStatuses.find(status => status.id == deleteStatusId);
        document.getElementById('status-name').innerText = status.nome;
        openDeleteModal();
      });
    });

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
      button.addEventListener('click', e => {
        editStatusId = e.target.closest('button').getAttribute('data-id');
        const status = allStatuses.find(status => status.id == editStatusId);
        document.getElementById('edit-nome2').value = status.nome;
        document.getElementById('edit-cor2').value = status.cor;
        openEditModal();
      });
    });
  }

  window.openDeleteModal = function () {
    document.getElementById("delete-modal").style.display = "block";
  };

  window.closeDeleteModal = function () {
    document.getElementById("delete-modal").style.display = "none";
    deleteStatusId = null;
  };

  window.openEditModal = function () {
    document.getElementById("edit-modal").style.display = "block";
  };

  window.closeEditModal = function () {
    document.getElementById("edit-modal").style.display = "none";
    editStatusId = null;
  };

  document.getElementById('open-save-modal-btn').addEventListener('click', () => {
    document.getElementById('save-modal').style.display = 'block';
  });

  function setActiveTab(tabId) {
    // Remove a classe active de todos os botões
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });

    // Adiciona a classe active ao botão clicado
    document.getElementById(tabId).classList.add('active');
  }

  setActiveTab('todos-agendamentos');

  document.getElementById("todos-agendamentos").addEventListener("click", () => {
    currentPage = 1;
    setActiveTab('todos-agendamentos');
    renderTable('todos');
  });

  document.getElementById("hoje-agendamentos").addEventListener("click", () => {
    currentPage = 1;
    setActiveTab('hoje-agendamentos');
    renderTable('hoje');
  });

  document.getElementById('save-button').addEventListener('click', salvarStatus);

  document.getElementById('open-status-modal-btn').addEventListener('click', () => {
    carregarStatus();
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

document.addEventListener('DOMContentLoaded', function () {
  fetch('http://localhost:8080/api/procedimentos/listar')
    .then(response => response.json())
    .then(data => {
      const procedimentoSelect = document.getElementById('procedimento-filtro');
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.idProcedimento;
        option.textContent = item.tipo;
        procedimentoSelect.appendChild(option);
      });
    });

  fetch('http://localhost:8080/especificacoes')
    .then(response => response.json())
    .then(data => {
      const especificacaoSelect = document.getElementById('especificacao-filtro');
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.idEspecificacao;
        option.textContent = item.especificacao;
        especificacaoSelect.appendChild(option);
      });
    });

  fetch('http://localhost:8080/usuarios')
    .then(response => response.json())
    .then(data => {
      const clienteSelect = document.getElementById('cliente-filtro');
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.idCliente;
        option.textContent = item.nome;
        clienteSelect.appendChild(option);
      });
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