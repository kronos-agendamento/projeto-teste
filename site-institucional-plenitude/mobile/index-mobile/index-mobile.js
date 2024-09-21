document.addEventListener('DOMContentLoaded', function() {
    const increaseFontBtn = document.getElementById('increase-font');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const rootElement = document.documentElement;

    // Definir tamanho de fonte padrão ou carregar do localStorage
    let currentFontSize = localStorage.getItem('fontSize') || '16px';
    rootElement.style.setProperty('--font-size-default', currentFontSize);

    // Função para aumentar o tamanho da fonte
    increaseFontBtn.addEventListener('click', function() {
        let newSize = parseFloat(currentFontSize) + 1;
        currentFontSize = `${newSize}px`;
        rootElement.style.setProperty('--font-size-default', currentFontSize);
        localStorage.setItem('fontSize', currentFontSize);
    });

    // Função para diminuir o tamanho da fonte
    decreaseFontBtn.addEventListener('click', function() {
        let newSize = parseFloat(currentFontSize) - 1;
        if (newSize >= 12) {  // Limitar tamanho mínimo da fonte
            currentFontSize = `${newSize}px`;
            rootElement.style.setProperty('--font-size-default', currentFontSize);
            localStorage.setItem('fontSize', currentFontSize);
        }
    });
});

function saudacao() {
    const saudacaoElement1 = document.getElementById('greeting1');
    const saudacaoElement2 = document.getElementById('greeting2');

    const dataAtual = new Date();
    const horaAtual = dataAtual.getHours();
    const diaSemana = dataAtual.getDay();
    
    let saudacaoTexto;
    let diasDaSemana = [
        { nome: "Domingo", genero: "um", otimo: "ótimo" },
        { nome: "Segunda-feira", genero: "uma", otimo: "ótima" },
        { nome: "Terça-feira", genero: "uma", otimo: "ótima" },
        { nome: "Quarta-feira", genero: "uma", otimo: "ótima" },
        { nome: "Quinta-feira", genero: "uma", otimo: "ótima" },
        { nome: "Sexta-feira", genero: "uma", otimo: "ótima" },
        { nome: "Sábado", genero: "um", otimo: "ótimo"  }
    ];
    
    // Verifica a hora do dia para a saudação
    if (horaAtual >= 0 && horaAtual < 12) {
        saudacaoTexto = "Bom dia";
    } else if (horaAtual >= 12 && horaAtual < 18) {
        saudacaoTexto = "Boa tarde";
    } else {
        saudacaoTexto = "Boa noite";
    }

    // Define o gênero correto para o "um/uma" de acordo com o dia da semana
    const dia = diasDaSemana[diaSemana];
    const genero = dia.genero;
    const otimo = dia.otimo;

    // Exibe a saudação com o dia da semana e o gênero correto
    saudacaoElement1.textContent = `${saudacaoTexto}`;
    saudacaoElement2.textContent = `Tenha ${genero} ${otimo} ${dia.nome}!`;

}

// Chama a função quando a página carregar
window.onload = saudacao;

