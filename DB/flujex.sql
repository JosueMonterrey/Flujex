-- 1. Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS flujex;
USE flujex;

-- 2. Tabla de Usuarios
CREATE TABLE user (
    user_id			INT				PRIMARY KEY	AUTO_INCREMENT,
    first_name 		VARCHAR(50)		NOT NULL,
    last_name_1 	VARCHAR(50)		NOT NULL,
    last_name_2 	VARCHAR(50)		NOT NULL,
    username 		VARCHAR(50)		NOT NULL 	UNIQUE,
    hashed_pwd		VARCHAR(255)	NOT NULL,
    email 			VARCHAR(100)	NOT NULL,
    phone 			VARCHAR(20)		NOT NULL,
    timezone 		VARCHAR(50)		NOT NULL	DEFAULT 'UTC',
    signup_date 	TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    last_login 		TIMESTAMP		NOT NULL	DEFAULT '2038-01-01 00:00:00',
    inactive_date	TIMESTAMP		NOT NULL	DEFAULT '2038-01-01 00:00:00',
    
    UNIQUE KEY (email, inactive_date),
    INDEX idx_email (email)
);

-- 3. Tabla de Monedas	
CREATE TABLE currency (
    currency_id		INT			PRIMARY KEY	AUTO_INCREMENT,
    name			VARCHAR(50) NOT NULL,
    symbol			VARCHAR(10) NOT NULL
);

-- 4. Tabla de Cuentas
CREATE TABLE account (
    account_id		INT				PRIMARY KEY AUTO_INCREMENT,
    user_id			INT				NOT NULL,
    currency_id		INT				NOT NULL,
    name			VARCHAR(100)	NOT NULL,
    description		VARCHAR(255)	NOT NULL,
    balance			DECIMAL(12,2)	NOT NULL	DEFAULT 0.00,
    creation_date	TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    updated_date	TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP	ON UPDATE CURRENT_TIMESTAMP,
    inactive_date	TIMESTAMP		NOT NULL	DEFAULT '2038-01-01 00:00:00',
    
    CONSTRAINT fk_acc_user		FOREIGN KEY (user_id)		REFERENCES user(user_id)		ON DELETE CASCADE,
    CONSTRAINT fk_acc_curr		FOREIGN KEY	(currency_id)	REFERENCES currency(currency_id),
    INDEX idx_user_acc (user_id)
);

-- 5. Tabla de Categorías
CREATE TABLE category (
    category_id		INT									PRIMARY KEY	AUTO_INCREMENT,
    account_id		INT									NOT NULL,
    name			VARCHAR(50)							NOT NULL,
    description		VARCHAR(255)						NOT NULL,
    color_r			TINYINT								NOT NULL	DEFAULT 0,
    color_g			TINYINT								NOT NULL	DEFAULT 0,
    color_b			TINYINT								NOT NULL	DEFAULT 0,
    type_allowed	ENUM('Ingreso', 'Gasto', 'Ambos')	NOT NULL	DEFAULT 'Ambos',
    inactive_date	TIMESTAMP							NOT NULL	DEFAULT '2038-01-01 00:00:00',
    	
    CONSTRAINT fk_cat_acc		FOREIGN KEY (account_id)		REFERENCES account(account_id)		ON DELETE CASCADE,
    INDEX idx_acc_category (account_id)
);

-- 6. Tabla de Metas de Ahorro
CREATE TABLE savings_goal (
    savings_id		INT				PRIMARY KEY AUTO_INCREMENT,
    account_id		INT				NOT NULL,
    name			VARCHAR(100)	NOT NULL,
    target_amount	DECIMAL(12,2)	NOT NULL,
    current_amount	DECIMAL(12,2)	NOT NULL	DEFAULT 0.00,
    deadline		DATE			NOT NULL,
    creation_date	TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    updated_date	TIMESTAMP		NOT NULL	DEFAULT CURRENT_TIMESTAMP		ON UPDATE CURRENT_TIMESTAMP,
    inactive_date	TIMESTAMP		NOT NULL	DEFAULT '2038-01-01 00:00:00',
    
    CONSTRAINT fk_savings_acc		FOREIGN KEY	(account_id)		REFERENCES account(account_id) 		ON DELETE CASCADE
);

