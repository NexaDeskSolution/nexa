
-- 0. CRIAÇÃO DO BANCO (Caso não esteja com a database ainda, use essa parte)

--CREATE DATABASE NexaDesk;
--GO
--USE NexaDesk;
--GO



-- 1. USUÁRIOS

CREATE TABLE usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL DEFAULT 'TÉCNICO',
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    data_criacao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT ck_usuarios_perfil
        CHECK (perfil IN ('ADMINISTRADOR', 'TÉCNICO', 'ATENDENTE')),

    CONSTRAINT ck_usuarios_status
        CHECK (status IN ('ATIVO', 'INATIVO'))
);
GO



-- 2. CLIENTES

CREATE TABLE clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome_fantasia VARCHAR(150) NOT NULL,
    cnpj_cpf VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(254) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    data_cadastro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT ck_clientes_status
        CHECK (status IN ('ATIVO', 'INATIVO'))
);
GO



-- 3. TÉCNICOS
-- Um técnico continua sendo um usuário do sistema, mas possui
-- informações profissionais próprias.

CREATE TABLE tecnicos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    especialidade VARCHAR(50) NOT NULL,
    data_contratacao DATE NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT fk_tecnicos_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),

    CONSTRAINT ck_tecnicos_especialidade
        CHECK (
            especialidade IN (
                'HARDWARE',
                'SOFTWARE',
                'REDES',
                'SEGURANÇA',
                'INFRAESTRUTURA'
            )
        ),

    CONSTRAINT ck_tecnicos_status
        CHECK (status IN ('ATIVO', 'INATIVO'))
);
GO



-- 4. FORNECEDORES

CREATE TABLE fornecedores (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    telefone VARCHAR(20) NULL,
    email VARCHAR(150) NULL,
    endereco VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',

    CONSTRAINT ck_fornecedores_status
        CHECK (status IN ('ATIVO', 'INATIVO'))
);
GO


-- 5. ESTOQUE DE PEÇAS
-- A situação do estoque é calculada automaticamente.

CREATE TABLE estoque (
    id INT IDENTITY(1,1) PRIMARY KEY,
    fornecedor_id INT NULL,
    nome_peca VARCHAR(150) NOT NULL,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    quantidade_atual INT NOT NULL DEFAULT 0,
    quantidade_minima INT NOT NULL DEFAULT 5,
    valor_unitario DECIMAL(12,2) NOT NULL DEFAULT 0,

    situacao AS (
        CASE
            WHEN quantidade_atual <= quantidade_minima
                THEN 'ESTOQUE BAIXO'
            ELSE 'DISPONÍVEL'
        END
    ) PERSISTED,

    CONSTRAINT fk_estoque_fornecedor
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),

    CONSTRAINT ck_estoque_quantidade
        CHECK (quantidade_atual >= 0),

    CONSTRAINT ck_estoque_minimo
        CHECK (quantidade_minima >= 0),

    CONSTRAINT ck_estoque_valor
        CHECK (valor_unitario >= 0)
);
GO



-- 6. EQUIPAMENTOS

CREATE TABLE equipamentos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    patrimonio VARCHAR(50) NOT NULL UNIQUE,
    tipo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NULL,
    modelo VARCHAR(100) NULL,
    numero_serie VARCHAR(100) NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'DISPONÍVEL',
    data_cadastro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_equipamento_cliente
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),

    CONSTRAINT ck_equipamento_status
        CHECK (
            status IN (
                'DISPONÍVEL',
                'EM SERVIÇO',
                'EM MANUTENÇÃO',
                'AGUARDANDO PEÇA',
                'FINALIZADO',
                'DEVOLVIDO'
            )
        )
);
GO


-- 7. CHAMADOS

