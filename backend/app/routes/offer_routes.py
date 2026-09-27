from flask import Blueprint
from app.controllers.offer_controller import get_all, get_by_id, create, update, delete

offer_bp = Blueprint('offer_bp', __name__)

offer_bp.route('/', methods=['GET'])(get_all)
offer_bp.route('/<id>', methods=['GET'])(get_by_id)
offer_bp.route('/', methods=['POST'])(create)
offer_bp.route('/<id>', methods=['PUT'])(update)
offer_bp.route('/<id>', methods=['DELETE'])(delete)
