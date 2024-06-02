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
            alert('Cadastro realizado com sucesso!');
        } else {
            alert('Erro ao realizar cadastro.');
        }
    } catch (error) {
        alert('Erro ao realizar cadastro.');
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
            alert('Login realizado com sucesso!');
        } else {
            alert('Erro ao realizar login.');
        }
    } catch (error) {
        alert('Erro ao realizar login.');
    }
});
