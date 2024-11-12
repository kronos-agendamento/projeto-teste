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
  let agendamentosOriginais = []; // Para armazenar os agendamentos originais
  let agendamentosFiltrados = []; // Variável para armazenar os agendamentos filtrados
  let filtroAtivo = null; // Variável para armazenar o filtro atual

  // Função para abrir o novo modal de status
  function openCustomStatusModal() {
    const modal = document.getElementById("custom-status-modal");
    modal.style.display = "flex";
    carregarStatusParaModal(); // Carrega os status quando o modal é aberto
  }

  // Função para carregar os status no modal
  function carregarStatusParaModal() {
    fetch("http://localhost:8080/status-agendamento")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 204) {
          throw new Error("Nenhum status cadastrado ainda.");
        } else {
          throw new Error("Erro ao buscar os status.");
        }
      })
      .then((data) => {
        const tbody = document.getElementById("custom-status-tbody");
        tbody.innerHTML = ""; // Limpa o conteúdo existente

        data.forEach((status) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${status.nome}</td>
            <td><div class="color-box" style="background-color: ${status.cor}; width: 20px; height: 20px; border-radius: 100px;"></div></td>
            <td><button class="select-btn" data-id="${status.id}" data-nome="${status.nome}">Selecionar</button></td>
          `;
          tbody.appendChild(row);
        });

        // Adiciona event listeners aos botões de seleção
        document.querySelectorAll(".select-btn").forEach((button) => {
          button.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const nome = this.getAttribute("data-nome");
            selecionarStatus(id, nome);
          });
        });
      })
      .catch((error) => {
        console.error("Erro:", error.message);
      });
  }

// Função para selecionar um status e atualizar
function selecionarStatus(id, nome) {
  fetch(`http://localhost:8080/api/agendamentos/atualizar-status/${selectedAgendamentoId}?statusId=${id}`, {
      method: "PUT",
  })
  .then((response) => {
      if (!response.ok) throw new Error("Erro ao atualizar o status.");
      return response.json();
  })
  .then((data) => {
      // Exibe uma notificação de sucesso
      showNotification(`Status atualizado para "${nome}" com sucesso!`);
      fetchAgendamentos(); // Atualizar a lista de agendamentos
      closeCustomStatusModal(); // Fechar o modal
      
      // Após atualizar o status, busca o e-mail do cliente
      buscarEmailCliente(selectedAgendamentoId, nome);  // Passa o ID do agendamento atualizado e o nome do novo status
  })
  .catch((error) => {
      console.error("Erro ao atualizar o status:", error);
      showNotification("Erro ao atualizar o status!", true);
  });
}

async function buscarEmailCliente(selectedAgendamentoId, nome) {
  try {
      const response = await fetch(`http://localhost:8080/api/agendamentos/buscar/${selectedAgendamentoId}`);
      if (!response.ok) {
          throw new Error(`Erro ao buscar agendamento com ID: ${selectedAgendamentoId}`);
      }
      const data = await response.json();

      // Adiciona um log para verificar os dados da resposta
      console.log('Resposta da API:', data);

      // Aqui você ajusta conforme a resposta que você verá no console
      const clienteEmail = data.email 
      const nomeCliente = data.usuario 
      const dataHoraAgendamento = new Date(data.dataHorario); // Supondo que você tem `dataHorario`
const dataFormatada = dataHoraAgendamento.toLocaleDateString('pt-BR');
const horaFormatada = dataHoraAgendamento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dataAgend = `${dataFormatada} às ${horaFormatada}`;


      const especificacao = data.especificacao


      // Verificar se o e-mail está disponível
      if (!clienteEmail) {
          console.error("E-mail do cliente não encontrado.");
          return;
      }

      // Enviar e-mail ao cliente sobre a atualização de status
      enviarEmail(clienteEmail, nomeCliente, nome, dataAgend, especificacao);

  } catch (error) {
      console.error('Erro ao buscar o e-mail do cliente:', error);
  }
}