CREATE TABLE chamados (
    id INT IDENTITY(1001,1) PRIMARY KEY,

    cliente_id INT NOT NULL,
    tecnico_id INT NULL,
    equipamento_id INT NULL,

    assunto VARCHAR(150) NULL,
    descricao VARCHAR(MAX) NOT NULL,

    categoria VARCHAR(50) NOT NULL,
    prioridade VARCHAR(20) NOT NULL DEFAULT 'MÉDIA',
    status VARCHAR(50) NOT NULL DEFAULT 'ABERTO',

    data_abertura DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    data_fechamento DATETIME2 NULL,

    CONSTRAINT fk_chamados_cliente
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),

    CONSTRAINT fk_chamados_tecnico
        FOREIGN KEY (tecnico_id) REFERENCES tecnicos(id),

    CONSTRAINT fk_chamados_equipamento
        FOREIGN KEY (equipamento_id) REFERENCES equipamentos(id),

    CONSTRAINT ck_chamados_categoria
        CHECK (
            categoria IN (
                'HARDWARE',
                'SOFTWARE',
                'REDE',
                'SEGURANÇA',
                'INFRAESTRUTURA',
                'OUTROS'
            )
        ),

    CONSTRAINT ck_chamados_prioridade
        CHECK (
            prioridade IN (
                'BAIXA',
                'MÉDIA',
                'ALTA',
                'CRÍTICA'
            )
        ),

    CONSTRAINT ck_chamados_status
        CHECK (
            status IN (
                'ABERTO',
                'TRIAGEM',
                'ANÁLISE',
                'AGUARDANDO PEÇA',
                'MANUTENÇÃO',
                'AGUARDANDO CLIENTE',
                'FINALIZADO',
                'SEM SOLUÇÃO'
            )
        ),

    CONSTRAINT ck_chamados_datas
        CHECK (
            data_fechamento IS NULL
            OR data_fechamento >= data_abertura
        )
);
GO



-- 8. PEÇAS UTILIZADAS EM CHAMADOS

CREATE TABLE chamado_pecas (
    id INT IDENTITY(1,1) PRIMARY KEY,

    chamado_id INT NOT NULL,
    estoque_id INT NOT NULL,

    quantidade INT NOT NULL DEFAULT 1,
    valor_unitario DECIMAL(12,2) NOT NULL,

    data_utilizacao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_chamado_pecas_chamado
        FOREIGN KEY (chamado_id) REFERENCES chamados(id),

    CONSTRAINT fk_chamado_pecas_estoque
        FOREIGN KEY (estoque_id) REFERENCES estoque(id),

    CONSTRAINT ck_chamado_pecas_quantidade
        CHECK (quantidade > 0),

    CONSTRAINT ck_chamado_pecas_valor
        CHECK (valor_unitario >= 0)
);
GO



-- 9. SERVIÇOS REALIZADOS EM CHAMADOS

CREATE TABLE chamado_servicos (
    id INT IDENTITY(1,1) PRIMARY KEY,

    chamado_id INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(12,2) NOT NULL DEFAULT 0,

    data_registro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_chamado_servicos_chamado
        FOREIGN KEY (chamado_id) REFERENCES chamados(id),

    CONSTRAINT ck_chamado_servicos_valor
        CHECK (valor >= 0)
);
GO



-- 10. ORÇAMENTOS

CREATE TABLE orcamentos (
    id INT IDENTITY(1,1) PRIMARY KEY,

    chamado_id INT NOT NULL,

    valor_servicos DECIMAL(12,2) NOT NULL DEFAULT 0,
    valor_pecas DECIMAL(12,2) NOT NULL DEFAULT 0,

    valor_total AS (
        valor_servicos + valor_pecas
    ) PERSISTED,

    status VARCHAR(30) NOT NULL DEFAULT 'ORÇAMENTO',

    data_emissao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    data_atualizacao DATETIME2 NULL,

    CONSTRAINT fk_orcamento_chamado
        FOREIGN KEY (chamado_id) REFERENCES chamados(id),

    CONSTRAINT ck_orcamento_valor_servicos
        CHECK (valor_servicos >= 0),

    CONSTRAINT ck_orcamento_valor_pecas
        CHECK (valor_pecas >= 0),

    CONSTRAINT ck_orcamento_status
        CHECK (
            status IN (
                'ORÇAMENTO',
                'AGUARDANDO APROVAÇÃO',
                'APROVADO',
                'RECUSADO',
                'PAGO'
            )
        )
);
GO



-- 11. PAGAMENTOS / FINANCEIRO

CREATE TABLE pagamentos (
    id INT IDENTITY(1,1) PRIMARY KEY,

    orcamento_id INT NOT NULL,

    valor_recebido DECIMAL(12,2) NOT NULL,
    forma_pagamento VARCHAR(30) NOT NULL,
    data_pagamento DATE NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',

    observacao VARCHAR(255) NULL,

    data_registro DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_pagamentos_orcamento
        FOREIGN KEY (orcamento_id) REFERENCES orcamentos(id),

    CONSTRAINT ck_pagamentos_valor
        CHECK (valor_recebido >= 0),

    CONSTRAINT ck_pagamentos_forma
        CHECK (
            forma_pagamento IN (
                'PIX',
                'Cartão',
                'Transferência',
                'Dinheiro',
                'Boleto'
            )
        ),

    CONSTRAINT ck_pagamentos_status
        CHECK (
            status IN (
                'PENDENTE',
                'PAGO'
            )
        )
);
GO


