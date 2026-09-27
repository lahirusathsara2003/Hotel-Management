from flask import request, jsonify
from app import mongo
from bson import ObjectId
from app.utils.auth import token_required
import random
import string

import datetime

def generate_res_id():
    date_str = datetime.datetime.now().strftime('%Y%m%d')
    chars = string.ascii_uppercase + string.digits
    suffix = ''.join(random.choice(chars) for _ in range(4))
    return f"{date_str}-{suffix}"

@token_required
def get_all(current_user):
    data = list(mongo.db.reservations.find())
    for item in data:
        item['_id'] = str(item['_id'])
        # Ensure reservation_id exists
        if 'reservation_id' not in item:
            item['reservation_id'] = f"RES-{str(item['_id'])[-6:].upper()}"
            
        # Add room details
        if 'room_id' in item:
            try:
                room = mongo.db.rooms.find_one({"_id": ObjectId(item['room_id'])})
                if room:
                    item['room_number'] = room.get('room_number', 'N/A')
            except: pass
        # Add customer details
        if 'customer_id' in item:
            try:
                customer = mongo.db.customers.find_one({"_id": ObjectId(item['customer_id'])})
                if customer:
                    item['customer_name'] = customer.get('name', 'N/A')
            except: pass
    return jsonify(data), 200

@token_required
def get_my_reservations(current_user):
    customer = mongo.db.customers.find_one({"user_id": str(current_user['_id'])})
    if not customer:
        return jsonify([]), 200
    
    data = list(mongo.db.reservations.find({"customer_id": str(customer['_id'])}))
    for item in data:
        item['_id'] = str(item['_id'])
        # Ensure reservation_id exists
        if 'reservation_id' not in item:
            item['reservation_id'] = f"RES-{str(item['_id'])[-6:].upper()}"
            
        # Add room details
        if 'room_id' in item:
            room = mongo.db.rooms.find_one({"_id": ObjectId(item['room_id'])})
            if room:
                item['room_number'] = room.get('room_number', 'N/A')
                item['room_type'] = room.get('type', 'N/A')
            
    return jsonify(data), 200

@token_required
def get_unpaid(current_user):
    # Get all reservations
    reservations = list(mongo.db.reservations.find())
    # Get all reservation_ids that already have payments
    paid_ids = [p['reservation_id'] for p in mongo.db.payments.find({}, {"reservation_id": 1})]
    
    # Get active offers for today
    today = datetime.datetime.now().strftime('%Y-%m-%d')
    active_offers = list(mongo.db.offers.find({
        "status": "Active",
        "start_date": {"$lte": today},
        "end_date": {"$gte": today}
    }))
    
    unpaid = []
    for res in reservations:
        res['_id'] = str(res['_id'])
        # Ensure reservation_id exists
        if 'reservation_id' not in res:
            res['reservation_id'] = f"RES-{str(res['_id'])[-6:].upper()}"
            
        if res['reservation_id'] not in paid_ids:
            # Calculate amount
            try:
                room = mongo.db.rooms.find_one({"_id": ObjectId(res['room_id'])})
                price_per_night = float(room.get('price_per_night', 0)) if room else 0
                
                check_in = datetime.datetime.strptime(res['check_in_date'], '%Y-%m-%d')
                check_out = datetime.datetime.strptime(res['check_out_date'], '%Y-%m-%d')
                nights = (check_out - check_in).days
                if nights <= 0: nights = 1
                
                base_amount = price_per_night * nights
                offers_total = 0
                for off in active_offers:
                    val_str = str(off.get('value', '0'))
                    if '%' in val_str:
                        perc = float(val_str.replace('%', '').strip())
                        change = (base_amount * perc / 100)
                    else:
                        try:
                            change = float(''.join(c for c in val_str if c.isdigit() or c == '.'))
                        except: change = 0
                    
                    offers_total += change
                
                res['total_amount'] = max(0, round(base_amount - offers_total, 2))
            except Exception as e:
                res['total_amount'] = 0
                
            unpaid.append(res)
            
    return jsonify(unpaid), 200

@token_required
def get_by_id(current_user, id):
    try:
        item = mongo.db.reservations.find_one({"_id": ObjectId(id)})
        if not item:
            return jsonify({"message": "Not found"}), 404
        item['_id'] = str(item['_id'])
        return jsonify(item), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@token_required
def create(current_user):
    data = request.get_json()
    # Check if room is actually available
    if 'room_id' in data:
        try:
            room = mongo.db.rooms.find_one({"_id": ObjectId(data['room_id'])})
            if not room or room.get('status') != 'Available':
                return jsonify({"message": "This room is already booked or unavailable"}), 400
        except: pass

    if 'reservation_id' not in data:
        data['reservation_id'] = generate_res_id()
    
    result = mongo.db.reservations.insert_one(data)
    
    # Automatically mark room as Booked
    if 'room_id' in data:
        try:
            mongo.db.rooms.update_one(
                {"_id": ObjectId(data['room_id'])},
                {"$set": {"status": "Booked"}}
            )
        except: pass
        
    return jsonify({"message": "Created successfully", "id": str(result.inserted_id), "reservation_id": data['reservation_id']}), 201

@token_required
def update(current_user, id):
    data = request.get_json()
    try:
        # If room_id is being changed, handle the old and new room statuses
        old_res = mongo.db.reservations.find_one({"_id": ObjectId(id)})
        
        result = mongo.db.reservations.update_one({"_id": ObjectId(id)}, {"$set": data})
        if result.matched_count:
            if 'room_id' in data and old_res and old_res.get('room_id') != data['room_id']:
                # Mark old room as Available
                if old_res.get('room_id'):
                    mongo.db.rooms.update_one({"_id": ObjectId(old_res['room_id'])}, {"$set": {"status": "Available"}})
                # Mark new room as Booked
                mongo.db.rooms.update_one({"_id": ObjectId(data['room_id'])}, {"$set": {"status": "Booked"}})
            
            return jsonify({"message": "Updated successfully"}), 200
        return jsonify({"message": "Not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@token_required
def delete(current_user, id):
    try:
        # Get reservation details before deleting to find the room_id
        res = mongo.db.reservations.find_one({"_id": ObjectId(id)})
        
        result = mongo.db.reservations.delete_one({"_id": ObjectId(id)})
        if result.deleted_count:
            # Mark room as Available again
            if res and 'room_id' in res:
                try:
                    mongo.db.rooms.update_one(
                        {"_id": ObjectId(res['room_id'])},
                        {"$set": {"status": "Available"}}
                    )
                except: pass
            return jsonify({"message": "Deleted successfully"}), 200
        return jsonify({"message": "Not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400
