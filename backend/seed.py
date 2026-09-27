import os
from dotenv import load_dotenv
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
import datetime

load_dotenv()
client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/hotel_db'))
db = client.get_database()

if not db.users.find_one({'username': 'admin'}):
    db.users.insert_one({
        'username': 'admin',
        'password_hash': generate_password_hash('admin123'),
        'role': 'Admin',
        'created_at': datetime.datetime.utcnow()
    })
    print("Admin user seeded! Username: admin, Password: admin123")
else:
    print("Admin user already exists.")
