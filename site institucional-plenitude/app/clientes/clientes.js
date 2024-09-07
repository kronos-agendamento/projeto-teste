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
    let cpfParaDeletar = null;
    const btnYes = document.querySelector('.btn-yes');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const modal = document.getElementById('modal');
    const modalProcedimento = document.getElementById('usu');

    async function fetchUsuariosAtivos() {
        try {
            // Buscando usuários com status 1 (ativos)
            const response = await fetch(`${baseUrl}/usuarios/buscar-por-status/1`);
            const data = await response.json();
            console.log('Dados recebidos da API (clientes ativos):', data);
            return data;
        } catch (error) {
            console.error('Erro ao carregar usuários ativos:', error);
            return [];
        }
    }

    async function fetchUsuarioPorCpf(cpf) {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário com CPF: ${cpf}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
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
            const instagram = user.instagram;
            const telefone = user.telefone;
            const cpf = user.cpf;

            row.innerHTML = `
                <td>${nome}</td>
                <td>${instagram}</td>
                <td>${telefone}</td>
                <td>${cpf}</td>
                <td>
                    <button class="edit-btn" data-id="${cpf}">✏️</button>
                    <button class="delete-btn" data-id="${cpf}" data-tipo="${nome}">🗑️</button>
                    <button class="archive-btn" data-id="${cpf}">📁</button>
                    <button class="especification-btn" data-id="${cpf}">📋</button>
                </td>
            `;
            proceduresTbody.appendChild(row);
        });
        

       // Event listener para o botão de especificação
       document.querySelectorAll('.especification-btn').forEach(button => {
        button.addEventListener('click', async function() {
            const cpf = this.getAttribute('data-id');
            const cliente = await fetchUsuarioPorCpf(cpf);

            if (cliente) {
                // Armazenar o nome do cliente no localStorage
                localStorage.setItem('clienteNome', cliente.nome);

                // Redirecionar para a página de edição com o CPF
                window.location.href = `../clientes/clienteForms/editar-cliente.html?cpf=${cpf}`;
            } else {
                console.error('Cliente não encontrado.');
            }
        });
    });

        document.querySelectorAll('.delete-btn').forEach(button => {
            const id = button.getAttribute('data-id');
            const tipo = button.getAttribute('data-tipo');
            button.addEventListener('click', (e) => {
                cpfParaDeletar = id;
                if (cpfParaDeletar) {
                    showModal(tipo);
                } else {
                    console.error('ID do usuário é indefinido.');
                }
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const cpf = this.getAttribute('data-id');
                const cliente = await fetchUsuarioPorCpf(cpf);
    
                if (cliente) {
                    // Armazenar o nome do cliente no localStorage
                    localStorage.setItem('clienteNome', cliente.nome);
    
                    // Redirecionar para a página de edição com o CPF
                    window.location.href = `../clientes/clienteForms/editar-cliente.html?cpf=${cpf}`;
                } else {
                    console.error('Cliente não encontrado.');
                }
            });
        });

        // Adiciona o event listener para o botão de arquivar (📁)
        document.querySelectorAll('.archive-btn').forEach(button => {
            const cpf = button.getAttribute('data-id');
            button.addEventListener('click', async (e) => {
                await arquivarUsuario(cpf);
                // Atualiza a tabela após arquivar o usuário
                usuarios = await fetchUsuariosAtivos();
                renderTable(usuarios, currentPage);
            });
        });
    }

    function showModal(nome) {
        modalProcedimento.textContent = `Nome do usuário: ${nome}`;
        modal.style.display = 'block';
    }

    async function init() {
        usuarios = await fetchUsuariosAtivos();
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

        btnYes.addEventListener('click', async () => {
            if (cpfParaDeletar !== null) {
                console.log(`Tentando deletar o ID: ${cpfParaDeletar}`);
                await deleteUser(cpfParaDeletar);
                usuarios = await fetchUsuariosAtivos();
                renderTable(usuarios, currentPage);
                closeModal();
            }
        });

        document.querySelector('.btn-no').addEventListener('click', closeModal);
    }

    // Função para arquivar usuário
    async function arquivarUsuario(cpf) {
        try {
            const response = await fetch(`${baseUrl}/usuarios/inativar/${cpf}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao arquivar o usuário.');
            }

            const data = await response.json();
            console.log(`Usuário ${cpf} arquivado com sucesso.`, data);
            showNotification('Usuário arquivado com sucesso!');
        } catch (error) {
            console.error('Erro ao arquivar o usuário:', error);
            showNotification('Erro ao arquivar o usuário.', true);
        }
    }

    async function deleteUser(cpf) {
        try {
            const response = await fetch(`${baseUrl}/usuarios/exclusao-usuario/${cpf}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar o usuário.');
            }
            console.log(`Usuário ${cpf} deletado com sucesso.`);
            showNotification('Usuário deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar o usuário:', error);
            showNotification('Erro ao deletar o usuário.', true);
        }
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    init();
});


