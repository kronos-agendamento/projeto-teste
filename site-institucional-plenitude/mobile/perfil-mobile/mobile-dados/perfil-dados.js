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
    return null;
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
        console.log("Dados recebidos:", userData);
        document.getElementById("nome").value = userData.nome || "";
        document.getElementById("nascimento").value = userData.dataNasc || "";
        document.getElementById("telefone").value = formatPhoneNumber(userData.telefone) || "";
        document.getElementById("genero").value = userData.genero || "";
        document.getElementById("instagram").value = userData.instagram || "";
        document.getElementById("indicacao").value = userData.indicacao || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("cpf").value = userData.cpf || "";
        document.getElementById("cep").value = userData.endereco.cep || "";
        document.getElementById("logradouro").value = userData.endereco.logradouro || "";
        document.getElementById("numero").value = userData.endereco.numero || "";
        document.getElementById("bairro").value = userData.endereco.bairro || "";
        document.getElementById("cidade").value = userData.endereco.cidade || "";
        document.getElementById("estado").value = userData.endereco.estado || "";
        document.getElementById("complemento").value = userData.endereco.complemento || "";
        document.getElementById("idEndereco").value = userData.endereco.idEndereco || "";
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

    // Exibir modal de confirmação antes de atualizar
    document.getElementById("save-usuario-button").addEventListener("click", function () {
        document.getElementById("modalDecisao").style.display = "block";
    });

    document.getElementById("save-endereco-button").addEventListener("click", function () {
        document.getElementById("modalDecisaoEndereco").style.display = "block";
    });

    document.getElementById("confirmUpdateButton").addEventListener("click", async function () {
        try {
            await atualizarUsuario();  // Atualiza primeiro os dados pessoais
    
            const userData = await fetchUserDataByCpf(localStorage.getItem("cpf")); // Atualiza a interface com os dados mais recentes
            if (userData) {
                fillUserProfile(userData);
            }
            fecharModalDecisao();
        } catch (error) {
            console.error("Erro ao confirmar atualização:", error);
            showNotification("Erro ao confirmar atualização.", true);
        }
    });
    
    document.getElementById("confirmUpdateButtonEndereco").addEventListener("click", async function () {
        try {
            await atualizarEndereco();  // Atualiza primeiro os dados pessoais
    
            const userData = await fetchUserDataByCpf(localStorage.getItem("cpf")); // Atualiza a interface com os dados mais recentes
            if (userData) {
                fillUserProfile(userData);
            }
            fecharModalDecisaoEndereco();
        } catch (error) {
            console.error("Erro ao confirmar atualização:", error);
            showNotification("Erro ao confirmar atualização.", true);
        }
    });

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
                cpf: document.getElementById("cpf").value
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

            // Recarregar os dados atualizados
            const userData = await fetchUserDataByCpf(cpf);
            if (userData) {
                fillUserProfile(userData); // Atualizar os campos com os dados mais recentes
            }
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
            showNotification("Erro ao Atualizar!", true);
        }
    }

    async function atualizarEndereco() {
        try {
            const idEndereco = document.getElementById("idEndereco").value; // Certifique-se de capturar o valor correto
            const enderecoDTO = {
                idEndereco: idEndereco,
                cep: document.getElementById("cep").value,
                logradouro: document.getElementById("logradouro").value,
                numero: document.getElementById("numero").value,
                bairro: document.getElementById("bairro").value,
                cidade: document.getElementById("cidade").value,
                estado: document.getElementById("estado").value,
                complemento: document.getElementById("complemento").value,
            };
    
            const enderecoResponse = await fetch(`http://localhost:8080/api/enderecos/${idEndereco}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(enderecoDTO),
            });
    
            if (!enderecoResponse.ok) {
                throw new Error(`Erro ao atualizar endereço: ${enderecoResponse.status}`);
            }
    
            showNotification("Endereço atualizado com sucesso!");
    
            // Opcional: Recarregar os dados atualizados
            const updatedUserData = await fetchUserDataByCpf(localStorage.getItem("cpf"));
            if (updatedUserData) {
                fillUserProfile(updatedUserData);
            }
        } catch (error) {
            console.error("Erro ao atualizar o endereço:", error);
            showNotification("Erro ao Atualizar Endereço!", true);
        }
    }
    




    function formatPhoneNumberToLong(phoneNumber) {
        if (!phoneNumber) return null;
        const cleaned = phoneNumber.replace(/\D/g, '');
        return parseInt(cleaned, 10);
    }


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
});

function fecharModalDecisao() {
    document.getElementById("modalDecisao").style.display = "none";
}

function fecharModalDecisaoEndereco() {
    document.getElementById("modalDecisaoEndereco").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("uploadForm2").addEventListener("submit", async (event) => {
        event.preventDefault();

        const cpf = document.getElementById("cpf").value;
        const fileInput = document.getElementById("file");

        if (!cpf || fileInput.files.length === 0) {
            alert("Por favor, insira o CPF e selecione uma imagem.");
            return;
        }

        const formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {
            const response = await fetch(`http://localhost:8080/usuarios/upload-foto/${cpf}`, {
                method: "POST",
                body: formData,
            });

            const result = await response.text();
            const responseMessage = document.getElementById("responseMessage");

            if (response.ok) {
                responseMessage.textContent = "Foto enviada com sucesso! Recarregue a página para ter acesso à foto atualizada.";
                responseMessage.style.color = "green";
            } else {
                responseMessage.textContent = `Erro: ${result}`;
                responseMessage.style.color = "red";
            }
        } catch (error) {
            console.error("Erro ao enviar a foto:", error);
            document.getElementById("responseMessage").textContent = "Erro ao enviar a foto.";
        }
    });
});

async function carregarImagem2() {
    const cpf = localStorage.getItem("cpf");
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
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

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

window.onload = carregarImagem2;
