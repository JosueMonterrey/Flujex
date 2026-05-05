from .connection import get_connection

# USER
def get_user_by_username(username):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM user
            WHERE username = %s
            AND inactive_date > NOW()
        """
        cursor.execute(query, [username])
        user = cursor.fetchone()
        return user
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM user
            WHERE email = %s
            AND inactive_date > NOW()
        """
        cursor.execute(query, [email])
        user = cursor.fetchone()
        return user
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def insert_new_user(data, hashed_pwd):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            INSERT INTO user (first_name, last_name_1, last_name_2, username, hashed_pwd, email, phone)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        values = [
            data['name'],
            data['lastname1'],
            data['lastname2'],
            data['username'],
            hashed_pwd,
            data['email'],
            data['phone']
        ]
        cursor.execute(query, values)

        conn.commit()

        new_user = get_user_by_email(data["email"])
        base_currency = get_currency_by_code("USD")
        insert_new_account(new_user["user_id"], base_currency["currency_id"], "[SYSTEM_ORIGIN]", "System account for external deposits.")
        insert_new_account(new_user["user_id"], base_currency["currency_id"], "[SYSTEM_DESTINY]", "System account for external expenses.")
        insert_new_category(new_user["user_id"], "[UNCATEGORIZED]", "No category", 0, 0, 0, "Both")

        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()
#

