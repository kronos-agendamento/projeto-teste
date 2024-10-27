document.addEventListener("DOMContentLoaded", function () {
  const bloqueioButton = document.getElementById("bloqueio-button");

  // Function to show notifications
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

  // Function to block time slots
  function bloquearHorarios() {
    const diaEscolhido = document.getElementById("diaEscolhido").value;
    const horaInicioBlock = document.getElementById("horaInicioBlock").value;
    const horaFimBlock = document.getElementById("horaFimBlock").value;
    const usuarioId = 1; // Substitute with real user ID if necessary

    if (!diaEscolhido || !horaInicioBlock || !horaFimBlock) {
      showNotification("Preencha todos os campos!", true);
      return;
    }

    const bloqueioData = {
      dia: diaEscolhido,
      horaInicio: horaInicioBlock,
      horaFim: horaFimBlock,
      usuarioId: usuarioId,
    };

    fetch("http://localhost:8080/api/agendamentos/bloquear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bloqueioData),
    })
      .then((response) => {
        if (response.ok) {
          showNotification("Horário bloqueado com sucesso!");
          fetchAgendamentos(getWeekDates(new Date()));
        } else {
          showNotification("Erro ao bloquear horário.", true);
        }
      })
      .catch((error) => {
        showNotification("Erro ao conectar à API.", true);
        console.error("Erro:", error);
      });
  }

  function desbloquearHorarios(dia, horaInicio) {
    fetch(
      `http://localhost:8080/api/agendamentos/desbloquear?dia=${dia}&horaInicio=${horaInicio}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          showNotification("Horário desbloqueado com sucesso!");
          // Corrigir: Garantir que currentDate é definido
          const currentDate = new Date(); // Definir currentDate corretamente
          currentDate.setDate(currentDate.getDate() + currentWeekOffset * 7);
          fetchAgendamentos(getWeekDates(currentDate)); // Atualizar a agenda corretamente
        } else {
          showNotification("Erro ao desbloquear horário.", true);
        }
      })
      .catch((error) => {
        showNotification("Erro ao conectar à API.", true);
        console.error("Erro:", error);
      });
  }

  // Add event listeners
  bloqueioButton.addEventListener("click", bloquearHorarios);

  // Function to get the dates from Tuesday to Saturday of the current week
  function getWeekDates(date = new Date()) {
    const weekDates = [];
    const day = date.getDay(); // Dia da semana (0 - Domingo, 6 - Sábado)
    const startDate = new Date(date);

    // Ajustar para pegar terça-feira como o primeiro dia
    const daysToTuesday = day === 0 ? 2 : 2 - day; // Ajusta para iniciar na terça-feira
    startDate.setDate(date.getDate() + daysToTuesday);

    // Pegar os dias de terça a sábado
    for (let i = 0; i < 5; i++) {
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      weekDates.push(newDate);
    }

    return weekDates;
  }

  let currentWeekOffset = 0;

  function changeWeek(offset) {
    currentWeekOffset += offset;
    renderWeek();
  }

  function goToCurrentWeek() {
    currentWeekOffset = 0;
    renderWeek();
  }

  document
    .getElementById("next-page-btn")
    .addEventListener("click", () => changeWeek(1));
  document
    .getElementById("prev-page-btn")
    .addEventListener("click", () => changeWeek(-1));
  document
    .getElementById("btn-voltar-home")
    .addEventListener("click", goToCurrentWeek);

  function renderWeek() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + currentWeekOffset * 7); // Usa o deslocamento para calcular a semana
    const weekDates = getWeekDates(currentDate);

    const weekHeaders = document.querySelectorAll(".agenda thead th");

    // Atualiza os cabeçalhos da tabela com os dias da semana
    weekDates.forEach((date, index) => {
      const day = date.toLocaleDateString("pt-BR", { weekday: "long" });
      const formattedDate = date.toLocaleDateString("pt-BR");
      weekHeaders[index].innerHTML = `${day}<br>${formattedDate}`;
    });

    // Atualiza o intervalo da semana no elemento "current-page"
    const currentPageElement = document.getElementById("current-page");
    currentPageElement.textContent = formatWeekRange(weekDates);

    fetchAgendamentos(weekDates); // Buscar os agendamentos na semana atual
  }

  function formatWeekRange(weekDates) {
    const startDate = weekDates[0]; // Primeira data da semana (segunda-feira)
    const endDate = weekDates[weekDates.length - 1]; // Última data da semana (sexta-feira)

    const startFormatted = startDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
    const endFormatted = endDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });

    return `${startFormatted} - ${endFormatted}`;
  }

  function fetchAgendamentos(weekDates) {
    const startDate = weekDates[0].toISOString(); // Primeira data da semana
    const endDate = weekDates[4].toISOString(); // Última data da semana

    fetch(
      `http://localhost:8080/api/agendamentos/listar?startDate=${startDate}&endDate=${endDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        renderAgendamentos(data, weekDates);
      })
      .catch((error) => {
        console.error("Error fetching agendamentos:", error);
      });
  }

  function renderAgendamentos(agendamentos, weekDates) {
    const tableCells = document.querySelectorAll(".agenda tbody td");

    // Limpar a tabela antes de adicionar novos agendamentos
    tableCells.forEach((cell) => {
      cell.innerHTML = "";
    });

    agendamentos.forEach((agendamento) => {
      const agendamentoDate = new Date(agendamento.dataHorario);
      const dayIndex = weekDates.findIndex(
        (date) => date.toDateString() === agendamentoDate.toDateString()
      );

      if (dayIndex >= 0) {
        const cell = tableCells[dayIndex];
        const horario = agendamentoDate.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (agendamento.tipoAgendamento === "Bloqueio") {
          // Torna os bloqueios clicáveis e captura as informações de data e hora
          cell.innerHTML += `<div class="agendamento bloqueio" data-dia="${
            agendamentoDate.toISOString().split("T")[0]
          }" data-hora="${horario}" style="cursor: pointer;">
            ${horario}<br>
            Bloqueio</div>`;

          // Adiciona o event listener para cada bloqueio
          const bloqueioDivs = cell.querySelectorAll(".bloqueio");
          bloqueioDivs.forEach((bloqueioDiv) => {
            bloqueioDiv.addEventListener("click", function () {
              const dia = this.getAttribute("data-dia");
              const hora = this.getAttribute("data-hora");

              // Aqui montamos o intervalo de 30 minutos com base no horário clicado
              const horaInicio = hora;
              const horaFim = add30Minutes(horaInicio);

              // Chama a função para desbloquear os horários
              desbloquearHorarios(dia, horaInicio);
            });
          });
        } else {
          cell.innerHTML += `<div class="agendamento">
            <strong>${horario}</strong>
            ${agendamento.usuario}<br>
            ${agendamento.procedimento}
          </div>`;
        }
      }
    });
  }

  // Função para adicionar 30 minutos a uma hora no formato HH:mm
  function add30Minutes(hora) {
    const [hours, minutes] = hora.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    date.setMinutes(date.getMinutes() + 30);

    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Inicializar semana atual ao carregar a página
  renderWeek();
});

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});
