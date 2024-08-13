document.getElementById('save-procedimento-button').addEventListener('click', function(){

    //Pegando dados dos inputs
    const cirurgia = document.getElementById('cirurgia').value;
    const descricao = document.querySelector('input[name="descricao"]').value;


    //Cria o objeto de dados para enviar
    const requestData = {
        cirugia: cirurgia,
        descricao: descricao,
    };

    //Fazendo a requisição POST
    fetch('http//localhost:8080/api/agendamentos', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Erro ao salvar agendamento')
        }
        return response.json();
    })

    .then(data => {
        //Caso dê certo
        document.getElementById('notification-message').textContent = 'Agendamento salvo com sucesso!';
        })
        .catch(error => {
            console.error('Erro ao salvar agendamento:', error);
            document.getElementById('notification-message').textContent = 'Erro ao salvar agendamento. Tente novamente'
        });
});