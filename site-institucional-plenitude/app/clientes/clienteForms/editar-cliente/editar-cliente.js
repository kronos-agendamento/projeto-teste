document.addEventListener("DOMContentLoaded", async function () {
  let isEditingPersonal = false; // Para alternar edição de Dados Pessoais
  let isEditingAddress = false; // Para alternar edição de Dados de Endereço
  let clienteData = {}; // Variável para armazenar os dados do cliente
  let originalData = {}; // Para armazenar os dados originais do cliente
  let undoStack = []; // Stack para desfazer ações
  let redoStack = []; // Stack para refazer ações
  let undoRedoTimeout; // Variável para o timeout

  const urlParams = new URLSearchParams(window.location.search);
  const idUsuario =
    urlParams.get("idUsuario") || localStorage.getItem("idUsuario");
  const idEndereco = urlParams.get("idEndereco");
  const clienteNome = localStorage.getItem("clienteNome");
  const agendamentoBtn = document.getElementById("agendamentoBtn");
    const anamneseBtn = document.getElementById("anamneseBtn");

    function formatTelefone(telefone) {
      if (!telefone) return "";
      const cleaned = ("" + telefone).replace(/\D/g, ""); // Remove qualquer caractere não numérico
      const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/); // Verifica se o telefone tem o formato (XX) XXXXX-XXXX
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`; // Retorna o formato correto
      }
      return telefone; // Retorna o valor original se não bater com o padrão
    }

    function formatCep(cep) {
      if (!cep) return "";
      const cleaned = ("" + cep).replace(/\D/g, ""); // Remove qualquer caractere que não seja número
      const match = cleaned.match(/^(\d{5})(\d{3})$/); // Verifica se o CEP tem 5 dígitos seguidos de 3 dígitos
      if (match) {
        return `${match[1]}-${match[2]}`; // Retorna no formato 00000-000
      }
      return cep; // Retorna o valor original caso não corresponda ao padrão
    }

  if (agendamentoBtn) {
    agendamentoBtn.addEventListener("click", function () {
      window.location.href = `../agendamentos-cliente/agendamento-clientes.html?idUsuario=${idUsuario}`;
    });
  }

    if (anamneseBtn) {
    anamneseBtn.addEventListener("click", function () {
        window.location.href = `../anamnese-cliente/anamnese-clientes.html?idUsuario=${idUsuario}`;
    });
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
        console.log("Dados do cliente:", clienteData);
        console.log("Avaliação do cliente:", clienteData.avaliacao); // Verifique o valor de avaliação aqui
        const avaliacaoSelecionada = clienteData.avaliacao; // Mantém como referência
        console.log("Avaliação carregada:", avaliacaoSelecionada);
        mostrarAvaliacaoEstrelas(avaliacaoSelecionada); // Exibe a avaliação carregada

        setFieldValue("codigo", clienteData.idUsuario);
        setFieldValue("nome", clienteData.nome);
        setFieldValue("nascimento", formatDate(clienteData.dataNasc));
        setFieldValue("instagram", clienteData.instagram);
        setFieldValue("cpf", clienteData.cpf);
        setFieldValue("telefone", formatTelefone(clienteData.telefone));
        setFieldValue("genero", clienteData.genero);
        setFieldValue("email", clienteData.email);
        setFieldValue("indicacao", clienteData.indicacao);

        // if (clienteData.avaliacao != null) {
        //   console.log(clienteData.avaliacao)
        //   localStorage.setItem("avaliacao", clienteData.avaliacao); // Salva a avaliação no localStorage
        //   mostrarAvaliacaoEstrelas(clienteData.avaliacao); // Exibe a avaliação como estrelas
        // } else {
        //   mostrarAvaliacaoEstrelas(0); // Exibe 0 estrelas se não houver avaliação
        // }

        if (clienteData.endereco) {
          setFieldValue("logradouro", clienteData.endereco.logradouro);
          setFieldValue("numero", clienteData.endereco.numero);
          setFieldValue("cep", formatCep(clienteData.endereco.cep));
          setFieldValue("bairro", clienteData.endereco.bairro);
          setFieldValue("cidade", clienteData.endereco.cidade);
          setFieldValue("estado", clienteData.endereco.estado);
          setFieldValue("complemento", clienteData.endereco.complemento);
        } else {
          console.error("Endereço não encontrado para o ID fornecido.");
        }
      }
    } catch (error) {
      console.error("Erro ao buscar os dados do cliente:", error);
    }
  }

   // Função para controlar os modais de confirmação
   function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }

  function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }
  
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

  // Botões de cancelamento para fechar modais
  document.querySelectorAll(".btn-no").forEach((button) => {
    button.addEventListener("click", (event) => {
      const modalId = event.target.closest(".modal").id;
      closeModal(modalId);
    });
  });

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

  function mostrarAvaliacaoEstrelas(pontuacao) {
    const avaliacaoElement = document.getElementById("avaliacao");
    avaliacaoElement.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.classList.add("star");
        if (i <= pontuacao) {
            star.classList.add("filled");
            star.innerHTML = "★";
        } else {
            star.innerHTML = "☆";
        }
        avaliacaoElement.appendChild(star);
    }
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

  // Função para mostrar ou esconder ícones de cadeado
  function toggleLockIcons(formId, show) {
    const lockIcons = document.querySelectorAll(`#${formId} .lock-icon`);
    lockIcons.forEach((lockIcon) => {
      lockIcon.style.display = show ? "inline" : "none";
    });
  }

  // Função para alternar a edição de "Dados Pessoais"
  function togglePersonalEditing() {
    isEditingPersonal = !isEditingPersonal; // Alterna o estado de edição
    
    if (isEditingPersonal) {
        // Seleciona todos os inputs e selects dentro do formulário
        document.querySelectorAll("#personalForm input, #personalForm select").forEach((field) => {
            field.disabled = false; // Habilita os campos de Dados Pessoais
        });
        document.getElementById("saveButton").disabled = false; // Habilita o botão de salvar de Dados Pessoais
        toggleLockIcons("personalForm", true); // Mostra ícones de cadeado para Dados Pessoais
    } else {
        // Desabilita todos os inputs e selects do formulário
        document.querySelectorAll("#personalForm input, #personalForm select").forEach((field) => {
            field.disabled = true; // Desabilita os campos de Dados Pessoais
        });
        document.getElementById("saveButton").disabled = true; // Desabilita o botão de salvar de Dados Pessoais
        toggleLockIcons("personalForm", false); // Esconde ícones de cadeado para Dados Pessoais
    }
}


  // Função para alternar a edição de "Dados de Endereço"
  function toggleAddressEditing() {
    isEditingAddress = !isEditingAddress; // Alterna o estado de edição
    if (isEditingAddress) {
      document.querySelectorAll("#addressForm input").forEach((field) => {
        field.disabled = false; // Habilita os campos de Dados de Endereço
      });
      document.getElementById("saveButtonAddress").disabled = false; // Habilita o botão de salvar de Endereço
      toggleLockIcons("addressForm", true); // Mostra ícones de cadeado para Dados de Endereço
    } else {
      document.querySelectorAll("#addressForm input").forEach((field) => {
        field.disabled = true; // Desabilita os campos de Dados de Endereço
      });
      document.getElementById("saveButtonAddress").disabled = true; // Desabilita o botão de salvar de Endereço
      toggleLockIcons("addressForm", false); // Esconde ícones de cadeado para Dados de Endereço
    }
  }

  // Vincula os eventos de clique aos botões de edição de cada formulário
  document
    .getElementById("editIconPessoal")
    .addEventListener("click", togglePersonalEditing);
  document
    .getElementById("editIconAdress")
    .addEventListener("click", toggleAddressEditing);

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

  document.addEventListener("DOMContentLoaded", function () {
    let avaliacaoSelecionada = 0; // Variável para armazenar a avaliação atual
  
    // Seleciona todas as estrelas e adiciona um evento de clique a cada uma
    document.querySelectorAll(".star-rating .star").forEach(star => {
      star.addEventListener("click", function () {
        avaliacaoSelecionada = parseInt(this.getAttribute("data-value")); // Captura o valor da estrela clicada
        atualizarEstrelas(avaliacaoSelecionada); // Atualiza a exibição das estrelas
      });
    });
  
    // Função para atualizar a exibição das estrelas com base na avaliação
    function atualizarEstrelas(pontuacao) {
      document.querySelectorAll(".star-rating .star").forEach(star => {
        // Preenche ou desmarca as estrelas com base no valor de pontuação
        if (parseInt(star.getAttribute("data-value")) <= pontuacao) {
          star.classList.add("filled"); // Marca estrela como preenchida
        } else {
          star.classList.remove("filled"); // Remove marcação de preenchido
        }
      });
    }
  });
  
  function formatTelefoneS(telefone) {
    if (!telefone) return "";
    
    // Remove todos os caracteres não numéricos (parênteses, traços, espaços, etc.)
    const cleaned = telefone.replace(/\D/g, ""); 
    
    // Verifica se o número tem o formato correto: 11 98765 4321
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/); 
    if (match) {
      return `${match[1]}${match[2]}${match[3]}`; // Retorna o telefone no formato: "XX XXXXX XXXX"
    }
    
    return telefone; // Retorna o valor original caso não corresponda ao formato esperado
  }
  
  


