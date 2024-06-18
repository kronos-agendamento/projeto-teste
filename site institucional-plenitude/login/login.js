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
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const instagram = document.getElementById('instagram').value;
    const senha = document.getElementById('senha').value;

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