# CURRENCY
def get_currency_by_code(code):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM currency
            WHERE code = %s
        """
        cursor.execute(query, [code])
        user = cursor.fetchone()
        return user
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_currency_by_id(currency_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM currency
            WHERE currency_id = %s
        """
        cursor.execute(query, [currency_id])
        user = cursor.fetchone()
        return user
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_all_currencies():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        cursor.execute("SELECT * FROM currency")
        currencies = cursor.fetchall()
        return currencies
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_exchange_rate_today(currency_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = """
            SELECT *
            FROM exchange_rate
            WHERE currency_id = %s
                AND rate_date = CURDATE()
        """

        cursor.execute(query, [currency_id])
        rate = cursor.fetchone()
        return rate
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def insert_exchange_rate(currency_id, rate_to_base):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            INSERT INTO exchange_rate (currency_id, rate_to_base)
            VALUES (%s, %s)
        """

        values = [currency_id, rate_to_base]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()
#

# ACCOUNTS
def get_accounts_by_user(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT acc.account_id,
                acc.name AS account_name,
                acc.description,
                acc.balance,
                acc.creation_date,
                acc.updated_date,
                cur.currency_id,
                cur.code,
                cur.name AS currency_name,
                cur.symbol
            FROM account acc
            JOIN currency cur
                ON acc.currency_id = cur.currency_id
            WHERE user_id = %s
                AND NOT acc.name = "[SYSTEM_ORIGIN]"
                AND NOT acc.name = "[SYSTEM_DESTINY]"
                AND inactive_date > NOW()
            ORDER BY acc.updated_date DESC
        """
        cursor.execute(query, [user_id])
        accounts = cursor.fetchall()
        return accounts
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_account_by_name(user_id, account_name):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT acc.account_id,
                acc.name AS account_name,
                acc.description,
                acc.balance,
                acc.creation_date,
                acc.updated_date,
                cur.currency_id,
                cur.code,
                cur.name AS currency_name,
                cur.symbol
            FROM account acc
            JOIN currency cur
                ON acc.currency_id = cur.currency_id
            WHERE user_id = %s
                AND acc.name = %s
                AND inactive_date > NOW()
        """
        cursor.execute(query, [user_id, account_name])
        user = cursor.fetchone()
        return user
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_account_by_id(account_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT acc.account_id,
                acc.name AS account_name,
                acc.description,
                acc.balance,
                acc.creation_date,
                acc.updated_date,
                cur.currency_id,
                cur.code,
                cur.name AS currency_name,
                cur.symbol
            FROM account acc
            JOIN currency cur
                ON acc.currency_id = cur.currency_id
            WHERE account_id = %s
                AND inactive_date > NOW()
        """
        cursor.execute(query, [account_id])
        account = cursor.fetchone()
        return account
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def insert_new_account(user_id, currency_id, account_name, account_description):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            INSERT INTO account (user_id, currency_id, name, description)
            VALUES (%s, %s, %s, %s)
        """

        values = [user_id, currency_id, account_name, account_description]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def delete_account_data(account_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE account
            SET inactive_date = NOW()
            WHERE account_id = %s
        """

        values = [account_id]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()
#

# TRANSACTIONS
def get_account_transactions(account_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT t.transaction_id,
                t.type,
                t.amount_origin,
                t.amount_destiny,
                t.description AS transaction_description,
                t.transaction_date,
                c.category_id,
                c.name AS category_name,
                c.description AS category_description,
                x.rate_to_base,
                a_orig.account_id AS origin_id,
                a_orig.name AS origin_name,
                a_orig.inactive_date AS origin_inactive_date,
                orig_curr.symbol AS origin_currency_symbol,
                a_dest.account_id AS destiny_id,
                a_dest.name AS destiny_name,
                a_dest.inactive_date AS destiny_inactive_date,
                dest_curr.symbol AS destiny_currency_symbol
            FROM transaction AS t
            JOIN category AS c
                ON t.category_id = c.category_id
            JOIN exchange_rate AS x
                ON t.rate_id = x.rate_id
            JOIN account AS a_orig
                ON t.origin_acc_id = a_orig.account_id
            JOIN currency AS orig_curr
                ON a_orig.currency_id = orig_curr.currency_id
            JOIN account AS a_dest
                ON t.destiny_acc_id = a_dest.account_id
            JOIN currency AS dest_curr
                ON a_dest.currency_id = dest_curr.currency_id
            WHERE t.origin_acc_id = %s
                OR t.destiny_acc_id = %s
            ORDER BY t.transaction_date
        """
        cursor.execute(query, [account_id, account_id])
        transactions = cursor.fetchall()
        return transactions
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_transactions_out_time_interval(account_id, days=9999):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT 
                IFNULL(COUNT(transaction_id), 0) AS amount_transactions,
                IFNULL(SUM(amount_origin), 0) AS total_out
            FROM transaction
            WHERE origin_acc_id = %s
            AND transaction_date >= DATE_SUB(NOW(), INTERVAL %s DAY);
        """
        cursor.execute(query, [account_id, days])
        transactions_data = cursor.fetchone()
        return transactions_data
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_transactions_in_time_interval(account_id, days=9999):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT 
                IFNULL(COUNT(transaction_id), 0) AS amount_transactions,
                IFNULL(SUM(amount_destiny), 0) AS total_in
            FROM transaction
            WHERE destiny_acc_id = %s
            AND transaction_date >= DATE_SUB(NOW(), INTERVAL %s DAY);
        """
        cursor.execute(query, [account_id, days])
        transactions_data = cursor.fetchone()
        return transactions_data
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def insert_new_transaction(origin_acc_id, destiny_acc_id, category_id, mov_type, amount_origin, amount_destiny, rate_id, description, origin_budget_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            INSERT INTO transaction (origin_acc_id, destiny_acc_id, category_id, type, amount_origin, amount_destiny, rate_id, description)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = [origin_acc_id, destiny_acc_id, category_id, mov_type, amount_origin, amount_destiny, rate_id, description]

        cursor.execute(query, values)

        if mov_type in ["Transfer", "Expense"]:
            cursor.execute(
                "UPDATE account SET balance = balance - %s WHERE account_id = %s",
                [amount_origin, origin_acc_id]
            )

        if mov_type in ["Transfer", "Deposit"]:
            cursor.execute(
                "UPDATE account SET balance = balance + %s WHERE account_id = %s",
                [amount_destiny, destiny_acc_id]
            )
        
        if origin_budget_id is not None:
            cursor.execute(
                "UPDATE budget SET current_spent = current_spent + %s WHERE budget_id = %s",
                [amount_origin, origin_budget_id]
            )

        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()
#

# CATEGORIES
def get_categories_by_user(user_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM category
            WHERE user_id = %s
                AND inactive_date > NOW()
                AND NOT name = '[UNCATEGORIZED]'
        """
        cursor.execute(query, [user_id])
        category = cursor.fetchall()
        return category
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def update_category_data(category_id, name, description, R, G, B, type_allowed):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE category
            SET name = %s,
                description = %s,
                color_r = %s,
                color_g = %s,
                color_b = %s,
                type_allowed = %s
            WHERE category_id = %s
        """

        values = [name, description, R, G, B, type_allowed, category_id]
        
        cursor.execute(query, values)
        conn.commit()
        
        return True
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def delete_category_data(user_id, category_id, name):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE category
            SET inactive_date = NOW()
            WHERE user_id = %s
                AND category_id = %s
                AND name = %s
        """

        values = [user_id, category_id, name]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def get_categories_by_user_and_multiple_type(user_id, type_allowed_1, type_allowed_2):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM category
            WHERE user_id = %s
                AND NOT name = '[UNCATEGORIZED]'
                AND type_allowed IN (%s, %s)
                AND inactive_date > NOW()
            ORDER BY name
        """
        cursor.execute(query, [user_id, type_allowed_1, type_allowed_2])
        categories = cursor.fetchall()
        return categories
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_categories_by_user_and_type(user_id, type_allowed):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM category
            WHERE user_id = %s
                AND NOT name = '[UNCATEGORIZED]'
                AND type_allowed = %s
                AND inactive_date > NOW()
            ORDER BY name
        """
        cursor.execute(query, [user_id, type_allowed])
        categories = cursor.fetchall()
        return categories
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_category_by_name(user_id, category_name):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM category
            WHERE user_id = %s AND name = %s AND inactive_date > NOW()
        """
        cursor.execute(query, [user_id, category_name])
        category = cursor.fetchone()
        return category
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def insert_new_category(user_id, name, description, R, G, B, type_allowed):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            INSERT INTO category (user_id, name, description, color_r, color_g, color_b, type_allowed)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        values = [user_id, name, description, R, G, B, type_allowed]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def get_most_spent_categories_time_interval(account_id, days=9999):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT
                t.category_id,
                c.name,
                c.color_r,
                c.color_g,
                c.color_b,
                IFNULL(COUNT(t.transaction_id), 0) AS amount_transactions,
                IFNULL(SUM(t.amount_origin), 0) AS total_out
            FROM transaction AS t
            JOIN category AS c
                ON t.category_id = c.category_id
            WHERE t.origin_acc_id = %s
            AND t.transaction_date >= DATE_SUB(NOW(), INTERVAL %s DAY)
            GROUP BY t.category_id
            ORDER BY total_out DESC
        """
        cursor.execute(query, [account_id, days])
        transactions_data = cursor.fetchall()
        return transactions_data
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()
#


# SUBSCRIPTION
def get_subscription_by_name(account_id, subscription_name):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM subscription
            WHERE account_id = %s AND name = %s AND inactive_date > NOW()
        """
        cursor.execute(query, [account_id, subscription_name])
        subscription = cursor.fetchone()
        return subscription
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_subscriptions_by_account(account_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM subscription
            WHERE account_id = %s AND inactive_date > NOW()
        """
        cursor.execute(query, [account_id])
        subscription = cursor.fetchall()
        return subscription
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def insert_new_subscription(account_id, name, amount, frequency, start_date):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            INSERT INTO subscription (account_id, name, amount, frequency, start_date, next_date)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        values = [account_id, name, amount, frequency, start_date, start_date]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def update_subscription_data(subscription_id, name, frequency, amount):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE subscription
            SET name = %s,
                frequency = %s,
                amount = %s
            WHERE subscription_id = %s
        """

        values = [name, frequency, amount, subscription_id]
        
        cursor.execute(query, values)
        conn.commit()
        
        return True
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def delete_subscription_data(account_id, subcription_id, name):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE subscription
            SET inactive_date = NOW()
            WHERE account_id = %s
                AND subscription_id = %s
                AND name = %s
        """

        values = [account_id, subcription_id, name]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def charge_subscription(subscription_id, account_id, name, amount, next_date, frequency):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE subscription
            SET next_date = CASE 
                    WHEN frequency = 'Daily'    THEN DATE_ADD(next_date, INTERVAL 1 DAY)
                    WHEN frequency = 'Weekly'   THEN DATE_ADD(next_date, INTERVAL 1 WEEK)
                    WHEN frequency = 'Monthly'  THEN DATE_ADD(next_date, INTERVAL 1 MONTH)
                    WHEN frequency = 'Annually' THEN DATE_ADD(next_date, INTERVAL 1 YEAR)
                    ELSE next_date
                END
            WHERE subscription_id = %s 
                AND inactive_date > NOW();
        """

        values = [subscription_id]
        
        cursor.execute(query, values)
        conn.commit()
        
        return True
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


# BUDGET
def get_budgets_by_account(account_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM budget
            WHERE account_id = %s AND inactive_date > NOW()
            ORDER BY year, month
        """
        cursor.execute(query, [account_id])
        budgets = cursor.fetchall()
        return budgets
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_budget_by_date(account_id, month, year):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM budget
            WHERE account_id = %s
                AND month = %s
                AND year = %s
                AND inactive_date > NOW()
        """
        cursor.execute(query, [account_id, month, year])
        budget = cursor.fetchone()
        return budget
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def get_budget_by_id(account_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT *
            FROM budget
            WHERE budget_id = %s
                AND inactive_date > NOW()
        """
        cursor.execute(query, [account_id])
        budget = cursor.fetchone()
        return budget
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        return None
    
    finally:
        cursor.close()
        conn.close()


def insert_new_budget(account_id, amount_limit, month, year):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            INSERT INTO budget (account_id, amount_limit, month, year)
            VALUES (%s, %s, %s, %s)
        """

        values = [account_id, amount_limit, month, year]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def update_budget_data(budget_id, amount_limit, month, year):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE budget
            SET amount_limit = %s,
                month = %s,
                year = %s
            WHERE budget_id = %s
        """

        values = [amount_limit, month, year, budget_id]
        
        cursor.execute(query, values)
        conn.commit()
        
        return True
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()


def delete_budget_data(account_id, budget_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = """
            UPDATE budget
            SET inactive_date = NOW()
            WHERE account_id = %s
                AND budget_id = %s
        """

        values = [account_id, budget_id]
        
        cursor.execute(query, values)
        conn.commit()
        
        return cursor.rowcount > 0
    
    except Exception as e:
        print("QUERY ERROR: " + str(e))
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()

