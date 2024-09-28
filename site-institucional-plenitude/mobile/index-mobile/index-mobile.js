// Usar o idUsuario dinamicamente na URL do endpoint
const usuarioId = localStorage.getItem('idUsuario');
const agendamentoId = localStorage.getItem('idAgendamento')
const apiUrl = `http://localhost:8080/api/agendamentos/agendamentos/usuario/${usuarioId}`;

// Função para formatar a data
function formatarData(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleDateString() + ' às ' + data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Função para criar os elementos de agendamento no DOM
function criarAgendamento(agendamento, isAnterior = false) {
    const boxAgendamento = document.createElement('div');
    boxAgendamento.classList.add('box-agendamento');

    // Criação do círculo branco com o ícone menor dentro
    const iconAgendamento = document.createElement('div');
    iconAgendamento.classList.add('icon-procedimento');
    iconAgendamento.style.backgroundColor = '#ffffff';
    iconAgendamento.style.border = '2px solid #AD9393';
    iconAgendamento.style.width = '80px';
    iconAgendamento.style.height = '80px';
    iconAgendamento.style.marginTop = '10px';

    const imgIcon = document.createElement('img');

    // Verifica o tipo de procedimento e ajusta o ícone
    switch (agendamento.tipoProcedimento) {
        case 'Maquiagem':
            imgIcon.src = '../../assets/icons/maquiagem-mobile.png';
            break;
        case 'Cílios':
            imgIcon.src = '../../assets/icons/cilios-mobile.png';
            break;
        case 'Sobrancelha':
            imgIcon.src = '../../assets/icons/sobrancelha-mobile.png';
            break;
        default:
            imgIcon.src = '../../assets/icons/profile.png'; // Ícone padrão
            break;
    }

    imgIcon.alt = agendamento.tipoProcedimento;
    imgIcon.classList.add('procedimento-icon'); // Classe para ajustar o tamanho do ícone
    iconAgendamento.appendChild(imgIcon);

    const procedimentoAgendamento = document.createElement('div');
    procedimentoAgendamento.classList.add('procedimento-agendamento');

    const dataSpan = document.createElement('span');
    dataSpan.textContent = formatarData(agendamento.dataAgendamento);
    dataSpan.style.fontWeight = 'bold';
    dataSpan.style.fontSize = '15px';

    const tipoSpan = document.createElement('span');
    tipoSpan.textContent = `${agendamento.tipoProcedimento} - ${agendamento.especificacaoProcedimento}`;
    tipoSpan.style.fontSize = '13px';

    procedimentoAgendamento.appendChild(dataSpan);
    procedimentoAgendamento.appendChild(tipoSpan);

    const buttonFlex = document.createElement('div');
    buttonFlex.classList.add('button-flex');

    // Botão de mais informações (três pontinhos) para todos os agendamentos
    const detalhesButton = document.createElement('button');
    detalhesButton.classList.add('edit');
    const detalhesImg = document.createElement('img');
    detalhesImg.src = '../../assets/icons/mais-tres-pontos-indicador.png';
    detalhesImg.alt = 'detalhes';
    detalhesButton.appendChild(detalhesImg);
    buttonFlex.appendChild(detalhesButton);

    // Evento de abrir modal ao clicar em "detalhes"
    detalhesButton.addEventListener('click', function() {
        abrirModalAgendamento(agendamento);
    });

    if (!isAnterior) {
        // Agendamentos futuros também têm botão de deletar e editar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('edit');
        deleteButton.setAttribute('data-id', agendamento.idAgendamento);

        // Adicionar evento ao botão para mostrar o modal de exclusão
        deleteButton.addEventListener('click', function () {
            document.getElementById('deleteModal').style.display = 'flex';

            // Captura o ID do agendamento do botão
            const agendamentoId = this.getAttribute('data-id');

            document.getElementById('confirmDeleteButton').addEventListener('click', function () {
                // Usa o ID capturado na URL
                fetch(`http://localhost:8080/api/agendamentos/excluir/${agendamentoId}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (response.ok) {
                        showNotification("Agendamento excluído com sucesso!");
                        location.reload();
                    } else {
                        showNotification("Erro ao excluir o agendamento. Tente novamente.", true);
                    }
                })
                .catch(error => {
                    showNotification("Agendamento excluído com sucesso!");
                });

                // Fechar o modal após confirmar
                document.getElementById('deleteModal').style.display = 'none';
            });
        });

        const deleteImg = document.createElement('img');
        deleteImg.src = '../../assets/icons/excluir.png';
        deleteImg.alt = 'delete';
        deleteButton.appendChild(deleteImg);
        buttonFlex.appendChild(deleteButton);

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        const editImg = document.createElement('img');
        editImg.src = '../../assets/icons/pen.png';
        editImg.alt = 'edit';
        editButton.appendChild(editImg);

        editButton.addEventListener('click', function() {
            const agendamentoId = agendamento.idAgendamento;
            const usuarioId = agendamento.usuarioId;
            const fkProcedimento = agendamento.fkProcedimento;
            const fkEspecificacao = agendamento.fkEspecificacao;
            window.location.href = `reagendarForms/reagendar-mobile.html?id=${agendamentoId}&idUsuario=${usuarioId}&fkProcedimento=${fkProcedimento}&fkEspecificacao=${fkEspecificacao}`;
        });
        buttonFlex.appendChild(editButton);
    }

    boxAgendamento.appendChild(iconAgendamento);
    boxAgendamento.appendChild(procedimentoAgendamento);
    boxAgendamento.appendChild(buttonFlex);

    return boxAgendamento;
}

function showNotification(message, isError = false) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    
    // Define a mensagem
    notificationMessage.textContent = message;

    // Define se é um erro ou não
    if (isError) {
        notification.classList.add("error");
    } else {
        notification.classList.remove("error");
    }

    // Exibe a notificação adicionando a classe "show"
    notification.classList.add("show");


    // Remove a notificação após 10 segundos (10000 milissegundos)
    notificationTimeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 3000); 
}

// Função para carregar e processar agendamentos
async function carregarAgendamentos() {
    try {
        const response = await fetch(apiUrl);
        const agendamentos = await response.json();

        const containerFuturos = document.getElementById('agendamentos-futuros');
        const containerAnteriores = document.getElementById('agendamentos-anteriores');
        const verTodosLink = document.getElementById('ver-todos-link');

        containerFuturos.innerHTML = '';
        containerAnteriores.innerHTML = '';

        const agora = new Date(); // Data e hora atuais
        let agendamentosAnteriores = [];
        let agendamentosFuturos = [];

        agendamentos.forEach(agendamento => {
            const dataAgendamento = new Date(agendamento.dataAgendamento);

            // Verifica se o agendamento é de hoje e se o horário já passou
            const ehHoje = dataAgendamento.toDateString() === agora.toDateString();
            const jaPassou = ehHoje && dataAgendamento < agora;

            if (dataAgendamento >= agora && !jaPassou) {
                // Agendamentos futuros
                agendamentosFuturos.push(agendamento);
            } else {
                // Agendamentos anteriores ou realizados hoje
                agendamentosAnteriores.push(agendamento);
            }
        });

        // Ordenar agendamentos futuros em ordem crescente
        agendamentosFuturos.sort((a, b) => new Date(a.dataAgendamento) - new Date(b.dataAgendamento));

        // Exibir agendamentos futuros
        agendamentosFuturos.forEach(agendamento => {
            const agendamentoElement = criarAgendamento(agendamento);
            containerFuturos.appendChild(agendamentoElement);
        });

        // Exibir os 3 primeiros agendamentos anteriores
        agendamentosAnteriores.slice(0, 3).forEach(agendamento => {
            const agendamentoElement = criarAgendamento(agendamento, true);
            containerAnteriores.appendChild(agendamentoElement);
        });

        // Evento do botão "Ver todos"
        verTodosLink.addEventListener('click', (e) => {
            e.preventDefault();
            containerAnteriores.innerHTML = ''; // Limpa os atuais
            agendamentosAnteriores.forEach(agendamento => {
                const agendamentoElement = criarAgendamento(agendamento, true);
                containerAnteriores.appendChild(agendamentoElement); // Exibe todos
            });
            verTodosLink.style.display = 'none'; // Esconde o link após exibir todos
        });

    } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
    }
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', carregarAgendamentos);

function abrirModalAgendamento(agendamento) {
    // Seleciona o modal pelo ID
    const modal = document.getElementById('modal-agendamento');
    
    // Seleciona os elementos dentro do modal onde você exibirá as informações
    const modalData = document.getElementById('modal-data');
    const modalHorario = document.getElementById('modal-horario');
    const modalDiaSemana = document.getElementById('modal-dia-semana');
    const modalProcedimento = document.getElementById('modal-procedimento');
    const modalEspecificacao = document.getElementById('modal-especificacao');
    const modalProfissional = document.getElementById('modal-profissional');
    const modalLocal = document.getElementById('modal-local');
    const modalStatus = document.getElementById('modal-status');

    // Função para formatar data e horário
    const formatarData = (data) => {
        const optionsData = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const optionsHorario = { hour: '2-digit', minute: '2-digit' };

        const dataObj = new Date(data);
        
        const diaSemana = dataObj.toLocaleDateString('pt-BR', { weekday: 'long' });
        const diaMesAno = dataObj.toLocaleDateString('pt-BR', optionsData);
        const horario = dataObj.toLocaleTimeString('pt-BR', optionsHorario);

        return { diaSemana, diaMesAno, horario };
    };

    const dataFormatada = formatarData(agendamento.dataAgendamento);

    // Atualiza os elementos com os dados do agendamento clicado
    // modalDiaSemana.textContent = dataFormatada.diaSemana;
    modalData.innerHTML = `<strong>Data:</strong> ${dataFormatada.diaMesAno}`;
    modalHorario.innerHTML = `<strong>Horário:</strong> ${dataFormatada.horario}`;
    modalProcedimento.innerHTML = `<strong>Procedimento:</strong> ${agendamento.tipoProcedimento}`;
    modalEspecificacao.innerHTML = `<strong>Especificação:</strong> ${agendamento.especificacaoProcedimento}`;
    modalProfissional.innerHTML = `<strong>Profissional:</strong> Priscila Rossato`;
    modalLocal.innerHTML = `<strong>Local:</strong> Vila Prudente`;
    modalStatus.innerHTML = `<strong>Status:</strong> ${agendamento.statusAgendamento} `;
    
    // Exibe o modal
    modal.style.display = 'block';
}

// Função para fechar o modal
function fecharModal() {
    const modal = document.getElementById('modal-agendamento');
    modal.style.display = 'none';
}

// Função para fechar o modal
function fecharModalDecisao() {
    const modal = document.getElementById('deleteModal');
    modal.style.display = 'none';
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
        { nome: "domingo", genero: "um", otimo: "ótimo" },
        { nome: "segunda-feira", genero: "uma", otimo: "ótima" },
        { nome: "terça-feira", genero: "uma", otimo: "ótima" },
        { nome: "quarta-feira", genero: "uma", otimo: "ótima" },
        { nome: "quinta-feira", genero: "uma", otimo: "ótima" },
        { nome: "sexta-feira", genero: "uma", otimo: "ótima" },
        { nome: "sábado", genero: "um", otimo: "ótimo"  }
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

