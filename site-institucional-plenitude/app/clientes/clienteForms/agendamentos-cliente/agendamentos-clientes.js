document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const idUsuario =
    params.get("idUsuario") || localStorage.getItem("idUsuario");
  const url = `http://localhost:8080/api/agendamentos/agendamentos/usuario/${idUsuario}`;
  const itemsPerPage = 5;
  let currentPage = 1;
  let agendamentos = [];
  let totalAgendamentos = 0;
  let agendamentoIdToDelete = null;
  let agendamentosOriginais = []; // Para armazenar os agendamentos originais
  let agendamentosFiltrados = []; // Variável para armazenar os agendamentos filtrados

  const urlParams = new URLSearchParams(window.location.search);
  const idEndereco = urlParams.get("idEndereco");
  const clienteNome = localStorage.getItem("clienteNome");
  const dadosBtn = document.getElementById("dadosBtn");

  if (clienteNome) {
    document.querySelector(
      "header h1"
    ).textContent = `Mais informações de: ${clienteNome}`;
  }

  dadosBtn.addEventListener("click", function () {
    // Redireciona para a página de agendamentos com o idUsuario na URL
    window.location.href = `../editar-cliente/editar-cliente.html?idUsuario=${idUsuario}`;
  });

  anamneseBtn.addEventListener("click", function () {
    // Redireciona para a página de agendamentos com o idUsuario na URL
    window.location.href = `../anamnese-cliente/anamnese-clientes.html?idUsuario=${idUsuario}`;
  });

  // Função para formatar a data e hora
  function formatarDataHora(dataHora) {
    const data = new Date(dataHora);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");
    return `${dia}/${mes} - ${horas}:${minutos}`;
  }

  // Função para carregar e processar os agendamentos
  async function fetchAgendamentos() {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Erro ao carregar os agendamentos.");
      }
      const data = await response.json();
      console.log(data); // Verifique os dados retornados aqui
      agendamentos = data;
      agendamentosOriginais = [...data]; // Armazenar uma cópia dos agendamentos originais
      agendamentosFiltrados = agendamentos;
      totalAgendamentos = agendamentos.length;

      renderTable();
    } catch (error) {
      console.error("Erro ao buscar os agendamentos:", error);
    }
  }

  // Função para renderizar a tabela de agendamentos
  function renderTable() {
    const tbody = document.getElementById("procedures-tbody");
    tbody.innerHTML = ""; // Limpa o conteúdo existente da tabela

    const totalPages = Math.ceil(agendamentosFiltrados.length / itemsPerPage);
    document.getElementById("current-page").textContent = currentPage;
    document.getElementById("total-pages").textContent = totalPages;

    // Corrige a paginação
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const agendamentosPaginaAtual = agendamentosFiltrados.slice(
      startIndex,
      endIndex
    ); // Filtra somente a página atual

    agendamentosPaginaAtual.forEach((agendamento) => {
      const clienteNome = agendamento.nomeUsuario;
      if (clienteNome) {
        document.querySelector(
          "header h1"
        ).textContent = `Agendamentos de: ${clienteNome}`;
      }

      const tr = document.createElement("tr");

      // Colunas de Data/Hora, Cliente, Procedimento e Especificação
      tr.innerHTML = `
        <td>${formatarDataHora(agendamento.dataAgendamento)}</td>
        <td>${agendamento.tipoProcedimento}</td>
        <td>${agendamento.especificacaoProcedimento}</td>
        <td>${agendamento.statusAgendamento}</td>
        
      `;
      // Coluna de Ações: Editar e Excluir
      const tdAcoes = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.classList.add("edit-btn");
      editButton.innerHTML = '<i class="fas fa-edit"></i>';
      editButton.addEventListener("click", (event) => {
        event.stopPropagation();
        editarAgendamento(
          agendamento.idAgendamento,
          agendamento.usuarioId,
          agendamento.fkProcedimento,
          agendamento.fkEspecificacao
        );
      });

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-btn");
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        excluirAgendamento(agendamento.idAgendamento);
      });

      tdAcoes.appendChild(editButton);
      tdAcoes.appendChild(deleteButton);
      tr.appendChild(tdAcoes);

      // Adiciona a linha na tabela
      tbody.appendChild(tr);

      // Desabilita ou habilita os botões de navegação de página
      document.getElementById("prev-page-btn").disabled = currentPage === 1;
      document.getElementById("next-page-btn").disabled =
        currentPage === totalPages;
    });
  }

  // Função para editar um agendamento
  window.editarAgendamento = function (
    idAgendamento,
    usuarioId,
    fkProcedimento,
    fkEspecificacao
  ) {
    sessionStorage.setItem("id_usuario", usuarioId);
    sessionStorage.setItem("id_agendamento", idAgendamento);
    sessionStorage.setItem("procedimento", fkProcedimento);
    sessionStorage.setItem("especificacao", fkEspecificacao);
    window.location.href = `../../../agendamento/agendamento-forms/editar-agendamento/editar-agendamento.html?idAgendamento=${idAgendamento}&usuarioId=${usuarioId}&procedimento=${fkProcedimento}&especificacao=${fkEspecificacao}`;
  };

  // Função para excluir um agendamento
  window.excluirAgendamento = function (id) {
    agendamentoIdToDelete = id;
    document.getElementById(
      "procedimento"
    ).textContent = `ID do agendamento: ${id}`;
    document.getElementById("modal").style.display = "block";
  };

  // Função para confirmar exclusão de agendamento
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

  // Função para exibir notificações
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

  // Função para fechar o modal de exclusão
  window.closeModal = function () {
    document.getElementById("modal").style.display = "none";
  };

  // Paginação
  document.getElementById("prev-page-btn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  document.getElementById("next-page-btn").addEventListener("click", () => {
    const totalPages = Math.ceil(agendamentosFiltrados.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  // Inicializa a busca de agendamentos ao carregar a página
  fetchAgendamentos();
});

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});