-- 7. Tabla de Presupuestos Mensuales
CREATE TABLE budget (
    budget_id		INT				PRIMARY KEY AUTO_INCREMENT,
    account_id		INT				NOT NULL,
    amount_limit	DECIMAL(12,2)	NOT NULL,
    current_spent	DECIMAL(12,2)	NOT NULL	DEFAULT 0.00,
    month			TINYINT			NOT NULL	CHECK (month BETWEEN 1 AND 12),
    year			SMALLINT		NOT NULL,
    inactive_date	TIMESTAMP		NOT NULL	DEFAULT '2038-01-01 00:00:00',
    
    CONSTRAINT 		fk_budget_acc		FOREIGN KEY (account_id)		REFERENCES account(account_id)		ON DELETE CASCADE,
    UNIQUE KEY		budget_period(account_id, month, year)
);

-- 8. Tabla de tipo de cambio
CREATE TABLE exchange_rate (
	rate_id			INT				PRIMARY KEY AUTO_INCREMENT,
	currency_id		INT				NOT NULL,
	rate_to_base	DECIMAL(12, 6)	NOT NULL,
	rate_date		DATE			NOT NULL,
	
	CONSTRAINT fk_rate_curr			FOREIGN KEY (currency_id)		REFERENCES currency(currency_id),
	UNIQUE KEY		(currency_id, rate_date)
);

-- 9. Tabla de Transacciones (Multimoneda)
CREATE TABLE transaction (
    transaction_id		INT											PRIMARY KEY	AUTO_INCREMENT,
    origin_acc_id		INT											NOT NULL,
    destiny_acc_id		INT											NOT NULL,
    category_id			INT											NOT NULL,
    type				ENUM('Gasto', 'Ingreso', 'Transferencia')	NOT NULL	DEFAULT 'Transferencia',
    amount_origin		DECIMAL(12,2)								NOT NULL,
    amount_destiny		DECIMAL(12,2)								NOT NULL,
    rate_id				INT											NOT NULL,
    description			VARCHAR(255)								NOT NULL,
    transaction_date	TIMESTAMP									NOT NULL	DEFAULT CURRENT_TIMESTAMP,
    updated_date		TIMESTAMP									NOT NULL	DEFAULT CURRENT_TIMESTAMP	ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_trans_orig		FOREIGN KEY	(origin_acc_id)			REFERENCES account(account_id),
    CONSTRAINT fk_trans_dest		FOREIGN KEY	(destiny_acc_id)	 	REFERENCES account(account_id),
    CONSTRAINT fk_trans_cat			FOREIGN KEY	(category_id)			REFERENCES category(category_id),
    CONSTRAINT fk_trans_rate		FOREIGN KEY	(rate_id)				REFERENCES exchange_rate(rate_id),
    INDEX idx_date_search (transaction_date),
    INDEX idx_acc_history (origin_acc_id, transaction_date)
);

-- 10. Tabla de Recibos
CREATE TABLE receipt (
	receipt_id		INT				PRIMARY KEY	AUTO_INCREMENT,
	transaction_id	INT				NOT NULL	UNIQUE,
	receipt_url		VARCHAR(500)	NOT NULL,
	upload_date		TIMESTAMP		NOT NULL,
	inactive_date	TIMESTAMP		NOT NULL	DEFAULT '2038-01-01 00:00:00',
	
	CONSTRAINT fk_receipt_trans		FOREIGN KEY	(transaction_id)		REFERENCES transaction(transaction_id)		ON DELETE CASCADE
);

-- 11. Tabla de Externos
CREATE TABLE external_source (
	source_id		INT				PRIMARY KEY AUTO_INCREMENT,
	transaction_id	INT				NOT NULL	UNIQUE,
	external_id		VARCHAR(500)	NOT NULL,	
	
	CONSTRAINT fk_src_trans			FOREIGN KEY (transaction_id)		REFERENCES transaction(transaction_id)		ON DELETE CASCADE
);

-- 12. Tabla de Subscripciones
CREATE TABLE subscription (
	subscription_id		INT												PRIMARY KEY AUTO_INCREMENT,
	account_id			INT												NOT NULL,
	amount				DECIMAL(12, 2)									NOT NULL,
	start_date			DATE											NOT NULL	DEFAULT (CURRENT_DATE),
	next_date			DATE											NOT NULL	DEFAULT (CURRENT_DATE),
	frequency			ENUM('Diario', 'Semanal', 'Mensual', 'Anual')	NOT NULL,
	updated_date		TIMESTAMP										NOT NULL	DEFAULT CURRENT_TIMESTAMP	ON UPDATE CURRENT_TIMESTAMP,
	inactive_date		TIMESTAMP										NOT NULL	DEFAULT '2038-01-01 00:00:00',
	
	CONSTRAINT fk_subs_acc			FOREIGN KEY (account_id)			REFERENCES account(account_id)		ON DELETE RESTRICT,
	INDEX idx_subs_next	(next_date)
);
