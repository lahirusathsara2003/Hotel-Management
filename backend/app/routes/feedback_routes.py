from flask import Blueprint
from app.controllers.feedback_controller import get_feedback, add_feedback, update_feedback, mark_feedback_seen

feedback_bp = Blueprint('feedback', __name__)

feedback_bp.route('/', methods=['GET'])(get_feedback)
feedback_bp.route('/', methods=['POST'])(add_feedback)
feedback_bp.route('/<id>', methods=['PUT'])(update_feedback)
feedback_bp.route('/mark-seen', methods=['POST'])(mark_feedback_seen)
