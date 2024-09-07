import mysql.connector
import pandas as pd
import numpy as np  # Certifique-se de importar o numpy

# Caminho do arquivo Excel
file_path = 'C:/Users/gyuli/Downloads/novo_relatrio.xlsx'

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

# Substituir NaN por None (equivalente a NULL no MySQL) e garantir que 'None' seja inserido corretamente
df_cleaned = df_cleaned.replace({np.nan: None})

# Configurar a conexão com o MySQL
connection = mysql.connector.connect(
    host='localhost',
    user='root',
    password='gyulia06*',
    database='kronosbooking'
)

cursor = connection.cursor()

# Script SQL para criar a tabela, caso ainda não exista
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
    codigo_cliente VARCHAR(15) UNIQUE
);
"""

# Executa a criação da tabela
cursor.execute(create_table_query)

# Script SQL para verificar se o codigo_cliente já existe
check_exists_query = """
SELECT COUNT(*) FROM feedback_estetica WHERE codigo_cliente = %s;
"""

# Script SQL para inserir os dados
insert_query = """
INSERT INTO feedback_estetica 
    (nome, data_preenchimento, conforto_visita, nota_experiencia, facilidade_agendamento, recomendacao_servicos, sugestao_melhoria, relato_experiencia, codigo_cliente)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);
"""

# Loop para verificar se o registro já existe e inserir caso contrário
for row in df_cleaned.itertuples(index=False, name=None):
    codigo_cliente = row[8]  # O código do cliente é o 9º campo
    cursor.execute(check_exists_query, (codigo_cliente,))
    result = cursor.fetchone()
    
    if result[0] == 0:
        cursor.execute(insert_query, row)
        print(f"Inserido o código cliente: {codigo_cliente}")
    else:
        print(f"Registro com o código cliente {codigo_cliente} já existe. Não inserido.")

# Confirma a transação
connection.commit()

# Fecha o cursor e a conexão
cursor.close()
connection.close()

print("Processo de inserção concluído!")
