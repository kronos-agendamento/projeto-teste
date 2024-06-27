document.addEventListener('DOMContentLoaded', async function () {
    const baseUrl = 'http://localhost:8080';

    const urlParams = new URLSearchParams(window.location.search);
    const procedimentoId = urlParams.get('id');

    if (!procedimentoId) {
        console.error('ID do procedimento não encontrado na URL.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/especificacoes/listar-por-id/${procedimentoId}`);
        const procedimento = await response.json();

        document.getElementById('pesquisar').value = procedimento.fkProcedimento.tipo;
        document.getElementById('especificacao').value = procedimento.especificacao;
        document.getElementById('valor-colocacao').value = `R$ ${procedimento.precoColocacao.toFixed(2).replace('.', ',')}`;
        document.getElementById('valor-retirada').value = `R$ ${procedimento.precoRetirada.toFixed(2).replace('.', ',')}`;
        document.getElementById('valor-manutencao').value = `R$ ${procedimento.precoManutencao.toFixed(2).replace('.', ',')}`;

        const tempoColocacaoMinutos = parseTempoMinutos(procedimento.fkTempoProcedimento.tempoColocacao);
        const horas = Math.floor(tempoColocacaoMinutos / 60);
        const minutos = tempoColocacaoMinutos % 60;
        document.getElementById('duracao-horas').value = horas;
        document.getElementById('duracao-minutos').value = minutos;

    } catch (error) {
        console.error('Erro ao buscar dados do procedimento:', error);
        showNotification('Erro ao carregar procedimento!', true);
    }

    document.querySelector('.save-button').addEventListener('click', async function (event) {
        event.preventDefault();

        const procedimento = {
            tipo: document.getElementById('pesquisar').value,
            descricao: document.getElementById('especificacao').value,
        };

        const especificacao = {
            especificacao: document.getElementById('especificacao').value,
            precoColocacao: parseFloat(document.getElementById('valor-colocacao').value.replace('R$', '').replace(',', '.')),
            precoManutencao: parseFloat(document.getElementById('valor-manutencao').value.replace('R$', '').replace(',', '.')),
            precoRetirada: parseFloat(document.getElementById('valor-retirada').value.replace('R$', '').replace(',', '.')),
            fkTempoProcedimentoId: procedimentoId,
            fkProcedimentoId: procedimentoId,
        };

        const tempoColocacao = `${formatTime(document.getElementById('duracao-horas').value)}:${formatTime(document.getElementById('duracao-minutos').value)}`;
        const tempoProcedimento = {
            tempoColocacao: tempoColocacao,
            tempoManutencao: "00:00", // assuming default values
            tempoRetirada: "00:00", // assuming default values
        };

        const updateEspecificacao = fetch(`${baseUrl}/especificacoes/atualizacao-especificacao/${procedimentoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(especificacao),
        });

        const updateTempo = fetch(`${baseUrl}/api/tempos/${procedimentoId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tempoProcedimento),
        });

        const updateProcedimento = fetch(`${baseUrl}/api/procedimentos/atualizar/${procedimentoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(procedimento),
        });

        try {
            const [especificacaoResponse, tempoResponse, procedimentoResponse] = await Promise.all([updateEspecificacao, updateTempo, updateProcedimento]);

            const messages = [];
            if (especificacaoResponse.ok) messages.push('Especificação atualizada com sucesso!');
            if (tempoResponse.ok) messages.push('Duração atualizada com sucesso!');
            if (procedimentoResponse.ok) messages.push('Procedimento atualizado com sucesso!');

            if (messages.length === 3) {
                showNotification('Todos os dados foram atualizados com sucesso!');
            } else {
                messages.forEach(message => showNotification(message));
                if (messages.length < 3) showNotification('Nem todos os dados foram atualizados!', true);
            }
        } catch (error) {
            console.error('Erro ao atualizar o procedimento:', error);
            showNotification('Erro ao salvar procedimento!', true);
        }
    });
});

function parseTempoMinutos(tempo) {
    const parts = tempo.split(':');
    if (parts.length === 2) {
        const horas = parseInt(parts[0], 10);
        const minutos = parseInt(parts[1], 10);
        return horas * 60 + minutos;
    }
    return 0;
}

function formatTime(value) {
    return value.toString().padStart(2, '0');
}

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

document.addEventListener('DOMContentLoaded', function () {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');

    if (nome && email) {
        document.getElementById('userName').textContent = nome;
        document.getElementById('userEmail').textContent = email;
    }
});