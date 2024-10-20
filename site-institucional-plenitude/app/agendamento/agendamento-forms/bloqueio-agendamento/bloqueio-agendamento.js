document.addEventListener("DOMContentLoaded", function () {
  const bloqueioButton = document.getElementById("bloqueio-button");

  // Função para mostrar notificações de sucesso ou erro
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

  // Função para bloquear horários de agendamento
  function bloquearHorarios() {
    const diaEscolhido = document.getElementById("diaEscolhido").value;
    const horaInicioBlock = document.getElementById("horaInicioBlock").value;
    const horaFimBlock = document.getElementById("horaFimBlock").value;
    const usuarioId = 1; // Substitua pelo ID do usuário correto, se necessário

    // Verifica se todos os campos estão preenchidos
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

    // Faz a requisição POST para a API de bloqueio
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
        } else {
          showNotification("Erro ao bloquear horário. Tente novamente.", true);
        }
      })
      .catch((error) => {
        showNotification("Erro ao conectar à API. Tente novamente.", true);
        console.error("Erro:", error);
      });
  }

  // Adiciona o evento de clique ao botão de bloqueio
  bloqueioButton.addEventListener("click", bloquearHorarios);
});
