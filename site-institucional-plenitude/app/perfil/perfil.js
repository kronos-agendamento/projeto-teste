function showNotification(message, isError = false) {
  console.log("Exibindo notificação:", message, isError); // Adiciona um log para verificar
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");

  if (!notification || !notificationMessage) {
    console.error("Elementos de notificação não encontrados no DOM.");
    return; // Evita erros se os elementos não existirem
  }

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

document.addEventListener("DOMContentLoaded", () => {

  let isEditing = false;
  let isEditingEmpresa = false;

  // Função para alternar a edição dos campos do formulário de usuário
  function toggleEditing() {
    isEditing = !isEditing;
    const lockIcons = document.querySelectorAll(".lock-icon");
    const fields = document.querySelectorAll("#personalForm input, #personalForm select");
    const saveButton = document.getElementById("save-usuario-button");

    console.log("Edição de usuário ativada:", isEditing);

    if (isEditing) {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "inline"; // Exibe ícones de cadeado
      });

      fields.forEach((field) => {
        const lockIcon = document.getElementById(`${field.id}-lock`);
        if (lockIcon && lockIcon.textContent === "🔓") {
          field.disabled = false; // Habilita apenas campos que podem ser editados
        }
      });

      // Habilitar o campo de senha se estiver desbloqueado
      const senhaLockIcon = document.getElementById("senha-lock");
      const senhaField = document.getElementById("senha");
      if (senhaLockIcon && senhaLockIcon.textContent === "🔓") {
        senhaField.disabled = false; // Habilita o campo de senha
      }

      saveButton.disabled = false; // Habilita o botão de salvar
    } else {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "none"; // Oculta ícones de cadeado
      });

      fields.forEach((field) => {
        field.disabled = true; // Desabilita todos os campos
      });

      saveButton.disabled = true; // Desabilita o botão de salvar
    }
  }

  // Função para alternar a edição dos campos do formulário de empresa
  function toggleEditingEmpresa() {
    isEditingEmpresa = !isEditingEmpresa;
    const lockIcons = document.querySelectorAll("#empresaForm .lock-icon");
    const fields = document.querySelectorAll("#empresaForm input, #empresaForm select");
    const saveButton = document.getElementById("save-empresa-button");

    if (isEditingEmpresa) {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "inline"; // Exibe ícones de cadeado
      });

      fields.forEach((field) => {
        const lockIcon = document.getElementById(`${field.id}-lock`);
        if (lockIcon && lockIcon.textContent === "🔓") {
          field.disabled = false; // Habilita apenas campos que podem ser editados
        }
      });

      saveButton.disabled = false; // Habilita o botão de salvar
    } else {
      lockIcons.forEach((lockIcon) => {
        lockIcon.style.display = "none"; // Oculta ícones de cadeado
      });

      fields.forEach((field) => {
        field.disabled = true; // Desabilita todos os campos
      });

      saveButton.disabled = true; // Desabilita o botão de salvar
    }
  }



  // Adicionar o event listener ao botão de editar dados pessoais
  const editIconUsuario = document.getElementById("editIconUsuario");
  if (editIconUsuario) {
    editIconUsuario.addEventListener("click", toggleEditing);
  }

  // Adicionar o event listener ao botão de editar dados empresariais
  const editIconEmpresa = document.getElementById("editIconEmpresa");
  if (editIconEmpresa) {
    editIconEmpresa.addEventListener("click", toggleEditingEmpresa);
  }




  // Função para salvar os dados da empresa
  async function atualizarEmpresa() {
    try {
      const cpf = localStorage.getItem("cpf");
      const empresaDTO = {
        nome: document.getElementById("empresa").value,
        cnpj: document.getElementById("cnpj").value.replace(/\D/g, ""), // Remove a máscara do CNPJ
        telefone: formatPhoneNumberToLong(document.getElementById("telefone-empresa").value),
        endereco: {
          cep: document.getElementById("cep").value.replace(/\D/g, ""), // Remove a máscara do CEP
          logradouro: document.getElementById("logradouro").value,
          numero: document.getElementById("numero").value,
          bairro: document.getElementById("bairro").value,
          cidade: document.getElementById("cidade-empresa").value,
          estado: document.getElementById("estado-empresa").value,
          complemento: document.getElementById("complemento").value,
        },
        horarioFuncionamento: {
          diaInicio: document.getElementById("diaInicio").value,
          diaFim: document.getElementById("diaFim").value,
          horarioAbertura: document.getElementById("horaInicio").value,
          horarioFechamento: document.getElementById("horaFim").value,
        },
      };

      const response = await fetch(`http://localhost:8080/api/empresas/${cpf}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaDTO),
      });
      console.log("Função showNotification foi chamada.");

      if (response.ok) {
        showNotification("Dados da empresa atualizados com sucesso!");
      } else {
        throw new Error(`Erro ao atualizar empresa: ${response.status}`);
      }

    } catch (error) {
      console.error("Erro ao atualizar a empresa:", error);
      showNotification("Erro ao atualizar dados da empresa!", true);
    }

    toggleEditingEmpresa(); // Desativa os campos após salvar
  }

  // Função auxiliar para formatar o número de telefone para o formato correto
  function formatPhoneNumberToLong(phoneNumber) {
    if (!phoneNumber) return null;
    const cleaned = String(phoneNumber).replace(/\D/g, ""); // Remove caracteres não numéricos
    return parseInt(cleaned, 10); // Converte para número
  }

  // Adicionar o event listener ao botão de salvar dados pessoais
  const saveUsuarioButton = document.getElementById("save-usuario-button");
  if (saveUsuarioButton) {
    saveUsuarioButton.addEventListener("click", async function () {
      await atualizarUsuario();
    });
  }

  // Adicionar o event listener ao botão de salvar dados empresariais
  const saveEmpresaButton = document.getElementById("save-empresa-button");
  if (saveEmpresaButton) {
    saveEmpresaButton.addEventListener("click", async function () {
      await atualizarEmpresa();
    });
  }

  // Função para carregar os dados do usuário e empresa
  async function carregarDados() {
    const cpf = localStorage.getItem("cpf");
    if (cpf) {
      const userData = await fetchUserDataByCpf(cpf);
      if (userData) {
        // Preencher dados pessoais
        document.getElementById("nome").value = userData.nome || "";
        document.getElementById("nascimento").value = userData.dataNasc || "";
        document.getElementById("telefone").value = formatPhoneNumber(userData.telefone || "");
        document.getElementById("cpf").value = userData.cpf || "";
        document.getElementById("genero").value = userData.genero || "";
        document.getElementById("instagram").value = userData.instagram || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("senha").value = userData.senha || "";

        // Preencher dados da empresa, se existirem
        if (userData.empresa) {
          document.getElementById("empresa").value = userData.empresa.nome || "";
          document.getElementById("cnpj").value = userData.empresa.cnpj || "";
          document.getElementById("telefone-empresa").value = userData.empresa.telefone || "";
          document.getElementById("cep").value = userData.empresa.endereco.cep || "";
          document.getElementById("logradouro").value = userData.empresa.endereco.logradouro || "";
          document.getElementById("numero").value = userData.empresa.endereco.numero || "";
          document.getElementById("bairro").value = userData.empresa.endereco.bairro || "";
          document.getElementById("cidade-empresa").value = userData.empresa.endereco.cidade || "";
          document.getElementById("estado-empresa").value = userData.empresa.endereco.estado || "";
          document.getElementById("complemento").value = userData.empresa.endereco.complemento || "";
          document.getElementById("diaInicio").value = userData.empresa.horarioFuncionamento.diaInicio || "";
          document.getElementById("diaFim").value = userData.empresa.horarioFuncionamento.diaFim || "";
          document.getElementById("horaInicio").value = userData.empresa.horarioFuncionamento.horarioAbertura || "";
          document.getElementById("horaFim").value = userData.empresa.horarioFuncionamento.horarioFechamento || "";
        }
      }
    }
  }

  carregarDados(); // Carregar os dados do usuário e empresa ao iniciar a página
});


// Função para buscar os dados do usuário por CPF
async function fetchUserDataByCpf(cpf) {
  try {
    const response = await fetch(`http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados do usuário: ${response.status}`);
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }
  return null;
}

// Carregar os dados do usuário quando o CPF estiver disponível
async function carregarDadosUsuario() {
  const cpf = localStorage.getItem("cpf");
  if (cpf) {
    const userData = await fetchUserDataByCpf(cpf);
    if (userData) {
      document.getElementById("nome").value = userData.nome || "";
      document.getElementById("nascimento").value = userData.dataNasc || "";
      document.getElementById("telefone").value = formatPhoneNumber(userData.telefone || ""); // Garantindo que seja string
      document.getElementById("cpf").value = userData.cpf || "";
      document.getElementById("genero").value = userData.genero || "";
      document.getElementById("instagram").value = userData.instagram || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("senha").value = userData.senha || "";
    }
  }
}

carregarDadosUsuario(); // Chamar a função para carregar os dados do usuário

// Função para formatar o número de telefone para exibição
function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== "string") return ""; // Verificação adicional para garantir que seja string
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}




async function fetchUserDataByCpf(cpf) {
  try {
    const response = await fetch(
      `http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`
    );
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
      console.error(
        "Usuário não encontrado ou erro ao buscar dados do usuário."
      );
    }
  }

  function fillUserProfile(userData) {
    // Dados do usuário
    document.getElementById("nome").value = userData.nome || "";
    document.getElementById("nascimento").value = userData.dataNasc || "";
    document.getElementById("telefone").value = formatPhoneNumber(userData.telefone) || "";
    document.getElementById("cpf").value = userData.cpf || "";
    document.getElementById("genero").value = userData.genero || "";
    document.getElementById("instagram").value = userData.instagram || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("senha").value = userData.senha || "";

    // Verificar se os dados da empresa existem
    if (userData.empresa) {
      // Dados da empresa
      document.getElementById("empresa").value = userData.empresa.nome || "";
      document.getElementById("cnpj").value = userData.empresa.cnpj || "";
      document.getElementById("telefone-empresa").value = userData.empresa.telefone || "";

      // Endereço da empresa
      if (userData.empresa.endereco) {
        document.getElementById("cep").value = userData.empresa.endereco.cep || "";
        document.getElementById("logradouro").value = userData.empresa.endereco.logradouro || "";
        document.getElementById("numero").value = userData.empresa.endereco.numero || "";
        document.getElementById("bairro").value = userData.empresa.endereco.bairro || "";
        document.getElementById("cidade-empresa").value = userData.empresa.endereco.cidade || "";
        document.getElementById("estado-empresa").value = userData.empresa.endereco.estado || "";
        document.getElementById("complemento").value = userData.empresa.endereco.complemento || "";
      }

      // Horário de funcionamento
      if (userData.empresa.horarioFuncionamento) {
        document.getElementById("diaInicio").value = userData.empresa.horarioFuncionamento.diaInicio || "";
        document.getElementById("diaFim").value = userData.empresa.horarioFuncionamento.diaFim || "";
        document.getElementById("horaInicio").value = userData.empresa.horarioFuncionamento.horarioAbertura || "";
        document.getElementById("horaFim").value = userData.empresa.horarioFuncionamento.horarioFechamento || "";
      }
    } else {
      console.warn("Dados da empresa não encontrados.");
    }
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

  // document
  //   .getElementById("bloqueio-button")
  //   .addEventListener("click", async function () {
  //     console.log("Botão de bloqueio clicado!");
  //     const diaEscolhido = document.getElementById("diaEscolhido").value;
  //     const horaInicioBlock = document.getElementById("horaInicioBlock").value;
  //     const horaFimBlock = document.getElementById("horaFimBlock").value;
  //     const idUsuario = parseInt(localStorage.getItem("idUsuario"), 10);
  //     const data = {
  //       dia: diaEscolhido,
  //       horaInicio: horaInicioBlock,
  //       horaFim: horaFimBlock,
  //       usuarioId: idUsuario,
  //     };
  //     fetch("http://localhost:8080/api/agendamentos/bloquear", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log("Sucesso:", data);
  //         alert("Horário bloqueado com sucesso!");
  //       })
  //       .catch((error) => {
  //         console.error("Erro:", error);
  //         alert("Erro ao bloquear horário.");
  //       });
  //   });

  // Adiciona o event listener após o DOM estar carregado
  document
    .getElementById("save-usuario-button")
    .addEventListener("click", async function () {
      const cpf = localStorage.getItem("cpf");
      await atualizarUsuario();

    });

  document.getElementById("save-empresa-button").addEventListener("click", function () {
    // Capturar os valores dos inputs
    const nomeEmpresa = document.getElementById("empresa").value;
    const cnpj = document.getElementById("cnpj").value.replace(/[^\d]/g, ""); // Remove a máscara do CNPJ
    const telefone = document.getElementById("telefone-empresa").value.replace(/[^\d]/g, ""); // Remove a máscara do telefone
    const cep = document.getElementById("cep").value.replace(/[^\d]/g, ""); // Remove a máscara do CEP
    const logradouro = document.getElementById("logradouro").value;
    const numero = document.getElementById("numero").value;
    const complemento = document.getElementById("complemento").value;
    const bairro = document.getElementById("bairro").value;
    const cidade = document.getElementById("cidade-empresa").value;
    const estado = document.getElementById("estado-empresa").value;
    const diaInicio = document.getElementById("diaInicio").value;
    const diaFim = document.getElementById("diaFim").value;
    const horaInicio = document.getElementById("horaInicio").value;
    const horaFim = document.getElementById("horaFim").value;

    // Montar o objeto para enviar para a API
    const empresaData = {
      nome: nomeEmpresa,
      telefone: telefone,
      cnpj: cnpj,
      endereco: {
        logradouro: logradouro,
        cep: cep,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        numero: numero,
        complemento: complemento,
      },
      horarioFuncionamento: {
        diaInicio: diaInicio,
        diaFim: diaFim,
        horarioAbertura: horaInicio,
        horarioFechamento: horaFim,
      },
    };

    // Recuperar o CPF do localStorage
    const cpf = localStorage.getItem("cpf");

    if (!cpf) {
      alert("CPF não encontrado no localStorage.");
      return;
    }

    // Fazer requisição PATCH para o endpoint de atualização de empresa
    fetch(`http://localhost:8080/api/empresas/${cpf}`, {
      method: "PUT", // Alterado de "PUT" para "PATCH"
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresaData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro ao atualizar empresa: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Exibe mensagem de sucesso
        showNotification("Dados da empresa atualizados com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao atualizar a empresa:", error);

        // Exibe mensagem de erro
        showNotification("Erro ao atualizar dados da empresa!", true);
      });

    // Oculta a notificação após alguns segundos
    setTimeout(() => {
      document.getElementById("notification").classList.remove("show", "error");
    }, 5000); // Oculta a notificação após 5 segundos
  });


  function formatPhoneNumberToLong(phoneNumber) {
    if (!phoneNumber) return null;
    const cleaned = phoneNumber.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    return parseInt(cleaned, 10); // Converte para número
  }


  function salvarNomeLocalStorage() {
    const nome = document.getElementById("nome").value;
    if (nome) {
      localStorage.setItem("nome", nome);
    }
  }

  function exibirNomeUsuario() {
    const nome = localStorage.getItem("nome");
    if (nome) {
      document.getElementById("userName").textContent = nome;
    }
  }


  document.addEventListener("DOMContentLoaded", function () {
    exibirNomeUsuario();
  });

  async function atualizarUsuario(cpf) {
    try {
      const cpf = localStorage.getItem("cpf");
      const usuarioDTO = {
        nome: document.getElementById("nome").value,
        dataNasc: document.getElementById("nascimento").value,
        telefone: formatPhoneNumberToLong(document.getElementById("telefone").value),
        genero: document.getElementById("genero").value,
        instagram: document.getElementById("instagram").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
      };

      const usuarioResponse = await fetch(
        `http://localhost:8080/usuarios/atualizacao-usuario-por-cpf/${cpf}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioDTO),
        }
      );

      if (!usuarioResponse.ok) {
        throw new Error(`Erro ao atualizar usuário: ${usuarioResponse.status}`);
      }

      // Exibe mensagem de sucesso
      showNotification("Dados da usuário atualizados com sucesso!");

      // Atualizar localStorage
      localStorage.setItem('nome', usuarioDTO.nome)
      localStorage.setItem('instagram', usuarioDTO.instagram)

      // Atualizar a página
      setTimeout(function () {
        location.reload();
      }, 1000);



      console.log("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);

      // Exibe mensagem de erro
      showNotification("Erro ao atualizar dados do usuário!", true);
    }

    // Oculta a notificação após alguns segundos
    setTimeout(() => {
      document.getElementById("notification").style.display = "none";
    }, 5000); // Oculta a notificação após 5 segundos
  }

  const nome = localStorage.getItem("nome");
  const instagram = localStorage.getItem("instagram");


  if (nome && instagram) {
    document.getElementById("userName").textContent = nome;
    document.getElementById("userInsta").textContent = instagram;
  }

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
});

document.addEventListener("DOMContentLoaded", function () {
  // const profileImageInput = document.getElementById("profileImage");
  const confirmModal = document.getElementById("confirmModal");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");
  const closeButton = document.querySelector(".close");
  let selectedFile = null;

  // profileImageInput.addEventListener("change", function () {
  //   selectedFile = this.files[0];
  //   if (selectedFile) {
  //     confirmModal.style.display = "block";
  //   }
  // });

  // confirmButton.addEventListener("click", async function () {
  //   if (selectedFile) {
  //     const formData = new FormData();
  //     formData.append("foto", selectedFile);

  //     const cpf = localStorage.getItem("cpf");
  //     if (cpf) {
  //       try {
  //         const response = await fetch(
  //           `http://localhost:8080/usuarios/atualizacao-foto/${cpf}`,
  //           {
  //             method: "POST",
  //             body: formData,
  //           }
  //         );

  //         if (!response.ok) {
  //           throw new Error(`Erro ao atualizar foto: ${response.status}`);
  //         }

  //         const updatedUser = await response.json();

  //         document.getElementById("notification-message").textContent =
  //           "Foto atualizada com sucesso!";
  //         document.getElementById("notification").style.display = "block";
  //       } catch (error) {
  //         console.error("Erro ao atualizar foto:", error);
  //         alert("Erro ao atualizar foto.");
  //       }
  //     } else {
  //       alert("CPF não encontrado.");
  //     }
  //   }
  //   confirmModal.style.display = "none";
  // });

  // cancelButton.addEventListener("click", function () {
  //   confirmModal.style.display = "none";
  // });

  // closeButton.addEventListener("click", function () {
  //   confirmModal.style.display = "none";
  // });

  // window.addEventListener("click", function (event) {
  //   if (event.target == confirmModal) {
  //     confirmModal.style.display = "none";
  //   }
  // });
});
document.addEventListener("DOMContentLoaded", function () {
  // Função para capitalizar a primeira letra de cada palavra
  function capitalizeWords(input) {
    const words = input.split(" ");
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 0) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
      }
    }
    return words.join(" ");
  }

  // Função para formatar CNPJ
  function formatCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]/g, ""); // Remove tudo que não é número
    if (cnpj.length > 14) cnpj = cnpj.substr(0, 14); // Limita a 14 dígitos
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }

  // Função para formatar CEP
  function formatCEP(cep) {
    cep = cep.replace(/[^\d]/g, ""); // Remove tudo que não é número
    if (cep.length > 8) cep = cep.substr(0, 8); // Limita a 8 dígitos
    return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  }

  // Função para validar campos sem números
  function removeNumbers(input) {
    return input.replace(/\d/g, ""); // Remove todos os números
  }

  // Validação para o campo "Nome da Empresa"
  const empresaInput = document.getElementById("empresa");
  empresaInput.addEventListener("input", function () {
    this.value = capitalizeWords(this.value);
  });

  // Validação para o campo "CNPJ"
  const cnpjInput = document.getElementById("cnpj");
  cnpjInput.addEventListener("input", function () {
    this.value = formatCNPJ(this.value);
  });

  // Validação para o campo "CEP"
  const cepInput = document.getElementById("cep");
  cepInput.addEventListener("input", function () {
    this.value = formatCEP(this.value);
  });

  // Validações para os campos "Logradouro", "Bairro", "Cidade", e "Estado"
  const logradouroInput = document.getElementById("logradouro");
  logradouroInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  const bairroInput = document.getElementById("bairro");
  bairroInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  const cidadeInput = document.getElementById("cidade-empresa"); // Verifique o ID correto no HTML
  if (cidadeInput) {
    cidadeInput.addEventListener("input", function () {
      this.value = capitalizeWords(removeNumbers(this.value));
    });
  } else {
    console.warn("Elemento 'cidade-empresa' não encontrado.");
  }

  const estadoInput = document.getElementById("estado-empresa");
  estadoInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  document.addEventListener("DOMContentLoaded", function () {
    // Função para popular um select
    function populateSelect(selectId, value) {
      const select = document.getElementById(selectId);
      if (select) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      } else {
        console.warn(`Elemento com ID ${selectId} não encontrado.`);
      }
    }

    // Mockar dias da semana no select
    const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    dias.forEach((dia) => {
      populateSelect("diasInicio", dia);
      populateSelect("diasFim", dia);
    });

    // Mockar horários de funcionamento no select
    for (let i = 0; i < 24; i++) {
      const hora = i < 10 ? `0${i}:00` : `${i}:00`;
      populateSelect("horarioInicio", hora);
      populateSelect("horarioFim", hora);
    }
  });



  document.addEventListener("DOMContentLoaded", function () {
    const nomeInput = document.getElementById("nome");

    nomeInput.addEventListener("input", function () {
      const words = nomeInput.value.split(" ");
      for (let i = 0; i < words.length; i++) {
        if (words[i].length > 0) {
          words[i] =
            words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
        }
      }
      nomeInput.value = words.join(" ");
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const telefoneInput = document.getElementById("telefone");

    const formatPhoneNumber = (value) => {
      if (!value) return value;
      const phoneNumber = value.replace(/[^\d]/g, "");
      const phoneNumberLength = phoneNumber.length;

      if (phoneNumberLength < 3) return phoneNumber;
      if (phoneNumberLength < 7) {
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
      }
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
        2,
        7
      )}-${phoneNumber.slice(7, 11)}`;
    };

    const handlePhoneNumberInput = (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
    };

    telefoneInput.addEventListener("input", handlePhoneNumberInput);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const instagramInput = document.getElementById("instagram");

    instagramInput.addEventListener("input", (event) => {
      let value = event.target.value;

      // Adicionar '@' no início se não estiver presente
      if (!value.startsWith("@")) {
        value = "@" + value;
      }

      // Substituir espaços por '_'
      value = value.replace(/\s/g, "_");

      // Remover caracteres inválidos
      value = value.replace(/[^a-z0-9_@]/g, "");

      // Garantir que não há letras maiúsculas
      value = value.toLowerCase();

      // Atualizar o campo de entrada com o valor formatado
      event.target.value = value;
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");

    emailInput.addEventListener("input", (event) => {
      let value = event.target.value;

      // Converter todas as letras para minúsculas
      value = value.toLowerCase();

      // Remover caracteres especiais, exceto @ e .
      value = value.replace(/[^a-z0-9@.]/g, "");

      // Atualizar o campo de entrada com o valor formatado
      event.target.value = value;
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const senhaInput = document.getElementById("senha");

    senhaInput.addEventListener("mouseover", () => {
      senhaInput.type = "text";
    });

    senhaInput.addEventListener("mouseout", () => {
      senhaInput.type = "password";
    });
  });
});





