from flask import Blueprint
from app.controllers.reservation_controller import get_all, get_by_id, create, update, delete, get_my_reservations, get_unpaid

reservation_bp = Blueprint('reservation_bp', __name__)

reservation_bp.route('/', methods=['GET'])(get_all)
reservation_bp.route('/my', methods=['GET'])(get_my_reservations)
reservation_bp.route('/unpaid', methods=['GET'])(get_unpaid)
reservation_bp.route('/<id>', methods=['GET'])(get_by_id)
reservation_bp.route('/', methods=['POST'])(create)
reservation_bp.route('/<id>', methods=['PUT'])(update)
reservation_bp.route('/<id>', methods=['DELETE'])(delete)
