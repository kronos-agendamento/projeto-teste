document.addEventListener('DOMContentLoaded', function () {
    // Captura o evento de envio do formulário do HubSpot
    hbspt.forms.create({
        region: "na1",
        portalId: "47162770",
        formId: "153aefaf-9256-4337-8cbb-54c7c9d720e0",
        onFormSubmit: function($form) {
            // Extrai os dados do formulário
            const formData = new FormData($form.get(0));
            const payload = {};

            formData.forEach((value, key) => {
                payload[key] = value; // Adiciona os dados ao payload
            });

            // Envia os dados para o servidor
            enviarDadosParaBanco(payload);
        }
    });
});

async function enviarDadosParaBanco(payload) {
    try {
        const response = await fetch('http://localhost:8080/salvar-dados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log('Dados enviados com sucesso!');
        } else {
            console.error('Erro ao enviar os dados.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}
