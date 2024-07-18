// Your JavaScript functionality can be added here.
// For now, let's just add some basic functionality for demonstration.
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
        });
    });
});

const list = document.querySelectorAll(".list");
function activeLink(){
    list.forEach((item) => 
    item.classList.remove("active"));
    this.classList.add("active");
}

list.forEach((item) => 
    item.addEventListener('click', activeLink));

const content = document.querySelector('.content');
let scrollPosition = 0;

function scrollUp() {
    scrollPosition -= 50; // Altere conforme necessário
    content.scrollTo({ top: scrollPosition, behavior: 'smooth' });
}

function scrollDown() {
    scrollPosition += 50; // Altere conforme necessário
    content.scrollTo({ top: scrollPosition, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userNameSpan').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }
});

(function() {
    "use strict";
  

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }
}
)

document.addEventListener('DOMContentLoaded', () => {
    const apiBaseUrl = 'http://localhost:8080';

    const fetchProcedimentos = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/procedimentos/listar`);
            if (response.ok) {
                const data = await response.json();
                return data.slice(0, 2); // Retorna no máximo 2 procedimentos
            } else {
                console.error('Falha ao buscar procedimentos');
                return [];
            }
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    };

    const fetchTempos = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/tempos`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Falha ao buscar tempos de procedimentos');
                return [];
            }
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    };

    const fetchEspecificacoes = async () => {
        try {
            const response = await fetch(`${apiBaseUrl}/especificacoes`);
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Falha ao buscar especificações');
                return [];
            }
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    };

    const formatarDuracao = (tempoColocacao) => {
        if (!tempoColocacao || tempoColocacao === 'N/A') {
            return 'N/A';
        }

        const [horas, minutos] = tempoColocacao.split(':');
        const horasFormatadas = parseInt(horas, 10);
        const minutosFormatados = parseInt(minutos, 10);

        if (horasFormatadas === 0) {
            return `${minutosFormatados}h`;
        } else {
            return `${horasFormatadas}:${minutosFormatados < 10 ? '0' + minutosFormatados : minutosFormatados}`;
        }
    };

    const popularTabela = async () => {
        const procedimentos = await fetchProcedimentos();
        const tempos = await fetchTempos();
        const especificacoes = await fetchEspecificacoes();

        const tabela = document.querySelector('#procedimentos-cadastrados tbody');
        tabela.innerHTML = ''; // Limpa a tabela antes de inserir novos dados

        procedimentos.forEach(procedimento => {
            const tempo = tempos.find(t => t.procedimentoId === procedimento.id);
            const especificacao = especificacoes.find(e => e.procedimentoId === procedimento.id);

            // Formata o preço com "R$" antes do número
            const precoFormatado = `R$ ${especificacao.precoColocacao.toFixed(2)}`;

            // Formata a duração (tempo) conforme especificado
            const duracaoFormatada = tempo ? formatarDuracao(tempo.tempoColocacao) : 'N/A';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${procedimento.tipo}</td>
                <td>${precoFormatado}</td>
                <td>${duracaoFormatada}h</td>
                <td>${especificacao ? especificacao.especificacao : 'N/A'}</td>
            `;
            tabela.appendChild(row);
        });
    };

    popularTabela();
});



document.addEventListener("DOMContentLoaded", () => {
    // Função para formatar o CPF
    function formatarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); // Remove tudo que não é dígito
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Formatação com pontos e traço
    }

    // Realiza a requisição para obter os agendamentos
    fetch('http://localhost:8080/api/agendamentos/listar')
        .then(response => response.json())
        .then(data => {
            // Ordena os agendamentos pela data em ordem decrescente
            const sortedData = data.sort((a, b) => new Date(b.data) - new Date(a.data));

            // Seleciona a tabela de "Clientes Frequentes"
            const frequentClientsTable = document.getElementById('clientes-frequentes').getElementsByTagName('tbody')[0];

            // Itera pelos dois agendamentos mais recentes
            sortedData.slice(0, 2).forEach(agendamento => {
                const row = frequentClientsTable.insertRow();
                const nome = agendamento.usuario.nome;
                const cpfFormatado = formatarCPF(agendamento.usuario.cpf);
                const ultimaAparicao = new Date(agendamento.data).toLocaleDateString('pt-BR');
                const ultimoProcedimento = agendamento.procedimento.tipo;

                row.insertCell(0).innerText = nome;
                row.insertCell(1).innerText = cpfFormatado;
                row.insertCell(2).innerText = ultimaAparicao;
                row.insertCell(3).innerText = ultimoProcedimento;
            });
        })
        .catch(error => console.error('Erro:', error));
});




