USE flujex;

-- 1. update_account_balance
CREATE TRIGGER trg_update_balance_after_transaction
AFTER INSERT
ON transaction
FOR EACH ROW
BEGIN
    UPDATE account
    SET balance = balance - NEW.amount_origin
    WHERE account_id = NEW.origin_acc_id;

    UPDATE account
    SET balance = balance + NEW.amount_destiny
    WHERE account_id = NEW.destiny_acc_id;
END;

-- 2. update_budget
CREATE TRIGGER trg_update_budget_after_expense
AFTER INSERT
ON transaction
FOR EACH ROW
BEGIN
    IF NEW.type = 'Expense' THEN
        UPDATE budget
        SET current_spent = current_spent + NEW.amount_origin
        WHERE
            account_id = NEW.origin_acc_id
            AND month = MONTH (CURRENT_DATE)
            AND year = YEAR (CURRENT_DATE);
    END IF;
END;

-- 3. audit_user_deactivation
CREATE TRIGGER trg_audit_user_deactivation
AFTER UPDATE
ON user
FOR EACH ROW
BEGIN
    IF OLD.inactive_date = '2038-01-01 00:00:00' AND NEW.inactive_date <= NOW() THEN
        INSERT INTO audit_log (action_type, table_name, record_id)
        VALUES (
                'DEACTIVATE',
                'user',
                NEW.user_id
            );
    END IF;
END;