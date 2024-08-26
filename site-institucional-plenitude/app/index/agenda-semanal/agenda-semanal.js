// Variáveis globais para controle da semana
let semanaAtual = 0; // 0 representa a semana atual, -1 a semana anterior, 1 a próxima semana

// Função para calcular as datas da semana atual com base no deslocamento de semanas
function calcularDatasSemana(offset) {
  const hoje = new Date();
  const primeiroDiaSemana = new Date(hoje.setDate(hoje.getDate() - hoje.getDay() + 2 + (offset * 7))); // Segunda-feira
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
    const response = await fetch('http://localhost:8080/api/agendamentos/listar');
    if (!response.ok) throw new Error('Erro ao buscar os agendamentos');
    
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
  const thElements = document.querySelectorAll('thead th');
  thElements.forEach((th, index) => {
    const dia = diasSemana[index];
    th.innerHTML = `${dia.toLocaleDateString('pt-BR', { weekday: 'long' })}<br />${dia.getDate().toString().padStart(2, '0')}/${(dia.getMonth() + 1).toString().padStart(2, '0')}/${dia.getFullYear()}`;
  });

  // Atualiza o texto "Semana do dia x a y"
  const dataInicio = diasSemana[0];
  const dataFim = diasSemana[diasSemana.length - 1];
  const currentPageSpan = document.getElementById('current-page');
  currentPageSpan.innerText = `Semana do dia ${dataInicio.getDate().toString().padStart(2, '0')}/${(dataInicio.getMonth() + 1).toString().padStart(2, '0')}/${dataInicio.getFullYear()} à ${dataFim.getDate().toString().padStart(2, '0')}/${(dataFim.getMonth() + 1).toString().padStart(2, '0')}/${dataFim.getFullYear()}`;

  // Seleciona todas as colunas (td) na primeira linha do corpo da tabela
  const diasElements = document.querySelectorAll('tbody tr td');
  diasElements.forEach(diaElement => diaElement.innerHTML = ''); // Limpa o conteúdo antes de popular

  agendamentos.forEach(agendamento => {
    const data = new Date(agendamento.dataHorario);
    
    diasSemana.forEach((dia, index) => {
      if (data.toDateString() === dia.toDateString()) { // Verifica se o agendamento está no dia correspondente
        const diaElement = diasElements[index];
        const appointment = document.createElement('div');
        appointment.classList.add('appointment');
        
        const horarioFormatado = `${data.getHours().toString().padStart(2, '0')}h${data.getMinutes().toString().padStart(2, '0')}`;
        appointment.innerHTML = `
          <p>${horarioFormatado} - ${horarioFormatado}<br />${agendamento.usuario.nome}<br />${agendamento.especificacao.especificacao}</p>
        `;
  
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
document.getElementById('prev-page-btn').addEventListener('click', () => changeWeek(-1));
document.getElementById('next-page-btn').addEventListener('click', () => changeWeek(1));

// Evento de clique no botão "Semana Atual"
document.getElementById('btn-voltar-home').addEventListener('click', voltarSemanaAtual);

// Chama o fetchAgendamentos ao carregar a página para exibir a semana atual
fetchAgendamentos();

document.addEventListener("DOMContentLoaded", function () {
    const nome = localStorage.getItem("nome");
    const email = localStorage.getItem("email");
  
    if (nome && email) {
      document.getElementById("userName").textContent = nome;
      document.getElementById("userNameSpan").textContent = nome;
      document.getElementById("userEmail").textContent = email;
    }
  });