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
                return jsonify({"success": True, "user_id" : user['user_id'], "msg": "Login completed"}), 200
        
        return jsonify({"success": False, "msg": "Wrong username or password"}), 401
    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # check if user already exists
        if get_user_by_email(data['email']):
            return jsonify({"success": False, "msg": "There is already an account associated with this email"}), 409
        
        if get_user_by_username(data['username']):
            return jsonify({"success": False, "msg": "Username is taken"}), 409

        # hash password
        password_bytes = data['password'].encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_pwd_bytes = bcrypt.hashpw(password_bytes, salt)
        hashed_pwd = hashed_pwd_bytes.decode('utf-8')
        
        # insert new user
        if insert_new_user(data, hashed_pwd):
            return jsonify({"success": True, "msg": "Account created successfully"}), 201
    
        return jsonify({"success": False, "msg": "Something went wrong when inserting into databse"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    

@main_routes.route('/create_account', methods=['POST'])
def create_account():
    try:
        data = request.get_json()

        print("============ " + data["userId"] + " ============")

        if get_account_by_name(data["userId"], data["name"]):
            return jsonify({"success": False, "msg": "An account with the same name already exists"}), 409

        currency_data = get_currency_by_code(data["currency"])
        if currency_data == None:
            return jsonify({"success": False, "msg": f"Currency {data["currency"]} does not exist"}), 404
        
        if insert_new_account(data["userId"], currency_data["currency_id"], data["name"], data["description"]):
            return jsonify({"success": True, "msg": "Account created successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when inserting into database"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    