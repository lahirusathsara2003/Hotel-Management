from flask import Blueprint
from app.controllers.checkin_controller import get_all, get_by_id, create, update, delete

checkin_bp = Blueprint('checkin_bp', __name__)

checkin_bp.route('/', methods=['GET'])(get_all)
checkin_bp.route('/<id>', methods=['GET'])(get_by_id)
checkin_bp.route('/', methods=['POST'])(create)
checkin_bp.route('/<id>', methods=['PUT'])(update)
checkin_bp.route('/<id>', methods=['DELETE'])(delete)
