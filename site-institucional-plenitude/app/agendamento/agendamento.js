document.addEventListener("DOMContentLoaded", function () {
    const url = 'http://localhost:8080/api/agendamentos/listar';
    const itemsPerPage = 5;
    let currentPage = 1;
    let agendamentos = [];
    let totalAgendamentos = 0;
    let confirmados = 0;
    let agendamentoIdToDelete = null;

    async function fetchAgendamentos() {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erro ao carregar os agendamentos.');
            const data = await response.json();
            agendamentos = data;
            totalAgendamentos = agendamentos.length;
            confirmados = agendamentos.filter(agendamento => agendamento.statusAgendamento.nome === "Confirmado").length;
            atualizarProgressBar(confirmados, totalAgendamentos);
            renderTable();
        } catch (error) {
            console.error('Erro ao buscar os agendamentos:', error);
        }
    }

    function renderTable() {
        const tbody = document.getElementById("procedures-tbody");
        tbody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        agendamentos.slice(startIndex, endIndex).forEach(agendamento => {
            const tr = document.createElement("tr");

            const dataHoraTd = document.createElement("td");
            dataHoraTd.textContent = `${new Date(agendamento.data).toLocaleDateString()} ${new Date(agendamento.horario).toLocaleTimeString()}`;
            tr.appendChild(dataHoraTd);

            const clienteTd = document.createElement("td");
            clienteTd.textContent = agendamento.usuario.nome;
            tr.appendChild(clienteTd);

            const procedimentoTd = document.createElement("td");
            procedimentoTd.textContent = agendamento.procedimento.tipo;
            tr.appendChild(procedimentoTd);

            const especificacaoTd = document.createElement("td");
            especificacaoTd.textContent = agendamento.procedimento.descricao;
            tr.appendChild(especificacaoTd);

            const statusTd = document.createElement("td");
            statusTd.textContent = agendamento.statusAgendamento.nome;
            tr.appendChild(statusTd);

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

        const totalPages = Math.ceil(totalAgendamentos / itemsPerPage);
        document.getElementById("current-page").textContent = currentPage;
        document.getElementById("total-pages").textContent = totalPages;

        document.getElementById("prev-page-btn").disabled = currentPage === 1;
        document.getElementById("next-page-btn").disabled = currentPage === totalPages;
    }

    function atualizarProgressBar(confirmados, total) {
        const progress = document.getElementById("progress");
        const percentage = total === 0 ? 0 : (confirmados / total) * 100;
        progress.style.width = `${percentage}%`;
        document.getElementById("progress-label").textContent = `Atendimentos Confirmados: ${confirmados}`;
        document.getElementById("total-label").textContent = `Atendimentos Totais: ${total}`;
    }

    document.getElementById("prev-page-btn").addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById("next-page-btn").addEventListener("click", () => {
        const totalPages = Math.ceil(totalAgendamentos / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    window.editarAgendamento = function (id) {
        window.location.href = `agendamento-forms/editar-agendamento/editar-agendamento.html?id=${id}`;
    };

    window.excluirAgendamento = function (id) {
        agendamentoIdToDelete = id;
        document.getElementById("procedimento").textContent = `ID do agendamento: ${id}`;
        document.getElementById("modal").style.display = "block";
    };

    window.closeModal = function () {
        document.getElementById("modal").style.display = "none";
    };

    window.confirmDeletion = async function () {
        if (agendamentoIdToDelete !== null) {
            try {
                const response = await fetch(`http://localhost:8080/api/agendamentos/excluir/${agendamentoIdToDelete}`, {
                    method: 'DELETE'
                });

                if (!response.ok) throw new Error('Erro ao excluir o agendamento.');
                await fetchAgendamentos();
                agendamentoIdToDelete = null;
                closeModal();
                showNotification("Agendamento excluído com sucesso!");
            } catch (error) {
                console.error('Erro ao excluir o agendamento:', error);
                showNotification('Erro ao excluir o agendamento!', true);
            }
        }
    };

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

    async function saveStatus() {
        const nome = document.getElementById("save-nome").value;
        const cor = document.getElementById("save-cor").value;

        try {
            const response = await fetch('http://localhost:8080/status-agendamento/cadastro-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, cor })
            });

            if (!response.ok) throw new Error('Erro ao salvar o status.');
            showNotification('Status salvo com sucesso!');
            closeSaveModal();
            renderTable();
        } catch (error) {
            showNotification('Erro ao salvar o status!', true);
        }
    }

    // Define the openSaveModal function in the global scope
    window.openSaveModal = function () {
        document.getElementById("save-modal").style.display = "block";
    };

    window.closeSaveModal = function () {
        document.getElementById("save-modal").style.display = "none";
    };
    // Garantir que o evento de clique no botão "Salvar" seja adicionado apenas uma vez
    const saveButton = document.querySelector(".btn-save");
    saveButton.removeEventListener("click", saveStatus); // Remove qualquer evento anterior
    saveButton.addEventListener("click", saveStatus);

    fetchAgendamentos();

    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');
    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }

    document.querySelector('.btn-no').addEventListener('click', function () {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('save-modal').style.display = 'none';
    });

    document.querySelector('.modal-content2 .btn-no').addEventListener('click', function () {
        document.getElementById('save-modal').style.display = 'none';
    });
});
