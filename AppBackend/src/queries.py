from .connection import get_connection

def get_user_by_username(username):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    query = "SELECT * FROM user WHERE username = %s"
    cursor.execute(query, [username])
    
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user