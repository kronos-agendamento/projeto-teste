document.addEventListener('DOMContentLoaded', async function () {
    let isEditing = false;
    let clienteData = {};  // Variável para armazenar os dados do cliente

    const urlParams = new URLSearchParams(window.location.search);
    const cpf = urlParams.get('cpf');
    const clienteNome = localStorage.getItem('clienteNome');

    if (clienteNome) {
        document.querySelector('header h1').textContent = `Mais informações de: ${clienteNome}`;
    }
    
    if (cpf) {
        try {
            clienteData = await fetchUsuarioPorCpf(cpf);
            if (clienteData) {
                // Preenchendo os campos do formulário de dados pessoais
                setFieldValue('nome', clienteData.nome);
                setFieldValue('nascimento', formatDate(clienteData.dataNasc));
                setFieldValue('instagram', clienteData.instagram);
                setFieldValue('cpf', clienteData.cpf);
                setFieldValue('telefone', clienteData.telefone);
                setFieldValue('genero', clienteData.genero);
                setFieldValue('email', clienteData.email);
                setFieldValue('indicacao', clienteData.indicacao);
                setFieldValue('emergencia', clienteData.telefoneEmergencial);

                // Preenchendo os campos do formulário de endereço
                if (clienteData.endereco) {
                    setFieldValue('logradouro', clienteData.endereco.logradouro);
                    setFieldValue('numero', clienteData.endereco.numero);
                    setFieldValue('cep', clienteData.endereco.cep);
                    setFieldValue('bairro', clienteData.endereco.bairro);
                    setFieldValue('cidade', clienteData.endereco.cidade);
                    setFieldValue('estado', clienteData.endereco.estado);
                    setFieldValue('complemento', clienteData.endereco.complemento);
                } else {
                    console.error('Endereço não encontrado para o CPF fornecido.');
                }
            } else {
                console.error('Nenhum dado encontrado para o CPF fornecido.');
            }
        } catch (error) {
            console.error('Erro ao buscar os dados do cliente:', error);
        }
    } else {
        console.error('CPF não fornecido na URL.');
    }

    async function fetchUsuarioPorCpf(cpf) {
        try {
            const response = await fetch(`http://localhost:8080/usuarios/buscar-por-cpf/${cpf}`);
            if (!response.ok) {
                throw new Error(`Erro ao buscar usuário com CPF: ${cpf}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return null;
        }
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    function setFieldValue(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (!value || value === '') {
            field.value = 'Não há registro desse dado*';
            field.style.color = 'red';
        } else {
            field.value = value;
            field.style.color = ''; // Reseta a cor para o padrão
        }
    }

    window.enableEditing = function () {
        isEditing = !isEditing; // Alterna o estado de edição
        const lockIcons = document.querySelectorAll('.lock-icon');
        const fields = document.querySelectorAll('#personalForm input, #addressForm input');
        const saveButtons = document.querySelectorAll('.save-button');

        if (isEditing) {
            lockIcons.forEach(lockIcon => {
                lockIcon.style.display = 'inline';
            });
            fields.forEach(field => {
                const lockIcon = document.getElementById(`${field.id}-lock`);
                if (lockIcon && lockIcon.textContent === '🔓') {
                    field.disabled = false;
                }
            });
            saveButtons.forEach(button => button.disabled = false);
        } else {
            lockIcons.forEach(lockIcon => {
                lockIcon.style.display = 'none';
            });
            fields.forEach(field => {
                field.disabled = true;
            });
            saveButtons.forEach(button => button.disabled = true);
        }
    };

    function showNotification(message, isError = false) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        notificationMessage.textContent = message;
        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    async function updatePersonalData(event) {
        event.preventDefault(); 

        const updatedData = {
            nome: document.getElementById('nome').value || clienteData.nome,
            email: document.getElementById('email').value || clienteData.email,
            senha: null,
            instagram: document.getElementById('instagram').value || clienteData.instagram,
            telefone: parseInt(document.getElementById('telefone').value) || clienteData.telefone,
            telefoneEmergencial: parseInt(document.getElementById('emergencia').value) || clienteData.telefoneEmergencial,
            genero: document.getElementById('genero').value || clienteData.genero,
            indicacao: document.getElementById('indicacao').value || clienteData.indicacao,
            nivelAcessoId: clienteData.nivelAcesso ? clienteData.nivelAcesso.codigo : null,
            enderecoId: clienteData.endereco ? clienteData.endereco.codigo : null,
            empresaId: clienteData.empresaId,
            fichaAnamneseId: clienteData.fichaAnamneseId
        };

        try {
            const response = await fetch(`http://localhost:8080/usuarios/atualizacao-usuario/${cpf}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                showNotification('Dados atualizados com sucesso!');
                window.enableEditing();
            } else {
                showNotification('Erro ao atualizar os dados.', true);
            }
        } catch (error) {
            console.error('Erro ao enviar os dados atualizados:', error);
            showNotification('Erro ao atualizar os dados.', true);
        }
    }

    async function updateAddressData(event) {
        event.preventDefault(); 

        const updatedAddress = {
            logradouro: document.getElementById('logradouro').value || clienteData.endereco.logradouro,
            numero: document.getElementById('numero').value || clienteData.endereco.numero,
            cep: document.getElementById('cep').value || clienteData.endereco.cep,
            bairro: document.getElementById('bairro').value || clienteData.endereco.bairro,
            cidade: document.getElementById('cidade').value || clienteData.endereco.cidade,
            estado: document.getElementById('estado').value || clienteData.endereco.estado,
            complemento: document.getElementById('complemento').value || clienteData.endereco.complemento
        };

        try {
            const response = await fetch(`http://localhost:8080/usuarios/atualizacao-endereco/${cpf}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAddress)
            });

            if (response.ok) {
                showNotification('Endereço atualizado com sucesso!');
                window.enableEditing();
            } else {
                showNotification('Erro ao atualizar o endereço.', true);
            }
        } catch (error) {
            console.error('Erro ao enviar os dados atualizados:', error);
            showNotification('Erro ao atualizar o endereço.', true);
        }
    }

    document.getElementById('personalForm').addEventListener('submit', updatePersonalData);
    document.getElementById('addressForm').addEventListener('submit', updateAddressData);

    document.getElementById('enviarEmailButton').addEventListener('click', async function () {
        const email = document.getElementById('email').value;
        
        if (email) {
            try {
                const response = await fetch('http://localhost:5000/enviar-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email }),
                });

                if (response.ok) {
                    showNotification('Email enviado com sucesso!');
                    window.enableEditing();
                } else {
                    showNotification('Erro ao enviar o email', true);
                }
            } catch (error) {
                showNotification('Erro ao enviar o email', true);
            }
        } else {
            alert('Por favor, insira um email válido.');
        }
    });
});
