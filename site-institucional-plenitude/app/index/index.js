document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => { });
  });
});

const list = document.querySelectorAll(".list");
function activeLink() {
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}

list.forEach((item) => item.addEventListener("click", activeLink));

const content = document.querySelector(".content");
let scrollPosition = 0;

function scrollUp() {
  scrollPosition -= 50; // Altere conforme necessário
  content.scrollTo({ top: scrollPosition, behavior: "smooth" });
}

function scrollDown() {
  scrollPosition += 50; // Altere conforme necessário
  content.scrollTo({ top: scrollPosition, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const email = localStorage.getItem("email");

  if (nome && email) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userNameSpan").textContent = nome;
    document.getElementById("userEmail").textContent = email;
  }
});

(function () {
  "use strict";

  /**
   * Preloader
   */
  let preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "http://localhost:8080";

  const fetchEspecificacoes = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/especificacoes`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Falha ao buscar especificações");
        return [];
      }
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  };

  const formatarDuracao = (tempoColocacao) => {
    if (!tempoColocacao || tempoColocacao === "N/A") {
      return "N/A";
    }

    const [horas, minutos] = tempoColocacao.split(":");
    const horasFormatadas = parseInt(horas, 10);
    const minutosFormatados = parseInt(minutos, 10);

    if (horasFormatadas === 0) {
      return `${minutosFormatados}`;
    } else {
      return `${horasFormatadas}:${minutosFormatados < 10 ? "0" + minutosFormatados : minutosFormatados}`;
    }
  };

  const popularTabela = async () => {
    const especificacoes = await fetchEspecificacoes();

    const tabela = document.querySelector("#procedimentos-cadastrados tbody");
    tabela.innerHTML = ""; // Limpa a tabela antes de inserir novos dados

    // Limita a exibição aos primeiros 2 itens
    especificacoes.slice(0, 3).forEach((especificacao) => {
      const procedimento = especificacao.fkProcedimento;
      const tempo = especificacao.fkTempoProcedimento;

      // Formata o preço com "R$" antes do número e usa vírgula como separador decimal
      const precoFormatado = `R$ ${especificacao.precoColocacao.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      // Formata a duração (tempo) conforme especificado
      const duracaoFormatada = tempo ? formatarDuracao(tempo.tempoColocacao) : "N/A";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${procedimento.tipo}</td>
        <td>${precoFormatado}</td>
        <td>${duracaoFormatada}h</td>
        <td>${especificacao.especificacao}</td>
      `;
      tabela.appendChild(row);
    });
  };

  popularTabela();

});

async function fetchAgendamentos() {
  const apiBaseUrl = "http://localhost:8080";
  try {
    const response = await fetch(`${apiBaseUrl}/api/agendamentos/listar`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Erro ao buscar agendamentos");
      return [];
    }
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const apiBaseUrl = "http://localhost:8080";

  // Função para formatar o CPF
  function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, ""); // Remove tudo que não é dígito
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"); // Formatação com pontos e traço
  }

  // Função para formatar a data
  function formatarData(data) {
    const dataObj = new Date(data);
    if (!isNaN(dataObj)) {
      return dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    }
    return "Data inválida";
  }

  // Função para buscar agendamentos e popular a tabela
  function fetchAgendamentos() {
    fetch(`${apiBaseUrl}/api/agendamentos/listar`)
      .then((response) => response.json())
      .then((data) => {
        // Ordena os agendamentos pela data em ordem decrescente
        const sortedData = data.sort(
          (a, b) => new Date(b.dataHorario) - new Date(a.dataHorario)
        );

        // Seleciona a tabela de "Clientes Frequentes"
        const frequentClientsTable = document
          .getElementById("clientes-frequentes")
          .getElementsByTagName("tbody")[0];

        // Itera pelos dois agendamentos mais recentes
        sortedData.slice(0, 3).forEach((agendamento) => {
          const row = frequentClientsTable.insertRow();
          const nome = agendamento.usuario.nome;
          const cpfFormatado = formatarCPF(agendamento.usuario.cpf);
          const ultimaAparicao = formatarData(agendamento.dataHorario);
          const ultimoProcedimento = agendamento.procedimento.tipo;

          row.insertCell(0).innerText = nome;
          row.insertCell(1).innerText = cpfFormatado;
          row.insertCell(2).innerText = ultimaAparicao;
          row.insertCell(3).innerText = ultimoProcedimento;
        });
      })
      .catch((error) => console.error("Erro:", error));
  }

  // Chama a função para buscar agendamentos e popular a tabela
  fetchAgendamentos();
});

// Função para filtrar os agendamentos do dia atual
function filtrarAgendamentosDoDia(agendamentos) {
  const hoje = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  return agendamentos.filter(
    (agendamento) => agendamento.dataHorario.split("T")[0] === hoje
  );
}

// Função para ordenar os agendamentos por horário
function ordenarAgendamentosPorHorario(agendamentos) {
  return agendamentos.sort((a, b) => new Date(a.dataHorario) - new Date(b.dataHorario));
}

// Função para renderizar a agenda diária
function renderizarAgendaDiaria(agendamentos) {
  const agendaContainer = document.querySelector(".daily-schedule .agenda");
  const dayElement = agendaContainer.querySelector(".day .weekday");
  const dateElement = agendaContainer.querySelector(".day .date");
  const appointmentsContainer = agendaContainer.querySelector(".appointments");

  const hoje = new Date();
  const diaSemana = hoje.toLocaleDateString("pt-BR", { weekday: "long" });
  const data = hoje.toLocaleDateString("pt-BR");

  dayElement.textContent = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
  dateElement.textContent = data;

  appointmentsContainer.innerHTML = "";

  const agendamentosOrdenados = ordenarAgendamentosPorHorario(agendamentos);

  agendamentosOrdenados.forEach(agendamento => {
    // Ajusta a data e hora para o fuso horário local
    const dataUTC = new Date(agendamento.dataHorario);

    // Adiciona 3 horas ao horário UTC
    dataUTC.setHours(dataUTC.getHours() + 3);

    const horarioLocal = dataUTC.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false // Use o formato 24 horas
    });

    const cliente = agendamento.usuario.nome;
    const procedimento = agendamento.procedimento.descricao;

    const appointmentElement = document.createElement("div");
    appointmentElement.className = "appointment";
    appointmentElement.innerHTML = `
      <div class="time">${horarioLocal}</div>
      <div class="details">
        <h3>${cliente}</h3>
        <p>${procedimento}</p>
      </div>
    `;

    appointmentsContainer.appendChild(appointmentElement);
  });
}

// Função para carregar a agenda diária
async function carregarAgendaDiaria() {
  const agendamentos = await fetchAgendamentos();
  const agendamentosDoDia = filtrarAgendamentosDoDia(agendamentos);
  renderizarAgendaDiaria(agendamentosDoDia);
}

// Chama a função para carregar a agenda diária quando a página é carregada
document.addEventListener("DOMContentLoaded", carregarAgendaDiaria);



// Função para buscar os usuários do backend
async function fetchUsuarios() {
  try {
    const response = await fetch("http://localhost:8080/usuarios");
    if (!response.ok) {
      throw new Error("Erro ao buscar usuários");
    }
    const usuarios = await response.json();
    return usuarios;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Função para filtrar os aniversariantes do mês atual
function filtrarAniversariantesDoMes(usuarios) {
  const mesAtual = new Date().getMonth() + 1; // Janeiro é 0
  return usuarios.filter((usuario) => {
    const mesAniversario = new Date(usuario.dataNasc).getMonth() + 1;
    return mesAniversario === mesAtual;
  });
}

// Função para ajustar a data sem o problema do fuso horário
function ajustarData(data) {
  const dataUTC = new Date(data);
  const dataLocal = new Date(
    dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000
  );
  return dataLocal.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

// Função para renderizar a lista de aniversariantes
function renderizarAniversariantes(aniversariantes, exibirTodos) {
  const birthdayList = document.querySelector(".birthday-list");
  birthdayList.innerHTML = "";

  const aniversariantesParaExibir = exibirTodos
    ? aniversariantes
    : aniversariantes.slice(0, 3);

  aniversariantesParaExibir.forEach((usuario) => {
    const dataNasc = ajustarData(usuario.dataNasc);
    const cardElement = document.createElement("div");
    cardElement.className = "birthday-info";
    cardElement.innerHTML = `
            <div class="icon">
                <i class="fas fa-birthday-cake"></i>
            </div>
            <div class="info">
                <h2>${usuario.nome}</h2>
            </div>
            <div class="date">
                <p>${dataNasc}</p>
            </div>
        `;
    birthdayList.appendChild(cardElement);
  });
}

// Função principal para carregar os aniversariantes
async function carregarAniversariantes() {
  const usuarios = await fetchUsuarios();
  const aniversariantes = filtrarAniversariantesDoMes(usuarios);
  let exibirTodos = false;

  renderizarAniversariantes(aniversariantes, exibirTodos);

  const toggleView = document.querySelector(".toggle-view");
  toggleView.addEventListener("click", (e) => {
    e.preventDefault();
    exibirTodos = !exibirTodos;
    renderizarAniversariantes(aniversariantes, exibirTodos);
    toggleView.textContent = exibirTodos ? "Ver menos <<" : "Ver todos >>";
  });
}

// Chamar a função principal quando a página for carregada
document.addEventListener("DOMContentLoaded", carregarAniversariantes);

const apiUrl = "http://localhost:8080/status-agendamento";
const statusTbody = document.getElementById("status-tbody");
const toggleView = document.getElementById("toggle-view");
const modal = document.getElementById("modal");
const procedimentoText = document.getElementById("procedimento");
const btnYes = document.querySelector(".btn-yes");
const editModal = document.getElementById("edit-modal");
const editNome = document.getElementById("edit-nome");
const editCor = document.getElementById("edit-cor");
const btnSave = document.querySelector(".btn-save");
let allStatuses = [];
let showingAll = false;
let deleteStatusId = null;
let editStatusId = null;

async function fetchStatuses() {
  try {
    const response = await fetch(apiUrl);
    if (response.status === 200) {
      allStatuses = await response.json();
      renderStatuses();
    } else if (response.status === 204) {
      statusTbody.innerHTML =
        '<tr><td colspan="3">Infelizmente nenhum cadastro de status foi realizado ainda.</td></tr>';
    } else {
      console.error("Erro ao buscar status:", response.status);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

function renderStatuses() {
  statusTbody.innerHTML = "";
  const statusesToShow = showingAll ? allStatuses : allStatuses.slice(0, 3);
  statusesToShow.forEach((status) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${status.nome}</td>
    <td><div class="color-box" style="background-color: ${status.cor};"></div></td>
    <td>
        <button class="edit-btn" data-id="${status.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${status.id}"><i class="fas fa-trash"></i></button>
    </td>

        `;
    statusTbody.appendChild(row);
  });
  toggleView.innerText = showingAll ? "Ver menos <<" : "Ver todos >>";
  attachEventListeners();
}

function attachEventListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      deleteStatusId = e.target.closest("button").getAttribute("data-id");
      const status = allStatuses.find((status) => status.id == deleteStatusId);
      procedimentoText.innerText = status.nome;
      openModal();
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

async function deleteStatus() {
  try {
    const response = await fetch(
      `${apiUrl}/exclusao-por-id/${deleteStatusId}`,
      { method: "DELETE" }
    );
    if (response.status === 200) {
      allStatuses = allStatuses.filter(
        (status) => status.id !== parseInt(deleteStatusId)
      );
      renderStatuses();
      closeModal();
      showNotification("Status deletado com sucesso!");
    } else {
      console.error("Erro ao excluir status:", response.status);
      showNotification("Erro ao excluir status!", true);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

async function updateStatus() {
  const updatedStatus = {
    nome: editNome.value,
    cor: editCor.value,
  };
  try {
    const response = await fetch(
      `${apiUrl}/atualizacao-status/${editStatusId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStatus),
      }
    );
    if (response.status === 200) {
      const updatedStatusFromServer = await response.json();
      allStatuses = allStatuses.map((status) =>
        status.id === parseInt(editStatusId) ? updatedStatusFromServer : status
      );
      renderStatuses();
      closeEditModal();
      showNotification("Status editado com sucesso!");
    } else {
      console.error("Erro ao atualizar status:", response.status);
      showNotification("Erro ao editar status!", true);
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
  }
}

function openModal() {
  modal.style.display = "block";
}

function closeModal() {
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

btnYes.addEventListener("click", async () => {
  await deleteStatus();
});

btnSave.addEventListener("click", async () => {
  await updateStatus();
});

toggleView.addEventListener("click", (e) => {
  e.preventDefault();
  showingAll = !showingAll;
  renderStatuses();
});

window.onclick = function (event) {
  if (event.target == modal) {
    closeModal();
  }
  if (event.target == editModal) {
    closeEditModal();
  }
};

fetchStatuses();

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