// Função para obter a avaliação e incluir no envio de dados ao backend
async function updatePersonalData(event) {
  event.preventDefault();
  console.log("Atualizando dados pessoais..."); // Verifique se a função está sendo chamada

  undoStack.push(JSON.parse(JSON.stringify(clienteData)));
  redoStack = [];

  // Inclui a avaliação selecionada no objeto updatedData
  const updatedData = {
    nome: document.getElementById("nome").value || clienteData.nome,
    email: document.getElementById("email").value || clienteData.email,
    instagram: document.getElementById("instagram").value || clienteData.instagram,
    telefone: parseInt(formatTelefoneS(document.getElementById("telefone").value)) || clienteData.telefone,
    genero: document.getElementById("genero").value || clienteData.genero,
    indicacao: document.getElementById("indicacao").value || clienteData.indicacao,
    cpf: document.getElementById("cpf").value || clienteData.cpf,
    avaliacao: clienteData.avaliacao// Inclui a avaliação selecionada
  };

  try {
    const response = await fetch(
      `http://localhost:8080/usuarios/${idUsuario}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (response.ok) {
      clienteData = { ...clienteData, ...updatedData };
      // localStorage.setItem("avaliacao", avaliacaoSelecionada); // Armazena no localStorage
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

document.getElementById("cep").addEventListener("blur", async function () {
  const cep = this.value.replace(/\D/g, ""); // Remove qualquer caracter não numérico

  if (cep.length === 8) {
    await buscarEnderecoPorCep(cep);
  } else {
    showNotification("CEP inválido. Verifique e tente novamente.", true);
  }
});


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

    undoStack.push(JSON.parse(JSON.stringify(clienteData.endereco)));
    redoStack = [];

    try {
      const response = await fetch(
        `http://localhost:8080/api/enderecos/${idEndereco}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedAddress),
        }
      );

      if (response.ok) {
        clienteData.endereco = updatedAddress;
        showNotification("Endereço atualizado com sucesso!");
        updateUndoRedoButtons();
        toggleAddressEditing(); // Desabilita edição após salvar
      } else {
        showNotification("Erro ao atualizar o endereço.", true);
      }
    } catch (error) {
      console.error("Erro ao enviar os dados atualizados:", error);
      showNotification("Erro ao atualizar o endereço.", true);
    }
  }

  function undoAction() {
    if (undoStack.length > 0) {
      const lastData = undoStack.pop();
      redoStack.push(JSON.parse(JSON.stringify(clienteData)));

      setFieldValue("nome", lastData.nome);
      setFieldValue("email", lastData.email);
      setFieldValue("instagram", lastData.instagram);
      setFieldValue("telefone", lastData.telefone);
      setFieldValue("genero", lastData.genero);
      setFieldValue("indicacao", lastData.indicacao);
      setFieldValue("cpf", lastData.cpf);

      if (lastData.endereco) {
        setFieldValue("logradouro", lastData.endereco.logradouro);
        setFieldValue("numero", lastData.endereco.numero);
        setFieldValue("cep", lastData.endereco.cep);
        setFieldValue("bairro", lastData.endereco.bairro);
        setFieldValue("cidade", lastData.endereco.cidade);
        setFieldValue("estado", lastData.endereco.estado);
        setFieldValue("complemento", lastData.endereco.complemento);
      }

      clienteData = lastData;
      showNotification("Alterações desfeitas.");
      updateUndoRedoButtons();
    } else {
      showNotification("Nenhuma alteração para desfazer.", true);
    }
  }

  function redoAction() {
    if (redoStack.length > 0) {
      const lastRedoData = redoStack.pop();
      undoStack.push(JSON.parse(JSON.stringify(clienteData)));

      setFieldValue("nome", lastRedoData.nome);
      setFieldValue("email", lastRedoData.email);
      setFieldValue("instagram", lastRedoData.instagram);
      setFieldValue("telefone", lastRedoData.telefone);
      setFieldValue("genero", lastRedoData.genero);
      setFieldValue("indicacao", lastRedoData.indicacao);
      setFieldValue("cpf", lastRedoData.cpf);

      if (lastRedoData.endereco) {
        setFieldValue("logradouro", lastRedoData.endereco.logradouro);
        setFieldValue("numero", lastRedoData.numero);
        setFieldValue("cep", lastRedoData.endereco.cep);
        setFieldValue("bairro", lastRedoData.endereco.bairro);
        setFieldValue("cidade", lastRedoData.endereco.cidade);
        setFieldValue("estado", lastRedoData.endereco.estado);
        setFieldValue("complemento", lastRedoData.endereco.complemento);
      }

      clienteData = lastRedoData;
      showNotification("Alterações refeitas.");
      updateUndoRedoButtons();
    } else {
      showNotification("Nenhuma alteração para refazer.", true);
    }
  }

  function updateUndoRedoButtons() {
    const btnUndo = document.getElementById("btn-undo");
    const btnRedo = document.getElementById("btn-redo");

    btnUndo.style.display = undoStack.length > 0 ? "inline" : "none";
    btnRedo.style.display = redoStack.length > 0 ? "inline" : "none";

    clearTimeout(undoRedoTimeout);

    // Se houver ações de desfazer/refazer, oculta os botões após 10 segundos
    if (undoStack.length > 0 || redoStack.length > 0) {
      undoRedoTimeout = setTimeout(() => {
        btnUndo.style.display = "none";
        btnRedo.style.display = "none";
      }, 10000); // 10 segundos
    }
  }

  document
    .getElementById("personalForm")
    .addEventListener("submit", updatePersonalData);
  document
    .getElementById("addressForm")
    .addEventListener("submit", updateAddressData);

  document.getElementById("btn-undo").addEventListener("click", undoAction);
  document.getElementById("btn-redo").addEventListener("click", redoAction);

  updateUndoRedoButtons(); // Atualiza os botões ao carregar a página
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
  window.location.href = `../agendamentos-cliente/agendamento-clientes.html?idUsuario=${idUsuario}`;
});

