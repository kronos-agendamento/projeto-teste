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

    const baseUrl = 'http://localhost:8080';
    const proceduresTbody = document.getElementById('procedures-tbody');
    const itemsPerPage = 5;
    let currentPage = 1;
    let usuarios = [];

    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');

    async function fetchClientesInativos() {
        try {
            // O status 0 indica clientes inativos
            const response = await fetch(`${baseUrl}/usuarios/buscar-por-status/0`);
            const data = await response.json();
            console.log('Dados recebidos da API (clientes inativos):', data);
            return data;
        } catch (error) {
            console.error('Erro ao carregar clientes inativos:', error);
            return [];
        }
    }

    function renderTable(users, page) {
        proceduresTbody.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = page * itemsPerPage;
        const paginatedUsers = users.slice(start, end);

        paginatedUsers.forEach(user => {
            const row = document.createElement('tr');
            const nome = user.nome;
            const nascimento = user.dataNasc;
            const instagram = user.instagram;
            const telefone = user.telefone;
            const cpf = user.cpf;

            row.innerHTML = `
                <td>${nome}</td>
                <td>${nascimento}</td>
                <td>${instagram}</td>
                <td>${telefone}</td>
                <td>${cpf}</td>
                <td>
                    <button class="edit-btn" data-id="${cpf}">✏️</button>
                    <button class="delete-btn" data-id="${cpf}" data-tipo="${nome}">🗑️</button>
                    <button class="activate-btn" data-id="${cpf}">🔓</button>
                </td>
            `;
            proceduresTbody.appendChild(row);
        });

        // Configura os eventos dos botões de exclusão
        document.querySelectorAll('.delete-btn').forEach(button => {
            const id = button.getAttribute('data-id');
            const tipo = button.getAttribute('data-tipo');
            button.addEventListener('click', () => {
                if (confirm(`Deseja realmente excluir o cliente ${tipo}?`)) {
                    deleteUser(id);
                }
            });
        });

        // Configura os eventos dos botões de edição
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                window.location.href = `editar-usuario.html?id=${id}`;
            });
        });

        // Configura os eventos dos botões de ativação
        document.querySelectorAll('.activate-btn').forEach(button => {
            const cpf = button.getAttribute('data-id');
            button.addEventListener('click', async (e) => {
                console.log(`Iniciando ativação do usuário com CPF: ${cpf}`);
                try {
                    const response = await fetch(`${baseUrl}/usuarios/ativar/${cpf}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        console.log("Usuário ativado com sucesso.");
                        showNotification('Usuário ativado com sucesso!');
                        // Recarrega a lista de usuários
                        usuarios = await fetchClientesInativos();
                        renderTable(usuarios, currentPage);
                    } else {
                        const errorText = await response.text();
                        console.error('Erro ao ativar o usuário:', errorText);
                        throw new Error('Erro ao ativar o usuário: ' + errorText);
                    }
                } catch (error) {
                    console.error('Erro geral:', error);
                    showNotification(error.message, true);
                }
            });
        });
    }

    async function init() {
        usuarios = await fetchClientesInativos();
        renderTable(usuarios, currentPage);

        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(usuarios, currentPage);
            }
        });

        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(usuarios.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderTable(usuarios, currentPage);
            }
        });
    }

    init();
});
