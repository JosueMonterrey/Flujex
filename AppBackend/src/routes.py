from flask import Blueprint, request, jsonify
from .queries import *
import bcrypt 
import traceback

main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        user = get_user_by_username(data['username'])
        
        if user != None:
            password_bytes = data['password'].encode('utf-8')
            hash_bytes = user['hashed_pwd'].encode('utf-8')

            if bcrypt.checkpw(password_bytes, hash_bytes):
                return jsonify({"success": True, "msg": "Login completed"}), 200
        
        return jsonify({"success": False, "msg": "Wrong username or password"}), 401
    except Exception as e:
        print("ERROR EN EL SERVIDOR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
