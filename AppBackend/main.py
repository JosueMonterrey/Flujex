from flask import Flask
from flask_cors import CORS
from src import main_routes

app = Flask(__name__)
CORS(app)

app.register_blueprint(main_routes)

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')