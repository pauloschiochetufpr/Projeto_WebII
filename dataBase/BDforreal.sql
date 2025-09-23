drop database manutencao;

Create DATABASE manutencao;

Use manutencao;

Create table cep(
    cep VARCHAR(8) PRIMARY KEY,      
    logradouro VARCHAR(255),
    bairro VARCHAR(128),
    localidade VARCHAR(128),
    uf CHAR(2),
    ibge VARCHAR(7),
    gia VARCHAR(20),
    ddd VARCHAR(3),
    siafi VARCHAR(10)
);

CREATE TABLE endereco (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(8) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    cidade VARCHAR(128) NOT NULL,
    logradouro VARCHAR(128) NOT NULL,
    bairro VARCHAR(128) NOT NULL,
    numero INT UNSIGNED NOT NULL,
    complemento VARCHAR(255),
    principal BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cep)
        REFERENCES Cep (cep)
);

CREATE TABLE ddd_validos (
    ddd CHAR(2) PRIMARY KEY
);

CREATE TABLE cliente (
    idCliente INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    telefone VARCHAR(13) NOT NULL,
    senha_hash VARCHAR(64) NOT NULL,
    salt VARCHAR(16) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE cliente_endereco(
    id_cliente int unsigned,
    id_endereco int unsigned,
    FOREIGN key (id_cliente) references cliente(idCliente),
    FOREIGN key (id_endereco) references endereco(id),
    PRIMARY KEY (id_cliente, id_endereco)
);

CREATE TABLE categoria (
    idCategoria INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ativo BOOLEAN DEFAULT TRUE,
    nome VARCHAR(64) NOT NULL
);

CREATE TABLE funcionario (
    idFuncionario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    dataNasc DATE NOT NULL,
    telefone VARCHAR(13) NOT NULL,
	senha_hash VARCHAR(64) NOT NULL,
    salt VARCHAR(16) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE stat (
    idStatus INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(15) NOT NULL
);

CREATE TABLE solicitacao (
    idSolicitacao INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(64) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    idCliente INT UNSIGNED,
    valor DECIMAL(10 , 2 ),
    idStatus INT UNSIGNED NOT NULL,
    idCategoria INT UNSIGNED UNSIGNED NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (idCategoria)
        REFERENCES categoria (idCategoria),
    FOREIGN KEY (idStatus)
        REFERENCES stat (idStatus),
    FOREIGN KEY (idCliente)
        REFERENCES cliente (idCliente)
);

CREATE TABLE HistSolicitacao (
    idHistorico INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    dataHora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    idSolicitacao INT UNSIGNED NOT NULL,
    cliente BOOLEAN,
    statusOld VARCHAR(32),
    statusNew VARCHAR(32),
    funcionarioOld INT UNSIGNED,
    funcionarioNew INT UNSIGNED,
    FOREIGN KEY (idSolicitacao)
        REFERENCES solicitacao (idSolicitacao),
    FOREIGN KEY (funcionarioNew)
        REFERENCES funcionario (idFuncionario),
    FOREIGN KEY (funcionarioOld)
        REFERENCES funcionario (idFuncionario)
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