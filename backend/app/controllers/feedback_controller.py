from flask import request, jsonify
from app import mongo
import datetime

def get_feedback():
    feedback = list(mongo.db.feedback.find())
    for item in feedback:
        item['_id'] = str(item['_id'])
    return jsonify(feedback), 200

def add_feedback():
    data = request.get_json()
    new_feedback = {
        'customer_name': data.get('customer_name'),
        'email': data.get('email'),
        'message': data.get('message'),
        'rating': data.get('rating'),
        'staff_reply': '',
        'created_at': datetime.datetime.utcnow()
    }
    mongo.db.feedback.insert_one(new_feedback)
    return jsonify({'message': 'Feedback submitted successfully'}), 201

def update_feedback(id):
    data = request.get_json()
    try:
        from bson import ObjectId
        result = mongo.db.feedback.update_one(
            {'_id': ObjectId(id)},
            {'$set': {
                'staff_reply': data.get('staff_reply'),
                'reply_seen_by_customer': False
            }}
        )
        if result.matched_count:
            return jsonify({'message': 'Feedback updated successfully'}), 200
        return jsonify({'message': 'Feedback not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 400

def mark_feedback_seen():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Email required'}), 400
    
    mongo.db.feedback.update_many(
        {'email': email, 'staff_reply': {'$ne': None}},
        {'$set': {'reply_seen_by_customer': True}}
    )
    return jsonify({'message': 'Feedback marked as seen'}), 200
