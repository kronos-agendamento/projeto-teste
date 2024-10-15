document.addEventListener("DOMContentLoaded", function () {
    let undoStack = [];
    let redoStack = [];
    let undoRedoTimeout;

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

    const btnArquivar = document.getElementById("btn-arquivar");
    const btnRedo = document.getElementById("btn-redo");
    const btnUndo = document.getElementById("btn-undo");
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

    function showModal(nome) {
        // Define o nome do cliente no modal
        modalProcedimento.textContent = `Nome do cliente: ${nome}`;
        // Exibe o modal
        modal.style.display = "block";
    }
    
    // Função para fechar o modal de exclusão
    function closeModal() {
        modal.style.display = "none";
    }
    btnYes.addEventListener("click", async () => {
        if (cpfParaDeletar !== null) {
            await deleteUser(cpfParaDeletar); // Chama a função deleteUser para excluir o usuário
            usuarios = await fetchUsuariosAtivos(); // Atualiza a lista de usuários após a exclusão
            renderTable(usuarios, currentPage); // Re-renderiza a tabela com os dados atualizados
            closeModal(); // Fecha o modal de exclusão
        }
    });
    
    function showModalArchive(nome, cpf) {
        modalProcedimentoArchive.textContent = `Nome do usuário: ${nome}`;
        cpfParaArquivar = cpf;
        modalArchive.style.display = "block";
    }

    function closeModalArchive() {
        modalArchive.style.display = "none";
    }

    btnYesArchive.addEventListener("click", async () => {
        if (cpfParaArquivar) {
            await arquivarUsuario(cpfParaArquivar);
            undoStack.push({ action: "archive", cpf: cpfParaArquivar }); // Adiciona ação ao undo stack
            redoStack = []; // Limpa redo stack após nova ação
            updateUndoRedoButtons(); // Atualiza visibilidade dos botões
            closeModalArchive();
        }
    });

    document.querySelector("#modal-archive .btn-no").addEventListener("click", closeModalArchive);

    async function fetchUsuariosAtivos() {
        try {
            const response = await fetch(`${baseUrl}/usuarios/buscar-por-status/1`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao carregar usuários ativos:", error);
            return [];
        }
    }

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
            const idEndereco = user.endereco.idEndereco;

      row.innerHTML = `
      <td>${nome}</td>
      <td>
          <a href="https://www.instagram.com/${instagram}" target="_blank" class="instagram-link" style="display: flex; align-items: center;">
              <img src="../../assets/icons/instagram-icon.png" alt="Instagram" style="width: 20px; height: 20px; margin-right: 8px; margin-top: 20px">
              ${user.instagram}
          </a>
      </td>
      <td>${telefone}</td>
      <td>${cpf}</td>
  <td>
    <!-- Botão de Editar com tooltip -->
    <div class="tooltip-wrapper">
        <button class="edit-btn" data-id="${user.idUsuario}" data-endereco="${idEndereco}" style="border: none; background: transparent; cursor: pointer;">
            <img src="../../assets/icons/editar.png" alt="Editar" style="width: 25px; height: 25px; margin-top:8px; margin-left:5px;">
        </button>
        <div class="tooltip11">Editar</div>
    </div>
    <!-- Botão de Excluir com tooltip -->
    <div class="tooltip-wrapper">
        <button class="delete-btn" data-id="${user.idUsuario}" style="border: none; background: transparent; cursor: pointer;">
            <img src="../../assets/icons/excluir.png" alt="Excluir" style="width: 25px; height: 25px; margin-top:8px; margin-left:2px;">
        </button>
        <div class="tooltip11">Excluir</div>
    </div>
    <!-- Botão de Arquivar com tooltip -->
    <div class="tooltip-wrapper">
        <button class="archive-btn" data-id="${user.cpf}" style="border: none; background: transparent; cursor: pointer;">
            <img src="../../assets/icons/arquivar.png" alt="Arquivar" style="width: 25px; height: 25px; margin-top:8px; margin-left:2px;">
        </button>
        <div class="tooltip11">Inativar</div>
    </div>
</td>
    `;
      proceduresTbody.appendChild(row);
    });

        const totalPages = Math.ceil(users.length / itemsPerPage);
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        adicionarEventosBotoes();
    }

    function adicionarEventosBotoes() {
        document.querySelectorAll(".edit-btn").forEach((button) => {
            button.addEventListener("click", async function () {
                const idUsuario = this.getAttribute("data-id");
                const idEndereco = this.getAttribute("data-endereco");
                const cliente = await fetchUsuarioPorId(idUsuario);

                if (cliente) {
                    localStorage.setItem("clienteNome", cliente.nome);
                    window.location.href = `../clientes/clienteForms/editar-cliente/editar-cliente.html?idUsuario=${idUsuario}&idEndereco=${idEndereco}`;
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

        document.querySelectorAll(".archive-btn").forEach((button) => {
            const cpf = button.getAttribute("data-id");
            const nome = button.closest("tr").querySelector("td").textContent;
            button.addEventListener("click", function () {
                showModalArchive(nome, cpf);
            });
        });
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
            showNotification('Erro ao excluir o usuário. Por favor, tente novamente.', true);
        }
    }
    
    
    async function arquivarUsuario(cpf) {
        try {
            const response = await fetch(`${baseUrl}/usuarios/inativar/${cpf}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Resposta da API:", response);

            if (response.ok) {
                showNotification("Usuário inativado com sucesso!");
                usuarios = await fetchUsuariosAtivos(); // Atualiza a lista de usuários
                renderTable(usuarios, currentPage); // Atualiza a tabela
            } else {
                // Verifica outros possíveis status que não são 200 mas podem não ser erros
                const responseData = await response.json();
                console.log("Erro ao inativar (dados da resposta):", responseData);
                showNotification(`Erro ao inativar o usuário: ${response.status} - ${response.statusText}`, true);
            }
        } catch (error) {
            console.error("Erro ao inativar o usuário (exceção):", error);
            showNotification("Erro ao inativar o usuário. Verifique o console para mais detalhes.", true);
        }
    }


    async function restoreArchivedUser(cpf) {
        try {
            const response = await fetch(`${baseUrl}/usuarios/ativar/${cpf}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao reativar o usuário.");
            }

            showNotification("Usuário reativado com sucesso!");
            usuarios = await fetchUsuariosAtivos(); // Atualiza a lista de usuários
            renderTable(usuarios, currentPage); // Atualiza a tabela
        } catch (error) {
            console.error("Erro ao reativar o usuário:", error);
            showNotification("Erro ao reativar o usuário.", true);
        }
    }

    function undoAction() {
        const lastAction = undoStack.pop();
        if (!lastAction) {
            showNotification("Nenhuma ação para desfazer.", true);
            return;
        }

        if (lastAction.action === "archive") {
            restoreArchivedUser(lastAction.cpf);
            redoStack.push(lastAction); // Adiciona ao stack de refazer
        }

        updateUndoRedoButtons(); // Atualiza visibilidade dos botões
    }

    function redoAction() {
        const lastRedoAction = redoStack.pop();
        if (!lastRedoAction) {
            showNotification("Nenhuma ação para refazer.", true);
            return;
        }

        if (lastRedoAction.action === "archive") {
            arquivarUsuario(lastRedoAction.cpf);
            undoStack.push(lastRedoAction); // Adiciona ao stack de desfazer
        }

        updateUndoRedoButtons(); // Atualiza visibilidade dos botões
    }

    function updateUndoRedoButtons() {
        // Atualiza a visibilidade dos botões "Desfazer" e "Refazer"
        if (undoStack.length > 0) {
            btnUndo.style.display = "inline-flex"; // Define como "inline-flex" para centralizar o conteúdo
            btnUndo.style.width = "100px";         // Aumenta a largura do botão
            btnUndo.style.height = "39.8px";       // Aumenta a altura do botão
            btnUndo.style.padding = "10px 10px";   // Ajusta o padding para tornar o botão mais "cheio"
            btnUndo.style.fontSize = "0.9rem";     // Aumenta o tamanho do texto
            btnUndo.style.marginLeft = "7px";
        } else {
            btnUndo.style.display = "none";
        }

        if (redoStack.length > 0) {
            btnRedo.style.display = "inline-flex"; // Define como "inline-flex" para centralizar o conteúdo
            btnRedo.style.width = "100px";         // Aumenta a largura do botão
            btnRedo.style.height = "39px";         // Aumenta a altura do botão
            btnRedo.style.padding = "10px 13px";   // Ajusta o padding para tornar o botão mais "cheio"
            btnRedo.style.fontSize = "0.9rem";     // Aumenta o tamanho do texto
            btnRedo.style.marginLeft = "7px";
        } else {
            btnRedo.style.display = "none";
        }


        // Reinicia o timer para ocultar os botões após 10 segundos
        clearTimeout(undoRedoTimeout);
        if (undoStack.length > 0 || redoStack.length > 0) {
            undoRedoTimeout = setTimeout(() => {
                btnUndo.style.display = "none";
                btnRedo.style.display = "none";
                // Quando os botões "Desfazer" e "Refazer" desaparecem, ajusta a margem do botão "Inativos"
                document.getElementById("btn-arquivar").style.marginLeft = "10px";
            }, 10000);
        }
    }

    btnUndo.addEventListener("click", undoAction);
    btnRedo.addEventListener("click", redoAction); // Adiciona o evento ao botão de refazer

    async function init() {
        usuarios = await fetchUsuariosAtivos();
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
                usuarios = await fetchUsuariosAtivos();
                renderTable(usuarios, currentPage);
                closeModal();
            }
        });

        document.querySelector(".btn-no").addEventListener("click", closeModal);

        updateUndoRedoButtons(); // Atualiza os botões na inicialização
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

  if (!data || (Array.isArray(data) && data.length === 0)) {
      resultadoDiv.innerHTML = "<p>Nenhum cliente encontrado.</p>";
  } else {
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

      document.querySelectorAll('.ver-mais-btn').forEach(button => {
          button.addEventListener('click', function() {
              const idUsuario = this.getAttribute("data-id");
              window.location.href = `../clientes/clienteForms/editar-cliente/editar-cliente.html?idUsuario=${idUsuario}`;
          });
      });
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
  window.location.href = "../clientes/clienteForms/arquivar-cliente/clientes-arquivados.html";
}

document.querySelector(".planilha-btn").addEventListener("click", function () {
  exportTableToExcel("procedures-table", "ClientesAtivos.xlsx");
});

function exportTableToExcel(tableId, filename = "") {
  var table = document.getElementById(tableId);
  var tempTable = table.cloneNode(true);
  var tempThead = tempTable.querySelector("thead");
  var tempHeaderRow = tempThead.rows[0];
  tempHeaderRow.deleteCell(-1); // Deletes the last cell from header

  var tempTbody = tempTable.querySelector("tbody");
  for (var i = 0; i < tempTbody.rows.length; i++) {
      tempTbody.rows[i].deleteCell(-1); // Deletes the last cell from each row
  }

  var wb = XLSX.utils.table_to_book(tempTable, { sheet: "Sheet1" });
  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
  }

  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), filename);
}