-- 12. HISTÓRICO / AUDITORIA

CREATE TABLE historico_auditoria (
    id INT IDENTITY(1,1) PRIMARY KEY,

    usuario_id INT NOT NULL,

    acao VARCHAR(255) NOT NULL,
    tabela_afetada VARCHAR(100) NULL,
    registro_id INT NULL,
    detalhes VARCHAR(1000) NULL,

    data_acao DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_historico_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
GO



-- 13. ÍNDICES


CREATE INDEX ix_chamados_cliente
    ON chamados(cliente_id);

CREATE INDEX ix_chamados_tecnico
    ON chamados(tecnico_id);

CREATE INDEX ix_chamados_status
    ON chamados(status);

CREATE INDEX ix_chamados_prioridade
    ON chamados(prioridade);

CREATE INDEX ix_chamados_data_abertura
    ON chamados(data_abertura);


CREATE INDEX ix_equipamentos_cliente
    ON equipamentos(cliente_id);

CREATE INDEX ix_equipamentos_status
    ON equipamentos(status);


CREATE INDEX ix_estoque_fornecedor
    ON estoque(fornecedor_id);

CREATE INDEX ix_estoque_quantidade
    ON estoque(quantidade_atual, quantidade_minima);


CREATE INDEX ix_chamado_pecas_chamado
    ON chamado_pecas(chamado_id);

CREATE INDEX ix_chamado_pecas_estoque
    ON chamado_pecas(estoque_id);


CREATE INDEX ix_chamado_servicos_chamado
    ON chamado_servicos(chamado_id);


CREATE INDEX ix_orcamentos_chamado
    ON orcamentos(chamado_id);

CREATE INDEX ix_orcamentos_status
    ON orcamentos(status);


CREATE INDEX ix_pagamentos_orcamento
    ON pagamentos(orcamento_id);

CREATE INDEX ix_pagamentos_status
    ON pagamentos(status);

CREATE INDEX ix_pagamentos_data
    ON pagamentos(data_pagamento);


CREATE INDEX ix_historico_usuario
    ON historico_auditoria(usuario_id);

CREATE INDEX ix_historico_data
    ON historico_auditoria(data_acao);

CREATE INDEX ix_historico_registro
    ON historico_auditoria(tabela_afetada, registro_id);
GO



-- 14. VIEW - MEUS CHAMADOS


CREATE VIEW vw_meus_chamados AS
SELECT
    c.id AS chamado_id,
    c.cliente_id,
    cl.nome_fantasia AS cliente,

    c.assunto,
    c.prioridade,
    c.status,
    c.data_abertura,

    t.id AS tecnico_id,

    u.nome AS tecnico,
    u.email AS tecnico_email

FROM chamados c

INNER JOIN clientes cl
    ON cl.id = c.cliente_id

LEFT JOIN tecnicos t
    ON t.id = c.tecnico_id

LEFT JOIN usuarios u
    ON u.id = t.usuario_id;
GO



-- 15. VIEW - ORÇAMENTOS

CREATE VIEW vw_orcamentos AS
SELECT
    o.id AS orcamento_id,

    o.chamado_id,

    cl.id AS cliente_id,
    cl.nome_fantasia AS cliente,

    o.valor_servicos,
    o.valor_pecas,
    o.valor_total,

    o.status,

    o.data_emissao,
    o.data_atualizacao

FROM orcamentos o

INNER JOIN chamados c
    ON c.id = o.chamado_id

INNER JOIN clientes cl
    ON cl.id = c.cliente_id;
GO



-- 16. VIEW - FINANCEIRO


CREATE VIEW vw_financeiro AS
SELECT
    p.id AS pagamento_id,

    p.orcamento_id,

    c.id AS cliente_id,
    c.nome_fantasia AS cliente,

    p.valor_recebido,
    p.forma_pagamento,
    p.data_pagamento,
    p.status,
    p.observacao

FROM pagamentos p

INNER JOIN orcamentos o
    ON o.id = p.orcamento_id

INNER JOIN chamados ch
    ON ch.id = o.chamado_id

INNER JOIN clientes c
    ON c.id = ch.cliente_id;
GO
