// Variáveis globais para controle da semana
let semanaAtual = 0; // 0 representa a semana atual, -1 a semana anterior, 1 a próxima semana

// Função para calcular as datas da semana atual com base no deslocamento de semanas
function calcularDatasSemana(offset) {
  const hoje = new Date();
  const primeiroDiaSemana = new Date(
    hoje.setDate(hoje.getDate() - hoje.getDay() + 2 + offset * 7)
  ); // Segunda-feira
  const diasSemana = [];

  for (let i = 0; i < 5; i++) {
    const dia = new Date(primeiroDiaSemana);
    dia.setDate(primeiroDiaSemana.getDate() + i);
    diasSemana.push(dia);
  }

  return diasSemana;
}

// Função para buscar os agendamentos e renderizar a semana atual
async function fetchAgendamentos() {
  try {
    const response = await fetch(
      "http://localhost:8080/api/agendamentos/listar"
    );
    if (!response.ok) throw new Error("Erro ao buscar os agendamentos");

    const agendamentos = await response.json();
    renderAgenda(agendamentos);
  } catch (error) {
    console.error(error);
  }
}

// Renderizar a agenda para a semana selecionada
function renderAgenda(agendamentos) {
  const diasSemana = calcularDatasSemana(semanaAtual);

  // Atualiza as datas na interface
  const thElements = document.querySelectorAll("thead th");
  thElements.forEach((th, index) => {
    const dia = diasSemana[index];
    th.innerHTML = `${dia.toLocaleDateString("pt-BR", {
      weekday: "long",
    })}<br />${dia.getDate().toString().padStart(2, "0")}/${(dia.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dia.getFullYear()}`;
  });

  // Atualiza o texto "Semana do dia x a y"
  const dataInicio = diasSemana[0];
  const dataFim = diasSemana[diasSemana.length - 1];
  const currentPageSpan = document.getElementById("current-page");
  currentPageSpan.innerText = `Semana do dia ${dataInicio
    .getDate()
    .toString()
    .padStart(2, "0")}/${(dataInicio.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${dataInicio.getFullYear()} à ${dataFim
    .getDate()
    .toString()
    .padStart(2, "0")}/${(dataFim.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${dataFim.getFullYear()}`;

  // Seleciona todas as colunas (td) na primeira linha do corpo da tabela
  const diasElements = document.querySelectorAll("tbody tr td");
  diasElements.forEach((diaElement) => (diaElement.innerHTML = "")); // Limpa o conteúdo antes de popular

  agendamentos.forEach((agendamento) => {
    const data = new Date(agendamento.dataHorario);

    diasSemana.forEach((dia, index) => {
      if (data.toDateString() === dia.toDateString()) {
        // Verifica se o agendamento está no dia correspondente
        const diaElement = diasElements[index];
        const appointment = document.createElement("div");
        appointment.classList.add("appointment");

        // Formata o horário do agendamento
        const horarioFormatado = `${data
          .getHours()
          .toString()
          .padStart(2, "0")}h${data.getMinutes().toString().padStart(2, "0")}`;

        // Se o tipo de agendamento for "Bloqueio", exibe "BLOQUEIO" e o horário
        if (agendamento.tipoAgendamento === "Bloqueio") {
          appointment.innerHTML = `<p>${horarioFormatado}<br />BLOQUEIO</p>`;
        } else {
          // Caso contrário, exibe o horário, o nome do usuário e a especificação
          appointment.innerHTML = `
            <p>${horarioFormatado}<br />${agendamento.usuario}<br />${
            agendamento.especificacao || ""
          }</p>
          `;
        }

        diaElement.appendChild(appointment);
      }
    });
  });
}

// Paginação de semanas
function changeWeek(offset) {
  semanaAtual += offset;
  fetchAgendamentos(); // Chama a função para buscar e renderizar agendamentos da semana atualizada
}

// Voltar para a semana atual
function voltarSemanaAtual() {
  semanaAtual = 0;
  fetchAgendamentos(); // Renderiza a semana atual
}

// Eventos de clique nos botões de navegação
document
  .getElementById("prev-page-btn")
  .addEventListener("click", () => changeWeek(-1));
document
  .getElementById("next-page-btn")
  .addEventListener("click", () => changeWeek(1));

// Evento de clique no botão "Semana Atual"
document
  .getElementById("btn-voltar-home")
  .addEventListener("click", voltarSemanaAtual);

// Chama o fetchAgendamentos ao carregar a página para exibir a semana atual
fetchAgendamentos();



document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }



});

// Array com os dias da semana em português
const diasSemana = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

// Certifique-se de que a saudação só é chamada após o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  saudacao(); // Chama a função saudacao quando o DOM estiver pronto
});

function saudacao() {
  const saudacaoElement1 = document.getElementById('greeting1');
  const saudacaoElement2 = document.getElementById('greeting2');

  // Verifica se os elementos existem antes de tentar modificar seu conteúdo
  if (!saudacaoElement1 || !saudacaoElement2) {
    console.error("Elementos de saudação não encontrados no DOM.");
    return; // Sai da função se os elementos não existirem
  }

  const dataAtual = new Date();
  const horaAtual = dataAtual.getHours();
  const diaSemana = dataAtual.getDay();

  let saudacaoTexto;
  let diasDaSemana = [
    { nome: "Domingo", genero: "um", otimo: "ótimo" },
    { nome: "Segunda-feira", genero: "uma", otimo: "ótima" },
    { nome: "Terça-feira", genero: "uma", otimo: "ótima" },
    { nome: "Quarta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Quinta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Sexta-feira", genero: "uma", otimo: "ótima" },
    { nome: "Sábado", genero: "um", otimo: "ótimo" }
  ];

  // Verifica a hora do dia para a saudação
  if (horaAtual >= 0 && horaAtual < 12) {
    saudacaoTexto = "Bom dia,";
  } else if (horaAtual >= 12 && horaAtual < 18) {
    saudacaoTexto = "Boa tarde,";
  } else {
    saudacaoTexto = "Boa noite,";
  }

  // Define o gênero correto para o "um/uma" de acordo com o dia da semana
  const dia = diasDaSemana[diaSemana];
  const genero = dia.genero;
  const otimo = dia.otimo;

  // Exibe a saudação com o dia da semana e o gênero correto
  saudacaoElement1.textContent = `${saudacaoTexto}`;
  saudacaoElement2.textContent = `Tenha ${genero} ${otimo} ${dia.nome}!`;
}

window.onload = saudacao;
new window.VLibras.Widget('https://vlibras.gov.br/app');

async function carregarImagem2() {
  const cpf = localStorage.getItem("cpf"); // Captura o valor do CPF a cada execução
  const perfilImage = document.getElementById("perfilImage");

  if (!cpf) {
      console.log("CPF não encontrado.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:8080/usuarios/busca-imagem-usuario/${cpf}`, {
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

// Carrega a imagem automaticamente quando a página termina de carregar
window.onload = carregarImagem2;