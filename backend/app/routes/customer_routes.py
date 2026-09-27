from flask import Blueprint
from app.controllers.customer_controller import get_all, get_by_id, create, update, delete, get_me

customer_bp = Blueprint('customer_bp', __name__)

customer_bp.route('/', methods=['GET'])(get_all)
customer_bp.route('/me', methods=['GET'])(get_me)
customer_bp.route('/<id>', methods=['GET'])(get_by_id)
customer_bp.route('/', methods=['POST'])(create)
customer_bp.route('/<id>', methods=['PUT'])(update)
customer_bp.route('/<id>', methods=['DELETE'])(delete)
