document.addEventListener('DOMContentLoaded', function() {
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const rootElement = document.documentElement;

    // Definir tamanho de fonte padrão ou carregar do localStorage
    let currentFontSize = localStorage.getItem('fontSize') || '16px';
    rootElement.style.setProperty('--font-size-default', currentFontSize);
    document.body.style.fontSize = currentFontSize; // Aplicar o tamanho de fonte ao body

    // Função para aumentar o tamanho da fonte
    increaseFontBtn.addEventListener('click', function() {
        let newSize = parseFloat(currentFontSize) + 1;
        currentFontSize = `${newSize}px`;
        rootElement.style.setProperty('--font-size-default', currentFontSize);
        document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
        localStorage.setItem('fontSize', currentFontSize);
    });

    // Função para diminuir o tamanho da fonte
    decreaseFontBtn.addEventListener('click', function() {
        let newSize = parseFloat(currentFontSize) - 1;
        if (newSize >= 12) {  // Limitar tamanho mínimo da fonte
            currentFontSize = `${newSize}px`;
            rootElement.style.setProperty('--font-size-default', currentFontSize);
            document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
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
    saudacaoElement2.textContent = `Aqui você pode gerenciar suas atividades!`;

}

 // Função que faz a chamada à API e insere o resultado no <h2>
 async function gapUltimoAgendamento() {
    let idUsuario = localStorage.getItem('idUsuario');
    
    try {
        const response = await fetch(`http://localhost:8080/api/agendamentos/count-dias-ultimo-agendamento/${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {

            const data = await response.json();

            document.querySelector('.descricao-aviso h2').textContent = `${data} dias`;

            localStorage.setItem("QtdDiaUltimoAgendamento", data);
        } else {
            console.error("Erro na resposta:", response.status);
            document.querySelector('.descricao-aviso h2').textContent = 'Erro ao obter dados';
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        document.querySelector('.descricao-aviso h2').textContent = 'Erro ao obter dados';
    }
}

// Chama ambas as funções ao carregar a página
window.onload = function() {
    saudacao();
    gapUltimoAgendamento();
};

function getDiaMaisAgendado() {
    // Recupera o ID do usuário do localStorage
    const idUsuario = localStorage.getItem('idUsuario');
    
    // Verifica se o ID do usuário está presente
    if (!idUsuario) {
        console.error('ID do usuário não encontrado no localStorage');
        document.getElementById('dMaisAgendados').innerText = 'ID do usuário não encontrado';
        return;
    }

    // Coloque o endereço completo da API
    fetch(`http://localhost:8080/api/agendamentos/dia-mais-agendado/${idUsuario}`)  // Certifique-se de que a porta e o caminho estão corretos
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição, status ' + response.status);
            }
            return response.text();  // Lendo a resposta como texto
        })
        .then(data => {
            // Atualiza o span com o dia mais agendado
            document.getElementById('dMaisAgendados').innerText = data;
        })
        .catch(error => {
            console.error('Erro ao buscar o dia mais agendado:', error);
            document.getElementById('dMaisAgendados').innerText = 'Erro ao carregar';
        });
}

// Chama a função para pegar o dia mais agendado
getDiaMaisAgendado();


function getHorarioMaisAgendado() {
    // Recupera o ID do usuário do localStorage
    const idUsuario = localStorage.getItem('idUsuario');

    // Verifica se o ID do usuário está presente
    if (!idUsuario) {
        console.error('ID do usuário não encontrado no localStorage');
        document.getElementById('horarioMaisAgendado').innerText = 'ID do usuário não encontrado';
        return;
    }

    // Fazendo a requisição à API que retorna o intervalo de tempo mais agendado
    fetch(`http://localhost:8080/api/agendamentos/usuarios/${idUsuario}/intervalo-mais-agendado`) 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar o horário mais agendado');
            }
            return response.text();  // A resposta será texto (o intervalo de tempo)
        })
        .then(data => {
            // Atualiza o conteúdo do span com o horário retornado pela API
            document.getElementById('horarioMaisAgendado').innerText = data;
        })
        .catch(error => {
            console.error('Erro:', error);
            document.getElementById('horarioMaisAgendado').innerText = 'Erro ao carregar';
        });
}

// Chama a função para pegar o horário mais agendado
getHorarioMaisAgendado();





// Função para formatar a data e hora
function formatDateTime(dateTimeString) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    return new Date(dateTimeString).toLocaleString('pt-BR', options);
}

// Função para buscar procedimentos
async function fetchProcedimentos() {
    const idUsuario = localStorage.getItem('idUsuario');

    if (!idUsuario) {
        console.error('ID do usuário não encontrado em localDate.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/procedimentos/top3/${idUsuario}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const procedimentos = await response.json();

        const container = document.querySelector(".box-agendamento");
        container.innerHTML = ''; // Limpar conteúdo anterior

        procedimentos.forEach(procedimento => {
            // Supondo que a resposta seja um array como [id, tipo, descricao, data_horario]
            const tipo_procedimento = procedimento[1]; // Tipo
            const descricao_procedimento = procedimento[2]; // Descrição
            const data_horario = procedimento[4]; // Data e horário mais recente

            const foto = '../../assets/icons/profile.png'; // Imagem padrão, você pode ajustar conforme necessário

            const formattedDateTime = formatDateTime(data_horario);

            const agendamentoHTML = `
                <div class="box-agendamento">
                    <div class="box-agendamento2">
                        <div class="icon-agendamento">
                            <img src="${foto}" width="100" height="100" alt="${tipo_procedimento}">
                        </div>
                        <div class="procedimento-agendamento">
                            <span id="agendamento">${tipo_procedimento}<br> ${descricao_procedimento}</span>
                            <span id="agendamento">Último agendamento: ${formattedDateTime}</span> <!-- Aqui mostramos a data e hora formatadas -->
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', agendamentoHTML);
        });
    } catch (error) {
        console.error('Erro ao buscar procedimentos:', error);
    }
}

// Chamada da função
fetchProcedimentos();

