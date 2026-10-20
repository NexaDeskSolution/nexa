-- 1. Usuários do Sistema (Acesso e Técnicos)
CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(50) DEFAULT 'Tecnico', -- Ex: Administrador, Tecnico
    status INT DEFAULT 1,
    data_criacao DATETIME DEFAULT GETDATE()
);
GO

-- 2. Clientes
CREATE TABLE clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome_fantasia VARCHAR(100) NOT NULL,
    cnpj_cpf VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(254) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    status INT DEFAULT 1,
    data_cadastro DATETIME DEFAULT GETDATE()
);
GO

-- 3. Fornecedores
CREATE TABLE fornecedores (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(150),
    status INT DEFAULT 1
);
GO

-- 4. Estoque de Peças
CREATE TABLE estoque (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fornecedor_id INT NULL,
    nome_peca VARCHAR(150) NOT NULL,
    quantidade_atual INT NOT NULL DEFAULT 0,
    quantidade_minima INT NOT NULL DEFAULT 5, -- Para gerar o alerta vermelho
    valor_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_estoque_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);
GO

-- 5. Equipamentos
CREATE TABLE equipamentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    numero_serie VARCHAR(100) UNIQUE,
    categoria VARCHAR(50), -- Hardware, Rede, etc.
    data_cadastro DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_equipamento_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
GO

-- 6. Chamados
CREATE TABLE chamados (
    id INT IDENTITY(1001,1) PRIMARY KEY, -- Começando do 1001
    cliente_id INT NOT NULL,
    tecnico_id INT NULL,
    equipamento_id INT NULL,
    assunto VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) NOT NULL, -- Puxado do HTML: HARDWARE, SOFTWARE, REDE, SEGURANÇA, etc.
    prioridade VARCHAR(20) DEFAULT 'MÉDIA', -- Puxado do HTML: BAIXA, MÉDIA, ALTA, CRÍTICA
    status VARCHAR(50) DEFAULT 'Em aberto', -- Puxado do HTML: Em aberto, Em manutenção, Aguardando peça, Finalizados
    data_abertura DATETIME DEFAULT GETDATE(),
    data_fechamento DATETIME NULL,
    
    CONSTRAINT fk_chamados_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT fk_chamados_tecnico FOREIGN KEY (tecnico_id) REFERENCES usuarios(id),
    CONSTRAINT fk_chamados_equipamento FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id)
);
GO

-- 7. Orçamentos (Financeiro vinculado aos chamados)
CREATE TABLE orcamentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    chamado_id INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente', -- Pendente, Aprovado, Recusado
    data_emissao DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_orcamento_chamado FOREIGN KEY (chamado_id) REFERENCES chamados(id)
);
GO

-- 8. Histórico / Auditoria
CREATE TABLE historico_auditoria (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL,
    acao VARCHAR(255) NOT NULL,
    tabela_afetada VARCHAR(50),
    registro_id INT,
    data_acao DATETIME DEFAULT GETDATE(),
    CONSTRAINT fk_historico_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
GO
