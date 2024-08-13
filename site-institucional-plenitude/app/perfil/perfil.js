async function fetchUserDataByCpf(cpf) {
    try {
        const response = await fetch(`http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`);
        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
    }
    return null; // Retorna null em caso de erro
}

document.addEventListener('DOMContentLoaded', async () => {
    const cpf = localStorage.getItem('cpf');
    if (cpf) {
        const userData = await fetchUserDataByCpf(cpf);
        if (userData) {
            fillUserProfile(userData);
        } else {
            console.error('Usuário não encontrado ou erro ao buscar dados do usuário.');
        }
    }

    // Adiciona o event listener após o DOM estar carregado
    document.getElementById('save-usuario-button').addEventListener('click', async function () {
        const cpf = localStorage.getItem('cpf');

        if (cpf) {
            const userData = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value,
                dataNasc: document.getElementById('nascimento').value,
                instagram: document.getElementById('instagram').value,
                telefone: parseInt(document.getElementById('telefone').value.replace(/\D/g, '')),
                telefoneEmergencial: parseInt(document.getElementById('telefoneEmergencial').value.replace(/\D/g, '')),
                genero: document.getElementById('genero').value,
                indicacao: document.getElementById('indicacao').value
            };

            try {
                const response = await fetch(`http://localhost:8080/usuarios/atualizacao-usuario-por-cpf/${cpf}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                if (!response.ok) {
                    throw new Error(`Erro ao atualizar usuário: ${response.status}`);
                }

                const updatedUser = await response.json();
                console.log('Dados atualizados com sucesso:', updatedUser);

                document.getElementById('notification-message').textContent = 'Dados atualizados com sucesso!';
                document.getElementById('notification').style.display = 'block';
            } catch (error) {
                console.error('Erro ao atualizar usuário:', error);
                alert('Erro ao atualizar usuário.');
            }
        } else {
            alert('CPF não encontrado.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const profileImageInput = document.getElementById('profileImage');
    const confirmModal = document.getElementById('confirmModal');
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    const closeButton = document.querySelector('.close');
    let selectedFile = null;

    profileImageInput.addEventListener('change', function () {
        selectedFile = this.files[0];
        if (selectedFile) {
            confirmModal.style.display = 'block';
        }
    });

    confirmButton.addEventListener('click', async function () {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('foto', selectedFile);

            const cpf = localStorage.getItem('cpf');
            if (cpf) {
                try {
                    const response = await fetch(`http://localhost:8080/usuarios/atualizacao-foto/${cpf}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error(`Erro ao atualizar foto: ${response.status}`);
                    }

                    const updatedUser = await response.json();
                    console.log('Foto atualizada com sucesso:', updatedUser);

                    document.getElementById('notification-message').textContent = 'Foto atualizada com sucesso!';
                    document.getElementById('notification').style.display = 'block';
                } catch (error) {
                    console.error('Erro ao atualizar foto:', error);
                    alert('Erro ao atualizar foto.');
                }
            } else {
                alert('CPF não encontrado.');
            }
        }
        confirmModal.style.display = 'none';
    });

    cancelButton.addEventListener('click', function () {
        confirmModal.style.display = 'none';
    });

    closeButton.addEventListener('click', function () {
        confirmModal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == confirmModal) {
            confirmModal.style.display = 'none';
        }
    });
});

function fillUserProfile(userData) {
    if (!userData) {
        console.error('Dados do usuário estão nulos ou indefinidos.');
        return;
    }

    document.getElementById('nome').value = userData.nome || '';
    document.getElementById('nascimento').value = userData.dataNasc || '';
    document.getElementById('telefone').value = userData.telefone || '';
    document.getElementById('telefoneEmergencial').value = userData.telefoneEmergencial || '';
    document.getElementById('genero').value = userData.genero || '';
    document.getElementById('instagram').value = userData.instagram || '';
    document.getElementById('indicacao').value = userData.indicacao || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('senha').value = userData.senha || '';
    document.getElementById('empresa').value = userData.empresa ? userData.empresa.nome : '';
    document.getElementById('cnpj').value = userData.empresa ? userData.empresa.cnpj : '';
    document.getElementById('endereco').value = userData.endereco ? userData.endereco.logradouro : '';

    // Buscar e preencher os dados da empresa pelo CNPJ
    const cnpj = userData.empresa ? userData.empresa.cnpj : null;
    if (cnpj) {
        fetch(`http://localhost:8080/api/empresas/filtrar-por-cnpj/${cnpj}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Empresa não encontrada pelo CNPJ fornecido.');
                }
                return response.json();
            })
            .then(data => {
                populateSelect('diasInicio', data.horarioFuncionamento.diaInicio);
                populateSelect('diasFim', data.horarioFuncionamento.diaFim);
                populateSelect('horarioInicio', data.horarioFuncionamento.horarioInicio);
                populateSelect('horarioFim', data.horarioFuncionamento.horarioFim);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }
}

function populateSelect(selectId, value) {
    const select = document.getElementById(selectId);
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
}

document.addEventListener('DOMContentLoaded', function () {
    const nomeInput = document.getElementById('nome');

    nomeInput.addEventListener('input', function () {
        const words = nomeInput.value.split(' ');
        for (let i = 0; i < words.length; i++) {
            if (words[i].length > 0) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
            }
        }
        nomeInput.value = words.join(' ');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const telefoneInput = document.getElementById('telefone');
    const telefoneEmergencialInput = document.getElementById('telefoneEmergencial');

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 3) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
        }
        return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
    };

    const handlePhoneNumberInput = (e) => {
        e.target.value = formatPhoneNumber(e.target.value);
    };

    telefoneInput.addEventListener('input', handlePhoneNumberInput);
    telefoneEmergencialInput.addEventListener('input', handlePhoneNumberInput);
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