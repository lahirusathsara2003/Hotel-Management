from flask import Blueprint
from app.controllers.service_controller import get_all, get_by_id, create, update, delete

service_bp = Blueprint('service_bp', __name__)

service_bp.route('/', methods=['GET'])(get_all)
service_bp.route('/<id>', methods=['GET'])(get_by_id)
service_bp.route('/', methods=['POST'])(create)
service_bp.route('/<id>', methods=['PUT'])(update)
service_bp.route('/<id>', methods=['DELETE'])(delete)