anamneseBtn.addEventListener("click", function () {
  // Redireciona para a página de anamnese com o idUsuario na URL
  window.location.href = `../anamnese-cliente/anamnese-clientes.html?idUsuario=${idUsuario}`;
});

// Selecionando os elementos do formulário
const cepInput = document.querySelector("#cep");
const logradouroInput = document.querySelector("#logradouro");
const bairroInput = document.querySelector("#bairro");
const cidadeInput = document.querySelector("#cidade");
const estadoInput = document.querySelector("#estado");

// Função para buscar o endereço pelo CEP
const buscaEndereco = async (cep) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      alert("CEP não encontrado.");
      return;
    }

    // Populando os campos com os dados recebidos
    logradouroInput.value = data.logradouro;
    bairroInput.value = data.bairro;
    cidadeInput.value = data.localidade;
    estadoInput.value = data.uf;
  } catch (error) {
    console.error("Erro ao buscar o endereço:", error);
  }
};

// Evento que detecta quando o usuário terminou de digitar o CEP
cepInput.addEventListener("blur", () => {
  const cep = cepInput.value.replace(/\D/g, ""); // Remove qualquer caractere que não seja número
  if (cep.length === 8) {
    // Verifica se o CEP tem 8 dígitos
    buscaEndereco(cep);
  } else {
    alert("Por favor, insira um CEP válido.");
  }
});

