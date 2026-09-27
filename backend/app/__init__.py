from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from app.config import Config

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.url_map.strict_slashes = False

    CORS(app)
    mongo.init_app(app)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.customer_routes import customer_bp
    from app.routes.room_routes import room_bp
    from app.routes.reservation_routes import reservation_bp
    from app.routes.payment_routes import payment_bp
    from app.routes.report_routes import report_bp
    from app.routes.feedback_routes import feedback_bp
    from app.routes.offer_routes import offer_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(customer_bp, url_prefix='/api/customers')
    app.register_blueprint(room_bp, url_prefix='/api/rooms')
    app.register_blueprint(reservation_bp, url_prefix='/api/reservations')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')
    app.register_blueprint(report_bp, url_prefix='/api/reports')
    app.register_blueprint(feedback_bp, url_prefix='/api/feedback')
    app.register_blueprint(offer_bp, url_prefix='/api/offers')

    return app
