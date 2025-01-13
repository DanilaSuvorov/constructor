from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import sqlite3
import bcrypt
import jwt
import datetime
import os
from functools import wraps

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["null", "file://", "http://localhost:5000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a secure secret key
DATABASE_PATH = 'database/users.db'

def get_db():
    db = sqlite3.connect(DATABASE_PATH)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    if not os.path.exists('database'):
        os.makedirs('database')
    
    db = get_db()
    with open('database/schema.sql', 'r') as f:
        db.executescript(f.read())
    db.commit()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            db = get_db()
            current_user = db.execute('SELECT * FROM users WHERE id = ?', 
                                    (data['user_id'],)).fetchone()
            if not current_user:
                raise Exception('User not found')
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Пожалуйста, заполните все поля'}), 400
    
    db = get_db()
    
    # Check if user already exists
    if db.execute('SELECT id FROM users WHERE email = ?', 
                  (data['email'],)).fetchone():
        return jsonify({'message': 'Пользователь с таким email уже существует'}), 409
    
    # Hash the password
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    # Create new user
    try:
        db.execute('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
                  (data['email'], hashed_password, data['email'].split('@')[0]))
        db.commit()
        return jsonify({'message': 'Регистрация успешно завершена'}), 201
    except Exception as e:
        return jsonify({'message': 'Ошибка при создании пользователя', 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Пожалуйста, заполните все поля'}), 400
    
    db = get_db()
    user = db.execute('SELECT * FROM users WHERE email = ?', 
                     (data['email'],)).fetchone()
    
    if not user:
        return jsonify({'message': 'Пользователь не найден'}), 401
    
    if bcrypt.checkpw(data['password'].encode('utf-8'), user['password_hash']):
        # Generate token
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }, app.config['SECRET_KEY'])
        
        # Update last login
        db.execute('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', 
                  (user['id'],))
        db.commit()
        
        response = make_response(jsonify({
            'message': 'Вход выполнен успешно',
            'user': {
                'email': user['email'],
                'name': user['name']
            }
        }))
        response.set_cookie('token', token, httponly=True, samesite='None', secure=True)
        return response
    
    return jsonify({'message': 'Неверный пароль'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.set_cookie('token', '', expires=0, samesite='None', secure=True)
    return response

@app.route('/api/user', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({
        'email': current_user['email'],
        'name': current_user['name']
    })

@app.route('/api/users', methods=['GET'])
@token_required
def get_users(current_user):
    db = get_db()
    users = db.execute('SELECT * FROM users').fetchall()
    return jsonify([dict(user) for user in users])

@app.route('/api/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    if not data or not data.get('email'):
        return jsonify({'message': 'Email не указан'}), 400
    
    db = get_db()
    user = db.execute('SELECT email FROM users WHERE email = ?', 
                     (data['email'],)).fetchone()
    
    return jsonify({
        'exists': user is not None,
        'message': 'Пользователь с таким email уже существует' if user else 'Email доступен'
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
