import mysql.connector
import pandas as pd

# Caminho do arquivo Excel
file_path = 'C:/Users/gyuli/Downloads/novo_relatrio_05-09-2024 (2).xlsx'

# Carregar os dados da planilha
df = pd.read_excel(file_path, sheet_name='Report')

# Renomear as colunas do DataFrame para facilitar o uso
df.columns = [
    'nome', 'data_preenchimento', 'conforto_visita', 'nota_experiencia', 'facilidade_agendamento',
    'recomendacao_servicos', 'sugestao_melhoria', 'relato_experiencia', 'codigo_cliente', 
    'titulo', 'status', 'criador', 'finalizado_em', 'criado_em', 'atualizado_em', 'expirado_em', 'vencido'
]

# Selecionar apenas as colunas necessárias para a tabela
df_cleaned = df[['nome', 'data_preenchimento', 'conforto_visita', 'nota_experiencia', 'facilidade_agendamento',
                 'recomendacao_servicos', 'sugestao_melhoria', 'relato_experiencia', 'codigo_cliente']]

# Substituir NaN por None (equivalente a NULL no MySQL)
df_cleaned = df_cleaned.where(pd.notnull(df_cleaned), None)

# Verificar se há NaNs antes de prosseguir
print(df_cleaned.isna().sum())  # Isso imprimirá a contagem de valores NaN por coluna

# Converter para uma lista de tuplas para facilitar a inserção
data_to_insert = df_cleaned.values.tolist()

# Imprimir os dados a serem inseridos para verificar
print("Dados a serem inseridos:", data_to_insert)

# Configurar a conexão com o MySQL
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='gyulia06*',
    database='kronosbooking'
)

cursor = connection.cursor()

# Script SQL para criar a tabela
create_table_query = """
CREATE TABLE IF NOT EXISTS feedback_estetica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    data_preenchimento DATE,
    conforto_visita VARCHAR(255),
    nota_experiencia DECIMAL(2,1),
    facilidade_agendamento VARCHAR(3),
    recomendacao_servicos VARCHAR(3),
    sugestao_melhoria TEXT,
    relato_experiencia TEXT,
    codigo_cliente VARCHAR(15)
);
"""

# Executa a criação da tabela
cursor.execute(create_table_query)

# Script SQL para inserir os dados
insert_query = """
INSERT INTO feedback_estetica 
    (nome, data_preenchimento, conforto_visita, nota_experiencia, facilidade_agendamento, recomendacao_servicos, sugestao_melhoria, relato_experiencia, codigo_cliente)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

# Verifique se os dados estão formatados corretamente
print("Inserindo dados...")

# Insere os dados na tabela
cursor.executemany(insert_query, data_to_insert)

# Confirma a transação
connection.commit()

# Fecha o cursor e a conexão
cursor.close()
connection.close()

print("Dados inseridos com sucesso!")
