from flask import Blueprint
from app.controllers.user_controller import get_all, get_by_id, create, update, delete

user_bp = Blueprint('user_bp', __name__)

user_bp.route('/', methods=['GET'])(get_all)
user_bp.route('/<id>', methods=['GET'])(get_by_id)
user_bp.route('/', methods=['POST'])(create)
user_bp.route('/<id>', methods=['PUT'])(update)
user_bp.route('/<id>', methods=['DELETE'])(delete)
