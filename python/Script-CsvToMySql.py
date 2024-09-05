import csv
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
    phone = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '')  # Remove formatação
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

# Abre o arquivo CSV e lê os dados
with open('dados.csv', mode='r') as csvfile:
    reader = csv.DictReader(csvfile)

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

# Comando SQL para inserir dados na tabela Usuario
comando_insert_usuario = """
INSERT INTO usuario (nome, email, cpf, telefone, instagram, senha)
VALUES (%s, %s, %s, %s, %s, %s)
"""

# Comando SQL para inserir mensagem na tabela Mensagem
comando_insert_mensagem = """
INSERT INTO mensagem (descricao, id_usuario)
VALUES (%s, %s)
"""

# Abre o arquivo CSV e lê os dados
with open('dados.csv', mode='r') as csvfile:
    reader = csv.DictReader(csvfile)

    for linha in reader:
        # Formatação dos dados
        nome = capitalize_name(linha['nome_completo'])
        email = linha['email'].lower()
        cpf = format_cpf(linha['cpf'])
        telefone = format_phone(linha['telefone'])
        instagram = format_instagram(linha['instagram'])
        senha = linha['senha']  # Supondo que a senha já está devidamente tratada
        mensagem = linha['mensagem']  # Nova coluna para mensagem

        # Verifica se todos os dados estão formatados corretamente antes de inserir
        if cpf and telefone:
            # Inserir dados na tabela Usuario
            dados_usuario = (nome, email, cpf, telefone, instagram, senha)
            cursor.execute(comando_insert_usuario, dados_usuario)

            # Pegar o último id_usuario inserido
            id_usuario = cursor.lastrowid

            # Inserir mensagem na tabela Mensagem associada ao id_usuario
            dados_mensagem = (mensagem, id_usuario)
            cursor.execute(comando_insert_mensagem, dados_mensagem)

            print(f"Usuário {nome} e mensagem inseridos com sucesso!")
        else:
            print(f"Falha ao inserir o usuário {nome}.")

# Confirma as mudanças e fecha a conexão
cnx.commit()
cursor.close()
cnx.close()

print("Dados importados com sucesso!")
