from flask import Blueprint
from app.controllers.report_controller import get_all, get_by_id, create, update, delete

report_bp = Blueprint('report_bp', __name__)

report_bp.route('/', methods=['GET'])(get_all)
report_bp.route('/<id>', methods=['GET'])(get_by_id)
report_bp.route('/', methods=['POST'])(create)
report_bp.route('/<id>', methods=['PUT'])(update)
report_bp.route('/<id>', methods=['DELETE'])(delete)
