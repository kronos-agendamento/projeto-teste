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
    document.getElementById("nome").value = userData.nome || "";
    document.getElementById("nascimento").value = userData.dataNasc || "";
    document.getElementById("telefone").value =
      formatPhoneNumber(userData.telefone) || "";
    document.getElementById("genero").value = userData.genero || "";
    document.getElementById("instagram").value = userData.instagram || "";
    document.getElementById("indicacao").value = userData.indicacao || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("senha").value = userData.senha || "";
    document.getElementById("empresa").value = userData.empresa.nome || "";
    document.getElementById("cnpj").value = userData.empresa.cnpj || "";
    document.getElementById("telefone-empresa").value = userData.empresa.telefone || "";
    document.getElementById("cep").value = userData.empresa.endereco.cep || "";
    document.getElementById("logradouro").value = userData.empresa.endereco.logradouro || "";
    document.getElementById("numero").value = userData.empresa.endereco.numero || "";
    document.getElementById("bairro").value = userData.empresa.endereco.bairro || "";
    document.getElementById("complemento").value = userData.empresa.endereco.complemento || "";
    document.getElementById("cidade").value = userData.empresa.endereco.cidade || "";
    document.getElementById("estado").value = userData.empresa.endereco.estado || "";

    document.getElementById('diaInicio').value = userData.empresa.horarioFuncionamento.diaInicio;
    document.getElementById('diaFim').value = userData.empresa.horarioFuncionamento.diaFim;
    document.getElementById('horaInicio').value = userData.empresa.horarioFuncionamento.horarioAbertura;
    document.getElementById('horaFim').value = userData.empresa.horarioFuncionamento.horarioFechamento;
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

  // Adiciona o event listener após o DOM estar carregado
  document
    .getElementById("save-usuario-button")
    .addEventListener("click", async function () {
      const cpf = localStorage.getItem("cpf");
      await atualizarUsuario();

    });

  function formatPhoneNumberToLong(phoneNumber) {
    if (!phoneNumber) return null;
    const cleaned = phoneNumber.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    return parseInt(cleaned, 10); // Converte para número
  }

  async function atualizarUsuario(cpf) {
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

      console.log("Usuário atualizado com sucesso!");
    } catch (error) {
      console.error(
        "Erro ao atualizar o usuário com o ID da nova empresa:",
        error
      );
    }
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
  const profileImageInput = document.getElementById("profileImage");
  const confirmModal = document.getElementById("confirmModal");
  const confirmButton = document.getElementById("confirmButton");
  const cancelButton = document.getElementById("cancelButton");
  const closeButton = document.querySelector(".close");
  let selectedFile = null;

  profileImageInput.addEventListener("change", function () {
    selectedFile = this.files[0];
    if (selectedFile) {
      confirmModal.style.display = "block";
    }
  });

  confirmButton.addEventListener("click", async function () {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("foto", selectedFile);

      const cpf = localStorage.getItem("cpf");
      if (cpf) {
        try {
          const response = await fetch(
            `http://localhost:8080/usuarios/atualizacao-foto/${cpf}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Erro ao atualizar foto: ${response.status}`);
          }

          const updatedUser = await response.json();

          document.getElementById("notification-message").textContent =
            "Foto atualizada com sucesso!";
          document.getElementById("notification").style.display = "block";
        } catch (error) {
          console.error("Erro ao atualizar foto:", error);
          alert("Erro ao atualizar foto.");
        }
      } else {
        alert("CPF não encontrado.");
      }
    }
    confirmModal.style.display = "none";
  });

  cancelButton.addEventListener("click", function () {
    confirmModal.style.display = "none";
  });

  closeButton.addEventListener("click", function () {
    confirmModal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == confirmModal) {
      confirmModal.style.display = "none";
    }
  });
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

  const cidadeInput = document.getElementById("cidade");
  cidadeInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  const estadoInput = document.getElementById("estado");
  estadoInput.addEventListener("input", function () {
    this.value = capitalizeWords(removeNumbers(this.value));
  });

  // Mockar dias da semana no select
  const dias = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];
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

  function populateSelect(selectId, value) {
    const select = document.getElementById(selectId);
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }

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

  document.addEventListener("DOMContentLoaded", function () {
    const nome = localStorage.getItem("nome");
    const email = localStorage.getItem("email");

    if (nome && email) {
      document.getElementById("userName").textContent = nome;
      document.getElementById("userEmail").textContent = email;
    }
  });
})();