// Funções para buscar dados de clientes arquivados, ativos e fidelizados
async function fetchArquivados() {
  const response = await fetch('http://localhost:8080/usuarios/count/arquivados');
  if (!response.ok) {
      throw new Error('Erro ao buscar clientes arquivados');
  }
  return await response.json();
}

async function fetchAtivos() {
  const response = await fetch('http://localhost:8080/usuarios/count/ativos');
  if (!response.ok) {
      throw new Error('Erro ao buscar clientes ativos');
  }
  return await response.json();
}

async function fetchFidelizados() {
  const response = await fetch('http://localhost:8080/usuarios/clientes-fidelizados-ultimos-tres-meses');
  if (!response.ok) {
      throw new Error('Erro ao buscar clientes fidelizados');
  }
  return await response.json();
}

async function updateKpiData() {
  try {
      const clientesAtivos = await fetchAtivos();
      const clientesArquivados = await fetchArquivados();
      const clientesFidelizados = await fetchFidelizados();

      document.getElementById('mais-agendado').textContent = clientesAtivos;
      document.getElementById('menos-agendado').textContent = clientesArquivados;
      document.getElementById('fidelizado').textContent = clientesFidelizados;
  } catch (error) {
      console.error('Erro ao buscar dados dos KPIs:', error);
  }
}

window.onload = updateKpiData;