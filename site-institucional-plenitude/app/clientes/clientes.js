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
    let cpfParaArquivar = null;
    let cpfParaDeletar = null;
    const btnYes = document.querySelector('.btn-yes');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    const modal = document.getElementById('modal');
    const modalArchive = document.getElementById('modal-archive');
    const modalProcedimento = document.getElementById('usu');
    const modalProcedimentoArchive = document.getElementById('usu-archive');
    const btnYesArchive = document.getElementById('btnYesArchive');

    // Função para abrir o modal de arquivar
    function showModalArchive(nome, cpf) {
        modalProcedimentoArchive.textContent = `Nome do usuário: ${nome}`;
        cpfParaArquivar = cpf;
        modalArchive.style.display = 'block';
    }

    // Função para fechar o modal de arquivar
    function closeModalArchive() {
        modalArchive.style.display = 'none';
    }

    // Event listener para o botão SIM no modal de arquivar
    btnYesArchive.addEventListener('click', async () => {
        if (cpfParaArquivar) {
            await arquivarUsuario(cpfParaArquivar);
            closeModalArchive();
            usuarios = await fetchUsuariosAtivos();
            renderTable(usuarios, currentPage); // Atualiza a tabela após arquivar
        }
    });

    // Event listener para o botão NÃO no modal de arquivar
    document.querySelector('#modal-archive .btn-no').addEventListener('click', closeModalArchive);


    // Função para buscar usuários ativos
    async function fetchUsuariosAtivos() {
        try {
            const response = await fetch(`${baseUrl}/usuarios/buscar-por-status/1`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao carregar usuários ativos:', error);
            return [];
        }
    }

    // Função para buscar usuário por CPF
    async function fetchUsuarioPorCpf(cpf) {
        try {
            const response = await fetch(`${baseUrl}/usuarios/buscar-por-cpf/${cpf}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário com CPF: ${cpf}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    // Função para renderizar a tabela
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
                    <button class="edit-btn" data-id="${cpf}" style="border: none; background: transparent; cursor: pointer;" title="Editar Cliente">
                            <img src="../../assets/icons/editar.png" alt="Editar" style="width: 25px; height: 25px; margin-top:8px; margin-left:5px;">
                    </button>
                    <button class="delete-btn" data-id="${cpf}" style="border: none; background: transparent; cursor: pointer;" title="Excluir Cliente">
                            <img src="../../assets/icons/excluir.png" alt="Excluir" style="width: 25px; height: 25px; margin-top:8px; margin-left:2px;">
                    </button>
                    <button class="archive-btn" data-id="${cpf}" style="border: none; background: transparent; cursor: pointer;" title="Arquivar Cliente">
                            <img src="../../assets/icons/arquivar.png" alt="Arquivar" style="width: 25px; height: 25px; margin-top:8px; margin-left:2px;">
                    </button>
                </td>
            `;
            proceduresTbody.appendChild(row);
        });

        // Event listener para o botão de especificação
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', async function () {
                const cpf = this.getAttribute('data-id');
                const cliente = await fetchUsuarioPorCpf(cpf);

                if (cliente) {
                    localStorage.setItem('clienteNome', cliente.nome);
                    window.location.href = `../clientes/clienteForms/editar-cliente.html?cpf=${cpf}`;
                } else {
                    console.error('Cliente não encontrado.');
                }
            });
        });

        // Event listener para o botão de deletar
        document.querySelectorAll('.delete-btn').forEach(button => {
            const id = button.getAttribute('data-id');
            const nome = button.closest('tr').querySelector('td:nth-child(1)').textContent; // Captura o nome corretamente
            button.addEventListener('click', () => {
                cpfParaDeletar = id;
                if (cpfParaDeletar) {
                    showModal(nome); // Passa o nome correto para o modal
                } else {
                    console.error('ID do usuário é indefinido.');
                }
            });
        });
        
        // Event listener para o botão de arquivar (📁)
        document.querySelectorAll('.archive-btn').forEach(button => {
            const cpf = button.getAttribute('data-id');
            const nome = button.closest('tr').querySelector('td').textContent; 
            button.addEventListener('click', function () {
                showModalArchive(nome, cpf); 
            });
        });
    }

    // Função para mostrar o modal de deletar
    function showModal(nome) {
        modalProcedimento.textContent = `Nome do usuário: ${nome}`;
        modal.style.display = 'block';
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
            showNotification('Usuário arquivado com sucesso!');
        } catch (error) {
            console.error('Erro ao arquivar o usuário:', error);
            showNotification('Erro ao arquivar o usuário.', true);
        }
    }

    // Função para deletar usuário
    async function deleteUser(cpf) {
        try {
            const response = await fetch(`${baseUrl}/usuarios/exclusao-usuario/${cpf}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar o usuário.');
            }
            showNotification('Usuário deletado com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar o usuário:', error);
            showNotification('Erro ao deletar o usuário.', true);
        }
    }

    // Função para fechar o modal de deletar
    function closeModal() {
        modal.style.display = 'none';
    }

    // Inicialização dos dados e tabela
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
                await deleteUser(cpfParaDeletar);
                usuarios = await fetchUsuariosAtivos();
                renderTable(usuarios, currentPage);
                closeModal();
            }
        });

        document.querySelector('.btn-no').addEventListener('click', closeModal);
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
        document.querySelectorAll('.edit-btn').forEach(button => {
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

document.querySelector('.planilha-btn').addEventListener('click', function () {
    exportTableToExcel('procedures-table', 'ClientesAtivos.xlsx');
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
