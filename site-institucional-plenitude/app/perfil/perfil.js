
document.addEventListener("DOMContentLoaded", function () {
    const url = 'http://localhost:8080/api/agendamentos/listar';
    const itemsPerPage = 5; // Número de itens por página
    let currentPage = 1; // Página atual
    let agendamentos = []; // Array para armazenar os agendamentos

    let totalAgendamentos = 0;
    let confirmados = 0;


    document.addEventListener('DOMContentLoaded', () => {
        // Função para carregar os dados do usuário
        async function carregarDadosUsuario() {
            try {
                const response = await fetch('/usuarios/listar-usuarios-ativos'); // Substitua pelo endpoint correto
                if (response.ok) {
                    const data = await response.json();
                    // Assumindo que o retorno é uma lista de usuários
                    const user = data[0]; // Pegar o primeiro usuário, ajuste conforme necessário
                    document.getElementById('userName').textContent = user.nome;
                    document.getElementById('userEmail').textContent = user.email;
                    document.getElementById('nome').value = user.nome;
                    document.getElementById('nascimento').value = user.dataNascimento;
                    document.getElementById('email').value = user.email;
                    document.getElementById('telefone').value = user.telefone;
                } else {
                    console.error('Erro ao carregar dados do usuário:', response.status);
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
            }
        }
    
        // Função para atualizar dados do usuário
        async function atualizarDadosUsuario() {
            const id = 1; // ID do usuário, ajuste conforme necessário
            const userData = {
                nome: document.getElementById('nome').value,
                dataNascimento: document.getElementById('nascimento').value,
                email: document.getElementById('email').value,
                telefone: document.getElementById('telefone').value
            };
    
            try {
                const response = await fetch(`/usuarios/atualizacao-usuario/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });
    
                if (response.ok) {
                    const updatedUser = await response.json();
                    mostrarNotificacao('Dados atualizados com sucesso!');
                } else {
                    console.error('Erro ao atualizar dados do usuário:', response.status);
                }
            } catch (error) {
                console.error('Erro ao atualizar dados do usuário:', error);
            }
        }
    
        // Função para mostrar a notificação
        function mostrarNotificacao(mensagem) {
            const notification = document.getElementById('notification');
            const notificationMessage = document.getElementById('notification-message');
            notificationMessage.textContent = mensagem;
            notification.classList.add('show');
    
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    
        // Carregar dados do usuário ao carregar a página
        carregarDadosUsuario();
    
        // Adicionar evento ao botão de salvar
        document.getElementById('save-procedimento-button').addEventListener('click', atualizarDadosUsuario);
    });
    




















});

// Funções para edição e exclusão
function editarAgendamento(id) {
    window.location.href = `agendamento-forms/editar-agendamento/editar-agendamento.html?id=${id}`;
}

function excluirAgendamento(id) {
    if (confirm("Deseja realmente excluir o agendamento?")) {
        // Implementar a lógica de exclusão do agendamento aqui
        alert("Agendamento excluído com sucesso!");
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }
});