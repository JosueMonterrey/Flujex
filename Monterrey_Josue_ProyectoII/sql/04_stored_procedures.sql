USE flujex;

-- 1. create_transaction
DELIMITER //
CREATE PROCEDURE sp_create_transaction (
    IN p_origin_acc_id INT,
    IN p_destiny_acc_id INT,
    IN p_category_id INT,
    IN p_type ENUM ('Expense', 'Deposit', 'Transfer'),
    IN p_amount_origin DECIMAL(12, 2),
    IN p_amount_destiny DECIMAL(12, 2)
) BEGIN
    UPDATE account
    SET balance = balance - p_amount_origin
    WHERE account_id = p_origin_acc_id;

    UPDATE account
    SET balance = balance + p_amount_destiny
    WHERE account_id = p_destiny_acc_id;

    INSERT INTO transaction (
            origin_acc_id,
            destiny_acc_id,
            category_id,
            type,
            amount_origin,
            amount_destiny
        )
    VALUES (
            p_origin_acc_id,
            p_destiny_acc_id,
            p_category_id,
            p_type,
            p_amount_origin,
            p_amount_destiny
        );

    COMMIT;

END //
DELIMITER ;

-- 2. add_receipt
DELIMITER //
CREATE PROCEDURE sp_add_receipt (
    IN p_transaction_id INT,
    IN p_receipt_url VARCHAR(500)
) BEGIN
    INSERT INTO
        receipt (transaction_id, receipt_url)
    VALUES
        (p_transaction_id, p_receipt_url);

END //
DELIMITER ;

-- 3. process_due_subscriptions
DELIMITER //
CREATE PROCEDURE sp_process_due_subscriptions ()
BEGIN
    UPDATE account a
    JOIN subscription s
        ON a.account_id = s.account_id
    SET a.balance = a.balance - s.amount
    WHERE s.next_date <= CURRENT_DATE();

    UPDATE subscription
    SET next_date = DATE_ADD(next_date, INTERVAL 1 MONTH)
    WHERE next_date <= CURRENT_DATE();

END //
DELIMITER ;

-- 4. deactivate_user
DELIMITER //
CREATE PROCEDURE sp_deactivate_user (IN p_user_id INT)
BEGIN
    UPDATE user
    SET inactive_date = NOW()
    WHERE user_id = p_user_id;

    UPDATE account
    SET inactive_date = NOW()
    WHERE user_id = p_user_id;

END //
DELIMITER ;

-- 5. top_expense_categories
DELIMITER //
CREATE PROCEDURE sp_get_top_expense_categories (IN p_user_id INT)
BEGIN
    SELECT
        c.name,
        SUM(t.amount_origin) AS total_spent
    FROM transaction t
    JOIN category c
        ON t.category_id = c.category_id
    JOIN account a
        ON t.origin_acc_id = a.account_id
    WHERE a.user_id = p_user_id
        AND t.type = 'Expense'
    GROUP BY c.name
    ORDER BY total_spent DESC
    LIMIT 5;

END //
DELIMITER ;

-- 6. monthly_summary
DELIMITER //
CREATE PROCEDURE sp_get_monthly_summary (
    IN p_user_id INT,
    IN p_month INT,
    IN p_year INT
)
BEGIN
    SELECT
        SUM(
            CASE
                WHEN t.type = 'Deposit' THEN t.amount_destiny
                ELSE 0
            END
        ) AS total_income,
        SUM(
            CASE
                WHEN t.type = 'Expense' THEN t.amount_origin
                ELSE 0
            END
        ) AS total_expenses
    FROM transaction t
    JOIN account a
        ON t.origin_acc_id = a.account_id
    WHERE a.user_id = p_user_id
        AND MONTH (t.transaction_date) = p_month
        AND YEAR (t.transaction_date) = p_year;

END //
DELIMITER ;