import pandas as pd
import mysql.connector

# Função para mostrar notificações
def show_notification(message, is_error=False):
    if is_error:
        print(f"Erro: {message}")
    else:
        print(f"Sucesso: {message}")

# Função para formatar CPF
def format_cpf(cpf):
    cpf = cpf.replace('.', '').replace('-', '')  # Remove pontos e traços
    if len(cpf) == 11:
        formatted_cpf = f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"
        print(f"CPF: {formatted_cpf}")
        return formatted_cpf
    else:
        show_notification("CPF inválido!", True)
        return None

# Função para formatar telefone (remover formatação)
def format_phone(phone):
    phone = phone.replace('', '').replace('', '').replace('', '').replace('', '')  # Remove formatação
    if len(phone) == 11:
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
    password='#Gf47148790816',
    host='localhost',
    database='kronosbooking'
)
cursor = cnx.cursor()

# Comando SQL para inserir dados no usuário
comando_insert_usuario = """
INSERT INTO usuario (nome, email, cpf, telefone, instagram, senha)
VALUES (%s, %s, %s, %s, %s, %s)
"""

# Comando SQL para inserir dados na mensagem
comando_insert_mensagem = """
INSERT INTO mensagem (descricao, id_usuario)
VALUES (%s, %s)
"""

# Lê o arquivo XLSX
df = pd.read_excel('dados.xlsx')

for index, linha in df.iterrows():
    # Formatação dos dados
    nome = capitalize_name(linha['Nome'])
    email = linha['Email'].lower()
    cpf = format_cpf(linha['CPF'])
    telefone = format_phone(linha['Telefone'])
    instagram = format_instagram(linha['Instagram'])
    senha = linha['Senha']  # Supondo que a senha já está devidamente tratada

    # Verifica se todos os dados estão formatados corretamente antes de inserir
    if cpf and telefone:
        dados_usuario = (nome, email, cpf, telefone, instagram, senha)
        cursor.execute(comando_insert_usuario, dados_usuario)
        user_id = cursor.lastrowid  # Obtém o ID do último usuário inserido
        show_notification(f"Usuário {nome} inserido com sucesso!")

        # Inserir mensagem associada ao usuário
        mensagem = "Mensagem padrão para novos usuários"  # Altere conforme necessário
        dados_mensagem = (mensagem, user_id)
        cursor.execute(comando_insert_mensagem, dados_mensagem)
        show_notification(f"Mensagem para o usuário {nome} inserida com sucesso!")
    else:
        show_notification(f"Falha ao inserir o usuário {nome}.", True)

# Confirma as mudanças e fecha a conexão
cnx.commit()
cursor.close()
cnx.close()

print("Dados importados com sucesso!")
