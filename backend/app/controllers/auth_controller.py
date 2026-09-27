from flask import request, jsonify
from app import mongo
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from app.config import Config

def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    role = data.get('role', 'customer')

    if not name or not email or not phone or not password:
        return jsonify({'message': 'All fields are required'}), 400

    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters'}), 400

    if role.lower() not in ['admin', 'staff', 'customer']:
        return jsonify({'message': 'Invalid role'}), 400

    if mongo.db.users.find_one({'email': email}):
        return jsonify({'message': 'Email already exists'}), 400

    hashed_password = generate_password_hash(password)
    
    new_user = {
        'name': name,
        'email': email,
        'phone': phone,
        'password_hash': hashed_password,
        'role': role.lower(),
        'created_at': datetime.datetime.utcnow()
    }
    
    user_id = mongo.db.users.insert_one(new_user).inserted_id

    if role.lower() == 'customer':
        customer_record = {
            'user_id': str(user_id),
            'name': name,
            'email': email,
            'phone': phone,
            'address': 'Not provided',
            'id_proof': 'Not provided',
            'created_at': datetime.datetime.utcnow()
        }
        mongo.db.customers.insert_one(customer_record)

    return jsonify({'message': 'User registered successfully'}), 201

def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.users.find_one({'email': email})
    
    # Fallback to username for the initial seeded admin
    if not user:
        user = mongo.db.users.find_one({'username': email})

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode({
        'user_id': str(user['_id']),
        'role': user['role'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, Config.SECRET_KEY, algorithm="HS256")

    display_name = user.get('name', user.get('username', 'User'))

    return jsonify({'token': token, 'role': user['role'], 'username': display_name, 'email': user.get('email', '')}), 200
