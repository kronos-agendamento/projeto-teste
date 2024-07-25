document.addEventListener("DOMContentLoaded", function () {
    const url = 'http://localhost:8080/app/capacitacao/listar';
    const itemsPerPage = 3; // Número de itens por página
    let currentPage = 1; // Página atual
    let capacitacoes = []; // Array para armazenar as capacitações

    async function fetchCapacitacoes() {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao carregar as capacitações.');
            }
            const data = await response.json();
            capacitacoes = data; // Atualiza o array de capacitações
            renderTable(); // Renderiza a tabela com as capacitações atuais
        } catch (error) {
            console.error('Erro ao buscar as capacitações:', error);
        }
    }

    function renderTable() {
        const tbody = document.getElementById("procedures-tbody");
        tbody.innerHTML = ''; // Limpa qualquer conteúdo existente

        let totalCapacitacoes = capacitacoes.length;
        let confirmados = capacitacoes.filter(capacitacao => capacitacao.ativo === 1).length;

        // Calcula o índice inicial e final dos itens a serem exibidos na página atual
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        capacitacoes.slice(startIndex, endIndex).forEach(capacitacao => {
            const tr = document.createElement("tr");

            // Nome
            const nomeTd = document.createElement("td");
            nomeTd.textContent = capacitacao.nome;
            tr.appendChild(nomeTd);

            // Descrição
            const descricaoTd = document.createElement("td");
            descricaoTd.textContent = capacitacao.descricao;
            tr.appendChild(descricaoTd);

            // Nível
            const nivelTd = document.createElement("td");
            nivelTd.textContent = capacitacao.nivel;
            tr.appendChild(nivelTd);

            // Modalidade
            const modalidadeTd = document.createElement("td");
            modalidadeTd.textContent = capacitacao.modalidade;
            tr.appendChild(modalidadeTd);

            // Carga Horária
            const cargaHorariaTd = document.createElement("td");
            cargaHorariaTd.textContent = capacitacao.cargaHoraria;
            tr.appendChild(cargaHorariaTd);

            // Preço
            const precoTd = document.createElement("td");
            precoTd.textContent = capacitacao.precoCapacitacao;
            tr.appendChild(precoTd);

            // Status
            const statusTd = document.createElement("td");
            statusTd.textContent = capacitacao.ativo ? 'Ativo' : 'Inativo';
            tr.appendChild(statusTd);

            tbody.appendChild(tr);
        });

        // Atualiza os dados de paginação
        document.getElementById("current-page").textContent = currentPage;
        document.getElementById("total-pages").textContent = Math.ceil(totalCapacitacoes / itemsPerPage);
        document.getElementById("progress").style.width = `${(confirmados / totalCapacitacoes) * 100}%`;
    }

    // Função para ir para a página anterior
    document.getElementById("prev-page-btn").addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
        updatePaginationButtons();
    });

    // Função para ir para a próxima página
    document.getElementById("next-page-btn").addEventListener("click", function () {
        if (currentPage < Math.ceil(capacitacoes.length / itemsPerPage)) {
            currentPage++;
            renderTable();
        }
        updatePaginationButtons();
    });

    function updatePaginationButtons() {
        document.getElementById("prev-page-btn").disabled = currentPage === 1;
        document.getElementById("next-page-btn").disabled = currentPage === Math.ceil(capacitacoes.length / itemsPerPage);
    }

    fetchCapacitacoes(); // Chama a função para buscar e renderizar as capacitações
});
