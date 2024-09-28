document.addEventListener("DOMContentLoaded", function () {
    const apiUrlClientes = "http://localhost:8080/usuarios";
    const apiUrlProcedimentos = "http://localhost:8080/api/procedimentos";
    const apiUrlEspecificacoes = "http://localhost:8080/api/especificacoes";
    const apiUrlAgendamentos = "http://localhost:8080/api/agendamentos";
  
    const procedimentosSelect = document.getElementById("procedimentos");
    const especificacoesSelect = document.getElementById("especificacoes");
    const tipoAgendamentoSelect = document.getElementById("tipo-atendimento");
    const dataInput = document.getElementById("data");
    const tempoAgendarSelect = null;
    const dataSelecionadaP = document.getElementById("data-selecionada");
    const horariosContainer = document.getElementById("horarios-disponiveis");
    const saveButton = document.getElementById("save-agendamento-button");


    let especificacoes = []; // Array para armazenar todas as especificações
  
    async function carregarProcedimentos() {
      try {
        const response = await fetch(apiUrlProcedimentos);
        if (response.ok) {
          const procedimentos = await response.json();
          procedimentos.forEach((procedimento) => {
            const option = document.createElement("option");
            option.value = procedimento.idProcedimento;
            option.text = procedimento.tipo;
            procedimentosSelect.appendChild(option);
          });
        } else {
          console.error("Erro ao buscar procedimentos: " + response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar procedimentos: ", error);
      }
    }
  
    async function carregarEspecificacoes() {
      try {
        const response = await fetch(apiUrlEspecificacoes);
        if (response.ok) {
          especificacoes = await response.json(); // Armazena todas as especificações
        } else {
          console.error("Erro ao buscar especificações: " + response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar especificações: ", error);
      }
    }
  
    // Função para filtrar as especificações com base no procedimento selecionado
    function filtrarEspecificacoesPorProcedimento(procedimentoId) {
      especificacoesSelect.innerHTML =
        '<option value="">Selecione uma especificação</option>'; // Reseta as opções
  
      const especificacoesFiltradas = especificacoes.filter(
        (especificacao) =>
          especificacao.procedimento.idProcedimento == procedimentoId
      );
  
      especificacoesFiltradas.forEach((especificacao) => {
        const option = document.createElement("option");
        option.value = especificacao.idEspecificacaoProcedimento;
        option.text = especificacao.especificacao;
        especificacoesSelect.appendChild(option);
      });
  
      if (especificacoesFiltradas.length > 0) {
        especificacoesSelect.removeAttribute("disabled");
        especificacoesSelect.classList.remove("disabled-select");
      } else {
        especificacoesSelect.setAttribute("disabled", "disabled");
        especificacoesSelect.classList.add("disabled-select");
      }
    }
  
    // Event listener para habilitar e filtrar especificações com base no procedimento selecionado
    procedimentosSelect.addEventListener("change", function () {
      const procedimentoId = procedimentosSelect.value;
      if (procedimentoId) {
        filtrarEspecificacoesPorProcedimento(procedimentoId);
      } else {
        especificacoesSelect.setAttribute("disabled", "disabled");
        especificacoesSelect.classList.add("disabled-select");
      }
    });
  
    dataInput.addEventListener("change", function () {
      const dataSelecionada = new Date(dataInput.value + "T00:00:00");
      if (!isNaN(dataSelecionada)) {
        const dia = dataSelecionada.getDate();
        const mes = dataSelecionada.toLocaleString("default", { month: "long" });
        const diaSemana = dataSelecionada.toLocaleString("default", {
          weekday: "long",
        });
        dataSelecionadaP.textContent = `Dia ${dia} de ${mes} - ${diaSemana}`;
  
        const procedimentoId = procedimentosSelect.value || params.get("fkProcedimento") ;
        const especificacaoId = especificacoesSelect.value || params.get("fkEspecificacao") ;
        const tipoAtendimento = tipoAgendamentoSelect.value;
  
        carregarHorariosDisponiveis(
          dataInput.value,
          procedimentoId,
          especificacaoId,
          tipoAtendimento
        );
      } else {
        dataSelecionadaP.textContent = "";
        horariosContainer.innerHTML = "";
      }
    });
  
    async function carregarHorariosDisponiveis(
      data,
      procedimentoId,
      especificacaoId,
      tipoAgendamento
    ) {
      try {
        const empresaId = localStorage.getItem("empresa");
  
        const url = new URL(apiUrlAgendamentos + "/horarios-disponiveis");
        url.searchParams.append("empresaId", empresaId);
        url.searchParams.append("data", data);
  
        const response = await fetch(url);
        if (response.ok) {
          const horariosDisponiveis = await response.json();
          horariosContainer.innerHTML = "";
  
          horariosDisponiveis.forEach((horario) => {
            const button = document.createElement("button");
            button.textContent = horario;
            button.classList.add("horario-button");
            horariosContainer.appendChild(button);
  
            button.addEventListener("click", function () {
              document
                .querySelectorAll(".horario-button")
                .forEach((btn) => btn.classList.remove("selected"));
              button.classList.add("selected");
            });
          });
        } else {
          console.error(
            "Erro ao buscar horários disponíveis: " + response.statusText
          );
        }
      } catch (error) {
        console.error("Erro ao buscar horários disponíveis: ", error);
      }
    }
  
    saveButton.addEventListener("click", async function () {
      const procedimentoId = procedimentosSelect.value || parseInt(params.get("fkProcedimento"), 10);
      const tipoAtendimento = tipoAgendamentoSelect.value;
      const especificacaoId = especificacoesSelect.value|| parseInt(params.get("fkEspecificacao"), 10);
      const data = dataInput.value;
      const horarioButton = document.querySelector(".horario-button.selected");
      const horario = horarioButton ? horarioButton.textContent : null;
      const tempoAgendar = tempoAgendarSelect;


      if (
        !procedimentoId ||
        !tipoAtendimento ||
        !especificacaoId ||
        !data ||
        !horario
      ) {
        showNotification("Todos os campos são obrigatórios", true);
        return;
      }
      console.log(`${data}T${horario}.000Z`);
      const dataHorario = new Date(`${data}T${horario}.000Z`).toISOString();
      const params = new URLSearchParams(window.location.search);

      const agendamento = {
        fk_usuario: parseInt(params.get("idUsuario"), 10),
        fk_procedimento: parseInt(procedimentoId, 10) || parseInt(params.get("fkProcedimento"), 10) ,
        fk_especificacao: parseInt(especificacaoId, 10)|| parseInt(params.get("fkEspecificacao"), 10) ,
        fk_status: 1,
        tipoAgendamento: tipoAtendimento,
        dataHorario: dataHorario,
        tempoAgendar: 50
      };
  
      try {
        // Realiza a requisição PUT para atualizar o agendamento
        const params = new URLSearchParams(window.location.search);
        const agendamentoId = params.get("id"); // Pega o ID do agendamento da URL
        const apiUrlEditarAgendamento = `http://localhost:8080/api/agendamentos/atualizar/${agendamentoId}`;
        const response = await fetch(apiUrlEditarAgendamento, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(agendamento),
        });
  
        if (response.ok) {
          // Mostra notificação de sucesso
          showNotification("Alterações realizadas com sucesso!");
    
          // Redireciona para a página index-mobile
          setTimeout(() => {
            window.location.href = "../index-mobile.html"; // Redireciona após 1 segundo
          }, 1000);
        } else {
          const errorMsg = await response.text();
          console.error("Erro ao reagendar: " + errorMsg);
          showNotification("Erro ao reagendar. Tente novamente.", true);
        }
      } catch (error) {
        console.error("Erro ao reagendar: ", error);
        showNotification("Erro ao reagendar. Tente novamente.", true);
  }
    });
  
    carregarProcedimentos();
    carregarEspecificacoes(); // Carrega todas as especificações no início
  });
  
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
  
  // document.addEventListener("DOMContentLoaded", function () {
  //   const nome = localStorage.getItem("nome");
  //   const instagram = localStorage.getItem("instagram");
  
  //   if (nome && instagram) {
  //     document.getElementById("userName").textContent = nome;
  //     document.getElementById("userInsta").textContent = instagram;
  //   }
  // });
  
  document.addEventListener("DOMContentLoaded", function () {
    // Captura o ID do agendamento da URL
    const params = new URLSearchParams(window.location.search);
    const agendamentoId = params.get("id"); // Pega o ID da URL
  
    if (!agendamentoId) {
      console.error("ID do agendamento não encontrado na URL");
      return;
    }
  
    // URL da API com o ID do agendamento capturado
    const url = `http://localhost:8080/api/agendamentos/buscar/${agendamentoId}`;
  
    // Realiza a requisição GET para obter os dados do agendamento
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Agendamento não encontrado");
        }
        return response.json();
      })
      .then((data) => {
        preencherFormulario(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar agendamento:", error);
      });
  
    // Função para preencher os campos do formulário com os dados recebidos
    function preencherFormulario(data) {
  
      // Preencher o select de procedimentos
      const procedimentosSelect = document.getElementById("procedimentos");
      const optionProcedimento = document.createElement("option");
      optionProcedimento.value = data.fkProcedimento; // Usar o ID do procedimento
      optionProcedimento.text = data.procedimento; // Mostrar o nome
      optionProcedimento.selected = true;
      procedimentosSelect.appendChild(optionProcedimento);
  
      // Preencher o select de tipo de atendimento
      const tipoAtendimentoSelect = document.getElementById("tipo-atendimento");
      tipoAtendimentoSelect.value = data.tipoAgendamento;
  
      // Preencher o select de especificações
      const especificacoesSelect = document.getElementById("especificacoes");
      const optionEspecificacao = document.createElement("option");
      optionEspecificacao.value = data.fkEspecificacao; // Usar o ID da especificação
      optionEspecificacao.text = data.especificacao; // Mostrar o nome
      optionEspecificacao.selected = true;
      especificacoesSelect.appendChild(optionEspecificacao);
      especificacoesSelect.disabled = false;
  
      // Preencher o campo de data
      const dataInput = document.getElementById("data");
      dataInput.value = data.dataHorario.split("T")[0];
  
      // Exibir horários disponíveis (simulando com o horário do agendamento)
      const horariosDisponiveis = document.getElementById("horarios-disponiveis");
      horariosDisponiveis.innerHTML = ""; // Limpar container
  
      // Formatar o horário do agendamento
      const horarioAgendamento = data.dataHorario.split("T")[1].substring(0, 5); // Mostra no formato HH:MM
  
      // Criar um botão para o horário do agendamento e marcá-lo como selecionado
      const button = document.createElement("button");
      button.textContent = horarioAgendamento;
      button.classList.add("horario-button", "selected"); // Marca como selecionado
      horariosDisponiveis.appendChild(button);
  
      // Adicionar comportamento de seleção de horário ao botão
      button.addEventListener("click", function () {
        document
          .querySelectorAll(".horario-button")
          .forEach((btn) => btn.classList.remove("selected"));
        button.classList.add("selected");
      });
    }
  });
  