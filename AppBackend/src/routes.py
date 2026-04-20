from flask import Blueprint, request, jsonify
from .queries import *

main_routes = Blueprint('main_routes', __name__)