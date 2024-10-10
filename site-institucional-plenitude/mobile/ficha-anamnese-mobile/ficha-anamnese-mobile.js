document.addEventListener("DOMContentLoaded", function () {
    const increaseFontBtn = document.getElementById("increase-font");
    const decreaseFontBtn = document.getElementById("decrease-font");
    const rootElement = document.documentElement;

    let currentFontSize = localStorage.getItem("fontSize") || "16px";
    rootElement.style.setProperty("--font-size-default", currentFontSize);
    document.body.style.fontSize = currentFontSize;

    let increaseClicks = 0;
    let decreaseClicks = 0;
    const maxClicks = 2;

    increaseFontBtn.addEventListener("click", function () {
        if (increaseClicks < maxClicks) {
            let newSize = parseFloat(currentFontSize) + 1;
            currentFontSize = `${newSize}px`;
            rootElement.style.setProperty("--font-size-default", currentFontSize);
            document.body.style.fontSize = currentFontSize;
            localStorage.setItem("fontSize", currentFontSize);

            increaseClicks++;
            decreaseClicks = 0;
        }
    });

    decreaseFontBtn.addEventListener('click', function() {
        if (decreaseClicks < maxClicks) {
            let newSize = parseFloat(currentFontSize) - 1;
            if (newSize >= 12) {
                currentFontSize = `${newSize}px`;
                rootElement.style.setProperty('--font-size-default', currentFontSize);
                document.body.style.fontSize = currentFontSize;
                localStorage.setItem('fontSize', currentFontSize);

                decreaseClicks++;
                increaseClicks = 0;
            }
        }
    });

    // Função para buscar as perguntas da API
    async function fetchPerguntas() {
        try {
            const response = await fetch('http://localhost:8080/api/perguntas');
            if (response.status === 204) {
                alert('Nenhuma pergunta encontrada.');
                return;
            }

            const perguntas = await response.json();
            renderPerguntas(perguntas);
        } catch (error) {
            console.error('Erro ao buscar perguntas:', error);
        }
    }

    // Função para renderizar as perguntas dinamicamente
    function renderPerguntas(perguntas) {
        const contentDiv = document.getElementById('content');
        contentDiv.innerHTML = ''; // Limpar o conteúdo atual

        perguntas.forEach(pergunta => {
            const formGroup = document.createElement('div');
            formGroup.classList.add('form-group');
            formGroup.style.marginBottom = "20px"; // Adicionar espaçamento entre perguntas

            // Cria o rótulo da pergunta
            const label = document.createElement('label');
            label.textContent = pergunta.pergunta;
            label.style.fontWeight = "bold";
            formGroup.appendChild(label);

            // Gerar o campo de acordo com o tipo da pergunta
            let inputElement = null;

            if (pergunta.tipo === 'Input') {
                console.log('Input');
                console.log(pergunta);
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.name = `pergunta_${pergunta.idPergunta}`;
                inputElement.required = true;
                inputElement.style.marginTop = "10px"; // Espaçamento
                inputElement.style.display = "block"; // Para garantir que fique abaixo da pergunta
                inputElement.style.width = "100%";
            } else if (pergunta.tipo === 'Check Box') {
                console.log('Check Box');
                console.log(pergunta);
                inputElement = document.createElement('input');
                inputElement.type = 'checkbox';
                inputElement.name = `pergunta_${pergunta.idPergunta}`;
                inputElement.style.marginTop = "10px"; // Espaçamento
            } else if (pergunta.tipo === 'Select') {
                console.log('Select');
                console.log(pergunta);
                inputElement = document.createElement('select');
                inputElement.name = `pergunta_${pergunta.idPergunta}`;
                inputElement.required = true;
                inputElement.style.marginTop = "10px"; // Espaçamento

                // Adiciona opções para o select
                const optionSim = document.createElement('option');
                optionSim.value = 'Sim';
                optionSim.textContent = 'Sim';

                const optionNao = document.createElement('option');
                optionNao.value = 'Não';
                optionNao.textContent = 'Não';

                inputElement.appendChild(optionSim);
                inputElement.appendChild(optionNao);
            }

            if (inputElement) {
                formGroup.appendChild(inputElement); // Adiciona o input no grupo de formulário
            }

            // Adiciona o grupo de formulário ao conteúdo
            contentDiv.appendChild(formGroup);
        });
    }

    // Função para enviar o formulário (exemplo de envio)
    function submitForm() {
        const formData = new FormData();

        // Coleta os valores dos inputs gerados
        document.querySelectorAll('input, select').forEach(input => {
            if (input.type === 'checkbox') {
                formData.append(input.name, input.checked ? 'Sim' : 'Não');
            } else {
                formData.append(input.name, input.value);
            }
        });

        console.log('Dados do formulário:', Object.fromEntries(formData));
    }

    // Buscar perguntas ao carregar a página
    window.onload = fetchPerguntas;
});
