import os

entities = [
    "user", "customer", "room", "reservation", "checkin", "payment", "staff", "service", "report"
]

routes_dir = "backend/app/routes"
controllers_dir = "backend/app/controllers"

os.makedirs(routes_dir, exist_ok=True)
os.makedirs(controllers_dir, exist_ok=True)

for entity in entities:
    # Generate Route
    route_file = os.path.join(routes_dir, f"{entity}_routes.py")
    if not os.path.exists(route_file):
        with open(route_file, "w") as f:
            f.write(f"""from flask import Blueprint
from app.controllers.{entity}_controller import get_all, get_by_id, create, update, delete

{entity}_bp = Blueprint('{entity}_bp', __name__)

{entity}_bp.route('/', methods=['GET'])(get_all)
{entity}_bp.route('/<id>', methods=['GET'])(get_by_id)
{entity}_bp.route('/', methods=['POST'])(create)
{entity}_bp.route('/<id>', methods=['PUT'])(update)
{entity}_bp.route('/<id>', methods=['DELETE'])(delete)
""")

    # Generate Controller
    controller_file = os.path.join(controllers_dir, f"{entity}_controller.py")
    collection_name = entity + "s" if entity not in ["staff", "report"] else entity
    if entity == "checkin": collection_name = "check_ins"
    if not os.path.exists(controller_file):
        with open(controller_file, "w") as f:
            f.write(f"""from flask import request, jsonify
from app import mongo
from bson import ObjectId
from app.utils.auth import token_required

@token_required
def get_all(current_user):
    data = list(mongo.db.{collection_name}.find())
    for item in data:
        item['_id'] = str(item['_id'])
    return jsonify(data), 200

@token_required
def get_by_id(current_user, id):
    try:
        item = mongo.db.{collection_name}.find_one({{"_id": ObjectId(id)}})
        if not item:
            return jsonify({{"message": "Not found"}}), 404
        item['_id'] = str(item['_id'])
        return jsonify(item), 200
    except Exception as e:
        return jsonify({{"message": str(e)}}), 400

@token_required
def create(current_user):
    data = request.get_json()
    result = mongo.db.{collection_name}.insert_one(data)
    return jsonify({{"message": "Created successfully", "id": str(result.inserted_id)}}), 201

@token_required
def update(current_user, id):
    data = request.get_json()
    try:
        result = mongo.db.{collection_name}.update_one({{"_id": ObjectId(id)}}, {{"$set": data}})
        if result.matched_count:
            return jsonify({{"message": "Updated successfully"}}), 200
        return jsonify({{"message": "Not found"}}), 404
    except Exception as e:
        return jsonify({{"message": str(e)}}), 400

@token_required
def delete(current_user, id):
    try:
        result = mongo.db.{collection_name}.delete_one({{"_id": ObjectId(id)}})
        if result.deleted_count:
            return jsonify({{"message": "Deleted successfully"}}), 200
        return jsonify({{"message": "Not found"}}), 404
    except Exception as e:
        return jsonify({{"message": str(e)}}), 400
""")
