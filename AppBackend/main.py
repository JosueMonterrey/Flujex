from flask import Flask
from flask_cors import CORS
from src import main_routes

app = Flask(__name__)
CORS(app)

# Registramos las rutas que definimos en el otro archivo
app.register_blueprint(main_routes)

if __name__ == '__main__':
    app.run(debug=True, port=5000)