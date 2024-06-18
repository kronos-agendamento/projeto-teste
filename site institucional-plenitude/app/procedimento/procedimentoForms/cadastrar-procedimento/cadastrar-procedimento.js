document.addEventListener('DOMContentLoaded', function () {
    // Fetch and populate procedures dropdown
    fetch('http://127.0.0.1:5500/api/procedimentos/listar')
        .then(response => response.json())
        .then(data => {
            const procedimentoDropdown = document.getElementById('procedimento-dropdown');
            data.forEach(procedimento => {
                const option = document.createElement('option');
                option.value = procedimento.idProcedimento; // Certifique-se de que 'idProcedimento' é o campo correto para o ID do procedimento
                option.textContent = procedimento.tipo;
                procedimentoDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar procedimentos:', error);
        });

    document.getElementById('save-procedimento-button').addEventListener('click', function () {
        const nome = document.getElementById('nome').value;
        const descricao = document.getElementById('descricao').value;

        const procedimentoData = {
            tipo: nome,
            descricao: descricao
        };

        fetch('http://127.0.0.1:5500/api/procedimentos/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(procedimentoData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Procedimento salvo com sucesso:', data);
            })
            .catch(error => {
                console.error('Erro ao salvar procedimento:', error);
            });
    });

    document.getElementById('save-especificacao-button').addEventListener('click', function () {
        const especificacao = document.getElementById('especificacao').value;
        const duracaoHoras = document.getElementById('duracao-horas').value;
        const duracaoMinutos = document.getElementById('duracao-minutos').value;
        const valorColocacao = document.getElementById('valor-colocacao').value;
        const valorRetirada = document.getElementById('valor-retirada').value;
        const valorManutencao = document.getElementById('valor-manutencao').value;
        const procedimentoId = document.getElementById('procedimento-dropdown').value;

        const tempoData = {
            tempoColocacao: `${duracaoHoras}:${duracaoMinutos}`,
            tempoManutencao: `${duracaoHoras}:${duracaoMinutos}`,
            tempoRetirada: `${duracaoHoras}:${duracaoMinutos}`
        };

        fetch('http://127.0.0.1:5500/api/tempos/cadastro-tempo-procedimento', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tempoData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(tempoResponse => {
                console.log('Tempo salvo com sucesso:', tempoResponse);

                const especificacaoData = {
                    especificacao: especificacao,
                    precoColocacao: parseFloat(valorColocacao),
                    precoManutencao: parseFloat(valorManutencao),
                    precoRetirada: parseFloat(valorRetirada),
                    fkTempoProcedimentoId: tempoResponse.idTempoProcedimento,
                    fkProcedimentoId: procedimentoId
                };

                return fetch('http://127.0.0.1:5500/especificacoes/cadastro-especificacao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(especificacaoData)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(especificacaoResponse => {
                console.log('Especificação salva com sucesso:', especificacaoResponse);
            })
            .catch(error => {
                console.error('Erro ao salvar especificação:', error);
            });
    });
});

// nav
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            alert(`Button ${button.innerText} clicked!`);
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