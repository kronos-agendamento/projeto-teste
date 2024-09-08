from flask import Flask, request, jsonify
from flask_cors import CORS  # Importar o CORS
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)  # Habilitando o CORS para todas as rotas

@app.route('/enviar-email', methods=['POST'])
def enviar_email():
    data = request.get_json()
    email_destino = data.get('email')
    
    if not email_destino:
        return jsonify({'error': 'Email é necessário'}), 400

    # Configurações do servidor SMTP para Outlook
    remetente = 'gyuliampiqueira@outlook.com'
    senha = 'Gsrpiq654'  # Senha da sua conta do Outlook

    try:
        # Configurando a mensagem do email
        msg = MIMEMultipart()
        msg['From'] = remetente
        msg['To'] = email_destino
        msg['Subject'] = 'Queremos ouvir sua opinião! 💬'
        
        corpo = """
        <p>Olá querida cliente,</p>
        <p>Esperamos que você tenha tido uma excelente experiência na <strong>Plenitude no Olhar</strong>! Sua satisfação é a nossa prioridade, e por isso gostaríamos de saber sua opinião sobre os serviços prestados.</p>
        <p>A sua opinião é essencial para que possamos continuar oferecendo o melhor atendimento e aprimorar cada detalhe para tornar suas visitas ainda mais agradáveis.</p>
        <p>Por favor, clique no link abaixo e preencha nosso breve formulário de feedback:</p>
        <p style="text-align: center;">
            <a href="https://app.pipefy.com/public/form/dDmFZVl8" style="background-color: #D2135D; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Preencher Formulário</a>
        </p>
        <p>Agradecemos o seu tempo e contamos com a sua ajuda para melhorar ainda mais nossos serviços!</p>
        <p>Com carinho,</p>
        <p><strong>Equipe Plenitude no Olhar</strong></p>
        <p style="font-style: italic;">Beleza que vai além do olhar ✨</p>
        """
        msg.attach(MIMEText(corpo, 'html'))

        # Conectando ao servidor SMTP do Outlook
        servidor = smtplib.SMTP('smtp.office365.com', 587)
        servidor.starttls()
        servidor.login(remetente, senha)

        # Enviando o email
        servidor.send_message(msg)
        servidor.quit()

        return jsonify({'message': 'Email enviado com sucesso!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