document.addEventListener('DOMContentLoaded', function() {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userNameSpan').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }
});

// Função para abrir o modal
function openModalPesquisa() {
    document.getElementById("modal-pesquisa").style.display = "block";
}

// Função para fechar o modal
function closeModalPesquisa() {
    document.getElementById("modal-pesquisa").style.display = "none";
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById("modal-pesquisa");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function pesquisarCliente() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const codigo = document.getElementById('codigo').value;

    let url = '';
    if (codigo) {
        url = `http://localhost:8080/usuarios/buscar-usuario-por-codigo/${codigo}`;
    } else if (cpf) {
        url = `http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`;
    } else if (nome) {
        url = `http://localhost:8080/usuarios/buscar-por-nome/${nome}`;
    } else {
        alert("Por favor, preencha ao menos um dos campos.");
        return;
    }

    console.log('URL gerada:', url);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => mostrarResultado(data))
        .catch(error => {
            console.error('Erro ao buscar cliente:', error);
            mostrarErro("Erro ao buscar cliente. Por favor, tente novamente.");
        });
}

function mostrarResultado(data) {
    const resultadoDiv = document.getElementById('resultado');
    
    if (!data || data.length === 0) {
        resultadoDiv.innerHTML = "<p>Nenhum cliente encontrado.</p>";
    } else if (Array.isArray(data)) {
        let tableHTML = `
            <table id="procedures-table-pesquisa" class="procedures-table-pesquisa">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Instagram</th>
                        <th>Telefone</th>
                        <th>CPF</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach(usuario => {
            tableHTML += `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.instagram}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.cpf}</td>
                    <td>
                        <button class="ver-mais-btn" data-id="${usuario.cpf}" style="border: none; background: transparent; cursor: pointer;" title="Ver mais">
                            <img src="../../assets/icons/mais-tres-pontos-indicador.png" alt="Ver mais" style="width: 20px; height: 20px; margin-top:18px; margin-left:15px;">
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableHTML += `</tbody></table>`;
        
        resultadoDiv.innerHTML = tableHTML;

        // Adicionar event listener para o botão "Ver mais"
        document.querySelectorAll('.ver-mais-btn').forEach(button => {
            button.addEventListener('click', function() {
                const cpf = this.getAttribute('data-id');
                // Redirecionar para a página de edição com o CPF na URL
                window.location.href = `../clientes/clienteForms/editar-cliente.html?cpf=${cpf}`;
            });
        });
    } else {
        resultadoDiv.innerHTML = `
            <p>Nome: ${data.nome} | CPF: ${data.cpf} | Instagram: ${data.instagram} | Telefone: ${data.telefone}</p>
        `;
    }
}




function mostrarErro(mensagem) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<p style="color: red;">${mensagem}</p>`;
}

function closeModalPesquisa() {
    document.getElementById('modal-pesquisa').style.display = 'none';
}

function redirectToArchived() {
    window.location.href = "../clientes/clientes-arquivados.html";
}
