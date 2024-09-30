async function fetchUserDataByCpf(cpf) {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`);
      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
    return null; // Retorna null em caso de erro
  }
  
  document.addEventListener("DOMContentLoaded", async () => {
    const cpf = localStorage.getItem("cpf");
    if (cpf) {
      const userData = await fetchUserDataByCpf(cpf);
      if (userData) {
        fillUserProfile(userData);
      } else {
        console.error("Usuário não encontrado ou erro ao buscar dados do usuário.");
      }
    }
  
    function fillUserProfile(userData) {
      document.getElementById("nome").value = userData.nome || "";
      document.getElementById("nascimento").value = userData.dataNasc || "";
      document.getElementById("telefone").value = formatPhoneNumber(userData.telefone) || "";
      document.getElementById("genero").value = userData.genero || "";
      document.getElementById("instagram").value = userData.instagram || "";
      document.getElementById("indicacao").value = userData.indicacao || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("cpf").value = userData.cpf || "";
    }
  
    function formatPhoneNumber(phoneNumber) {
      if (!phoneNumber) return "";
      const cleaned = ("" + phoneNumber).replace(/\D/g, "");
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return phoneNumber;
    }
  
    // Função para salvar os dados
    async function atualizarUsuario() {
      try {
        const cpf = localStorage.getItem("cpf");
        const usuarioDTO = {
          nome: document.getElementById("nome").value,
          dataNasc: document.getElementById("nascimento").value,
          telefone: formatPhoneNumberToLong(document.getElementById("telefone").value),
          genero: document.getElementById("genero").value,
          instagram: document.getElementById("instagram").value,
          indicacao: document.getElementById("indicacao").value,
          email: document.getElementById("email").value,
          cpf: document.getElementById("cpf").value,
        };
  
        const usuarioResponse = await fetch(`http://localhost:8080/usuarios/atualizacao-usuario-por-cpf/${cpf}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioDTO),
        });
  
        if (!usuarioResponse.ok) {
          throw new Error(`Erro ao atualizar usuário: ${usuarioResponse.status}`);
        }
  
        showNotification("Dados atualizados com sucesso!");
      } catch (error) {
        console.error("Erro ao atualizar o usuário:", error);
        showNotification("Erro ao Atualizar!");

      }
    }
  
    document.getElementById("save-usuario-button").addEventListener("click", atualizarUsuario);
  
    function formatPhoneNumberToLong(phoneNumber) {
      if (!phoneNumber) return null;
      const cleaned = phoneNumber.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
      return parseInt(cleaned, 10); // Converte para número
    }
  });

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
  
  