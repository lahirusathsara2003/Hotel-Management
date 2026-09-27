from flask import request, jsonify
from app import mongo
from bson import ObjectId
from app.utils.auth import token_required

@token_required
def get_all(current_user):
    data = list(mongo.db.offers.find())
    for item in data:
        item['_id'] = str(item['_id'])
    return jsonify(data), 200

@token_required
def get_by_id(current_user, id):
    try:
        item = mongo.db.offers.find_one({"_id": ObjectId(id)})
        if not item:
            return jsonify({"message": "Not found"}), 404
        item['_id'] = str(item['_id'])
        return jsonify(item), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@token_required
def create(current_user):
    data = request.get_json()
    result = mongo.db.offers.insert_one(data)
    return jsonify({"message": "Created successfully", "id": str(result.inserted_id)}), 201

@token_required
def update(current_user, id):
    data = request.get_json()
    try:
        result = mongo.db.offers.update_one({"_id": ObjectId(id)}, {"$set": data})
        if result.matched_count:
            return jsonify({"message": "Updated successfully"}), 200
        return jsonify({"message": "Not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@token_required
def delete(current_user, id):
    try:
        result = mongo.db.offers.delete_one({"_id": ObjectId(id)})
        if result.deleted_count:
            return jsonify({"message": "Deleted successfully"}), 200
        return jsonify({"message": "Not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400