// Função para definir o valor de um campo de entrada
function setFieldValue(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (!field) {
    console.error(`Campo com id "${fieldId}" não foi encontrado.`);
    return;
  }

  if (!value || value === "") {
    field.value = "Não há registro desse dado*";
    field.style.color = "red"; // Muda a cor do texto para vermelho para indicar ausência de dado
  } else {
    field.value = value;
    field.style.color = ""; // Reseta a cor para o padrão
  }
}

document.addEventListener("DOMContentLoaded", async function () {
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

  const enviarEmailButton = document.getElementById("enviarEmailButton");
  const emailInput = document.getElementById("email"); // Pegar o input do email

  let clienteData = {}; // Variável para armazenar os dados do cliente
  console.log(clienteData);

  // Verifique se o idUsuario está nos parâmetros da URL ou no localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const idUsuario =
    urlParams.get("idUsuario") || localStorage.getItem("idUsuario");
  const clienteNome = localStorage.getItem("clienteNome");

  // Se o nome do cliente estiver armazenado, exibe no cabeçalho
  if (clienteNome) {
    document.querySelector(
      "header h1"
    ).textContent = `Mais informações de: ${clienteNome}`;
  }

  // Função para capturar o valor do campo de email e enviar o e-mail
  enviarEmailButton.addEventListener("click", function () {
    // Captura o email diretamente do campo de input
    const emailCliente = emailInput.value;
    const nomeCliente = clienteData.nome || "Cliente";

    // Verificar se o campo de email tem um valor
    if (!emailCliente) {
      showNotification("O cliente não possui um e-mail cadastrado.", true);
      return;
    }

    // Mensagem de feedback
    const mensagem =
      "Por favor, nos dê seu feedback sobre os nossos serviços preenchendo o formulário no link abaixo.";

    // Chama a função para enviar o e-mail
    enviarEmail(emailCliente, nomeCliente, mensagem);
  });

  // Função para enviar o e-mail
  async function enviarEmail(email, nome, mensagem) {
    try {
      const response = await fetch("http://127.0.0.1:5000/enviar-email", {
        // Rota do servidor Flask para enviar e-mail
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // E-mail do destinatário
          nome: nome, // Nome do cliente
          mensagem: mensagem, // Mensagem personalizada
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`Email enviado com sucesso para ${email}`);
        showNotification("E-mail enviado com sucesso!");
      } else {
        console.error("Erro ao enviar o e-mail:", data.error);
        showNotification("Erro ao enviar o e-mail.", true);
      }
    } catch (error) {
      console.error("Erro ao enviar o e-mail:", error);
      showNotification("Erro ao enviar o e-mail.", true);
    }
  }
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
      const response = await fetch(`http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`, {
          method: "GET",
      });

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

async function carregarImagem3() {
  // Captura o valor do CPF a partir da URL
  const urlParams = new URLSearchParams(window.location.search);
  const cpf = urlParams.get("cpf"); // Obtém o valor do parâmetro 'cpf'
  const perfilClienteImage = document.getElementById("perfilClienteImage");

  if (!cpf) {
      console.log("CPF não encontrado na URL.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:8080/usuarios/busca-imagem-usuario-cpf/${cpf}`, {
          method: "GET",
      });

      if (response.ok) {
          const blob = await response.blob(); // Recebe a imagem como Blob
          const imageUrl = URL.createObjectURL(blob); // Cria uma URL temporária para o Blob

          // Define a URL da imagem carregada como src do img
          perfilClienteImage.src = imageUrl;
          perfilClienteImage.alt = "Foto do usuário";
          perfilClienteImage.style.width = "34vh";
          perfilClienteImage.style.height = "34vh";
          perfilClienteImage.style.borderRadius = "20px";
      } else {
          console.log("Imagem não encontrada para o CPF informado.");
      }
  } catch (error) {
      console.error("Erro ao buscar a imagem:", error);
  }
}


window.onload = function () {
  carregarImagem2();
  carregarImagem3();
};





document.addEventListener("DOMContentLoaded", function () {
  const tooltips = document.querySelectorAll(
    ".tooltip15, .tooltip16, .tooltip17, .tooltip18, .tooltip19, .tooltip20"
  );

  tooltips.forEach((tooltip) => {
    const targetButton = tooltip.previousElementSibling;

    targetButton.addEventListener("mouseenter", () => {
      tooltip.style.visibility = "hidden"; // Oculta temporariamente para cálculo
      tooltip.style.display = "block"; // Exibe para cálculo
      positionTooltip(tooltip, targetButton);
      tooltip.style.visibility = "visible"; // Mostra após posicionamento
    });

    targetButton.addEventListener("mouseleave", () => {
      tooltip.style.display = "none"; // Oculta quando sai do hover
    });

    window.addEventListener("resize", () => {
      if (tooltip.style.display === "block") {
        positionTooltip(tooltip, targetButton); // Recalcula posição em redimensionamento
      }
    });
  });

  function positionTooltip(tooltip, target) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Centraliza horizontalmente e posiciona acima do botão
    const topPosition = targetRect.top - tooltipRect.height - 3;
    const leftPosition =
      targetRect.left + targetRect.width / 0 - tooltipRect.width / 0;

    tooltip.style.top = `${topPosition + window.scrollY}px`;
    tooltip.style.left = `${leftPosition + window.scrollX}px`;
  }
});
