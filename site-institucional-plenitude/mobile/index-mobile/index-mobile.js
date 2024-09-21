// Usar o idUsuario dinamicamente na URL do endpoint
const usuarioId = localStorage.getItem('idUsuario');
const apiUrl = `http://localhost:8080/api/agendamentos/agendamentos/usuario/${usuarioId}`;

// Função para formatar a data
function formatarData(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleDateString() + ' às ' + data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Função para criar os elementos de agendamento no DOM
function criarAgendamento(agendamento) {
    const boxAgendamento = document.createElement('div');
    boxAgendamento.classList.add('box-agendamento');

    const iconAgendamento = document.createElement('div');
    iconAgendamento.classList.add('icon-agendamento');
    const imgIcon = document.createElement('img');
    imgIcon.src = '../../assets/icons/profile.png';
    imgIcon.alt = '';
    iconAgendamento.appendChild(imgIcon);

    const procedimentoAgendamento = document.createElement('div');
    procedimentoAgendamento.classList.add('procedimento-agendamento');
    
    const dataSpan = document.createElement('span');
    dataSpan.textContent = formatarData(agendamento.dataAgendamento);
    
    const tipoSpan = document.createElement('span');
    tipoSpan.textContent = `${agendamento.tipoProcedimento} - ${agendamento.especificacaoProcedimento}`;

    procedimentoAgendamento.appendChild(dataSpan);
    procedimentoAgendamento.appendChild(tipoSpan);

    const buttonFlex = document.createElement('div');
    buttonFlex.classList.add('button-flex');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('edit');
    const deleteImg = document.createElement('img');
    deleteImg.src = '../../assets/icons/excluir.png';
    deleteImg.alt = 'delete';
    deleteButton.appendChild(deleteImg);

    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    const editImg = document.createElement('img');
    editImg.src = '../../assets/icons/pen.png';
    editImg.alt = 'edit';
    editButton.appendChild(editImg);

    buttonFlex.appendChild(deleteButton);
    buttonFlex.appendChild(editButton);

    boxAgendamento.appendChild(iconAgendamento);
    boxAgendamento.appendChild(procedimentoAgendamento);
    boxAgendamento.appendChild(buttonFlex);

    return boxAgendamento;
}

// Função para buscar os agendamentos e adicionar ao container
async function carregarAgendamentos() {
    try {
        const response = await fetch(apiUrl);
        const agendamentos = await response.json();

        const container = document.getElementById('agendamentos-container');
        container.innerHTML = '';

        agendamentos.forEach(agendamento => {
            const agendamentoElement = criarAgendamento(agendamento);
            container.appendChild(agendamentoElement);
        });
    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAgendamentos);

document.addEventListener('DOMContentLoaded', function() {

    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const rootElement = document.documentElement;

    // Definir tamanho de fonte padrão ou carregar do localStorage
    let currentFontSize = localStorage.getItem('fontSize') || '16px';
    rootElement.style.setProperty('--font-size-default', currentFontSize);

    // Função para aumentar o tamanho da fonte
    increaseFontBtn.addEventListener('click', function() {
        let newSize = parseFloat(currentFontSize) + 1;
        currentFontSize = `${newSize}px`;
        rootElement.style.setProperty('--font-size-default', currentFontSize);
        localStorage.setItem('fontSize', currentFontSize);
    });

    // Função para diminuir o tamanho da fonte
    decreaseFontBtn.addEventListener('click', function() {
        let newSize = parseFloat(currentFontSize) - 1;
        if (newSize >= 12) {  // Limitar tamanho mínimo da fonte
            currentFontSize = `${newSize}px`;
            rootElement.style.setProperty('--font-size-default', currentFontSize);
            localStorage.setItem('fontSize', currentFontSize);
        }
    });
});

function saudacao() {
    const saudacaoElement1 = document.getElementById('greeting1');
    const saudacaoElement2 = document.getElementById('greeting2');

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
        { nome: "Sábado", genero: "um", otimo: "ótimo"  }
    ];
    
    // Verifica a hora do dia para a saudação
    if (horaAtual >= 0 && horaAtual < 12) {
        saudacaoTexto = "Bom dia";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacaoTexto = "Boa tarde";
    } else {
        saudacaoTexto = "Boa noite";
    }

    // Define o gênero correto para o "um/uma" de acordo com o dia da semana
    const dia = diasDaSemana[diaSemana];
    const genero = dia.genero;
    const otimo = dia.otimo;

    // Exibe a saudação com o dia da semana e o gênero correto
    saudacaoElement1.textContent = `${saudacaoTexto}`;
    saudacaoElement2.textContent = `Tenha ${genero} ${otimo} ${dia.nome}!`;

}

// Chama a função quando a página carregar
window.onload = saudacao;