// Função para enviar o e-mail após a atualização do status
async function enviarEmail(clienteEmail, nomeCliente, nome, dataAgend, especificacao) {
  try {
      const response = await fetch('http://127.0.0.1:5001/enviar-email-status', { // Rota do servidor Flask para enviar e-mail
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: clienteEmail,      // E-mail do destinatário
              nome: nomeCliente,        // Nome do cliente
              mensagem: `Olá ${nomeCliente}, o status do seu agendamento do dia ${dataAgend} para o procedimento de ${especificacao} foi alterado para "${nome}".` // Mensagem personalizada
          })
      });

      const data = await response.json();
      if (response.ok) {
          console.log(`Email enviado com sucesso para ${clienteEmail}`);
          showNotification("E-mail enviado com sucesso!");
      } else {
          console.error('Erro ao enviar o e-mail:', data.error);
          showNotification('Erro ao enviar o e-mail.', true);
      }
  } catch (error) {
      console.error('Erro ao enviar o e-mail:', error);
      showNotification('Erro ao enviar o e-mail.', true);
  }
}



  // Função para fechar o modal de seleção de status
  function closeCustomStatusModal() {
    const modal = document.getElementById("custom-status-modal");
    modal.style.display = "none";
  }

  // Adiciona um botão para abrir o modal de seleção de status
  document
    .getElementById("select-status-btn")
    .addEventListener("click", carregarStatusParaModal);

  totalAgendamentos = agendamentos.filter(
    (agendamento) => agendamento.statusAgendamento.nome !== "Cancelado"
  ).length;

  confirmados = agendamentos.filter(
    (agendamento) =>
      agendamento.statusAgendamento.nome === "Concluído" &&
      agendamento.statusAgendamento.nome !== "Cancelado"
  ).length;

  async function fetchAgendamentos() {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao carregar os agendamentos.");
      }
      const data = await response.json();

      // Filtra para excluir os agendamentos de tipo "Bloqueio"
      agendamentos = data.filter(
        (agendamento) => agendamento.tipoAgendamento !== "Bloqueio"
      );

      // Armazena uma cópia dos agendamentos originais para uso posterior
      agendamentosOriginais = [...agendamentos];

      agendamentosFiltrados = agendamentos;

      // Ordenar agendamentos por data, do mais recente ao mais antigo
      agendamentos.sort(
        (a, b) => new Date(b.dataHorario) - new Date(a.dataHorario)
      );

      // Exclui os agendamentos cancelados do total
      totalAgendamentos = agendamentos.filter(
        (agendamento) => agendamento.statusAgendamento.nome !== "Cancelado"
      ).length;

      // Conta somente os agendamentos concluídos, excluindo os cancelados
      confirmados = agendamentos.filter(
        (agendamento) =>
          agendamento.statusAgendamento.nome === "Concluído" &&
          agendamento.statusAgendamento.nome !== "Cancelado"
      ).length;

      // Atualiza a barra de progresso com os dados corretos
      atualizarProgressBar(confirmados, totalAgendamentos);
      renderTable();
    } catch (error) {
      console.error("Erro ao buscar os agendamentos:", error);
    }
  }

  function renderTable() {
    console.log(agendamentosFiltrados);
    const tbody = document.getElementById("procedures-tbody");
    tbody.innerHTML = "";

    const totalPages = Math.ceil(agendamentosFiltrados.length / itemsPerPage);
    document.getElementById("current-page").textContent = currentPage;
    document.getElementById("total-pages").textContent = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const agendamentosPaginaAtual = agendamentosFiltrados.slice(
      startIndex,
      endIndex
    );

    document.getElementById("prev-page-btn").disabled = currentPage === 1;
    document.getElementById("next-page-btn").disabled =
      currentPage === totalPages;

      agendamentosPaginaAtual.forEach((agendamento) => {
        const tr = document.createElement("tr");
        tr.classList.add("clickable-row");
      
        // Ajustar para o horário local
        const dataHora = new Date(agendamento.dataHorario);
        const dia = String(dataHora.getDate()).padStart(2, "0");
        const mes = String(dataHora.getMonth() + 1).padStart(2, "0");
        const horas = String(dataHora.getHours()).padStart(2, "0");
        const minutos = String(dataHora.getMinutes()).padStart(2, "0");
        const dataHoraFormatada = `${dia}/${mes} - ${horas}:${minutos}`;
      
        const dataHoraTd = document.createElement("td");
        dataHoraTd.textContent = dataHoraFormatada;
        tr.appendChild(dataHoraTd);
      
        const clienteTd = document.createElement("td");
        clienteTd.textContent = agendamento.usuario;
        clienteTd.dataset.idUsuario = agendamento.usuarioId;
        clienteTd.dataset.idAgendamento = agendamento.idAgendamento;
        tr.appendChild(clienteTd);
      
        const procedimentoTd = document.createElement("td");
        procedimentoTd.textContent = agendamento.procedimento;
        procedimentoTd.dataset.fkProcedimento = agendamento.fkProcedimento;
        tr.appendChild(procedimentoTd);
      
        const especificacaoTd = document.createElement("td");
        especificacaoTd.textContent = agendamento.especificacao;
        especificacaoTd.dataset.fkEspecificacao = agendamento.fkEspecificacao;
        tr.appendChild(especificacaoTd);
      
        const statusTd = document.createElement("td");
        const statusColorDiv = document.createElement("div");
        statusColorDiv.style.backgroundColor = agendamento.statusAgendamento.cor;
        statusColorDiv.style.width = "10px";
        statusColorDiv.style.height = "10px";
        statusColorDiv.style.borderRadius = "100px";
        statusColorDiv.style.display = "inline-block";
        statusColorDiv.style.marginRight = "5px";
      
        const statusNomeSpan = document.createElement("span");
        statusNomeSpan.textContent = agendamento.statusAgendamento.nome;
      
        statusTd.appendChild(statusColorDiv);
        statusTd.appendChild(statusNomeSpan);
        tr.appendChild(statusTd);
      
        const acoesTd = document.createElement("td");
      
        // Função para criar tooltips
        function addTooltip(element, text) {
          const tooltip = document.createElement("span");
          tooltip.classList.add("tooltip-40");
          tooltip.innerText = text;
          element.appendChild(tooltip);
      
          element.addEventListener("mouseover", () => {
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = "1";
          });
      
          element.addEventListener("mouseout", () => {
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = "0";
          });
        }
      
        // Botão de Editar
        const editButton = document.createElement("button");
        editButton.classList.add("edit-btn", "filter-btn");
        editButton.dataset.id = agendamento.idAgendamento;
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        addTooltip(editButton, "Editar");
        editButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Impede que o evento se propague para a linha
          editarAgendamento(
            clienteTd.dataset.idAgendamento,
            clienteTd.dataset.idUsuario,
            procedimentoTd.dataset.fkProcedimento,
            especificacaoTd.dataset.fkEspecificacao
          );
        });
        acoesTd.appendChild(editButton);
      
        // Botão de Excluir
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-btn", "filter-btn");
        deleteButton.dataset.id = agendamento.idAgendamento;
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        addTooltip(deleteButton, "Excluir");
        deleteButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Impede que o evento se propague para a linha
          excluirAgendamento(agendamento.idAgendamento);
        });
        acoesTd.appendChild(deleteButton);
      
        tr.appendChild(acoesTd);
        tr.addEventListener("click", () =>
          showDetalhesModal(agendamento.idAgendamento)
        );
      
        tbody.appendChild(tr);
      });
      
  }

  window.excluirAgendamento = function (id) {
    agendamentoIdToDelete = id;
    document.getElementById(
      "procedimento"
    ).textContent = `ID do agendamento: ${id}`;
    document.getElementById("modal").style.display = "block";
  };

  window.closeModal = function () {
    document.getElementById("modal").style.display = "none";
  };

  window.confirmDeletion = async function () {
    if (agendamentoIdToDelete !== null) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/agendamentos/excluir/${agendamentoIdToDelete}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Erro ao excluir o agendamento.");
        await fetchAgendamentos(); // Atualiza a lista de agendamentos após exclusão
        agendamentoIdToDelete = null;
        closeModal();
        showNotification("Agendamento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o agendamento:", error);
        showNotification("Erro ao excluir o agendamento!", true);
      }
    }
  };

  function aplicarFiltroAtual() {
    if (filtroAtivo === "hoje") {
      const hoje = new Date();
      const diaAtual = hoje.getDate();
      const mesAtual = hoje.getMonth();
      const anoAtual = hoje.getFullYear();

      agendamentosFiltrados = agendamentosFiltrados.filter((agendamento) => {
        const dataAgendamento = new Date(agendamento.dataHorario);
        return (
          dataAgendamento.getDate() === diaAtual &&
          dataAgendamento.getMonth() === mesAtual &&
          dataAgendamento.getFullYear() === anoAtual
        );
      });
    } else if (filtroAtivo === "todos") {
      agendamentosFiltrados = [...agendamentosOriginais]; // Mostra todos os dados filtrados originalmente
    }
    renderTable(); // Renderiza a tabela novamente com os dados filtrados
  }
  // Botão para filtrar agendamentos de hoje
  document.getElementById("hoje-agendamentos").addEventListener("click", () => {
    filtroAtivo = "hoje";
    aplicarFiltroAtual();
  });

  // Botão para mostrar todos os agendamentos
  document
    .getElementById("todos-agendamentos")
    .addEventListener("click", () => {
      filtroAtivo = "todos";
      aplicarFiltroAtual();
    });

  // Inicialmente oculta o botão "Limpar Filtros"
  document.getElementById("clear-all-filters").style.display = "none";

  // Atualiza a função de aplicação de filtros
  document
    .getElementById("apply-filter-button")
    .addEventListener("click", () => {
      const from = document.getElementById("filter-from").value;
      const to = document.getElementById("filter-to").value;
      const client = document.getElementById("cliente-filtro").value;
      const procedure = document.getElementById("procedimento-filtro").value;
      const specification = document.getElementById(
        "especificacao-filtro"
      ).value;

      const params = new URLSearchParams({
        dataInicio: from || "",
        dataFim: to || "",
        clienteId: client || "",
        procedimentoId: procedure || "",
        especificacaoId: specification || "",
      });

      fetch(
        `http://localhost:8080/api/agendamentos/filtro?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((agendamentos) => {
          agendamentosFiltrados = agendamentos; // Atualiza a variável global com os agendamentos filtrados
          currentPage = 1; // Reseta a página para 1
          renderTable(); // Re-renderiza a tabela com os dados filtrados

          // Mostra o botão "Limpar Filtros" quando houver filtros aplicados
          document.getElementById("clear-all-filters").style.display = "flex";
        })
        .catch((error) => {
          console.error("Erro ao aplicar filtros:", error);
        });
    });

  document.getElementById("exportar-planilha").addEventListener("click", () => {
    document.getElementById("export-modal").style.display = "flex";
  });

  document.getElementById("export-all").addEventListener("click", () => {
    exportarParaExcel("todos");
    fecharModal();
  });

  document.getElementById("export-today").addEventListener("click", () => {
    exportarParaExcel("hoje");
    fecharModal();
  });

  document
    .getElementById("cancel-export")
    .addEventListener("click", fecharModal);

  function fecharModal() {
    document.getElementById("export-modal").style.display = "none";
  }

  function exportarParaExcel(filtroAtivo = "todos") {
    let agendamentosParaExportar = agendamentos;
    let nomeArquivo = "Agendamentos.xlsx";

    if (filtroAtivo === "hoje") {
      const hoje = new Date();
      const dataHoje = `${hoje.getFullYear()}-${String(
        hoje.getMonth() + 1
      ).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
      const dia = String(hoje.getDate()).padStart(2, "0");
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      nomeArquivo = `Agendamentos - ${dia}-${mes}.xlsx`;

      agendamentosParaExportar = agendamentos.filter((agendamento) => {
        const dataAgendamento = new Date(agendamento.dataHorario);
        const dataAgendamentoFormatada = `${dataAgendamento.getFullYear()}-${String(
          dataAgendamento.getMonth() + 1
        ).padStart(2, "0")}-${String(dataAgendamento.getDate()).padStart(
          2,
          "0"
        )}`;
        return dataAgendamentoFormatada === dataHoje;
      });
    }

    // Prepara os dados para exportação
    const dados = agendamentosParaExportar.map((agendamento) => ({
      "Data e Hora": new Date(agendamento.dataHorario).toLocaleString(),
      Cliente: agendamento.usuario,
      Procedimento: agendamento.procedimento,
      Especificação: agendamento.especificacao,
      Status: agendamento.statusAgendamento.nome,
    }));

    // Cria uma nova planilha
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Agendamentos");

    // Exporta o arquivo Excel
    XLSX.writeFile(wb, nomeArquivo);
  }

  // Adiciona um botão para abrir o modal de seleção de status
  document
    .getElementById("select-status-btn")
    .addEventListener("click", openCustomStatusModal);

  function showDetalhesModal(id) {
    const agendamento = agendamentos.find((a) => a.idAgendamento === id);

    if (agendamento) {
      selectedAgendamentoId = id; // Define o ID selecionado
      document.getElementById("detalhe-cliente").value = agendamento.usuario;
      document.getElementById("detalhe-celular").value =
        agendamento.usuarioTelefone;
      const dataHora = new Date(agendamento.dataHorario);
      document.getElementById(
        "detalhe-data"
      ).value = `${dataHora.getUTCFullYear()}-${String(
        dataHora.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(dataHora.getUTCDate()).padStart(2, "0")}`;
      document.getElementById("detalhe-inicio").value = `${String(
        dataHora.getUTCHours()
      ).padStart(2, "0")}:${String(dataHora.getUTCMinutes()).padStart(2, "0")}`;
      document.getElementById("detalhe-fim").value = `${String(
        dataHora.getUTCHours() + 1
      ).padStart(2, "0")}:${String(dataHora.getUTCMinutes()).padStart(2, "0")}`; // Ajuste conforme necessário
      document.getElementById("detalhe-procedimento").value =
        agendamento.procedimento;
      document.getElementById("detalhe-status").value =
        agendamento.statusAgendamento.nome;

      // Verifica o status do agendamento
      const statusId = agendamento.statusAgendamento.id; // Assumindo que você tem o id no objeto de status
      const clienteFaltouButton = document.getElementById("clienteFaltou");
      const atendimentoConcluidoButton = document.getElementById(
        "atendimentoConcluido"
      );

      // Desabilita ou habilita os botões conforme o status
      if (statusId === 1) {
        // Status Agendado
        clienteFaltouButton.disabled = false;
        atendimentoConcluidoButton.disabled = false;
        clienteFaltouButton.classList.remove("btn-disabled");
        atendimentoConcluidoButton.classList.remove("btn-disabled");
      } else {
        clienteFaltouButton.disabled = true;
        atendimentoConcluidoButton.disabled = true;
        clienteFaltouButton.classList.add("btn-disabled");
        atendimentoConcluidoButton.classList.add("btn-disabled");
      }

      document.getElementById("detalhes-modal").style.display = "block";
    }
  }

  window.closeDetalhesModal = function () {
    selectedAgendamentoId = null; // Redefinir o ID selecionado
    document.getElementById("detalhes-modal").style.display = "none";
  };

  window.clienteFaltou = async function () {
    if (!selectedAgendamentoId) {
      showNotification("Nenhum agendamento selecionado!", true);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/agendamentos/atualizar-status/${selectedAgendamentoId}?statusId=2`,
        {
          method: "PUT",
        }
      );

      if (!response.ok)
        throw new Error('Erro ao atualizar o status para "Cliente Faltou".');
      await fetchAgendamentos(); // Atualizar a lista de agendamentos
      closeDetalhesModal(); // Fechar o modal de detalhes
      showNotification('Status atualizado para "Cliente Faltou" com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
      showNotification("Erro ao atualizar o status!", true);
    }
  };

  window.atendimentoConcluido = async function () {
    if (!selectedAgendamentoId) {
      showNotification("Nenhum agendamento selecionado!", true);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/agendamentos/atualizar-status/${selectedAgendamentoId}?statusId=3`,
        {
          method: "PUT",
        }
      );

      if (!response.ok)
        throw new Error(
          'Erro ao atualizar o status para "Atendimento Concluído".'
        );
      await fetchAgendamentos(); // Atualizar a lista de agendamentos
      closeDetalhesModal(); // Fechar o modal de detalhes
      showNotification(
        'Status atualizado para "Atendimento Concluído" com sucesso!'
      );
    } catch (error) {
      console.error("Erro ao atualizar o status:", error);
      showNotification("Erro ao atualizar o status!", true);
    }
  };

  function atualizarProgressBar(confirmados, total) {
    const progress = document.getElementById("progress");
    const percentage = total === 0 ? 0 : (confirmados / total) * 100;
    progress.style.width = `${percentage}%`;

    document.getElementById(
      "progress-label"
    ).textContent = `Atendimentos Concluídos: ${confirmados}`;
    document.getElementById(
      "total-label"
    ).textContent = `Atendimentos Totais: ${total}`;
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

  // Função que será chamada ao clicar no botão de editar
  window.editarAgendamento = function (
    idAgendamento,
    usuarioId,
    fkProcedimento,
    fkEspecificacao
  ) {
    // Salvando o id_usuario e o id_agendamento no sessionStorage
    sessionStorage.setItem("id_usuario", usuarioId);
    sessionStorage.setItem("id_agendamento", idAgendamento);
    sessionStorage.setItem("procedimento", fkProcedimento);
    sessionStorage.setItem("especificacao", fkEspecificacao);

    // Redirecionando para a página com os parâmetros na URL
    window.location.href = `agendamento-forms/editar-agendamento/editar-agendamento.html?idAgendamento=${idAgendamento}&usuarioId=${usuarioId}&procedimento=${fkProcedimento}&especificacao=${fkEspecificacao}`;
  };

  window.excluirAgendamento = function (id) {
    agendamentoIdToDelete = id;
    document.getElementById(
      "procedimento"
    ).textContent = `ID do agendamento: ${id}`;
    document.getElementById("modal").style.display = "block";
  };

  window.closeModal = function () {
    document.getElementById("modal").style.display = "none";
  };

  window.confirmDeletion = async function () {
    if (agendamentoIdToDelete !== null) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/agendamentos/excluir/${agendamentoIdToDelete}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Erro ao excluir o agendamento.");
        await fetchAgendamentos();
        agendamentoIdToDelete = null;
        closeModal();
        showNotification("Agendamento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o agendamento:", error);
        showNotification("Erro ao excluir o agendamento!", true);
      }
    }
  };

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

  fetchAgendamentos();

  window.salvarStatus = function () {
    // Obter os valores dos inputs
    const nome = document.getElementById("edit-nome").value;
    const cor = document.getElementById("edit-cor").value;

    // Validar os dados antes de enviar
    if (!nome || !cor) {
      showNotification("Por favor, preencha todos os campos!", true);
      return;
    }

    // Preparar o corpo da requisição
    const statusData = {
      nome: nome,
      cor: cor,
      motivo: "", // Enviar motivo vazio por enquanto
    };

    // Fazer a requisição POST
    fetch("http://localhost:8080/status-agendamento/cadastro-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
    })
      .then((response) => {
        // Verificar o tipo de conteúdo da resposta
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          return response.json(); // Se for JSON, parse como JSON
        } else {
          return response.text(); // Caso contrário, trate como texto
        }
      })
      .then((data) => {
        // Exibir a mensagem de sucesso retornada pelo servidor
        showNotification("Status cadastrado com sucesso!");
        document.getElementById("save-modal").style.display = "none"; // Fechar o modal após o sucesso
      })
      .catch((error) => {
        console.error("Erro ao salvar o status:", error);
        showNotification("Ocorreu um erro ao salvar o status!", true);
      });
  };

  window.carregarStatus = function () {
    fetch("http://localhost:8080/status-agendamento")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 204) {
          throw new Error("Nenhum status cadastrado ainda.");
        } else {
          throw new Error("Erro ao buscar os status.");
        }
      })
      .then((data) => {
        allStatuses = data; // Guardar os status carregados
        const tbody = document.getElementById("status-tbody");
        tbody.innerHTML = ""; // Limpa o conteúdo existente

        data.forEach((status) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${status.nome}</td>
             <td>
  <div class="color-box" style="background-color: ${status.cor}; width: 20px; height: 20px; border-radius: 100px; margin-left: 35%;"></div>
</td>
<td>
  <!-- Botão de Editar com tooltip -->
  <div class="tooltip-wrapper">
    <button class="edit-btn" data-id="${status.id}">
      <i class="fas fa-edit"></i>
    </button>
    <div class="tooltip9">Editar</div>
  </div>

  <!-- Botão de Excluir com tooltip -->
  <div class="tooltip-wrapper">
    <button class="delete-btn" data-id="${status.id}">
      <i class="fas fa-trash"></i>
    </button>
    <div class="tooltip9">Excluir</div>
  </div>
</td>


            `;
          tbody.appendChild(row);
        });

        attachEventListeners(); // Reanexar os event listeners
      })
      .catch((error) => {
        console.error("Erro:", error.message);
      });
  };

  window.confirmDeletion2 = async function () {
    if (deleteStatusId) {
      try {
        const response = await fetch(
          `http://localhost:8080/status-agendamento/exclusao-por-id/${deleteStatusId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Erro ao excluir o status.");
        await carregarStatus();
        deleteStatusId = null;
        closeDeleteModal();
        showNotification("Status excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir o status:", error);
        showNotification("Erro ao excluir o status!", true);
      }
    }
  };

  window.salvarStatusEditado = async function () {
    if (editStatusId) {
      const nome = document.getElementById("edit-nome2").value;
      const cor = document.getElementById("edit-cor2").value;
      const statusData = {
        nome: nome,
        cor: cor,
      };

      try {
        const response = await fetch(
          `http://localhost:8080/status-agendamento/atualizacao-status/${editStatusId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(statusData),
          }
        );
        if (!response.ok) throw new Error("Erro ao editar o status.");
        await carregarStatus();
        await fetchAgendamentos(); // Adicione esta linha para atualizar a tabela de agendamentos
        editStatusId = null;
        closeEditModal();
        showNotification("Status editado com sucesso!");
      } catch (error) {
        console.error("Erro ao editar o status:", error);
        showNotification("Erro ao editar o status!", true);
      }
    }
  };

  function attachEventListeners() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        deleteStatusId = e.target.closest("button").getAttribute("data-id");
        const status = allStatuses.find(
          (status) => status.id == deleteStatusId
        );
        document.getElementById("status-name").innerText = status.nome;
        openDeleteModal();
      });
    });

    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        editStatusId = e.target.closest("button").getAttribute("data-id");
        const status = allStatuses.find((status) => status.id == editStatusId);
        document.getElementById("edit-nome2").value = status.nome;
        document.getElementById("edit-cor2").value = status.cor;
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

  document
    .getElementById("open-save-modal-btn")
    .addEventListener("click", () => {
      document.getElementById("save-modal").style.display = "block";
    });

  function setActiveTab(tabId) {
    // Remove a classe active de todos os botões
    document.querySelectorAll(".tab-button").forEach((button) => {
      button.classList.remove("active");
    });

    // Adiciona a classe active ao botão clicado
    document.getElementById(tabId).classList.add("active");
  }

  setActiveTab("todos-agendamentos");

  document
    .getElementById("todos-agendamentos")
    .addEventListener("click", () => {
      currentPage = 1;
      setActiveTab("todos-agendamentos");
      renderTable("todos");
    });

  document.getElementById("hoje-agendamentos").addEventListener("click", () => {
    currentPage = 1;
    setActiveTab("hoje-agendamentos");
    renderTable("hoje");
  });

  document
    .getElementById("save-button")
    .addEventListener("click", salvarStatus);

  document
    .getElementById("open-status-modal-btn")
    .addEventListener("click", () => {
      carregarStatus();
      document.getElementById("status-modal").style.display = "block";
    });

  document
    .getElementById("open-filter-modal-btn")
    .addEventListener("click", () => {
      document.getElementById("filter-modal").style.display = "block";
    });

  document.getElementById("close-save-modal").addEventListener("click", () => {
    document.getElementById("save-modal").style.display = "none";
  });

  document
    .getElementById("close-status-modal")
    .addEventListener("click", () => {
      document.getElementById("status-modal").style.display = "none";
    });

  document
    .getElementById("close-filter-modal")
    .addEventListener("click", () => {
      document.getElementById("filter-modal").style.display = "none";
    });

  // Função para limpar os inputs individualmente
  document.getElementById("clear-from").addEventListener("click", () => {
    document.getElementById("filter-from").value = "";
  });

  document.getElementById("clear-to").addEventListener("click", () => {
    document.getElementById("filter-to").value = "";
  });

  document.getElementById("clear-client").addEventListener("click", () => {
    document.getElementById("cliente-filtro").value = "";
  });

  document.getElementById("clear-procedure").addEventListener("click", () => {
    document.getElementById("procedimento-filtro").value = "";
  });

  document
    .getElementById("clear-specification")
    .addEventListener("click", () => {
      document.getElementById("especificacao-filtro").value = "";
    });

  // Limpar todos os filtros
  document.getElementById("clear-all-filters").addEventListener("click", () => {
    filtroAtivo = null;
    agendamentos = [...agendamentosOriginais];
    currentPage = 1;

    renderTable();

    document.getElementById("filter-from").value = "";
    document.getElementById("filter-to").value = "";
    document.getElementById("cliente-filtro").value = "";
    document.getElementById("procedimento-filtro").value = "";
    document.getElementById("especificacao-filtro").value = "";

    document.getElementById("clear-all-filters").style.display = "none";
    fetchAgendamentos(); // Chama a função original que busca todos os agendamentos
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const procedimentoSelect = document.getElementById("procedimento-filtro");
  const especificacaoSelect = document.getElementById("especificacao-filtro");

  // Função para popular as opções de Procedimento
  fetch("http://localhost:8080/api/procedimentos")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.idProcedimento;
        option.textContent = item.tipo;
        procedimentoSelect.appendChild(option);
      });
    });

  // Função para popular as opções de Especificação conforme o Procedimento selecionado
  fetch("http://localhost:8080/api/especificacoes")
    .then((response) => response.json())
    .then((data) => {
      // Ao mudar o procedimento
      procedimentoSelect.addEventListener("change", function () {
        especificacaoSelect.disabled = false;
        especificacaoSelect.innerHTML = ""; // Limpa as opções anteriores

        const procedimentoId = procedimentoSelect.value;

        // Filtra as especificações que pertencem ao procedimento selecionado
        const especificacoesFiltradas = data.filter(
          (item) => item.procedimento.idProcedimento == procedimentoId
        );

        // Popula o select de especificações
        especificacoesFiltradas.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.idEspecificacaoProcedimento;
          option.textContent = item.especificacao;
          especificacaoSelect.appendChild(option);
        });
      });
    });

  // Popular as opções de Clientes
  fetch("http://localhost:8080/usuarios")
    .then((response) => response.json())
    .then((data) => {
      const clienteSelect = document.getElementById("cliente-filtro");
      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.idUsuario;
        option.textContent = item.nome;
        clienteSelect.appendChild(option);
      });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }

new window.VLibras.Widget('https://vlibras.gov.br/app');
  
});

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

window.onload = function () {
  carregarImagem2();
};


document.addEventListener("DOMContentLoaded", function () {
  const tooltips = document.querySelectorAll(
    ".tooltip, .tooltip2, .tooltip3, .tooltip4, .tooltip5, .tooltip6, .tooltip7, .tooltip8, .tooltip9, .tooltip12, .tooltip29, .tooltip30"
  );

  tooltips.forEach((tooltip) => {
    const targetButton = tooltip.previousElementSibling;

    targetButton.addEventListener("mouseenter", () => {
      tooltip.style.visibility = "hidden"; // Oculta temporariamente para cálculo
      tooltip.style.display = "block"; // Exibe para cálculo
      positionTooltip(tooltip, targetButton);
      tooltip.style.visibility = "visible"; // Mostra após posicionamento
    });

    targetButton.addEventListener("mouseleave", () => {
      tooltip.style.display = "none"; // Oculta quando sai do hover
    });

    window.addEventListener("resize", () => {
      if (tooltip.style.display === "block") {
        positionTooltip(tooltip, targetButton); // Recalcula posição em redimensionamento
      }
    });
  });

  function positionTooltip(tooltip, target) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Centraliza horizontalmente e posiciona acima do botão
    const topPosition = targetRect.top - tooltipRect.height - 5;
    const leftPosition =
      targetRect.left + targetRect.width / 0 - tooltipRect.width / 0;

    tooltip.style.top = `${topPosition + window.scrollY}px`;
    tooltip.style.left = `${leftPosition + window.scrollX}px`;
  }
});

