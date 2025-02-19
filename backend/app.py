from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash



import os
import logging



# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)




# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Set absolute path for database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(BASE_DIR, "database.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Change this for production

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

class ServiceRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    status = db.Column(db.String(20), default='Pending')

# Ensure database is created
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Welcome to the College Service Ticketing System!"

# User Signup with Unique Email & Username Check

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']

    # Check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"success": False, "message": "Email already in use."})

    # ✅ Hash the password before storing it
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    # Save new user
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "Signup successful!"})




# User Login with Correct Password Check
import traceback  # Add this at the top of your file
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)  # Generate JWT Token
        return jsonify({"success": True, "message": "Login successful!", "token": access_token})
    else:
        return jsonify({"success": False, "message": "Invalid email or password."})


# Create Service Request
@app.route('/service-request', methods=['POST'])
@jwt_required()
def create_service_request():
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        app.logger.debug(f"Request received: {data}, User: {user_id}")

        if not data or 'category' not in data or 'description' not in data:
            return jsonify({'message': 'Missing required fields'}), 400

        new_request = ServiceRequest(user_id=user_id, category=data['category'], description=data['description'])
        db.session.add(new_request)
        db.session.commit()

        return jsonify({'message': 'Service request created successfully'}), 201
    except Exception as e:
        app.logger.error(f"Error: {str(e)}")
        return jsonify({'message': 'Internal Server Error'}), 500


# View User's Service Requests
@app.route('/service-requests', methods=['GET'])
@jwt_required()
def get_user_requests():
    user_id = get_jwt_identity()
    requests = ServiceRequest.query.filter_by(user_id=user_id).all()

    result = [{'id': r.id, 'category': r.category, 'description': r.description, 'status': r.status} for r in requests]
    return jsonify(result), 200

# View All Service Requests (Admin Only)
@app.route('/all-service-requests', methods=['GET'])
@jwt_required()
def get_all_requests():
    requests = ServiceRequest.query.all()
    result = [{'id': r.id, 'user_id': r.user_id, 'category': r.category, 'description': r.description, 'status': r.status} for r in requests]
    return jsonify(result), 200

# Update Service Request Status
@app.route('/update-status/<int:request_id>', methods=['PUT'])
@jwt_required()
def update_status(request_id):
    data = request.get_json()
    request_obj = ServiceRequest.query.get(request_id)

    if not request_obj:
        return jsonify({'message': 'Service request not found'}), 404

    if 'status' not in data:
        return jsonify({'message': 'Missing status field'}), 400

    request_obj.status = data['status']
    db.session.commit()

    return jsonify({'message': 'Service request status updated successfully'}), 200

# Delete Service Request
@app.route('/delete-request/<int:request_id>', methods=['DELETE'])
@jwt_required()
def delete_request(request_id):
    request_obj = ServiceRequest.query.get(request_id)

    if not request_obj:
        return jsonify({'message': 'Service request not found'}), 404

    db.session.delete(request_obj)
    db.session.commit()

    return jsonify({'message': 'Service request deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
