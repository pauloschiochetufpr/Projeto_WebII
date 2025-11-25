drop database manutencao;

Create DATABASE manutencao;

Use manutencao;

Create table cep(
    cep VARCHAR(8) PRIMARY KEY,      
    logradouro VARCHAR(255),
    complemento VARCHAR(255),
    bairro VARCHAR(128),
    localidade VARCHAR(128),
    uf CHAR(2),
    ibge VARCHAR(7),
    gia VARCHAR(20),
    ddd VARCHAR(3),
    siafi VARCHAR(10)
);

CREATE TABLE endereco (
    id_endereco INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    localidade VARCHAR(128) NOT NULL,
    logradouro VARCHAR(128) NOT NULL,
    bairro VARCHAR(128) NOT NULL,
    complemento VARCHAR(255) NOT NULL,
    numero INT UNSIGNED NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cep)
        REFERENCES Cep (cep)
);

CREATE TABLE ddd_validos (
    ddd CHAR(2) PRIMARY KEY
);

CREATE TABLE cliente (
    id_cliente BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    telefone VARCHAR(13) NOT NULL,
    senha_hash VARCHAR(64) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cliente_endereco (
    id_cliente BIGINT UNSIGNED,
    id_endereco INT UNSIGNED,
    FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente),
    FOREIGN KEY (id_endereco)
        REFERENCES endereco (id_endereco),
    PRIMARY KEY (id_cliente , id_endereco)
);

CREATE TABLE categoria (
    id_categoria INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ativo BOOLEAN DEFAULT TRUE,
    nome VARCHAR(64) NOT NULL
);

-- Status --
INSERT INTO stat (stat) VALUES ('ABERTA');
INSERT INTO stat (stat) VALUES ('ORÇADA');
INSERT INTO stat (stat) VALUES ('APROVADA');
INSERT INTO stat (stat) VALUES ('REJEITADA');
INSERT INTO stat (stat) VALUES ('ARRUMADA');
INSERT INTO stat (stat) VALUES ('PAGA');
INSERT INTO stat (stat) VALUES ('FINALIZADA');
INSERT INTO stat (stat) VALUES ('REDIRECIONADA');

-- Categorias --
INSERT INTO categoria (nome) VALUES 
('Notebook'),
('Desktop'),
('Impressora'),
('Mouse'),
('Teclado');

INSERT INTO categoria (nome) VALUES 
('treko');

CREATE TABLE funcionario (
    id_funcionario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    data_nasc DATE NOT NULL,
    telefone VARCHAR(13) NOT NULL,
	senha_hash VARCHAR(64) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

insert into funcionario(nome, email, data_nasc, telefone, senha_hash) values ("Inicial",  "func@gmail.com", '2006-03-07', "41999999999", "$2a$10$x9f/RMVsG1v./xLqaMIgRejvr4.O3m8Ns0Ivkqcm76b6Bu/BEIUTu");

CREATE TABLE stat (
    id_status INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    stat VARCHAR(15) NOT NULL
);

CREATE TABLE solicitacao (
    id_solicitacao INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    id_cliente BIGINT UNSIGNED,
    valor DECIMAL(10 , 2 ),
    id_status INT UNSIGNED NOT NULL,
    id_categoria INT UNSIGNED UNSIGNED NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_categoria)
        REFERENCES categoria (id_categoria),
    FOREIGN KEY (id_status)
        REFERENCES stat (id_status),
    FOREIGN KEY (id_cliente)
        REFERENCES cliente (id_cliente)
);

CREATE TABLE hist_solicitacao (
    id_historico INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_solicitacao INT UNSIGNED NOT NULL,
    cliente BOOLEAN,
    status_old VARCHAR(32),
    status_new VARCHAR(32),
    funcionario_old INT UNSIGNED,
    funcionario_new INT UNSIGNED,
    FOREIGN KEY (id_solicitacao)
        REFERENCES solicitacao (id_solicitacao),
    FOREIGN KEY (funcionario_new)
        REFERENCES funcionario (id_funcionario),
    FOREIGN KEY (funcionario_old)
        REFERENCES funcionario (id_funcionario)
);

-- Blacklist de token
CREATE TABLE token_blacklist (
    token VARCHAR(512) PRIMARY KEY,
    data_expiracao DATETIME NOT NULL
);

-- Lista oficial da anantel

INSERT INTO ddd_validos (ddd) VALUES
('11'), ('12'), ('13'), ('14'), ('15'), ('16'), ('17'), ('18'), ('19'),
('21'), ('22'), ('24'),
('27'), ('28'),
('31'), ('32'), ('33'), ('34'), ('35'), ('37'), ('38'),
('41'), ('42'), ('43'), ('44'), ('45'), ('46'),
('51'), ('53'), ('54'), ('55'),
('61'),
('62'), ('64'),
('63'),
('65'), ('66'),
('67'),
('71'), ('73'), ('74'), ('75'), ('77'),
('81'), ('87'),
('82'),
('84'),
('85'), ('88'),
('86'), ('89'),
('91'), ('93'), ('94'),
('92'), ('97'),
('95'),
('96'),
('98'), ('99');