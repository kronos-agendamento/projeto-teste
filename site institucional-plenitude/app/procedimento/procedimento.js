document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'http://localhost:8080';
    const proceduresTbody = document.getElementById('procedures-tbody');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const modal = document.getElementById('modal');
    const modalProcedimento = document.getElementById('procedimento');
    const btnYes = document.querySelector('.btn-yes');
    let currentPage = 1;
    const itemsPerPage = 3;
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
            maisAgendado: '/api/procedimentos/mais-agendado',
            menosAgendado: '/api/procedimentos/menos-agendado',
            melhorAvaliado: '/api/procedimentos/melhor-nota'
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
    setInterval(updateKPIs, 5000);

    async function fetchProcedures() {
        try {
            const response = await fetch(`${baseUrl}/especificacoes`);
            const data = await response.json();
            console.log('Dados recebidos da API:', data); // Log para verificar os dados recebidos
            return data;
        } catch (error) {
            console.error('Erro ao carregar procedimentos:', error);
            return [];
        }
    }

    function renderTable(procedures, page) {
        proceduresTbody.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedProcedures = procedures.slice(start, end);

        paginatedProcedures.forEach(procedure => {
            const row = document.createElement('tr');
            const nome = procedure.fkProcedimento.tipo;
            const preco = `R$${procedure.precoColocacao.toFixed(2).replace('.', ',')}`;
            const duracao = procedure.fkTempoProcedimento.tempoColocacao;
            const especificacao = procedure.especificacao;

            // Use o idEspecificacaoProcedimento para o data-id
            const procedimentoId = procedure.idEspecificacaoProcedimento;

            row.innerHTML = `
                <td>${nome}</td>
                <td>${preco}</td>
                <td>${duracao}</td>
                <td>${especificacao}</td>
                <td>
                    <button class="edit-btn" data-id="${procedimentoId}">✏️</button>
                    <button class="delete-btn" data-id="${procedimentoId}" data-especificacao="${especificacao}">🗑️</button>
                </td>
            `;
            proceduresTbody.appendChild(row);
        });

        // Atualiza a paginação
        currentPageSpan.textContent = page;
        const totalPages = Math.ceil(procedures.length / itemsPerPage);
        totalPagesSpan.textContent = totalPages;

        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = page === totalPages;

        // Eventos dos botões de deletar
        document.querySelectorAll('.delete-btn').forEach(button => {
            const id = button.getAttribute('data-id');
            button.addEventListener('click', (e) => {
                procedimentoIdParaDeletar = e.target.getAttribute('data-id');
                const procedimentoEspecificacao = e.target.getAttribute('data-especificacao');
                if (procedimentoIdParaDeletar) {
                    showModal(procedimentoEspecificacao);
                } else {
                    console.error('ID do procedimento é indefinido.');
                }
            });
        });

        // Eventos dos botões de editar
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.href = `procedimentoForms/editar-procedimento/editar-procedimento.html?id=${id}`;
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
                console.log(`Tentando deletar o ID: ${procedimentoIdParaDeletar}`);
                await deleteProcedimento(procedimentoIdParaDeletar);
                procedimentos = await fetchProcedures();
                renderTable(procedimentos, currentPage);
                closeModal();
            }
        });
    }

    async function deleteProcedimento(id) {
        try {
            const response = await fetch(`${baseUrl}/especificacoes/exclusao-por-id/${id}`, {
                method: 'DELETE'
            });
            const response2 = await fetch(`${baseUrl}/api/procedimentos/deletar/${id}`, {
                method: 'DELETE'
            });
            const response3 = await fetch(`${baseUrl}/api/tempos/exclusao-por-id/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar o procedimento.');
            }
            console.log(`Procedimento ${id} deletado com sucesso.`);
        } catch (error) {
            console.error('Erro ao deletar o procedimento:', error);
        }
    }

    function showModal(procedimento) {
        modalProcedimento.textContent = `Procedimento: ${procedimento}`;
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    window.showModal = showModal;
    window.closeModal = closeModal;

    init();
});
