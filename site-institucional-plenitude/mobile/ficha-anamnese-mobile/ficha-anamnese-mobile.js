document.addEventListener("DOMContentLoaded", function () {
  const increaseFontBtn = document.getElementById("increase-font");
  const decreaseFontBtn = document.getElementById("decrease-font");
  const rootElement = document.documentElement;

  // Definir tamanho de fonte padrão ou carregar do localStorage
  let currentFontSize = localStorage.getItem("fontSize") || "16px";
  rootElement.style.setProperty("--font-size-default", currentFontSize);
    document.body.style.fontSize = currentFontSize; // Aplicar o tamanho de fonte ao body

    let increaseClicks = 0;
    let decreaseClicks = 0;
    const maxClicks = 2; // Limitar o número de vezes que o tamanho da fonte pode ser alterado

  // Função para aumentar o tamanho da fonte
  increaseFontBtn.addEventListener("click", function () {
        if (increaseClicks < maxClicks) {
        let newSize = parseFloat(currentFontSize) + 1; // Aumentar 1px
        currentFontSize = `${newSize}px`;
        rootElement.style.setProperty("--font-size-default", currentFontSize);
            document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
        localStorage.setItem("fontSize", currentFontSize); // Salvar no localStorage
            
            increaseClicks++; // Incrementar o contador de aumentos
            decreaseClicks = 0; // Resetar o contador de diminuições para permitir novo ciclo
        }
  });

    // Função para diminuir o tamanho da fonte
    decreaseFontBtn.addEventListener('click', function() {
        if (decreaseClicks < maxClicks) {
            let newSize = parseFloat(currentFontSize) - 1; // Diminuir 1px
            if (newSize >= 12) {  // Limitar o tamanho mínimo da fonte
                currentFontSize = `${newSize}px`;
                rootElement.style.setProperty('--font-size-default', currentFontSize);
                document.body.style.fontSize = currentFontSize; // Aplicar o novo tamanho ao body
                localStorage.setItem('fontSize', currentFontSize); // Salvar no localStorage
                
                decreaseClicks++; // Incrementar o contador de diminuições
                increaseClicks = 0; // Resetar o contador de aumentos para permitir novo ciclo
            }
        }
    });
});

