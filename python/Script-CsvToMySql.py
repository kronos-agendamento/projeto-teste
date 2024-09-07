import csv
import mysql.connector
from datetime import datetime

# Função para mostrar notificações
def show_notification(message, is_error=False):
    if is_error:
        print(f"Erro: {message}")
    else:
        print(f"Sucesso: {message}")

# Função para remover formatação de telefone (mantendo apenas números)
def format_phone(phone):
    phone = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')  # Remove formatação
    if phone.isdigit() and len(phone) >= 10:
        print(f"Telefone: {phone}")
        return phone
    else:
        show_notification("Telefone inválido!", True)
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
    password='#Gf47148790816',  # Sua senha do MySQL
    host='localhost',
    database='kronosbooking'  # Nome do banco de dados
)
cursor = cnx.cursor()

# Comando SQL para inserir dados na tabela Leads
comando_insert_lead = """
INSERT INTO Leads (nome, email, telefone, instagram, mensagem, data_criacao)
VALUES (%s, %s, %s, %s, %s, %s)
"""

# Abre o arquivo CSV e lê os dados
with open('dados.csv', mode='r') as csvfile:
    reader = csv.DictReader(csvfile)

    for linha in reader:
        # Formatação dos dados
        nome = capitalize_name(linha['nome_completo'])
        email = linha['email'].lower()
        telefone = format_phone(linha['telefone'])
        instagram = format_instagram(linha['instagram'])
        mensagem = linha['mensagem']

        # Data de criação (vindo do Pipefy ou outra fonte)
        data_criacao_str = linha['data_criacao']  # Exemplo: '2024-09-06 12:34:56'
        try:
            data_criacao = datetime.strptime(data_criacao_str, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            show_notification(f"Formato de data inválido para {nome}: {data_criacao_str}", True)
            continue

        # Verifica se todos os dados estão formatados corretamente antes de inserir
        if telefone:
            # Inserir dados na tabela Leads
            dados_lead = (nome, email, telefone, instagram, mensagem, data_criacao)
            cursor.execute(comando_insert_lead, dados_lead)

            print(f"Lead {nome} inserido com sucesso!")
        else:
            print(f"Falha ao inserir o lead {nome}.")

# Confirma as mudanças e fecha a conexão
cnx.commit()
cursor.close()
cnx.close()

print("Dados importados com sucesso!")

