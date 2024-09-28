document.addEventListener("DOMContentLoaded", async function () {
  let isEditing = false;
  let clienteData = {}; // Variável para armazenar os dados do cliente

  const urlParams = new URLSearchParams(window.location.search);
  const idUsuario = urlParams.get("idUsuario") || localStorage.getItem("idUsuario");
  const idEndereco = urlParams.get("idEndereco");
  const clienteNome = localStorage.getItem("clienteNome");
  const agendamentoBtn = document.getElementById("agendamentoBtn");

  // Verifica se o botão de agendamentos existe antes de adicionar o evento
  if (agendamentoBtn) {
    agendamentoBtn.addEventListener("click", function () {
      // Redireciona para a página de agendamentos com o idUsuario na URL
      window.location.href = `../agendamentos-cliente/agendamentos-clientes.html?idUsuario=${idUsuario}`;
    });
  } else {
    console.error("Botão de agendamento não encontrado.");
  }

  if (clienteNome) {
    document.querySelector(
      "header h1"
    ).textContent = `Mais informações de: ${clienteNome}`;
  }

  
  if (idUsuario) {
    try {
      clienteData = await fetchUsuarioPorId(idUsuario);
      if (clienteData) {
        // Preenchendo os campos do formulário de dados pessoais
        setFieldValue("codigo", clienteData.idUsuario)
        setFieldValue("nome", clienteData.nome);
        setFieldValue("nascimento", formatDate(clienteData.dataNasc));
        setFieldValue("instagram", clienteData.instagram);
        setFieldValue("cpf", clienteData.cpf); // Você pode manter o CPF para exibir, mas não usá-lo para chamadas de API
        setFieldValue("telefone", clienteData.telefone);
        setFieldValue("genero", clienteData.genero);
        setFieldValue("email", clienteData.email);
        setFieldValue("indicacao", clienteData.indicacao);

        // Preenchendo os campos do formulário de endereço
        if (clienteData.endereco) {
          setFieldValue("logradouro", clienteData.endereco.logradouro);
          setFieldValue("numero", clienteData.endereco.numero);
          setFieldValue("cep", clienteData.endereco.cep);
          setFieldValue("bairro", clienteData.endereco.bairro);
          setFieldValue("cidade", clienteData.endereco.cidade);
          setFieldValue("estado", clienteData.endereco.estado);
          setFieldValue("complemento", clienteData.endereco.complemento);
        } else {
          console.error("Endereço não encontrado para o ID fornecido.");
        }
      } else {
        console.error("Nenhum dado encontrado para o ID fornecido.");
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do cliente:", error);
    }
  } else {
    console.error("ID do usuário não fornecido na URL.");
  }

  async function fetchUsuarioPorId(idUsuario) {
    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${idUsuario}`
      );
      if (!response.ok) {
        throw new Error(`Erro ao buscar usuário com ID: ${idUsuario}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return null;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  function setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (!value || value === "") {
      field.value = "Não há registro desse dado*";
      field.style.color = "red";
    } else {
      field.value = value;
      field.style.color = ""; // Reseta a cor para o padrão
    }
  }

  window.enableEditing = function () {
    isEditing = !isEditing; // Alterna o estado de edição
    const lockIcons = document.querySelectorAll(".lock-icon");
    const fields = document.querySelectorAll(
      "#personalForm input, #addressForm input"
    );
    const saveButtons = document.querySelectorAll(".save-button");

    if (isEditing) {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "inline";
      });
      fields.forEach((field) => {
        const lockIcon = document.getElementById(`${field.id}-lock`);
        if (lockIcon && lockIcon.textContent === "🔓") {
          field.disabled = false;
        }
      });
      saveButtons.forEach((button) => (button.disabled = false));
    } else {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "none";
      });
      fields.forEach((field) => {
        field.disabled = true;
      });
      saveButtons.forEach((button) => (button.disabled = true));
    }
  };

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

  async function updatePersonalData(event) {
    event.preventDefault();

    const updatedData = {
      nome: document.getElementById("nome").value || clienteData.nome,
      email: document.getElementById("email").value || clienteData.email,
      instagram:
        document.getElementById("instagram").value || clienteData.instagram,
      telefone:
        parseInt(document.getElementById("telefone").value) ||
        clienteData.telefone,
      genero: document.getElementById("genero").value || clienteData.genero,
      indicacao:
        document.getElementById("indicacao").value || clienteData.indicacao,
      cpf: document.getElementById("cpf").value || clienteData.cpf,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${idUsuario}`, // Alterado para usar idUsuario
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        showNotification("Dados atualizados com sucesso!");
        window.enableEditing();
      } else {
        showNotification("Erro ao atualizar os dados.", true);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados atualizados:", error);
      showNotification("Erro ao atualizar os dados.", true);
    }
  }

  async function updateAddressData(event) {
    event.preventDefault();

    const updatedAddress = {
      logradouro:
        document.getElementById("logradouro").value ||
        clienteData.endereco.logradouro,
      numero:
        document.getElementById("numero").value || clienteData.endereco.numero,
      cep: document.getElementById("cep").value || clienteData.endereco.cep,
      bairro:
        document.getElementById("bairro").value || clienteData.endereco.bairro,
      cidade:
        document.getElementById("cidade").value || clienteData.endereco.cidade,
      estado:
        document.getElementById("estado").value || clienteData.endereco.estado,
      complemento:
        document.getElementById("complemento").value ||
        clienteData.endereco.complemento,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/enderecos/${idEndereco}`, // Alterado para usar o ID do endereço
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAddress),
        }
      );

      if (response.ok) {
        showNotification("Endereço atualizado com sucesso!");
        window.enableEditing();
      } else {
        showNotification("Erro ao atualizar o endereço.", true);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados atualizados:", error);
      showNotification("Erro ao atualizar o endereço.", true);
    }
  }

  document
    .getElementById("personalForm")
    .addEventListener("submit", updatePersonalData);
  document
    .getElementById("addressForm")
    .addEventListener("submit", updateAddressData);

  document
    .getElementById("enviarEmailButton")
    .addEventListener("click", async function () {
      const email = document.getElementById("email").value;

      if (email) {
        try {
          const response = await fetch("http://localhost:5000/enviar-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
          });

          if (response.ok) {
            showNotification("Email enviado com sucesso!");
            window.enableEditing();
          } else {
            showNotification("Erro ao enviar email", true);
          }
        } catch (error) {
          console.error("Erro ao enviar email:", error);
        }
      } else {
        alert("Por favor, insira um email válido.");
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }
});

agendamentoBtn.addEventListener("click", function () {
  // Redireciona para a página de agendamentos com o idUsuario na URL
  window.location.href = `../agendamentos-cliente/agendamentos-clientes.html?idUsuario=${idUsuario}`;
});
