document.addEventListener('DOMContentLoaded', function () {
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

    const baseUrl = 'http://localhost:8080/api';
    const proceduresTbody = document.getElementById('procedures-tbody');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const modal = document.getElementById('modal');
    const modalProcedimento = document.getElementById('procedimento');
    const btnYes = document.querySelector('.btn-yes');
    let currentPage = 1;
    const itemsPerPage = 5;
    let procedimentos = [];
    let procedimentoIdParaDeletar = null;

    function fetchData(endpoint, id) {
        fetch(baseUrl + endpoint)
            .then(response => response.json())
            .then(data => {
                const elemento = document.getElementById(id);
                if (data && data.tipo) {
                    elemento.textContent = data.tipo;
                } else {
                    elemento.textContent = 'Não disponível';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
                document.getElementById(id).textContent = 'Erro ao carregar';
            });
    }

    function updateKPIs() {
        const endpoints = {
            maisAgendado: '/procedimentos/mais-agendado',
            menosAgendado: '/procedimentos/menos-agendado',
            melhorAvaliado: '/procedimentos/melhor-nota'
        };

        const ids = {
            maisAgendado: 'mais-agendado',
            menosAgendado: 'menos-agendado',
            melhorAvaliado: 'melhor-avaliado'
        };

        fetchData(endpoints.maisAgendado, ids.maisAgendado);
        fetchData(endpoints.menosAgendado, ids.menosAgendado);
        fetchData(endpoints.melhorAvaliado, ids.melhorAvaliado);
    }

    updateKPIs();

    async function fetchProcedures() {
        try {
            const response = await fetch(`${baseUrl}/especificacoes`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao carregar procedimentos:', error);
            return [];
        }
    }

    function formatDuration(duration) {
        const [hours, minutes] = duration.split(':').map(Number);
        return `${hours}h ${minutes} min`;
    }

    function renderTable(procedures, page) {
        proceduresTbody.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedProcedures = procedures.slice(start, end);

        paginatedProcedures.forEach(procedure => {
            const row = document.createElement('tr');

            const nome = procedure.procedimento.tipo;
            const preco = `R$${procedure.precoColocacao.toFixed(2).replace('.', ',')}`;
            const duracao = formatDuration(procedure.tempoColocacao);
            const especificacao = procedure.especificacao;
            const procedimentoId = procedure.idEspecificacaoProcedimento;

            row.innerHTML = `
                <td>${nome}</td>
                <td>${preco}</td>
                <td>${duracao}</td>
                <td>${especificacao}</td>
                <td>
                    <button class="edit-btn" data-id="${procedimentoId}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${procedimentoId}" data-tipo="${nome}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            proceduresTbody.appendChild(row);
        });

        currentPageSpan.textContent = page;
        const totalPages = Math.ceil(procedures.length / itemsPerPage);
        totalPagesSpan.textContent = totalPages;

        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = page === totalPages;

        document.querySelectorAll('.delete-btn').forEach(button => {
            const id = button.getAttribute('data-id');
            const tipo = button.getAttribute('data-tipo');
            button.addEventListener('click', (e) => {
                procedimentoIdParaDeletar = e.currentTarget.getAttribute('data-id');
                if (procedimentoIdParaDeletar) {
                    showModal(tipo);
                } else {
                    console.error('ID do procedimento é indefinido.');
                }
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                window.location.href = `procedimento-forms/editar-procedimento/editar-procedimento.html?id=${id}`;
            });
        });
    }

    async function init() {
        procedimentos = await fetchProcedures();
        renderTable(procedimentos, currentPage);

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(procedimentos, currentPage);
            }
        });

        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(procedimentos.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(procedimentos, currentPage);
            }
        });

        btnYes.addEventListener('click', async () => {
            if (procedimentoIdParaDeletar !== null) {
                await deleteProcedimento(procedimentoIdParaDeletar);
                procedimentos = await fetchProcedures();
                renderTable(procedimentos, currentPage);
                closeModal();
            }
        });
    }

    async function deleteProcedimento(id) {
        try {
            const response = await fetch(`${baseUrl}/especificacoes/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                // Se a resposta não for OK, obter o erro do servidor
                const errorData = await response.json();
                if (errorData.message) {
                    showNotification(`Erro: ${errorData.message}`, true);
                } else {
                    showNotification('Erro ao deletar o procedimento. Tente novamente mais tarde.', true);
                }
                throw new Error('Erro ao deletar o procedimento.');
            }

            // Tentar deletar no endpoint de procedimentos
            const response2 = await fetch(`${baseUrl}/procedimentos/${id}`, {
                method: 'DELETE'
            });

            if (!response2.ok) {
                // Se a resposta não for OK, obter o erro do servidor
                const errorData = await response2.json();
                if (errorData.message) {
                    showNotification(`Erro: ${errorData.message}`, true);
                } else {
                    showNotification('Erro ao deletar o procedimento. Tente novamente mais tarde.', true);
                }
                throw new Error('Erro ao deletar o procedimento.');
            }

            showNotification('Procedimento deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar o procedimento:', error);
        }
    }

    function showModal(tipoProcedimento) {
        modalProcedimento.textContent = `Procedimento: ${tipoProcedimento}`;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    window.showModal = showModal;
    window.closeModal = closeModal;

    init();
});

document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }
});

document.querySelector('.planilha-btn').addEventListener('click', function () {
    exportTableToExcel('procedures-table', 'Procedimentos.xlsx');
});

function exportTableToExcel(tableId, filename = '') {
    var table = document.getElementById(tableId);

    // Create a temporary table to remove the "Ações" column
    var tempTable = table.cloneNode(true);

    // Remove the last column (Ações) from the header
    var tempThead = tempTable.querySelector('thead');
    var tempHeaderRow = tempThead.rows[0];
    tempHeaderRow.deleteCell(-1); // Deletes the last cell from header

    // Remove the last column (Ações) from all rows in the body
    var tempTbody = tempTable.querySelector('tbody');
    for (var i = 0; i < tempTbody.rows.length; i++) {
        tempTbody.rows[i].deleteCell(-1); // Deletes the last cell from each row
    }

    // Convert the temporary table to Excel workbook and download
    var wb = XLSX.utils.table_to_book(tempTable, { sheet: "Sheet1" });
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename);
}
