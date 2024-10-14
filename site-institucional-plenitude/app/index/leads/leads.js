document.addEventListener("DOMContentLoaded", function () {
    const baseUrl = "http://localhost:8080"; // Altere para o URL do seu servidor, se necessário
    let leads = []; // Aqui você pode adicionar os dados dos leads
    const leadsTbody = document.getElementById("procedures-tbody");
    const prevPageBtn = document.getElementById("prev-page-btn");
    const nextPageBtn = document.getElementById("next-page-btn");
    const currentPageSpan = document.getElementById("current-page");
    const totalPagesSpan = document.getElementById("total-pages");
    const itemsPerPage = 5; // Defina quantos itens por página
    let currentPage = 1;

    // Função para buscar os leads
    async function fetchLeads() {
        try {
            const response = await fetch(`${baseUrl}/usuarios/buscar-leads`);
            if (!response.ok) throw new Error("Erro ao buscar os leads");

            leads = await response.json(); // Armazena os dados dos leads
            renderLeads(); // Renderiza os dados
        } catch (error) {
            console.error(error);
            showNotification("Erro ao carregar leads", true);
        }
    }

    // Função para renderizar a lista de leads no HTML (dentro da tabela)
    function renderLeads() {
        const start = (currentPage - 1) * itemsPerPage; // Calcula o início dos itens
        const end = start + itemsPerPage; // Calcula o fim dos itens
        const paginatedLeads = leads.slice(start, end); // Fatiar os leads para a página atual
        const leadsTableBody = document.querySelector("#leads tbody");

        // Limpar o conteúdo da tabela antes de renderizar
        leadsTableBody.innerHTML = "";

        if (paginatedLeads.length === 0) {
            leadsTableBody.innerHTML = "<tr><td colspan='5'>Nenhum lead encontrado.</td></tr>";
            return;
        }

        // Adiciona cada lead como uma nova linha na tabela
        paginatedLeads.forEach(lead => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${lead.nome}</td>
                <td>${lead.email}</td>
                <td>${lead.telefone}</td>
                <td>${lead.instagram}</td>
                <td>${lead.mensagem}</td>
            `;
            leadsTableBody.appendChild(row);
        });

        currentPageSpan.textContent = currentPage; // Atualiza a página atual
        totalPagesSpan.textContent = Math.ceil(leads.length / itemsPerPage); // Atualiza o total de páginas
        prevPageBtn.disabled = currentPage === 1; // Desabilita botão de página anterior
        nextPageBtn.disabled = currentPage >= Math.ceil(leads.length / itemsPerPage); // Desabilita botão de próxima página
    }

    // Função para exibir notificações
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

    // Funções para navegar entre páginas
    prevPageBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderLeads();
        }
    });

    nextPageBtn.addEventListener("click", function () {
        if (currentPage < Math.ceil(leads.length / itemsPerPage)) {
            currentPage++;
            renderLeads();
        }
    });

    // Chama a função para buscar e renderizar os leads ao carregar a página
    fetchLeads();

    new window.VLibras.Widget('https://vlibras.gov.br/app');
});
