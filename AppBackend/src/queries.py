from .connection import get_connection

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
        conn.rollback()
        return False
    
    finally:
        cursor.close()
        conn.close()