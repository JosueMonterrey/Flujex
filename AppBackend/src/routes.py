from flask import Blueprint, request, jsonify
from .queries import *
import bcrypt 
import traceback
import requests
import os
from dotenv import load_dotenv
from datetime import date

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
        
        if insert_new_account(data["userId"], data["currencyId"], data["name"], data["description"]):
            return jsonify({"success": True, "msg": "Account created successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when inserting into database"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/create_category', methods=['POST'])
def create_category():
    try:
        data = request.get_json()

        if get_category_by_name(data["userId"], data["name"]):
            return jsonify({"success": False, "msg": "A category with the same name already exists"}), 409
        
        if insert_new_category(data["userId"], data["name"], data["description"], data["color_r"], data["color_g"], data["color_b"], data["allowed"]):
            return jsonify({"success": True, "msg": "Category created successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when inserting into database"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    

@main_routes.route('/update_category', methods=['POST'])
def update_category():
    try:
        data = request.get_json()

        already_exists = get_category_by_name(data["userId"], data["name"])

        if already_exists and already_exists["category_id"] != data["editId"]:
            return jsonify({"success": False, "msg": "A category with the same name already exists"}), 409
        
        if update_category_data(data["editId"], data["name"], data["description"], data["color_r"], data["color_g"], data["color_b"], data["allowed"]):
            return jsonify({"success": True, "msg": "Category updated successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when updating the data"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/delete_category', methods=['POST'])
def delete_category():
    try:
        data = request.get_json()

        if delete_category_data(data["userId"], data["editId"], data["name"]):
            return jsonify({"success": True, "msg": "Category deleted successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when deleting the data"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/get_accounts', methods=['POST'])
def get_accounts():
    try:
        data = request.get_json()

        accounts = get_accounts_by_user(data["userId"])

        if accounts is not None:
            return jsonify({"success": True, "msg": "Accounts retrieved successfully", "accounts" : accounts}), 201
        
        return jsonify({"success": False, "msg": "Failed to get user accounts"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/get_categories', methods=['POST'])
def get_categories():
    try:
        data = request.get_json()
        
        categories = get_categories_by_user(data["userId"])

        if categories is not None:
            return jsonify({"success": True, "msg": "Categories retrieved successfully", "categories" : categories}), 201
        
        return jsonify({"success": False, "msg": "Failed to get user categories"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/get_categories_by_type', methods=['POST'])
def get_categories_by_type():
    try:
        data = request.get_json()

        category_type = "Both" if data["movementType"] == "Transfer" else data["movementType"]

        categories = []
        if category_type == "Both":
            categories = get_categories_by_user_and_type(data["userId"], category_type)
        else:
            categories = get_categories_by_user_and_multiple_type(data["userId"], category_type, "Both")

        if categories is not None:
            return jsonify({"success": True, "msg": "Categories retrieved successfully", "categories" : categories}), 201
        
        return jsonify({"success": False, "msg": "Failed to get user categories"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/get_currencies', methods=['POST'])
def get_currencies():
    try:
        currencies = get_all_currencies()

        if currencies:
            return jsonify({"success": True, "msg": "All currencies retrieved", "currencies": currencies}), 201
        
        return jsonify({"success": False, "msg": "Failed to get currencies"}), 500

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


@main_routes.route('/get_transactions', methods=['POST'])
def get_transactions():
    try:
        data = request.get_json()

        transactions = get_account_transactions(data["id"])

        if transactions is not None:
            return jsonify({"success": True, "msg": "Transactions retrieved successfully", "transactions" : transactions}), 201
        
        return jsonify({"success": False, "msg": "Failed to get transactions"}), 500

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
    

@main_routes.route('/new_transaction', methods=['POST'])
def new_transaction():
    try:
        data = request.get_json()

        acc_origin = data["accountOrigin"]
        acc_destiny = data["accountDestiny"]
        category = data["category"]

        # HANDLE EXTERNAL SOURCE ACCOUNTS
        if data["movementType"] == "Income" or acc_origin == None:
            acc_origin = get_account_by_name(data["userId"], "[SYSTEM_ORIGIN]")
            if acc_origin == None:
                raise Exception("[SYSTEM_ORIGIN] account not found")

        if data["movementType"] == "Expense" or acc_destiny == None:
            acc_destiny = get_account_by_name(data["userId"], "[SYSTEM_DESTINY]")
            if acc_destiny == None:
                raise Exception("[SYSTEM_DESTINY] account not found")

        # HANDLE UNCATEGORIZED TRANSACTIONS
        if category == None:
            category = get_category_by_name(data["userId"], "[UNCATEGORIZED]")
            if category == None:
                raise Exception("[UNCATEGORIZED] category not found")
                    

        # HANDLE EXCHANGE RATE
        xchg_rate_origin = get_exchange_rate_today(acc_origin["currency_id"])
        xchg_rate_destiny = get_exchange_rate_today(acc_destiny["currency_id"])


        if xchg_rate_origin == None or xchg_rate_destiny == None:
            print("ExchangeRate-API queried")
            api_key = os.getenv('XCHG_RATE_API_KEY')
            url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/USD"
            response = requests.get(url)

            if response.status_code == 200:
                data = response.json()
                rates = data["conversion_rates"]

                if xchg_rate_origin == None:
                    insert_exchange_rate(acc_origin["currency_id"], rates[acc_origin["code"]])
                    xchg_rate_origin = get_exchange_rate_today(acc_origin["currency_id"])
                
                if xchg_rate_destiny == None:
                    insert_exchange_rate(acc_destiny["currency_id"], rates[acc_destiny["code"]])
                    xchg_rate_destiny = get_exchange_rate_today(acc_destiny["currency_id"])
            else:
                raise Exception("Failed to get exchange rates")


        base_to_origin = float(xchg_rate_origin["rate_to_base"])
        base_to_destiny = float(xchg_rate_destiny["rate_to_base"])
        origin_to_base = 1 / base_to_origin

        am = data.get("amount")
        if am is None:
            raise Exception(f"Invalid transaction amount: {am}")
        
        amount_origin = float(am)
        amount_destiny = amount_origin * origin_to_base * base_to_destiny

        if data["movementType"] == "Deposit":
            amount_destiny = amount_origin

        origin_budget = get_budget_by_date(acc_origin["account_id"], date.today().month, date.today().year)
        origin_budget_id = origin_budget["budget_id"] if origin_budget is not None else None

        if origin_budget is not None and float(origin_budget["current_spent"]) + amount_origin > float(origin_budget["amount_limit"]):
            return jsonify({"success": False, "msg": "Amount surpasses budget limit on origin account"}), 500

        if insert_new_transaction(acc_origin["account_id"], acc_destiny["account_id"], category["category_id"], data["movementType"], amount_origin, amount_destiny, xchg_rate_origin["rate_id"], data["description"], origin_budget_id):
            return jsonify({"success": True, "msg": "Movement successful"}), 201

        return jsonify({"success": False, "msg": "Something went wrong when inserting into database"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/create_subscription', methods=['POST'])
def create_subscription():
    try:
        data = request.get_json()

        if get_subscription_by_name(data["accountId"], data["name"]):
            return jsonify({"success": False, "msg": "A subscription with the same name already exists"}), 409
        
        if insert_new_subscription(data["accountId"], data["name"], data["amount"], data["frequency"], data["startDate"]):
            return jsonify({"success": True, "msg": "Subscription created successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when inserting into database"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    

@main_routes.route('/get_subscriptions', methods=['POST'])
def get_subscriptions():
    try:
        data = request.get_json()

        subscriptions = get_subscriptions_by_account(data["accountId"])

        if subscriptions is not None:
            return jsonify({"success": True, "msg": "Subscriptions retrieved successfully", "subscriptions": subscriptions}), 201
        
        return jsonify({"success": False, "msg": "Failed to get subscriptions"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/update_subscription', methods=['POST'])
def update_subscription():
    try:
        data = request.get_json()

        already_exists = get_subscription_by_name(data["accountId"], data["name"])

        if already_exists and already_exists["subscription_id"] != data["editId"]:
            return jsonify({"success": False, "msg": "A subscription with the same name already exists"}), 409
        
        if update_subscription_data(data["editId"], data["name"], data["frequency"], data["amount"]):
            return jsonify({"success": True, "msg": "Subscription updated successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when updating the data"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/delete_subscription', methods=['POST'])
def delete_subscription():
    try:
        data = request.get_json()

        if delete_subscription_data(data["accountId"], data["editId"], data["name"]):
            return jsonify({"success": True, "msg": "Subscription deleted successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when deleting the data"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/create_budget', methods=['POST'])
def create_budget():
    try:
        data = request.get_json()

        already_exists = get_budget_by_date(data["accountId"], data["month"], data["year"])

        if already_exists:
            return jsonify({"success": False, "msg": "A budget already exists for that time period"}), 409

        if insert_new_budget(data["accountId"], data["amount"], data["month"], data["year"]):
            return jsonify({"success": True, "msg": "Budget created successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when inserting into database"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
    

@main_routes.route('/get_budgets', methods=['POST'])
def get_budgets():
    try:
        data = request.get_json()

        budgets = get_budgets_by_account(data["accountId"])

        if budgets is not None:
            return jsonify({"success": True, "msg": "Budgets retrieved successfully", "budgets": budgets}), 201
        
        return jsonify({"success": False, "msg": "Failed to get budgets"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/update_budget', methods=['POST'])
def update_budget():
    try:
        data = request.get_json()

        already_exists = get_budget_by_date(data["accountId"], data["month"], data["year"])

        if already_exists and already_exists["budget_id"] != data["editId"]:
            return jsonify({"success": False, "msg": "A budget already exists for that time period"}), 409
        
        all_data = get_budget_by_id(data["editId"])
        if all_data is not None and all_data["current_spent"] > float(data["amount"]):
            return jsonify({"success": False, "msg": "Budget limit cannot be less than current spent amount"}), 500    
        
        if update_budget_data(data["editId"], data["amount"], data["month"], data["year"]):
            return jsonify({"success": True, "msg": "Budget updated successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when updating the data"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/delete_budget', methods=['POST'])
def delete_budget():
    try:
        data = request.get_json()

        if delete_budget_data(data["accountId"], data["editId"]):
            return jsonify({"success": True, "msg": "Budget deleted successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when deleting the data"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@main_routes.route('/delete_account', methods=['POST'])
def delete_account():
    try:
        data = request.get_json()

        if delete_account_data(data["accountId"]):
            return jsonify({"success": True, "msg": "Account deleted successfully"}), 201
        
        return jsonify({"success": False, "msg": "Something went wrong when deleting the data"}), 500

    except Exception as e:
        print("SERVER ERROR:", traceback.format_exc())
        return jsonify({"error": str(e)}), 500
