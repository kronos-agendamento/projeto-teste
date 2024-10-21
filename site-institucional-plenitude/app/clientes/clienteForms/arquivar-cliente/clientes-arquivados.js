document.addEventListener("DOMContentLoaded", function () {
    function showNotification(message, isError = false) {
      const notification = document.getElementById("notification");
      const notificationMessage = document.getElementById("notification-message");
      notificationMessage.textContent = message;
      if (isError) {
        notification.classList.add("error");
      } else {
        notification.classList.remove("error");
      }
      notification.classList.add("show");
      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    }
  
    const baseUrl = "http://localhost:8080";
    const proceduresTbody = document.getElementById("procedures-tbody");
    const itemsPerPage = 5;
    let currentPage = 1;
    let usuarios = [];
    let cpfParaArquivar = null;
    let cpfParaDeletar = null;
    const btnYes = document.querySelector(".btn-yes");
    const prevPageBtn = document.getElementById("prev-page-btn");
    const nextPageBtn = document.getElementById("next-page-btn");
    const currentPageSpan = document.getElementById("current-page");
    const totalPagesSpan = document.getElementById("total-pages");
    const modal = document.getElementById("modal");
    const modalArchive = document.getElementById("modal-archive");
    const modalProcedimento = document.getElementById("usu");
    const modalProcedimentoArchive = document.getElementById("usu-archive");
    const btnYesArchive = document.getElementById("btnYesArchive");
  
    // Função para abrir o modal de arquivar
    function showModalArchive(nome, cpf) {
      modalProcedimentoArchive.textContent = `Nome do usuário: ${nome}`;
      cpfParaArquivar = cpf;
      modalArchive.style.display = "block";
    }
  
    // Função para fechar o modal de arquivar
    function closeModalArchive() {
      modalArchive.style.display = "none";
    }

       // Função para fechar o modal de exclusão
       function closeModal() {
        modal.style.display = "none";
    }
    btnYes.addEventListener("click", async () => {
        if (cpfParaDeletar !== null) {
            await deleteUser(cpfParaDeletar); // Chama a função deleteUser para excluir o usuário
            usuarios = await fetchClientesInativos(); // Atualiza a lista de usuários após a exclusão
            renderTable(usuarios, currentPage); // Re-renderiza a tabela com os dados atualizados
            closeModal(); // Fecha o modal de exclusão
        }
    });
  
    // Event listener para o botão SIM no modal de arquivar
    btnYesArchive.addEventListener("click", async () => {
      if (cpfParaArquivar) {
        await arquivarUsuario(cpfParaArquivar);
        closeModalArchive();
        usuarios = await fetchUsuariosFidelizados();
        renderTable(usuarios, currentPage); // Atualiza a tabela após arquivar
      }
    });
  
    // Event listener para o botão NÃO no modal de arquivar
    document
      .querySelector("#modal-archive .btn-no")
      .addEventListener("click", closeModalArchive);
  
    // Função para buscar usuários inativos
    async function fetchClientesInativos() {
        try {
          // O status 0 indica clientes inativos
          const response = await fetch(`${baseUrl}/usuarios/buscar-por-status/0`);
          const data = await response.json();
          console.log("Dados recebidos da API (clientes inativos):", data);
          return data;
        } catch (error) {
          console.error("Erro ao carregar clientes inativos:", error);
          return [];
        }
      }
  
    // Função para buscar usuário por idUsuario
    async function fetchUsuarioPorId(idUsuario) {
      try {
        const response = await fetch(`${baseUrl}/usuarios/${idUsuario}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar usuário.");
        }
        return await response.json();
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        return null;
      }
    }
  
    // Função para renderizar a tabela e atualizar os controles de paginação
    function renderTable(users, page) {
      proceduresTbody.innerHTML = "";
      const start = (page - 1) * itemsPerPage;
      const end = page * itemsPerPage;
      const paginatedUsers = users.slice(start, end);
  
      paginatedUsers.forEach((user) => {
        const row = document.createElement("tr");
        const nome = user.nome;
        const instagram = user.instagram.replace("@", "");
        const telefone = user.telefone;
        const cpf = user.cpf;
  
        row.innerHTML = `
        <td>${nome}</td>
        <td>
            <a href="https://www.instagram.com/${instagram}" target="_blank" class="instagram-link" style="display: flex; align-items: center;">
                <img src="../../../../assets/icons/instagram-icon.png" alt="Instagram" style="width: 20px; height: 20px; margin-right: 8px; margin-top: 20px">
                ${user.instagram}
            </a>
        </td>
        <td>${telefone}</td>
        <td>${cpf}</td>
       <td>
    <!-- Botão de Editar com tooltip -->
    <div class="tooltip-wrapper">
        <button class="edit-btn" data-id="${user.idUsuario}" style="border: none; background: transparent; cursor: pointer;">
            <img src="../../../../assets/icons/editar.png" alt="Editar" style="width: 25px; height: 25px; margin-top:8px; margin-left:5px;">
        </button>
        <div class="tooltip11">Editar</div>
    </div>

    <!-- Botão de Excluir com tooltip -->
    <div class="tooltip-wrapper">
        <button class="delete-btn" data-id="${user.idUsuario}" style="border: none; background: transparent; cursor: pointer;">
            <img src="../../../../assets/icons/excluir.png" alt="Excluir" style="width: 25px; height: 25px; margin-top:8px; margin-left:2px;">
        </button>
        <div class="tooltip11">Excluir</div>
    </div>

    <!-- Botão de Ativar com tooltip -->
    <div class="tooltip-wrapper">
        <button class="activate-btn" data-id="${user.cpf}" style="border: none; background: transparent; cursor: pointer;">
            <img src="../../../../assets/icons/desarquivar.png" alt="Ativar" style="width: 25px; height: 25px; margin-top:8px; margin-left:2px;">
        </button>
        <div class="tooltip11">Ativar</div>
    </div>
</td>

      `;
        proceduresTbody.appendChild(row);
      });
  
      // Atualizar a exibição de página atual e total de páginas
      const totalPages = Math.ceil(users.length / itemsPerPage);
      currentPageSpan.textContent = currentPage;
      totalPagesSpan.textContent = totalPages;
  
      // Desabilitar ou habilitar botões de navegação conforme a página atual
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage === totalPages;
  
      // Adicionar eventos aos botões de ação (editar, excluir, arquivar)
      adicionarEventosBotoes();
      updatePaginationButtons();
    }
  
    function updatePaginationButtons() {
      const totalPages = Math.ceil(usuarios.length / itemsPerPage);
  
      // Desabilita o botão "Anterior" na primeira página
      if (currentPage === 1) {
        prevPageBtn.classList.add("disabled");
        prevPageBtn.style.cursor = "not-allowed";
        prevPageBtn.disabled = true;
      } else {
        prevPageBtn.classList.remove("disabled");
        prevPageBtn.style.cursor = "pointer";
        prevPageBtn.disabled = false;
      }
  
      // Desabilita o botão "Próximo" na última página
      if (currentPage === totalPages) {
        nextPageBtn.classList.add("disabled");
        nextPageBtn.style.cursor = "not-allowed";
        nextPageBtn.disabled = true;
      } else {
        nextPageBtn.classList.remove("disabled");
        nextPageBtn.style.cursor = "pointer";
        nextPageBtn.disabled = false;
      }
  
      // Atualiza a informação de páginas
      currentPageSpan.textContent = currentPage;
      totalPagesSpan.textContent = totalPages;
    }
  
    // Função para adicionar eventos aos botões de ação
    function adicionarEventosBotoes() {
      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", async function () {
          const idUsuario = this.getAttribute("data-id");
          const idEndereco = this.getAttribute("data-endereco");
          const cliente = await fetchUsuarioPorId(idUsuario);
  
          if (cliente) {
            localStorage.setItem("clienteNome", cliente.nome);
            window.location.href = `../editar-cliente/editar-cliente.html?idUsuario=${idUsuario}&idEndereco=${idEndereco}`;
          } else {
            console.error("Cliente não encontrado.");
          }
        });
      });
  
      document.querySelectorAll(".delete-btn").forEach((button) => {
        const id = button.getAttribute("data-id");
        const nome = button.closest("tr").querySelector("td:nth-child(1)").textContent;
        button.addEventListener("click", () => {
            cpfParaDeletar = id;
            if (cpfParaDeletar) {
                showModal(nome);
            } else {
                console.error("ID do usuário é indefinido.");
            }
        });
    });
  
    // Configura os eventos dos botões de ativação
    document.querySelectorAll(".activate-btn").forEach((button) => {
        const cpf = button.getAttribute("data-id");
        button.addEventListener("click", async (e) => {
          console.log(`Iniciando ativação do usuário com CPF: ${cpf}`);
          try {
            const response = await fetch(`${baseUrl}/usuarios/ativar/${cpf}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
            });
  
            if (response.ok) {
              console.log("Usuário ativado com sucesso.");
              showNotification("Usuário ativado com sucesso!");
              // Recarrega a lista de usuários
              usuarios = await fetchClientesInativos();
              renderTable(usuarios, currentPage);
            } else {
              const errorText = await response.text();
              console.error("Erro ao ativar o usuário:", errorText);
              throw new Error("Erro ao ativar o usuário: " + errorText);
            }
          } catch (error) {
            console.error("Erro geral:", error);
            showNotification(error.message, true);
          }
        });
      });
    }
  
    // Função para mostrar o modal de deletar
    function showModal(nome) {
      modalProcedimento.textContent = `Nome do usuário: ${nome}`;
      modal.style.display = "block";
    }
  
  
    async function deleteUser(idUsuario) {
      try {
          const response = await fetch(`http://localhost:8080/usuarios/exclusao-usuario/${idUsuario}`, {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          // Trata os códigos de sucesso, como 200 (OK) e 204 (No Content)
          if (response.ok || response.status === 204) {
              showNotification('Usuário excluído com sucesso!');
          } else {
              // Se o status não for um desses códigos, tratamos como erro
              throw new Error(`Erro ao deletar usuário: ${response.status} - ${response.statusText}`);
          }
  
      } catch (error) {
          console.error('Erro ao deletar o usuário:', error);
          showNotification('Usuário excluído com sucesso!');
      }
  }
  
    // Função para fechar o modal de deletar
    function closeModal() {
      modal.style.display = "none";
    }
  
    // Inicialização dos dados e tabela
    async function init() {
      usuarios = await fetchClientesInativos();
      renderTable(usuarios, currentPage);
  
      prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderTable(usuarios, currentPage);
        }
      });
  
      nextPageBtn.addEventListener("click", () => {
        const totalPages = Math.ceil(usuarios.length / itemsPerPage);
        if (currentPage < totalPages) {
          currentPage++;
          renderTable(usuarios, currentPage);
        }
      });
  
      btnYes.addEventListener("click", async () => {
        if (cpfParaDeletar !== null) {
          await deleteUser(cpfParaDeletar);
          usuarios = await fetchUsuariosFidelizados();
          renderTable(usuarios, currentPage);
          closeModal();
        }
      });
  
      document.querySelector(".btn-no").addEventListener("click", closeModal);
    }
  
    init();
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    const nome = localStorage.getItem("nome");
    const instagram = localStorage.getItem("instagram");
  
    if (nome && instagram) {
      document.getElementById("userName").textContent = nome;
      document.getElementById("userInsta").textContent = instagram;
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
  window.onclick = function (event) {
    const modal = document.getElementById("modal-pesquisa");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
  
  function pesquisarCliente() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const codigo = document.getElementById('codigo').value;
  
    let url = '';
    if (codigo) {
        url = `http://localhost:8080/usuarios/${codigo}`;
    } else if (cpf) {
        url = `http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`;
    }
    // } else if (nome) {
    //     url = `http://localhost:8080/usuarios/buscar-por-nome/${nome}`;
    else {
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
  
    if (!data || (Array.isArray(data) && data.length === 0)) {
        resultadoDiv.innerHTML = "<p>Nenhum cliente encontrado.</p>";
    } else {
        // Se o retorno for um único objeto, transforme-o em um array para que a tabela funcione
        const usuarios = Array.isArray(data) ? data : [data];
  
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
  
        usuarios.forEach(usuario => {
            tableHTML += `
                <tr>
                    <td>${usuario.nome}</td>
                    <td>${usuario.instagram}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.cpf}</td>
                    <td>
                        <button class="ver-mais-btn" data-id="${usuario.idUsuario}" style="border: none; background: transparent; cursor: pointer;" title="Ver mais">
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
                const idUsuario = this.getAttribute("data-id");
                window.location.href = `../clientes/clienteForms/editar-cliente/editar-cliente.html?idUsuario=${idUsuario}`;
            });
        });
    }
  }
  
  
  async function fetchUsuarioPorIdUsuario(idUsuario) {
    try {
        const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar cliente: ${response.statusText}`);
        }
        const cliente = await response.json();
        return cliente;
    } catch (error) {
        console.error("Erro na requisição:", error);
        return null;
    }
  }
  
  
  
  
  function mostrarErro(mensagem) {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `<p style="color: red;">${mensagem}</p>`;
  }
  
  function closeModalPesquisa() {
    document.getElementById("modal-pesquisa").style.display = "none";
  }
  
  function redirectToArchived() {
    window.location.href =
      "../clientes/clienteForms/arquivar-cliente/clientes-arquivados.html";
  }
  
  // Adiciona o evento de clique ao botão para exportar a tabela
document.querySelector(".planilha-btn").addEventListener("click", function () {
  // Faz a requisição para buscar todos os dados do servidor
  fetch("http://localhost:8080/usuarios/buscar-por-status/0")  // Altere para a sua URL que retorna todos os dados de clientes
    .then(response => response.json())  // Converte a resposta em JSON
    .then(data => {
      // Preenche a tabela com todos os dados recebidos
      renderAllUsersInTable(data);

      // Depois de preencher a tabela, chama a função de exportação
      exportTableToExcel("procedures-table", "ClientesInativos.xlsx");
    })
    .catch(error => {
      console.error("Erro ao buscar os dados completos:", error);
    });
});

// Função para preencher a tabela com todos os dados recebidos
function renderAllUsersInTable(data) {
var table = document.getElementById("procedures-table").querySelector("tbody");
table.innerHTML = ""; // Limpa a tabela antes de preenchê-la

data.forEach(user => {
  let row = table.insertRow();
  row.insertCell(0).textContent = user.nome;
  row.insertCell(1).textContent = user.instagram;
  row.insertCell(2).textContent = user.telefone;
  row.insertCell(3).textContent = user.cpf;  // Certifique-se de que a API retorna o CPF
  row.insertCell(4).textContent = user.email;
});
}

// Função para exportar a tabela para um arquivo Excel
function exportTableToExcel(tableId, filename = "") {
var table = document.getElementById(tableId);

// Clona a tabela para manipular sem alterar o DOM original
var tempTable = table.cloneNode(true);

// Verificar se há cabeçalho e adicioná-lo, se necessário
var tempThead = tempTable.querySelector("thead");
if (!tempThead) {
  tempThead = tempTable.createTHead();
  var row = tempThead.insertRow(0);
  row.insertCell(0).textContent = "Nome Completo";
  row.insertCell(1).textContent = "Perfil Instagram";
  row.insertCell(2).textContent = "Telefone de Contato";
  row.insertCell(3).textContent = "Documento CPF";
  row.insertCell(4).textContent = "Email";
} else {
  // Se o cabeçalho já existe, altera os títulos das colunas diretamente
  var tempHeaderRow = tempThead.rows[0];
  tempHeaderRow.cells[0].textContent = "Nome Completo";
  tempHeaderRow.cells[1].textContent = "Perfil Instagram";
  tempHeaderRow.cells[2].textContent = "Telefone de Contato";
  tempHeaderRow.cells[3].textContent = "Documento CPF";
  tempHeaderRow.cells[4].textContent = "Email";
}

// Converte a tabela para um arquivo Excel
var wb = XLSX.utils.table_to_book(tempTable, { sheet: "Sheet1" });
var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

// Salva o arquivo Excel
saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename);
}
  
  // Função para buscar dados de clientes arquivados (status 0)
  async function fetchArquivados() {
    const response = await fetch('http://localhost:8080/usuarios/count/arquivados'); // Ajuste a URL conforme necessário
    if (!response.ok) {
        throw new Error('Erro ao buscar clientes arquivados');
    }
    return await response.json(); // Retorna o número de clientes arquivados
  }
  
  // Função para buscar dados de clientes ativos (status 1)
  async function fetchAtivos() {
    const response = await fetch('http://localhost:8080/usuarios/count/ativos'); // Ajuste a URL conforme necessário
    if (!response.ok) {
        throw new Error('Erro ao buscar clientes ativos');
    }
    return await response.json(); // Retorna o número de clientes ativos
  }
  
  // Função para buscar dados de clientes fidelizados (agendamentos nos ultimos 3 meses)
  async function fetchFidelizados() {
    const response = await fetch('http://localhost:8080/usuarios/clientes-fidelizados-ultimos-tres-meses'); // Ajuste a URL conforme necessário
    if (!response.ok) {
        throw new Error('Erro ao buscar clientes ativos');
    }
    return await response.json(); // Retorna o número de clientes fidelizados
  }
  
  // Função para atualizar os KPIs
  async function updateKpiData() {
    try {
        const clientesAtivos = await fetchAtivos();
        const clientesArquivados = await fetchArquivados();
        const clientesFidelizados = await fetchFidelizados();
        
        // Atualizar o valor dos KPIs no HTML
        document.getElementById('mais-agendado').textContent = clientesAtivos;
        document.getElementById('menos-agendado').textContent = clientesArquivados;
        document.getElementById('fidelizado').textContent = clientesFidelizados
  
    } catch (error) {
        console.error('Erro ao buscar dados dos KPIs:', error);
    }
  }
  
  // Chama a função para atualizar os KPIs ao carregar a página
  window.onload = updateKpiData;
  