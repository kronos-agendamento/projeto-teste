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

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpfFormatado').value; // Usar o valor não formatado
    const telefone = document.getElementById('telefoneFormatado').value; // Usar o valor não formatado
    const instagram = document.getElementById('instagram').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;

    if (senha !== confirmarSenha) {
        showNotification('As senhas não coincidem.', true);
        return;
    }

    const payload = {
        nome,
        email,
        telefone,
        instagram,
        senha,
        cpf,
        telefoneEmergencial: telefone,
        dataNasc: "2000-01-01",
        genero: "não informado",
        indicacao: null,
        status: true,
        nivelAcessoId: null,
        enderecoId: null,
        empresaId: null,
        fichaAnamneseId: null
    };

    try {
        const response = await fetch('http://localhost:8080/usuarios/cadastro-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Salva nome e email no localStorage
            localStorage.setItem('nome', nome);
            localStorage.setItem('email', email);

            showNotification('Cadastro realizado com sucesso!');
            window.location.href = '../../app/index/index.html';
        } else {
            showNotification('Erro ao realizar cadastro.', true);
        }
    } catch (error) {
        showNotification('Erro ao realizar cadastro.', true);
    }
});


document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    const payload = {
        email,
        senha
    };

    try {
        const response = await fetch('http://localhost:8080/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const loginData = await response.json();

            // Salva o nome e o email no localStorage
            localStorage.setItem('nome', loginData.nome);
            localStorage.setItem('email', loginData.email);

            showNotification('Login realizado com sucesso!');
            window.location.href = '../../app/index/index.html';
        } else {
            showNotification('Erro ao realizar login. Verifique suas credenciais.', true);
        }
    } catch (error) {
        showNotification('Erro ao realizar login.', true);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const mobileLoginBtn = document.getElementById('mobileLoginBtn');
    const mobileRegisterBtn = document.getElementById('mobileRegisterBtn');

    mobileLoginBtn.addEventListener('click', function () {
        signInForm.classList.add('active');
        signUpForm.classList.remove('active');
    });

    mobileRegisterBtn.addEventListener('click', function () {
        signUpForm.classList.add('active');
        signInForm.classList.remove('active');
    });

    // Initialize by showing the register form
    signUpForm.classList.add('active');
});

document.addEventListener('DOMContentLoaded', function () {
    const instagramInput = document.getElementById('instagram');

    instagramInput.addEventListener('input', function (e) {
        let value = instagramInput.value;

        // Adiciona @ no início se ainda não tiver
        if (!value.startsWith('@')) {
            value = '@' + value;
        }

        // Substitui espaços por sublinhados
        value = value.replace(/\s+/g, '_');

        // Transforma todas as letras em minúsculas
        value = value.toLowerCase();

        // Atualiza o valor do campo com as modificações
        instagramInput.value = value;
    });
});

function togglePasswordVisibility() {
    const senhaInput = document.getElementById('senha');
    const toggleIcon = document.getElementById('toggleIcon');

    if (senhaInput.type === 'password') {
        senhaInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        senhaInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

document.getElementById('telefone').addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    // Limita o comprimento da string a 11 caracteres
    input = input.slice(0, 11);

    if (input.length > 2) {
        input = '(' + input.slice(0, 2) + ') ' + input.slice(2);
    }
    if (input.length > 10) { // Corrige para inserir o hífen após o décimo caractere
        input = input.slice(0, 10) + '-' + input.slice(10);
    }
    e.target.value = input; // Atualiza o campo de telefone com a formatação

    // Atualiza o campo oculto com o valor sem formatação
    document.getElementById('telefoneFormatado').value = input.replace(/\D/g, '');
});

document.getElementById('cpf').addEventListener('input', function (e) {
    let input = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    // Atualiza o campo oculto com o valor sem formatação antes de aplicar a formatação
    document.getElementById('cpfFormatado').value = input;

    // Formata com pontos e traço para exibição
    if (input.length > 9) {
        input = input.slice(0, 3) + '.' + input.slice(3, 6) + '.' + input.slice(6, 9) + '-' + input.slice(9, 11);
    } else if (input.length > 6) {
        input = input.slice(0, 3) + '.' + input.slice(3, 6) + '.' + input.slice(6);
    } else if (input.length > 3) {
        input = input.slice(0, 3) + '.' + input.slice(3);
    }
    e.target.value = input; // Atualiza o campo de CPF com a formatação
});


document.getElementById('nome').addEventListener('input', function (e) {
    // Remove números do valor do input
    let valueWithoutNumbers = e.target.value.replace(/\d/g, '');

    // Aplica a capitalização para cada palavra, mantendo os espaços
    e.target.value = valueWithoutNumbers.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('email').addEventListener('input', function (e) {
        e.target.value = e.target.value.toLowerCase();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Seleciona todos os botões de alternância
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Identifica o campo de senha correspondente
            const passwordInput = button.previousElementSibling;

            // Verifica o tipo atual e alterna
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Altera o ícone ou texto do botão, se necessário
            // Exemplo: Alterna entre ícones de olho aberto e fechado
            button.innerHTML = type === 'password' ? '&#128065;' : '&#128584;'; // ícones são apenas exemplos
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginEmail').addEventListener('input', function (e) {
        e.target.value = e.target.value.toLowerCase();
    });
});