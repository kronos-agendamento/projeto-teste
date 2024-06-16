function showModal(procedimento) {
    document.getElementById('procedimento').textContent = `Procedimento: ${procedimento}`;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}


// Chart.JS abaixo


document.addEventListener('DOMContentLoaded', function () {
    const ctx1 = document.getElementById('chart1').getContext('2d');
    const ctx2 = document.getElementById('chart2').getContext('2d');
    const ctx3 = document.getElementById('chart3').getContext('2d');
    const ctx4 = document.getElementById('chart4').getContext('2d');

    let chart1, chart2, chart3, chart4;

    function createCharts() {
        if (chart1) chart1.destroy();
        if (chart2) chart2.destroy();
        if (chart3) chart3.destroy();
        if (chart4) chart4.destroy();

        chart1 = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: ['Rinoplastia', 'Russo', 'Fox Eyes'],
                datasets: [{
                    label: 'Quantidade de Agendamentos',
                    data: [30, 45, 25],
                    backgroundColor: '#D2135D',
                }]
            }
        });

        chart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Rinoplastia', 'Russo', 'Micro'],
                datasets: [{
                    label: 'Média de Avaliações',
                    data: [4.8, 3.0, 4.6],
                    backgroundColor: '#D2135D',
                }]
            }
        });

        chart3 = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Receita Acumulada',
                    data: [4000, 1000, 8000, 5500, 7000, 9000],
                    backgroundColor: '#D2135D',
                    borderColor: '#D2135D',
                    fill: false
                }]
            }
        });

        chart4 = new Chart(ctx4, {
            type: 'bar',
            data: {
                labels: ['Whatsapp', 'Instagram', 'Facebook'],
                datasets: [{
                    label: 'Média de Clientes Avaliados',
                    data: [20, 15, 10],
                    backgroundColor: '#D2135D',
                }]
            }
        });
    }

    createCharts();

    window.addEventListener('resize', function () {
        createCharts();
    });
});

