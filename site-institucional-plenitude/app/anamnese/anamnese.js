// document.getElementById('save-procedimento-button').addEventListener('click', function(){

//     //Pegando dados dos inputs
//     const cirurgia = document.getElementById('cirurgia').value;
//     const descricao = document.querySelector('input[name="descricao"]').value;
//     const botaoModal = document.querySelector('actions button')
    
    
//     // botaoModal.onclick = function() {
//     //     modal.showModal()
//     // }
    


// })

var btn = document.getElementsByClassName('planilha-btn')[0];
var modal = document.getElementsByTagName('dialog')[0]; // Primeiro modal na página

btn.onclick = function() {
    modal.showModal();
}

const cirurgia = document.getElementById('cirugia').value
const descricao = document.getElementById('descricao').value


    //Cria o objeto de dados para enviar
    const requestData = {
        cirugia: cirurgia,
        descricao: descricao,
    };

    //Fazendo a requisição POST
    fetch('http://localhost:8080/api/agendamentos', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(data => {
        // Exibe mensagem de sucesso
        document.getElementById('notification-message').textContent = 'Agendamento salvo com sucesso!';
    })
    .catch(error => {
        console.error('Erro ao salvar agendamento:', error);
        document.getElementById('notification-message').textContent = 'Erro ao salvar agendamento. Tente novamente';
    });

    

;