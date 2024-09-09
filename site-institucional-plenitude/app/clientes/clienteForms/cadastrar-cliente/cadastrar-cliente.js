document.addEventListener("DOMContentLoaded", function () {
  // Função para exibir notificação
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

  const instagramInput = document.getElementById("instagram");

  instagramInput.addEventListener("input", function (e) {
    let value = instagramInput.value;

    // Adiciona @ no início se ainda não tiver
    if (!value.startsWith("@")) {
      value = "@" + value;
    }

    // Substitui espaços por sublinhados
    value = value.replace(/\s+/g, "_");

    // Transforma todas as letras em minúsculas
    value = value.toLowerCase();

    // Atualiza o valor do campo com as modificações
    instagramInput.value = value;
  });

  document.getElementById("nome").addEventListener("input", function (e) {
    let input = e.target.value;

    // Remove números do valor do input
    let valueWithoutNumbers = input.replace(/\d/g, "");

    // Divide as palavras, capitaliza a primeira letra de cada uma, e une de volta
    valueWithoutNumbers = valueWithoutNumbers
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // Atualiza o campo de nome com a nova formatação
    e.target.value = valueWithoutNumbers;
  });

  document.getElementById("indicacao").addEventListener("input", function (e) {
    let input = e.target.value;

    // Remove números do valor do input
    let valueWithoutNumbers = input.replace(/\d/g, "");

    // Divide as palavras, capitaliza a primeira letra de cada uma, e une de volta
    valueWithoutNumbers = valueWithoutNumbers
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // Atualiza o campo de nome com a nova formatação
    e.target.value = valueWithoutNumbers;
  });

  document.getElementById("telefone").addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    // Limita o comprimento da string a 11 caracteres
    input = input.slice(0, 11);

    if (input.length > 2) {
      input = "(" + input.slice(0, 2) + ") " + input.slice(2);
    }
    if (input.length > 10) {
      // Corrige para inserir o hífen após o décimo caractere
      input = input.slice(0, 10) + "-" + input.slice(10);
    }
    e.target.value = input; // Atualiza o campo de telefone com a formatação
  });

  document.getElementById("emergencia").addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    // Limita o comprimento da string a 11 caracteres
    input = input.slice(0, 11);

    if (input.length > 2) {
      input = "(" + input.slice(0, 2) + ") " + input.slice(2);
    }
    if (input.length > 10) {
      // Corrige para inserir o hífen após o décimo caractere
      input = input.slice(0, 10) + "-" + input.slice(10);
    }
    e.target.value = input; // Atualiza o campo de telefone com a formatação
  });

  document.getElementById("cpf").addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos

    // Atualiza o campo oculto com o valor sem formatação antes de aplicar a formatação
    document.getElementById("cpfFormatado").value = input;

    // Formata com pontos e traço para exibição
    if (input.length > 9) {
      input =
        input.slice(0, 3) +
        "." +
        input.slice(3, 6) +
        "." +
        input.slice(6, 9) +
        "-" +
        input.slice(9, 11);
    } else if (input.length > 6) {
      input =
        input.slice(0, 3) + "." + input.slice(3, 6) + "." + input.slice(6);
    } else if (input.length > 3) {
      input = input.slice(0, 3) + "." + input.slice(3);
    }
    e.target.value = input; // Atualiza o campo de CPF com a formatação
  });

  document.getElementById("nome").addEventListener("input", function (e) {
    // Remove números do valor do input
    let valueWithoutNumbers = e.target.value.replace(/\d/g, "");

    // Aplica a capitalização para cada palavra, mantendo os espaços
    e.target.value = valueWithoutNumbers
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  });

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("email").addEventListener("input", function (e) {
      e.target.value = e.target.value.toLowerCase();
    });
  });

  // Função para buscar endereço pelo CEP usando a API do ViaCEP
  async function buscarEnderecoPorCep(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new Error("Erro ao buscar o endereço pelo CEP");
      }

      const endereco = await response.json();

      if (endereco.erro) {
        showNotification(
          "CEP não encontrado. Verifique e tente novamente.",
          true
        );
        return null;
      }

      // Preenche os campos de endereço
      document.getElementById("logradouro").value = endereco.logradouro;
      document.getElementById("bairro").value = endereco.bairro;
      document.getElementById("cidade").value = endereco.localidade;
      document.getElementById("estado").value = endereco.uf;

      return endereco;
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      showNotification("Erro ao buscar o endereço. Tente novamente.", true);
    }
  }

  // Adiciona o evento de blur ao campo de CEP para buscar o endereço
  document.getElementById("cep").addEventListener("blur", async function () {
    const cep = this.value.replace(/\D/g, ""); // Remove qualquer caracter não numérico

    if (cep.length === 8) {
      await buscarEnderecoPorCep(cep);
    } else {
      showNotification("CEP inválido. Verifique e tente novamente.", true);
    }
  });

  // O restante do código continua como estava
  document
    .getElementById("usuarioForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      // Remover pontuações para enviar ao banco
      const cpf = document.getElementById("cpf").value.replace(/\D/g, ""); // Remove tudo que não for número
      const telefone = document
        .getElementById("telefone")
        .value.replace(/\D/g, ""); // Remove tudo que não for número
      const telefoneEmergencial = document
        .getElementById("emergencia")
        .value.replace(/\D/g, ""); // Remove tudo que não for número

      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const instagram = document.getElementById("instagram").value;
      const senha = document.getElementById("senha").value;
      const dataNasc = document.getElementById("nascimento").value;
      const genero = document.getElementById("genero").value;
      const indicacao = document.getElementById("indicacao").value;

      const logradouro = document.getElementById("logradouro").value;
      const numero = parseInt(document.getElementById("numero").value);
      const cep = document.getElementById("cep").value;
      const bairro = document.getElementById("bairro").value;
      const cidade = document.getElementById("cidade").value;
      const estado = document.getElementById("estado").value;
      const complemento = document.getElementById("complemento").value;

      try {
        let enderecoId;
        const verificarEnderecoResponse = await fetch(
          `http://localhost:8080/api/enderecos/buscar-por-tudo/${logradouro}/${numero}/${cep}`
        );

        if (verificarEnderecoResponse.ok) {
          const enderecoData = await verificarEnderecoResponse.json();
          enderecoId = enderecoData.id || enderecoData;
          console.log("Endereço já existe com ID:", enderecoId);
        } else if (verificarEnderecoResponse.status === 404) {
          const enderecoResponse = await fetch(
            "http://localhost:8080/api/enderecos/cadastrar",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                logradouro,
                numero,
                cep,
                bairro,
                cidade,
                estado,
              }),
            }
          );

          if (!enderecoResponse.ok) {
            const errorText = await enderecoResponse.text();
            console.error("Erro ao cadastrar endereço:", errorText);
            throw new Error("Erro ao cadastrar endereço: " + errorText);
          }

          // Faz o GET para buscar o ID do endereço recém-cadastrado
          const enderecoData = await fetch(
            `http://localhost:8080/api/enderecos/buscar-por-tudo/${logradouro}/${numero}/${cep}`
          );
          if (!enderecoData.ok) {
            throw new Error("Erro ao buscar o endereço após cadastro");
          }

          const enderecoJson = await enderecoData.json();
          enderecoId = enderecoJson.id || enderecoJson;
          console.log("Novo endereço cadastrado com ID:", enderecoId);
        } else {
          const errorText = await verificarEnderecoResponse.text();
          console.error("Erro ao verificar o endereço:", errorText);
          throw new Error("Erro ao verificar o endereço: " + errorText);
        }

        if (!enderecoId) throw new Error("ID do endereço não encontrado.");

        try {
          const verificarComplementoResponse = await fetch(
            `http://localhost:8080/api/complementos/buscar-por-endereco-complemento/${enderecoId}/${complemento}`
          );
          if (!verificarComplementoResponse.ok) {
            if (verificarComplementoResponse.status === 404) {
              // Se o complemento não existe, cria um novo
              const complementoResponse = await fetch(
                "http://localhost:8080/api/complementos/cadastrar",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    complemento,
                    enderecoId,
                  }),
                }
              );

              if (!complementoResponse.ok) {
                const errorText = await complementoResponse.text();
                console.error("Erro ao cadastrar complemento:", errorText);
                throw new Error("Erro ao cadastrar complemento: " + errorText);
              }

              console.log("Complemento cadastrado com sucesso.");
            } else {
              const errorText = await verificarComplementoResponse.text();
              console.error("Erro ao verificar o complemento:", errorText);
              throw new Error("Erro ao verificar o complemento: " + errorText);
            }
          } else {
            console.log("Complemento já existe para o endereço.");
          }
        } catch (complementoError) {
          console.error("Erro ao processar complemento:", complementoError);

          // Se der erro 500, assume que não existe e tenta cadastrar
          if (complementoError.message.includes("500")) {
            const complementoResponse = await fetch(
              "http://localhost:8080/api/complementos/cadastrar",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  complemento,
                  enderecoId,
                }),
              }
            );

            if (!complementoResponse.ok) {
              const errorText = await complementoResponse.text();
              console.error("Erro ao cadastrar complemento:", errorText);
              throw new Error("Erro ao cadastrar complemento: " + errorText);
            }

            console.log(
              "Complemento cadastrado com sucesso após falha na verificação."
            );
          } else {
            throw complementoError;
          }
        }

        console.log("Iniciando cadastro do usuário...");
        const usuarioResponse = await fetch(
          "http://localhost:8080/usuarios/cadastro-usuario",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nome,
              email,
              telefone,
              instagram,
              senha,
              cpf,
              telefoneEmergencial,
              dataNasc,
              genero,
              indicacao,
              status: true,
              nivelAcessoId: 3,
              enderecoId: enderecoId,
              empresaId: null,
              fichaAnamneseId: null,
            }),
          }
        );

        if (usuarioResponse.ok) {
          console.log("Usuário cadastrado com sucesso.");
          localStorage.setItem("nome", nome);
          localStorage.setItem("email", email);

          showNotification("Cadastro realizado com sucesso!");
          window.location.href = "../clientes.html";
        } else {
          const errorText = await usuarioResponse.text();
          console.error("Erro ao cadastrar usuário:", errorText);
          throw new Error("Erro ao realizar cadastro de usuário: " + errorText);
        }
      } catch (error) {
        console.error("Erro geral:", error);
        showNotification(error.message, true);
      }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginEmail").addEventListener("input", function (e) {
    e.target.value = e.target.value.toLowerCase();
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
