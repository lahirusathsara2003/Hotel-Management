from flask import request, jsonify
from app import mongo
from bson import ObjectId
from app.utils.auth import token_required
import datetime

@token_required
def get_all(current_user):
    data = list(mongo.db.customers.find())
    for item in data:
        item['_id'] = str(item['_id'])
    return jsonify(data), 200

@token_required
def get_me(current_user):
    item = mongo.db.customers.find_one({"user_id": str(current_user['_id'])})
    if not item:
        # Create profile on the fly for legacy users
        item = {
            "user_id": str(current_user['_id']),
            "name": current_user.get('name', current_user.get('username', 'Guest')),
            "email": current_user.get('email', ''),
            "phone": current_user.get('phone', ''),
            "address": "Not provided",
            "id_proof": "Not provided"
        }
        res = mongo.db.customers.insert_one(item)
        item['_id'] = str(res.inserted_id)
        return jsonify(item), 200
    item['_id'] = str(item['_id'])
    return jsonify(item), 200

@token_required
def get_by_id(current_user, id):
    try:
        item = mongo.db.customers.find_one({"_id": ObjectId(id)})
        if not item:
            return jsonify({"message": "Not found"}), 404
        item['_id'] = str(item['_id'])
        return jsonify(item), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@token_required
def create(current_user):
    data = request.get_json()
    result = mongo.db.customers.insert_one(data)
    return jsonify({"message": "Created successfully", "id": str(result.inserted_id)}), 201

@token_required
def update(current_user, id):
    data = request.get_json()
    try:
        result = mongo.db.customers.update_one({"_id": ObjectId(id)}, {"$set": data})
        if result.matched_count:
            return jsonify({"message": "Updated successfully"}), 200
        return jsonify({"message": "Not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@token_required
def delete(current_user, id):
    try:
        # Check if customer has active reservations/bookings
        today = datetime.datetime.now().strftime('%Y-%m-%d')
        active_res = mongo.db.reservations.find_one({
            "$or": [
                {"customer_id": str(id)},
                {"customer_id": ObjectId(id)}
            ],
            "check_out_date": {"$gte": today}
        })
        if active_res:
            return jsonify({"message": "Cannot delete customer with active bookings or reservations"}), 400

        result = mongo.db.customers.delete_one({"_id": ObjectId(id)})
        if result.deleted_count:
            # Delete related reservations/bookings (payments are untouched)
            mongo.db.reservations.delete_many({
                "$or": [
                    {"customer_id": str(id)},
                    {"customer_id": ObjectId(id)}
                ]
            })
            return jsonify({"message": "Deleted successfully"}), 200
        return jsonify({"message": "Not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400
