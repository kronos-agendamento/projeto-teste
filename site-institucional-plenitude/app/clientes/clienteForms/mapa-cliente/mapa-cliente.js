
    let map;
    let heatmap;
    let heatmapData = [];

    // Inicializa o mapa
    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: -23.55052, lng: -46.633308 }, // São Paulo
            zoom: 11
        });

        // Chama a função para buscar os endereços da API
        fetchEnderecos();
    }

    // Função para buscar os endereços da API
    async function fetchEnderecos() {
        try {
            const response = await fetch('http://localhost:8080/api/enderecos');
            if (!response.ok) {
                throw new Error(`Erro ao buscar endereços: ${response.statusText}`);
            }

            const enderecos = await response.json();
            const geocoder = new google.maps.Geocoder();

            // Itera sobre os endereços retornados pela API
            enderecos.forEach(endereco => {
                const fullAddress = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}, ${endereco.estado}`;
                geocodeAddress(geocoder, fullAddress);
            });
        } catch (error) {
            console.error('Erro ao buscar os endereços:', error);
        }
    }

    // Função para geocodificar o endereço e adicionar pontos ao mapa de calor
    function geocodeAddress(geocoder, address) {
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;

                // Adicionar a localização com o peso ao array de dados do heatmap
                heatmapData.push({
                    location: location,
                    weight: 1 // Aqui você pode ajustar o peso conforme necessário
                });

                // Atualiza o mapa de calor
                if (heatmap) {
                    heatmap.setData(heatmapData);
                } else {
                    initHeatmap();
                }
            } else {
                console.log('Geocode não foi bem-sucedido para o seguinte motivo: ' + status);
            }
        });
    }

    // Inicializa o Heatmap Layer
    function initHeatmap() {
        const gradient = [
            'rgba(0, 255, 0, 0)',    // Verde claro
            'rgba(255, 255, 0, 1)',  // Amarelo
            'rgba(255, 165, 0, 1)',  // Laranja
            'rgba(255, 0, 0, 1)'     // Vermelho
        ];

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            map: map,
            radius: 40, // Ajuste o raio conforme necessário
            gradient: gradient
        });
    }

    // Função para buscar os dados da tabela de bairros
    async function fetchTop5Bairros() {
        try {
            const response = await fetch('http://localhost:8080/usuarios/top5-bairros-clientes');
            if (!response.ok) {
                throw new Error('Erro ao buscar dados da API');
            }

            const data = await response.json();

            // Referência ao corpo da tabela
            const tableBody = document.querySelector('#top5-bairros-table tbody');

            // Limpa o corpo da tabela
            tableBody.innerHTML = '';

            // Percorre os dados retornados e adiciona linhas à tabela
            data.forEach(item => {
                const row = document.createElement('tr');

                const bairroCell = document.createElement('td');
                bairroCell.textContent = item.bairro;
                bairroCell.style.padding = "12px";
                bairroCell.style.border = "1px solid #ddd";
                row.appendChild(bairroCell);

                const cidadeCell = document.createElement('td');
                cidadeCell.textContent = item.cidade;
                cidadeCell.style.padding = "12px";
                cidadeCell.style.border = "1px solid #ddd";
                row.appendChild(cidadeCell);

                const clientesCell = document.createElement('td');
                clientesCell.textContent = item.clientes;
                clientesCell.style.padding = "12px";
                clientesCell.style.border = "1px solid #ddd";
                row.appendChild(clientesCell);

                // Adiciona a linha à tabela
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    async function fetchTop3Cidades() {
        try {
            // Faz a requisição para o endpoint
            const response = await fetch('http://localhost:8080/usuarios/top3-cidades-clientes');
            
            // Verifica se a requisição foi bem-sucedida
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }

            // Converte a resposta para JSON
            const data = await response.json();

            // Atualiza o H2 e P com os dados das top 3 cidades
            document.querySelector('.stat-item:nth-child(1) h2').textContent = data[0].cidade;
            document.getElementById('mais-agendado').textContent = `${data[0].porcentagem.toFixed(2)}%`;

            document.querySelector('.stat-item:nth-child(2) h2').textContent = data[1].cidade;
            document.getElementById('menos-agendado').textContent = `${data[1].porcentagem.toFixed(2)}%`;

            document.querySelector('.stat-item:nth-child(3) h2').textContent = data[2].cidade;
            document.getElementById('fidelizado').textContent = `${data[2].porcentagem.toFixed(2)}%`;

        } catch (error) {
            console.error('Erro ao buscar as top 3 cidades:', error);
            // Caso dê erro, exibe uma mensagem de erro
            document.querySelector('.stat-item:nth-child(1) h2').textContent = "Erro";
            document.getElementById('mais-agendado').textContent = "Erro ao carregar";

            document.querySelector('.stat-item:nth-child(2) h2').textContent = "Erro";
            document.getElementById('menos-agendado').textContent = "Erro ao carregar";

            document.querySelector('.stat-item:nth-child(3) h2').textContent = "Erro";
            document.getElementById('fidelizado').textContent = "Erro ao carregar";
        }
    }


    // Chama ambas as funções ao carregar a página
    window.onload = function() {
        initMap();
        fetchTop5Bairros();
        fetchTop3Cidades();
    };


    document.addEventListener("DOMContentLoaded", function () {
        const nome = localStorage.getItem("nome");
        const instagram = localStorage.getItem("instagram");
      
        if (nome && instagram) {
            document.getElementById("userName").textContent = nome;
            document.getElementById("userInsta").textContent = instagram;
        }
      });

    new window.VLibras.Widget('https://vlibras.gov.br/app');