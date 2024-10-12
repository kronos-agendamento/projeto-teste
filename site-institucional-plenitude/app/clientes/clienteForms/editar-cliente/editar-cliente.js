document.addEventListener("DOMContentLoaded", async function () {
    let isEditing = false;
    let clienteData = {}; // Variável para armazenar os dados do cliente
    let originalData = {}; // Para armazenar os dados originais do cliente
    let undoStack = []; // Stack para desfazer ações
    let redoStack = []; // Stack para refazer ações
    let undoRedoTimeout; // Variável para o timeout

    const urlParams = new URLSearchParams(window.location.search);
    const idUsuario = urlParams.get("idUsuario") || localStorage.getItem("idUsuario");
    const idEndereco = urlParams.get("idEndereco");
    const clienteNome = localStorage.getItem("clienteNome");
    const agendamentoBtn = document.getElementById("agendamentoBtn");

    if (agendamentoBtn) {
        agendamentoBtn.addEventListener("click", function () {
            window.location.href = `../agendamentos-cliente/agendamentos-clientes.html?idUsuario=${idUsuario}`;
        });
    }

    if (clienteNome) {
        document.querySelector("header h1").textContent = `Mais informações de: ${clienteNome}`;
    }

    if (idUsuario) {
        try {
            clienteData = await fetchUsuarioPorId(idUsuario);
            if (clienteData) {
                originalData = JSON.parse(JSON.stringify(clienteData));

                setFieldValue("codigo", clienteData.idUsuario);
                setFieldValue("nome", clienteData.nome);
                setFieldValue("nascimento", formatDate(clienteData.dataNasc));
                setFieldValue("instagram", clienteData.instagram);
                setFieldValue("cpf", clienteData.cpf);
                setFieldValue("telefone", clienteData.telefone);
                setFieldValue("genero", clienteData.genero);
                setFieldValue("email", clienteData.email);
                setFieldValue("indicacao", clienteData.indicacao);

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
            }
        } catch (error) {
            console.error("Erro ao buscar os dados do cliente:", error);
        }
    }

    async function fetchUsuarioPorId(idUsuario) {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`);
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

    // Função para mostrar ícones de cadeado apenas para os campos do formulário ativo
    function toggleLockIcons(formId, show) {
        const lockIcons = document.querySelectorAll(`#${formId} .lock-icon`);
        lockIcons.forEach((lockIcon) => {
            lockIcon.style.display = show ? "inline" : "none";
        });
    }

    // Função para habilitar apenas os campos de "Dados Pessoais"
    function enablePersonalEditing() {
        document.querySelectorAll("#personalForm input").forEach((field) => {
            field.disabled = false; // Habilita os campos de Dados Pessoais
        });

        document.querySelectorAll("#addressForm input").forEach((field) => {
            field.disabled = true; // Desabilita os campos de Dados de Endereço
        });

        document.getElementById("saveButton").disabled = false; // Habilita o botão de salvar de Dados Pessoais
        document.getElementById("saveButtonAddress").disabled = true; // Desabilita o botão de salvar de Endereço

        // Mostra os ícones de cadeado apenas para o formulário de "Dados Pessoais"
        toggleLockIcons("personalForm", true);
        toggleLockIcons("addressForm", false);
    }

    // Função para habilitar apenas os campos de "Dados de Endereço"
    function enableAddressEditing() {
        document.querySelectorAll("#addressForm input").forEach((field) => {
            field.disabled = false; // Habilita os campos de Dados de Endereço
        });

        document.querySelectorAll("#personalForm input").forEach((field) => {
            field.disabled = true; // Desabilita os campos de Dados Pessoais
        });

        document.getElementById("saveButton").disabled = true; // Desabilita o botão de salvar de Dados Pessoais
        document.getElementById("saveButtonAddress").disabled = false; // Habilita o botão de salvar de Endereço

        // Mostra os ícones de cadeado apenas para o formulário de "Dados de Endereço"
        toggleLockIcons("addressForm", true);
        toggleLockIcons("personalForm", false);
    }

    // Função de alternância de edição - não utilizada mais diretamente
    window.enableEditing = function () {
        isEditing = !isEditing;
        const lockIcons = document.querySelectorAll(".lock-icon");
        const fields = document.querySelectorAll("#personalForm input, #addressForm input");
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

    // Vincula os eventos de clique aos botões de edição de cada formulário
    document.getElementById("editIconPessoal").addEventListener("click", enablePersonalEditing);
    document.getElementById("editIconAdress").addEventListener("click", enableAddressEditing);

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

        undoStack.push(JSON.parse(JSON.stringify(clienteData)));
        redoStack = [];

        const updatedData = {
            nome: document.getElementById("nome").value || clienteData.nome,
            email: document.getElementById("email").value || clienteData.email,
            instagram: document.getElementById("instagram").value || clienteData.instagram,
            telefone: parseInt(document.getElementById("telefone").value) || clienteData.telefone,
            genero: document.getElementById("genero").value || clienteData.genero,
            indicacao: document.getElementById("indicacao").value || clienteData.indicacao,
            cpf: document.getElementById("cpf").value || clienteData.cpf,
        };

        try {
            const response = await fetch(`http://localhost:8080/usuarios/${idUsuario}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                clienteData = updatedData;
                showNotification("Dados atualizados com sucesso!");
                updateUndoRedoButtons();
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
            logradouro: document.getElementById("logradouro").value || clienteData.endereco.logradouro,
            numero: document.getElementById("numero").value || clienteData.endereco.numero,
            cep: document.getElementById("cep").value || clienteData.endereco.cep,
            bairro: document.getElementById("bairro").value || clienteData.endereco.bairro,
            cidade: document.getElementById("cidade").value || clienteData.endereco.cidade,
            estado: document.getElementById("estado").value || clienteData.endereco.estado,
            complemento: document.getElementById("complemento").value || clienteData.endereco.complemento,
        };

        undoStack.push(JSON.parse(JSON.stringify(clienteData.endereco)));
        redoStack = [];

        try {
            const response = await fetch(`http://localhost:8080/api/enderecos/${idEndereco}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedAddress),
            });

            if (response.ok) {
                clienteData.endereco = updatedAddress;
                showNotification("Endereço atualizado com sucesso!");
                updateUndoRedoButtons();
                window.enableEditing();
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

    document.getElementById("personalForm").addEventListener("submit", updatePersonalData);
    document.getElementById("addressForm").addEventListener("submit", updateAddressData);

    document.getElementById("btn-undo").addEventListener("click", undoAction);
    document.getElementById("btn-redo").addEventListener("click", redoAction);

    updateUndoRedoButtons(); // Atualiza os botões ao carregar a página
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
