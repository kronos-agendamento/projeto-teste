document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const instagram = document.getElementById("instagram").value;
    const telefone = document.getElementById("telefone").value;
    const message = document.querySelector('[name="message"]').value;

    // Armazena os dados no localStorage
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("instagram", instagram);
    localStorage.setItem("telefone", telefone);

    // Envia a mensagem para o banco de dados
    fetch("http://localhost:8080/mensagem/cadastro-mensagem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Sucesso:", data);
        alert("Formulário enviado com sucesso!");
        document.getElementById("contactForm").reset();

        // Redireciona para a página de login
        window.location.href = "login.html";
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao enviar o formulário.");
      });
  });
