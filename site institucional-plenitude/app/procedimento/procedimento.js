document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'http://localhost:8080';
    const proceduresTbody = document.getElementById('procedures-tbody');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');

    let currentPage = 1;
    const itemsPerPage = 3;

    // Carrega os dados das KPIs
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

            row.innerHTML = `
                <td>${nome}</td>
                <td>${preco}</td>
                <td>${duracao}</td>
                <td>${especificacao}</td>
                <td>
                    <button class="edit-btn">✏️</button>
                    <button class="delete-btn" onclick="showModal('${especificacao}')">🗑️</button>
                </td>
            `;
            proceduresTbody.appendChild(row);
        });

        currentPageSpan.textContent = page;
        const totalPages = Math.ceil(procedures.length / itemsPerPage);
        totalPagesSpan.textContent = totalPages;

        prevPageBtn.disabled = page === 1;
        nextPageBtn.disabled = page === totalPages;
    }

    async function init() {
        const procedures = await fetchProcedures();
        renderTable(procedures, currentPage);

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(procedures, currentPage);
            }
        });

        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(procedures.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(procedures, currentPage);
            }
        });
    }

    init();

    // Função para mostrar o modal de confirmação de exclusão
    function showModal(procedimento) {
        document.getElementById('procedimento').textContent = `Procedimento: ${procedimento}`;
        document.getElementById('modal').style.display = 'block';

        const yesButton = document.querySelector('.btn-yes');
        yesButton.onclick = function () {
            deleteProcedure(procedimento);
        };
    }

    // Função para excluir o procedimento, tempo e especificação
    async function deleteProcedure(procedimento) {
        try {
            const procedureId = await getProcedureIdBySpecification(procedimento);
            const tempoId = await getTempoIdBySpecification(procedimento);

            // Primeira requisição DELETE
            await fetch(`${baseUrl}/api/procedimentos/deletar/${procedureId}`, { method: 'DELETE' });
            // Segunda requisição DELETE
            await fetch(`${baseUrl}/api/tempos/exclusao-por-id/${tempoId}`, { method: 'DELETE' });
            // Terceira requisição DELETE
            await fetch(`${baseUrl}/especificacoes/exclusao-por-especificacao/${procedimento}`, { method: 'DELETE' });

            // Atualiza a tabela após exclusão
            init();
            closeModal();
        } catch (error) {
            console.error('Erro ao excluir procedimento:', error);
            closeModal();
            alert('Erro ao excluir procedimento.');
        }
    }

    // Função para buscar o ID do procedimento por especificação
    async function getProcedureIdBySpecification(especificacao) {
        try {
            const response = await fetch(`${baseUrl}/api/procedimentos?especificacao=${especificacao}`);
            const data = await response.json();
            return data.id; // Ajuste de acordo com o retorno do seu endpoint
        } catch (error) {
            console.error('Erro ao buscar procedimento:', error);
            throw error;
        }
    }

    // Função para buscar o ID do tempo do procedimento por especificação
    async function getTempoIdBySpecification(especificacao) {
        try {
            const response = await fetch(`${baseUrl}/api/tempos?especificacao=${especificacao}`);
            const data = await response.json();
            return data.id; // Ajuste de acordo com o retorno do seu endpoint
        } catch (error) {
            console.error('Erro ao buscar tempo do procedimento:', error);
            throw error;
        }
    }

    // Função para fechar o modal de confirmação de exclusão
    function closeModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Expor funções globalmente para serem usadas no HTML
    window.showModal = showModal;
    window.closeModal = closeModal;
});
