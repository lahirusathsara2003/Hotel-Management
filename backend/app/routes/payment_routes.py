from flask import Blueprint
from app.controllers.payment_controller import get_all, get_by_id, create, update, delete

payment_bp = Blueprint('payment_bp', __name__)

payment_bp.route('/', methods=['GET'])(get_all)
payment_bp.route('/<id>', methods=['GET'])(get_by_id)
payment_bp.route('/', methods=['POST'])(create)
payment_bp.route('/<id>', methods=['PUT'])(update)
payment_bp.route('/<id>', methods=['DELETE'])(delete)
