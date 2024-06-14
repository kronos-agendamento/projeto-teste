document.addEventListener('DOMContentLoaded', function () {
    const baseUrl = 'http://localhost:8080/api/procedimentos';

    const endpoints = {
        maisAgendado: '/mais-agendado',
        menosAgendado: '/menos-agendado',
        melhorAvaliado: '/melhor-nota'
    };

    const ids = {
        maisAgendado: 'mais-agendado',
        menosAgendado: 'menos-agendado',
        melhorAvaliado: 'melhor-avaliado'
    };

    function fetchData(endpoint, id) {
        fetch(baseUrl + endpoint)
            .then(response => response.json())
            .then(data => {
                const elemento = document.getElementById(id);
                if (data && data.tipo) {
                    elemento.textContent = data.tipo;
                } else {
                    elemento.textContent = 'Não disponível';
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados:', error);
                document.getElementById(id).textContent = 'Erro ao carregar';
            });
    }

    function updateKPIs() {
        fetchData(endpoints.maisAgendado, ids.maisAgendado);
        fetchData(endpoints.menosAgendado, ids.menosAgendado);
        fetchData(endpoints.melhorAvaliado, ids.melhorAvaliado);
    }

    // Chama a função updateKPIs ao carregar a página
    updateKPIs();

    // Atualiza as KPIs a cada 5 segundos (5000 milissegundos)
    setInterval(updateKPIs, 5000);
});

function showModal(procedimento) {
    document.getElementById('procedimento').textContent = `Procedimento: ${procedimento}`;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}