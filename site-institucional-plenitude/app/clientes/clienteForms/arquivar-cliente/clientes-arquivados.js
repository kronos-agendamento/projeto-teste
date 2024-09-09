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

  const prevPageBtn = document.getElementById("prev-page-btn");
  const nextPageBtn = document.getElementById("next-page-btn");
  const currentPageSpan = document.getElementById("current-page");
  const totalPagesSpan = document.getElementById("total-pages");

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

  function renderTable(users, page) {
    proceduresTbody.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const paginatedUsers = users.slice(start, end);

    paginatedUsers.forEach((user) => {
      const row = document.createElement("tr");
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
        
                    <button class="edit-btn" data-id="${cpf}" style="border: none; background: transparent; cursor: pointer;" title="Editar Cliente">
                            <img src="../../../../assets/icons/editar.png" alt="Editar" style="width: 25px; height: 25px; margin-top:18px; margin-left:2px;">
                    </button>
                    <button class="delete-btn" data-id="${cpf}" data-tipo="${nome}" style="border: none; background: transparent; cursor: pointer;" title="Excluir Cliente">
                            <img src="../../../../assets/icons/excluir.png" alt="Excluir" style="width: 25px; height: 25px; margin-top:18px; margin-left:2px;">
                    </button>
                    <button class="activate-btn" data-id="${cpf}" style="border: none; background: transparent; cursor: pointer;" title="Desarquivar Cliente">
                            <img src="../../../../assets/icons/desarquivar.png" alt="Arquivar" style="width: 25px; height: 25px; margin-top:18px; margin-left:2px;">
                    </button>
                </td>
            `;
      proceduresTbody.appendChild(row);
    });

    // Configura os eventos dos botões de exclusão
    document.querySelectorAll(".delete-btn").forEach((button) => {
      const id = button.getAttribute("data-id");
      const tipo = button.getAttribute("data-tipo");
      button.addEventListener("click", () => {
        if (confirm(`Deseja realmente excluir o cliente ${tipo}?`)) {
          deleteUser(id);
        }
      });
    });

    // Configura os eventos dos botões de edição
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        window.location.href = `editar-usuario.html?id=${id}`;
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
  }

  init();
});

document.querySelector(".planilha-btn").addEventListener("click", function () {
  exportTableToExcel("procedures-table", "ClientesArquivados.xlsx");
});

function exportTableToExcel(tableId, filename = "") {
  var table = document.getElementById(tableId);

  // Create a temporary table to remove the "Ações" column
  var tempTable = table.cloneNode(true);

  // Remove the last column (Ações) from the header
  var tempThead = tempTable.querySelector("thead");
  var tempHeaderRow = tempThead.rows[0];
  tempHeaderRow.deleteCell(-1); // Deletes the last cell from header

  // Remove the last column (Ações) from all rows in the body
  var tempTbody = tempTable.querySelector("tbody");
  for (var i = 0; i < tempTbody.rows.length; i++) {
    tempTbody.rows[i].deleteCell(-1); // Deletes the last cell from each row
  }

  // Convert the temporary table to Excel workbook and download
  var wb = XLSX.utils.table_to_book(tempTable, { sheet: "Sheet1" });
  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    filename
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});
