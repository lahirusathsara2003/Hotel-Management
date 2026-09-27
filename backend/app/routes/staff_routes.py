from flask import Blueprint
from app.controllers.staff_controller import get_all, get_by_id, create, update, delete

staff_bp = Blueprint('staff_bp', __name__)

staff_bp.route('/', methods=['GET'])(get_all)
staff_bp.route('/<id>', methods=['GET'])(get_by_id)
staff_bp.route('/', methods=['POST'])(create)
staff_bp.route('/<id>', methods=['PUT'])(update)
staff_bp.route('/<id>', methods=['DELETE'])(delete)
