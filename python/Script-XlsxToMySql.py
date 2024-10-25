import pandas as pd
import mysql.connector
from datetime import datetime

# Função para mostrar notificações
def show_notification(message, is_error=False):
    if is_error:
        print(f"Erro: {message}")
    else:
        print(f"Sucesso: {message}")

# Função para formatar telefone (remover formatação e validar)
def format_phone(phone):
    try:
        phone = int(phone)  # Converte para número inteiro
        if len(str(phone)) >= 10:  # Verifica se tem pelo menos 10 dígitos
            print(f"Telefone: {phone}")
            return phone
        else:
            show_notification("Telefone inválido!", True)
            return None
    except ValueError:
        show_notification("Formato de telefone inválido!", True)
        return None

# Função para formatar Instagram
def format_instagram(instagram):
    if not instagram.startswith('@'):
        instagram = '@' + instagram
    instagram = instagram.replace(' ', '_').lower()  # Substitui espaços por sublinhados e transforma em minúsculo
    print(f"Instagram: {instagram}")
    return instagram

# Função para capitalizar nomes
def capitalize_name(name):
    capitalized_name = ' '.join([word.capitalize() for word in name.split()])
    print(f"Nome: {capitalized_name}")
    return capitalized_name

# Configuração do banco de dados MySQL
cnx = mysql.connector.connect(
    user='root',
    password='#Gf47148790816',
    host='localhost',
    database='kronosbooking'
)
cursor = cnx.cursor()

# Comando SQL para inserir dados na tabela Leads
comando_insert_lead = """
INSERT INTO Leads (nome, email, telefone, instagram, mensagem, data_criacao)
VALUES (%s, %s, %s, %s, %s, %s)
"""

# Lê o arquivo XLSX
df = pd.read_excel('dados.xlsx')

for index, linha in df.iterrows():
    # Formatação dos dados
    nome = capitalize_name(linha['Nome'])
    email = linha['Email'].lower()
    telefone = format_phone(linha['Telefone'])  # Formata o telefone como inteiro
    instagram = format_instagram(linha['Instagram'])
    mensagem = linha['Mensagem']  # Usa a mensagem da planilha
    data_criacao = datetime.now()  # Data e hora atual

    # Verifica se o telefone é válido antes de inserir
    if telefone:
        dados_lead = (nome, email, telefone, instagram, mensagem, data_criacao)
        cursor.execute(comando_insert_lead, dados_lead)
        show_notification(f"Lead {nome} inserido com sucesso!")
    else:
        show_notification(f"Falha ao inserir o lead {nome}.", True)

# Confirma as mudanças e fecha a conexão
cnx.commit()
cursor.close()
cnx.close()

print("Dados importados com sucesso!")

