document.addEventListener("DOMContentLoaded", function () {
    const url = 'http://localhost:8080/api/agendamentos/listar';
    const itemsPerPage = 5; // Número de itens por página
    let currentPage = 1; // Página atual
    let agendamentos = []; // Array para armazenar os agendamentos

    async function fetchAgendamentos() {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao carregar os agendamentos.');
            }
            const data = await response.json();
            agendamentos = data; // Atualiza o array de agendamentos
            renderTable(); // Renderiza a tabela com os agendamentos atuais
        } catch (error) {
            console.error('Erro ao buscar os agendamentos:', error);
        }
    }

    function renderTable() {
        const tbody = document.getElementById("procedures-tbody");
        tbody.innerHTML = ''; // Limpa qualquer conteúdo existente

        let totalAgendamentos = agendamentos.length;
        let confirmados = 0;

        // Calcula o índice inicial e final dos itens a serem exibidos na página atual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        agendamentos.slice(startIndex, endIndex).forEach(agendamento => {
            if (agendamento.statusAgendamento.nome === "Confirmado") {
                confirmados++;
            }

            const tr = document.createElement("tr");

            // Data/Hora
            const dataHoraTd = document.createElement("td");
            dataHoraTd.textContent = `${new Date(agendamento.data).toLocaleDateString()} ${new Date(agendamento.horario).toLocaleTimeString()}`;
            tr.appendChild(dataHoraTd);

            // Cliente
            const clienteTd = document.createElement("td");
            clienteTd.textContent = agendamento.usuario.nome;
            tr.appendChild(clienteTd);

            // Procedimento
            const procedimentoTd = document.createElement("td");
            procedimentoTd.textContent = agendamento.procedimento.tipo;
            tr.appendChild(procedimentoTd);

            // Especificação
            const especificacaoTd = document.createElement("td");
            especificacaoTd.textContent = agendamento.procedimento.descricao;
            tr.appendChild(especificacaoTd);

            // Status
            const statusTd = document.createElement("td");
            statusTd.textContent = agendamento.statusAgendamento.nome;
            tr.appendChild(statusTd);

            // Ações
            const acoesTd = document.createElement("td");
            const editButton = document.createElement("button");
            editButton.classList.add("edit-btn");
            editButton.dataset.id = agendamento.idAgendamento;
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            editButton.addEventListener("click", () => editarAgendamento(agendamento.idAgendamento));

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-btn");
            deleteButton.dataset.id = agendamento.idAgendamento;
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener("click", () => excluirAgendamento(agendamento.idAgendamento));

            acoesTd.appendChild(editButton);
            acoesTd.appendChild(deleteButton);
            tr.appendChild(acoesTd);

            tbody.appendChild(tr);
        });

        // Atualiza a barra de progresso
        atualizarProgressBar(confirmados, totalAgendamentos);

        // Atualiza a paginação
        const totalPages = Math.ceil(totalAgendamentos / itemsPerPage);
        document.getElementById("current-page").textContent = currentPage;
        document.getElementById("total-pages").textContent = totalPages;

        // Habilita ou desabilita os botões de próxima e página anterior conforme necessário
        const prevPageBtn = document.getElementById("prev-page-btn");
        const nextPageBtn = document.getElementById("next-page-btn");

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    function atualizarProgressBar(confirmados, total) {
        const progress = document.getElementById("progress");
        const percentage = total === 0 ? 0 : (confirmados / total) * 100;
        progress.style.width = `${percentage}%`;

        // Atualiza os rótulos com os números
        document.getElementById("progress-label").textContent = `Atendimentos Confirmados: ${confirmados}`;
        document.getElementById("total-label").textContent = `Atendimentos Totais: ${total}`;
    }

    // Eventos para navegação entre páginas
    document.getElementById("prev-page-btn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById("next-page-btn").addEventListener("click", () => {
        const totalPages = Math.ceil(agendamentos.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    // Inicializa a página
    fetchAgendamentos();
});

// Funções para edição e exclusão
function editarAgendamento(id) {
    window.location.href = `agendamento-forms/editar-agendamento/editar-agendamento.html?id=${id}`;
}

function excluirAgendamento(id) {
    if (confirm("Deseja realmente excluir o agendamento?")) {
        // Implementar a lógica de exclusão do agendamento aqui
        alert("Agendamento excluído com sucesso!");
    }
}