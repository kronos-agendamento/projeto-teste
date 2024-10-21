from flask import Flask, request, jsonify
from flask_cors import CORS  # Importar o CORS
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)  # Habilitando o CORS para todas as rotas

@app.route('/enviar-email-status', methods=['POST'])
def enviar_email():
    data = request.get_json()
    email_destino = data.get('email')
    mensagem= data.get('mensagem') 
    

    if not email_destino or not mensagem:
        return jsonify({'error': 'Email e status são necessários'}), 400

    # Configurações do servidor SMTP para Gmail
    remetente = 'gyugyulia64@gmail.com'  # Seu email do Gmail
    senha = 'bfzf asbi vdul ikwr'   # Senha de aplicativo do Gmail

    try:
        # Configurando a mensagem do email
        msg = MIMEMultipart()
        msg['From'] = remetente
        msg['To'] = email_destino
        msg['Subject'] = 'Atualização de Status do Agendamento - Plenitude no Olhar' 

        # Corpo do e-mail que será enviado ao cliente
        corpo = f"""
        <p> <strong>{mensagem}</strong></p>
        <p>Caso tenha alguma dúvida ou precise de mais informações, estamos à disposição.</p>
        <p>Atenciosamente,</p>
        <p><strong>Equipe Plenitude no Olhar</strong></p>
        <p style="font-style: italic;">Beleza que vai além do olhar ✨</p>
        """

        msg.attach(MIMEText(corpo, 'html'))

        # Conectando ao servidor SMTP do Gmail
        servidor = smtplib.SMTP('smtp.gmail.com', 587)
        servidor.starttls()
        servidor.login(remetente, senha)

        # Enviando o email
        servidor.send_message(msg)
        servidor.quit()

        return jsonify({'message': 'Email enviado com sucesso!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
