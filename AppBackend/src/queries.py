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
                cur.code,
                cur.name AS currency_name,
                cur.symbol
            FROM account acc
            JOIN currency cur
                ON acc.currency_id = cur.currency_id
            WHERE user_id = %s AND inactive_date > NOW()
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
            SELECT *
            FROM account
            WHERE user_id = %s AND name = %s AND inactive_date > NOW()
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
                cur.code,
                cur.name AS currency_name,
                cur.symbol
            FROM account acc
            JOIN currency cur
                ON acc.currency_id = cur.currency_id
            WHERE account_id = %s AND inactive_date > NOW()
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
#

# TRANSACTIONS
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
#

# CATEGORIES
def get_most_spent_categories_time_interval(account_id, days=9999):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    try:        
        query = """
            SELECT
                c.name,
                IFNULL(COUNT(transaction_id), 0) AS amount_transactions,
                IFNULL(SUM(amount_origin), 0) AS total_out
            FROM transaction AS t
            JOIN category AS c
                ON t.category_id = c.category_id
            WHERE origin_acc_id = %s
            AND transaction_date >= DATE_SUB(NOW(), INTERVAL %s DAY)
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