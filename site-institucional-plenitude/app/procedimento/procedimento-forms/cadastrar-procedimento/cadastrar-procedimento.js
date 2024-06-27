document.addEventListener('DOMContentLoaded', function () {
    // Função para exibir notificação
    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        notificationMessage.textContent = message;
        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Função para carregar procedimentos no dropdown
    function loadProcedimentos() {
        fetch('http://localhost:8080/api/procedimentos/listar')
            .then(response => response.json())
            .then(data => {
                const procedimentoDropdown = document.getElementById('procedimento-dropdown');
                procedimentoDropdown.innerHTML = ''; // Limpa o dropdown antes de adicionar os novos procedimentos
                data.forEach(procedimento => {
                    const option = document.createElement('option');
                    option.value = procedimento.idProcedimento; // Certifique-se de que 'idProcedimento' é o campo correto para o ID do procedimento
                    option.textContent = procedimento.tipo;
                    procedimentoDropdown.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar procedimentos:', error);
                showNotification('Erro ao carregar procedimentos: ' + error.message, true);
            });
    }

    // Carregar procedimentos ao iniciar a página
    loadProcedimentos();

    document.getElementById('save-procedimento-button').addEventListener('click', function () {
        const nome = document.getElementById('nome').value;
        const descricao = document.getElementById('descricao').value;

        const procedimentoData = {
            tipo: nome,
            descricao: descricao
        };

        fetch('http://localhost:8080/api/procedimentos/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(procedimentoData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Procedimento salvo com sucesso:', data);
                showNotification('Procedimento salvo com sucesso!');
                loadProcedimentos(); // Atualizar o dropdown após salvar o procedimento
            })
            .catch(error => {
                console.error('Erro ao salvar procedimento:', error);
                showNotification('Erro ao salvar procedimento!', true);
            });
    });

    document.getElementById('save-especificacao-button').addEventListener('click', function () {
        const especificacao = document.getElementById('especificacao').value;
        let duracaoHoras = document.getElementById('duracao-horas').value;
        let duracaoMinutos = document.getElementById('duracao-minutos').value;
        const valorColocacao = document.getElementById('valor-colocacao').value;
        const valorRetirada = document.getElementById('valor-retirada').value;
        const valorManutencao = document.getElementById('valor-manutencao').value;
        const procedimentoId = document.getElementById('procedimento-dropdown').value;

        duracaoHoras = duracaoHoras.padStart(2, '0');
        duracaoMinutos = duracaoMinutos.padStart(2, '0');

        const tempoData = {
            tempoColocacao: `${duracaoHoras}:${duracaoMinutos}`,
            tempoManutencao: `${duracaoHoras}:${duracaoMinutos}`,
            tempoRetirada: `${duracaoHoras}:${duracaoMinutos}`
        };

        fetch('http://localhost:8080/api/tempos/cadastro-tempo-procedimento', {
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

                return fetch('http://localhost:8080/especificacoes/cadastro-especificacao', {
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
                showNotification('Especificação salva com sucesso!');
            })
            .catch(error => {
                console.error('Erro ao salvar especificação:', error);
                showNotification('Erro ao salvar especificação!', true);
            });
    });
});

// nav
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Ação para os botões de navegação
        });
    });
});

const list = document.querySelectorAll(".list");
function activeLink() {
    list.forEach((item) =>
        item.classList.remove("active"));
    this.classList.add("active");
}
list.forEach((item) =>
    item.addEventListener('click', activeLink));

document.addEventListener('DOMContentLoaded', function () {
    const uploadFotoInput = document.getElementById('upload-foto');
    const customUploadButton = document.getElementById('custom-upload-button');
    const fileNameSpan = document.getElementById('file-name');

    customUploadButton.addEventListener('click', function () {
        uploadFotoInput.click();
    });

    uploadFotoInput.addEventListener('change', function () {
        if (uploadFotoInput.files.length > 0) {
            fileNameSpan.textContent = uploadFotoInput.files[0].name;
        } else {
            fileNameSpan.textContent = 'Nenhum arquivo escolhido';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }
});