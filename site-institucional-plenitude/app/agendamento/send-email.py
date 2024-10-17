import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# Função para enviar e-mail de forma dinâmica
def enviar_email_para_cliente(cliente_email, nome_cliente, novo_status, email_sender, email_password):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    # Configuração do e-mail
    msg = MIMEMultipart()
    msg["From"] = email_sender
    msg["To"] = cliente_email
    msg["Subject"] = "Atualização no Status do seu Agendamento"

    # Corpo do e-mail
    body = f"""
    Olá {nome_cliente},

    O status do seu agendamento foi atualizado para: {novo_status}.

    Agradecemos por escolher nossos serviços.
    
    Atenciosamente,
    Equipe de Atendimento
    """
    msg.attach(MIMEText(body, "plain"))

    try:
        # Conectar ao servidor SMTP e enviar o e-mail
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_sender, email_password)
        server.sendmail(email_sender, cliente_email, msg.as_string())
        server.quit()
        print(f"E-mail enviado para {cliente_email} com sucesso!")
    except Exception as e:
        print(f"Erro ao enviar e-mail: {e}")

# Recebe argumentos via linha de comando ou API
if __name__ == "__main__":
    # Argumentos recebidos dinamicamente: cliente_email, nome_cliente, novo_status
    if len(sys.argv) < 5:
        print("Uso: python3 enviar_email.py <cliente_email> <nome_cliente> <novo_status> <email_sender> <email_password>")
        sys.exit(1)

    cliente_email = sys.argv[1]  # Email do cliente recebido
    nome_cliente = sys.argv[2]   # Nome do cliente
    novo_status = sys.argv[3]    # Novo status do agendamento
    email_sender = sys.argv[4]   # E-mail do remetente
    email_password = sys.argv[5] # Senha do e-mail do remetente

    # Chama a função para enviar o e-mail
    enviar_email_para_cliente(cliente_email, nome_cliente, novo_status, email_sender, email_password)
