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
}
document.addEventListener('DOMContentLoaded', async () => {
    const cpf = localStorage.getItem('cpf');
    if (cpf) {
        const userData = await fetchUserDataByCpf(cpf);
        if (userData) {
            fillUserProfile(userData);
        }
    }
});

function fillUserProfile(userData) {
    document.getElementById('nome').value = userData.nome || '';
    document.getElementById('nascimento').value = userData.dataNasc || '';
    document.getElementById('telefone').value = userData.telefone || '';
    document.getElementById('telefoneEmergencial').value = userData.telefoneEmergencial || '';
    document.getElementById('genero').value = userData.genero || '';
    document.getElementById('instagram').value = userData.instagram || '';
    document.getElementById('email').value = userData.email || '';
    document.getElementById('senha').value = userData.senha || '';
    document.getElementById('empresa').value = userData.empresa || '';
    document.getElementById('cnpj').value = userData.empresa || '';
    document.getElementById('endereco').value = userData.endereco.logradouro || '';
}
