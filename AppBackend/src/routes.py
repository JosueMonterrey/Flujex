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


@main_routes.route('/get_accounts', methods=['POST'])
def get_accounts():
    try:
        data = request.get_json()

        accounts = get_accounts_by_user(data["userId"])

        if accounts:
            return jsonify({"success": True, "msg": "Accounts retrieved successfully", "accounts" : accounts}), 201
        
        return jsonify({"success": False, "msg": "Failed to get user accounts"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/get_account_details', methods=['POST'])
def get_account_details():
    try:
        data = request.get_json()

        account = get_account_by_id(data["id"])

        if account:
            return jsonify({"success": True, "msg": "Account details retrieved successfully", "account" : account}), 201
        
        return jsonify({"success": False, "msg": "Failed to get account details"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/get_account_transfers_out', methods=['POST'])
def get_account_transfers_out():
    try:
        data = request.get_json()

        transactions_data = get_transactions_out_time_interval(data["id"], data["days"]) if "days" in data else get_transactions_out_time_interval(data["id"])

        if transactions_data:
            return jsonify({"success": True, "msg": "Transactions retrieved successfully", "transactions_data" : transactions_data}), 201
        
        return jsonify({"success": False, "msg": "Failed to get transactions"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    

@main_routes.route('/get_account_transfers_in', methods=['POST'])
def get_account_transfers_in():
    try:
        data = request.get_json()

        transactions_data = get_transactions_in_time_interval(data["id"], data["days"]) if "days" in data else get_transactions_in_time_interval(data["id"])

        if transactions_data:
            return jsonify({"success": True, "msg": "Transactions retrieved successfully", "transactions_data" : transactions_data}), 201
        
        return jsonify({"success": False, "msg": "Failed to get transactions"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/get_most_spent_categories', methods=['POST'])
def get_most_spent_categories():
    try:
        data = request.get_json()

        categories_data = get_most_spent_categories_time_interval(data["id"], data["days"]) if "days" in data else get_most_spent_categories_time_interval(data["id"])

        return jsonify({"success": True, "msg": "Categories calculated successfully", "categories_data" : categories_data}), 201        
        # return jsonify({"success": False, "msg": "Failed to get categories"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500