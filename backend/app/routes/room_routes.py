from flask import Blueprint
from app.controllers.room_controller import get_all, get_by_id, create, update, delete, get_available

room_bp = Blueprint('room_bp', __name__)

room_bp.route('/', methods=['GET'])(get_all)
room_bp.route('/available', methods=['GET'])(get_available)
room_bp.route('/<id>', methods=['GET'])(get_by_id)
room_bp.route('/', methods=['POST'])(create)
room_bp.route('/<id>', methods=['PUT'])(update)
room_bp.route('/<id>', methods=['DELETE'])(delete)
