document.addEventListener("DOMContentLoaded", async function () {
  // Variáveis de controle
  let isEditingPersonal = false;
  let isEditingAddress = false;
  let clienteData = {};
  let originalData = {};
  let undoStack = [];
  let redoStack = [];
  let undoRedoTimeout;

  const urlParams = new URLSearchParams(window.location.search);
  const idUsuario = urlParams.get("codigo");
  const idEndereco = urlParams.get("endereco");
  const clienteNome = urlParams.get("nome");
  

  if (clienteNome) {
    document.querySelector(
      "header h1"
    ).textContent = `Mais informações de: ${clienteNome}`;
  }

  // Fetch de dados do usuário
  if (idUsuario) {
    try {
      clienteData = await fetchUsuarioPorId(idUsuario);
      if (clienteData) {
        originalData = JSON.parse(JSON.stringify(clienteData));
        preencherCampos(clienteData);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do cliente:", error);
    }
  }

  // Função para preencher campos
  function preencherCampos(data) {
    setFieldValue("codigo", data.idUsuario);
    setFieldValue("nome", data.nome);
    setFieldValue("nascimento", formatDate(data.dataNasc));
    setFieldValue("instagram", data.instagram);
    setFieldValue("cpf", data.cpf);
    setFieldValue("telefone", data.telefone);
    setFieldValue("genero", data.genero);
    setFieldValue("email", data.email);
    setFieldValue("nivelAcesso", data.nivelAcesso);

    if (data.endereco) {
      setFieldValue("logradouro", data.endereco.logradouro);
      setFieldValue("numero", data.endereco.numero);
      setFieldValue("cep", data.endereco.cep);
      setFieldValue("bairro", data.endereco.bairro);
      setFieldValue("cidade", data.endereco.cidade);
      setFieldValue("estado", data.endereco.estado);
      setFieldValue("complemento", data.endereco.complemento);
    } else {
      console.error("Endereço não encontrado para o ID fornecido.");
    }
  }

  async function fetchUsuarioPorId(idUsuario) {
    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${idUsuario}`
      );
      if (!response.ok)
        throw new Error(`Erro ao buscar usuário com ID: ${idUsuario}`);
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
    if (!field) {
      console.error(`Campo com id "${fieldId}" não foi encontrado.`);
      return;
    }
    field.value = value || "Não há registro desse dado*";
    field.style.color = value ? "" : "red";
  }

  // Funções de edição e ícones de cadeado
  function toggleLockIcons(formId, show) {
    const lockIcons = document.querySelectorAll(`#${formId} .lock-icon`);
    lockIcons.forEach((lockIcon) => {
      lockIcon.style.display = show ? "inline" : "none";
    });
  }

  function togglePersonalEditing() {
    isEditingPersonal = !isEditingPersonal;
    document
      .querySelectorAll("#personalForm input, #personalForm select")
      .forEach((field) => {
        field.disabled = !isEditingPersonal;
      });
    document.getElementById("saveButton").disabled = !isEditingPersonal;
    document.getElementById("deleteButton").style.display = isEditingPersonal
      ? "inline"
      : "none";
    toggleLockIcons("personalForm", isEditingPersonal);
  }

  function toggleAddressEditing() {
    isEditingAddress = !isEditingAddress;
    document.querySelectorAll("#addressForm input").forEach((field) => {
      field.disabled = !isEditingAddress;
    });
    document.getElementById("saveButtonAddress").disabled = !isEditingAddress;
    toggleLockIcons("addressForm", isEditingAddress);
  }

  // Funções de notificações
  function showNotification(message, isError = false) {
    const notification = document.getElementById("notification");
    const notificationMessage = document.getElementById("notification-message");
    notificationMessage.textContent = message;
    notification.classList.toggle("error", isError);
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }

  // Função para atualizar os botões de desfazer/refazer
  function updateUndoRedoButtons() {
    const btnUndo = document.getElementById("btn-undo");
    const btnRedo = document.getElementById("btn-redo");

    if (btnUndo && btnRedo) {
      btnUndo.style.display = undoStack.length > 0 ? "inline" : "none";
      btnRedo.style.display = redoStack.length > 0 ? "inline" : "none";

      clearTimeout(undoRedoTimeout);

      if (undoStack.length > 0 || redoStack.length > 0) {
        undoRedoTimeout = setTimeout(() => {
          btnUndo.style.display = "none";
          btnRedo.style.display = "none";
        }, 10000);
      }
    }
  }

  // Função de exclusão do usuário
  async function deleteUser() {
    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/exclusao-usuario/${idUsuario}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        showNotification("Usuário excluído com sucesso!");

        // Aguarda 2 segundos antes de redirecionar para a página anterior
        setTimeout(() => {
          window.location.href = "../../perfil.html";
        }, 2000);
      } else {
        showNotification("Erro ao excluir o usuário.", true);
      }
    } catch (error) {
      console.error("Erro ao excluir o usuário:", error);
      showNotification("Erro ao excluir o usuário.", true);
    }
  }

  // Função para atualizar dados pessoais
  async function updatePersonalData(event) {
    event.preventDefault();
    undoStack.push(JSON.parse(JSON.stringify(clienteData)));
    redoStack = [];

    const updatedData = {
      nome: document.getElementById("nome").value || clienteData.nome,
      email: document.getElementById("email").value || clienteData.email,
      instagram:
        document.getElementById("instagram").value || clienteData.instagram,
      telefone:
        parseInt(document.getElementById("telefone").value) ||
        clienteData.telefone,
      genero: document.getElementById("genero").value || clienteData.genero,
      nivelAcesso: parseInt(document.getElementById("nivelAcesso").value),
      cpf: document.getElementById("cpf").value || clienteData.cpf,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/usuarios/${idUsuario}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        clienteData = { ...clienteData, ...updatedData };
        showNotification("Dados atualizados com sucesso!");
        updateUndoRedoButtons();
        togglePersonalEditing();
      } else {
        showNotification("Erro ao atualizar os dados.", true);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados atualizados:", error);
      showNotification("Erro ao atualizar os dados.", true);
    }
  }

  // Função para atualizar dados de endereço
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
        `http://localhost:8080/api/enderecos/${idEndereco}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedAddress),
        }
      );

      if (response.ok) {
        clienteData.endereco = updatedAddress;
        showNotification("Endereço atualizado com sucesso!");
        updateUndoRedoButtons();
        toggleAddressEditing();
      } else {
        showNotification("Erro ao atualizar o endereço.", true);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados atualizados:", error);
      showNotification("Erro ao atualizar o endereço.", true);
    }
  }

  // Função para controlar os modais de confirmação
  function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }

  function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }

  // Confirmar ações ao clicar nos botões de confirmação
  document
    .getElementById("confirmSavePersonalButton")
    ?.addEventListener("click", async () => {
      await updatePersonalData(new Event("submit"));
      closeModal("confirmSavePersonalModal");
    });

  document
    .getElementById("confirmSaveAddressButton")
    ?.addEventListener("click", async () => {
      await updateAddressData(new Event("submit"));
      closeModal("confirmSaveAddressModal");
    });

  document
    .getElementById("confirmDeleteButton")
    ?.addEventListener("click", async () => {
      await deleteUser();
      closeModal("confirmDeleteModal");
    });

  // Botões de cancelamento para fechar modais
  document.querySelectorAll(".btn-no").forEach((button) => {
    button.addEventListener("click", (event) => {
      const modalId = event.target.closest(".modal").id;
      closeModal(modalId);
    });
  });

  // Eventos de clique para alternar edição
  document
    .getElementById("editIconPessoal")
    ?.addEventListener("click", togglePersonalEditing);
  document
    .getElementById("editIconAdress")
    ?.addEventListener("click", toggleAddressEditing);

  // Eventos de clique para abrir modais de confirmação
  document.getElementById("saveButton")?.addEventListener("click", (event) => {
    event.preventDefault();
    openModal("confirmSavePersonalModal");
  });
  document
    .getElementById("saveButtonAddress")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      openModal("confirmSaveAddressModal");
    });
  document
    .getElementById("deleteButton")
    ?.addEventListener("click", (event) => {
      event.preventDefault();
      openModal("confirmDeleteModal");
    });

  // Funções de Undo e Redo
  document.getElementById("btn-undo")?.addEventListener("click", undoAction);
  document.getElementById("btn-redo")?.addEventListener("click", redoAction);
  updateUndoRedoButtons(); // Inicializar Undo e Redo ao carregar a página
  new window.VLibras.Widget('https://vlibras.gov.br/app');
});

async function carregarImagem2() {
  const cpf = localStorage.getItem("cpf"); // Captura o valor do CPF a cada execução
  const perfilImage = document.getElementById("perfilImage");

  if (!cpf) {
    console.log("CPF não encontrado.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`,
      {
        method: "GET",
      }
    );

    if (response.ok) {
      const blob = await response.blob(); // Recebe a imagem como Blob
      const imageUrl = URL.createObjectURL(blob); // Cria uma URL temporária para o Blob

      // Define a URL da imagem carregada como src do img
      perfilImage.src = imageUrl;
      perfilImage.alt = "Foto do usuário";
      perfilImage.style.width = "20vh";
      perfilImage.style.height = "20vh";
      perfilImage.style.borderRadius = "300px";
    } else {
      console.log("Imagem não encontrada para o CPF informado.");
    }
  } catch (error) {
    console.error("Erro ao buscar a imagem:", error);
  }
}

// Carrega a imagem automaticamente quando a página termina de carregar
window.onload = carregarImagem2;

const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");

if (nome && instagram) {
  document.getElementById("userName").textContent = nome;
  document.getElementById("userInsta").textContent = instagram;
}
