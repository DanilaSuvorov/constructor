from flask import Flask, request, jsonify, g, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import datetime
import secrets
from flask_mail import Mail, Message
import os
from functools import wraps
import jwt

app = Flask(__name__, static_folder='.')
CORS(app, resources={
    r"/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'dansuvtim@gmail.com'
app.config['MAIL_PASSWORD'] = 'myil gift zgzr mrxv'
app.config['MAIL_DEFAULT_SENDER'] = 'dansuvtim@gmail.com'

mail = Mail(app)

DATABASE_PATH = 'database/users.db'

def init_db():
    if not os.path.exists('database'):
        os.makedirs('database')
        
    # Always recreate the database to ensure correct schema
    if os.path.exists(DATABASE_PATH):
        os.remove(DATABASE_PATH)
        
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reset_token TEXT,
        reset_token_expires TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()
    print("Database initialized with correct schema")

# Initialize database on startup
init_db()

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE_PATH)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token отсутствует'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            db = get_db()
            cursor = db.cursor()
            cursor.execute('SELECT * FROM users WHERE id = ?', (data['user_id'],))
            current_user = cursor.fetchone()
            
            if not current_user:
                return jsonify({'message': 'Пользователь не найден'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Срок действия токена истек'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Недействительный токен'}), 401
        except Exception as e:
            print(f"Token verification error: {str(e)}")
            return jsonify({'message': 'Ошибка проверки токена'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/api/register', methods=['POST'])
def register():
    if not request.is_json:
        return jsonify({'message': 'Content-Type должен быть application/json'}), 400
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email и пароль обязательны'}), 400
    
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Check if user exists
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        if cursor.fetchone():
            return jsonify({'message': 'Пользователь с таким email уже существует'}), 400
        
        # Create user
        hashed_password = generate_password_hash(password)
        cursor.execute('INSERT INTO users (email, password) VALUES (?, ?)',
                      (email, hashed_password))
        db.commit()
        
        # Get created user
        cursor.execute('SELECT id, email FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        # Generate token
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'Регистрация успешна',
            'token': token,
            'user': {
                'id': user[0],
                'email': user[1]
            }
        }), 201
        
    except Exception as e:
        print(f"Registration error: {str(e)}")
        db.rollback()
        return jsonify({'message': 'Ошибка при регистрации', 'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({'message': 'Content-Type должен быть application/json'}), 400
    
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email и пароль обязательны'}), 400
    
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('SELECT id, email, password FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        if not user or not check_password_hash(user[2], password):
            return jsonify({'message': 'Неверный email или пароль'}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': user[0],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'message': 'Вход выполнен успешно',
            'token': token,
            'user': {
                'id': user[0],
                'email': user[1]
            }
        })
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'Ошибка при входе', 'error': str(e)}), 500

@app.route('/api/request-reset', methods=['POST'])
def request_reset():
    if not request.is_json:
        return jsonify({'message': 'Content-Type должен быть application/json'}), 400
        
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email обязателен'}), 400
    
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Find user
        cursor.execute('SELECT id FROM users WHERE email = ?', (email,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'message': 'Пользователь с таким email не найден'}), 404
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        
        # Save reset token
        cursor.execute('''UPDATE users 
                         SET reset_token = ?, reset_token_expires = ? 
                         WHERE id = ?''',
                      (reset_token, expires, user[0]))
        db.commit()
        
        # Send email
        msg = Message(
            'Восстановление пароля',
            recipients=[email]
        )
        msg.html = f'''
        <h3>Восстановление пароля</h3>
        <p>Для восстановления пароля используйте этот код:</p>
        <h2>{reset_token}</h2>
        <p>Код действителен в течение 1 часа.</p>
        '''
        
        mail.send(msg)
        
        return jsonify({
            'message': 'Инструкции по восстановлению пароля отправлены на ваш email'
        })
        
    except Exception as e:
        print(f"Password reset request error: {str(e)}")
        db.rollback()
        return jsonify({'message': 'Ошибка при запросе сброса пароля', 'error': str(e)}), 500

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    if not request.is_json:
        return jsonify({'message': 'Content-Type должен быть application/json'}), 400
        
    data = request.get_json()
    print("Reset password data:", data)
    
    email = data.get('email')
    reset_token = data.get('token')
    new_password = data.get('password')
    
    if not all([email, reset_token, new_password]):
        print("Missing fields:", {
            'email': bool(email),
            'token': bool(reset_token),
            'password': bool(new_password)
        })
        return jsonify({'message': 'Email, токен и новый пароль обязательны'}), 400
    
    try:
        db = get_db()
        cursor = db.cursor()
        
        # Find user with valid reset token
        cursor.execute('''SELECT id FROM users 
                         WHERE email = ? AND reset_token = ? 
                         AND reset_token_expires > ?''',
                      (email, reset_token, datetime.datetime.utcnow()))
        user = cursor.fetchone()
        
        if not user:
            print("No user found or token expired")
            return jsonify({'message': 'Неверный или просроченный токен сброса пароля'}), 400
        
        # Update password and clear reset token
        hashed_password = generate_password_hash(new_password)
        cursor.execute('''UPDATE users 
                         SET password = ?, reset_token = NULL, reset_token_expires = NULL 
                         WHERE id = ?''',
                      (hashed_password, user[0]))
        db.commit()
        
        return jsonify({'message': 'Пароль успешно обновлен'})
        
    except Exception as e:
        print(f"Password reset error: {str(e)}")
        db.rollback()
        return jsonify({'message': 'Ошибка при сбросе пароля', 'error': str(e)}), 500

@app.route('/api/user')
@token_required
def get_user(current_user):
    return jsonify({
        'id': current_user[0],
        'email': current_user[1]
    })

@app.route('/')
def serve_index():
    return send_from_directory('.', 'account.html')

if __name__ == '__main__':
    app.run(debug=True)
