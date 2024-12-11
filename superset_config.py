# Базовые настройки
SECRET_KEY = 'ваш_секретный_ключ'  # Замените на свой секретный ключ
SQLALCHEMY_DATABASE_URI = 'sqlite:///path/to/superset.db'  # Для продакшена лучше использовать PostgreSQL

# Настройки безопасности
ENABLE_CORS = True
CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['http://localhost:8088', 'http://your-domain.com']
}

# Настройки для встраивания
HTTP_HEADERS = {
    'X-Frame-Options': 'ALLOW-FROM http://localhost:8088 http://your-domain.com',
    'Content-Security-Policy': "frame-ancestors 'self' http://localhost:8088 http://your-domain.com"
}

# Настройки аутентификации
AUTH_TYPE = 1  # Database auth
AUTH_USER_REGISTRATION = True
AUTH_USER_REGISTRATION_ROLE = "Admin"

# Настройки JWT для API
JWT_AUTH_ENABLED = True
JWT_AUTH_USER_IDENTITY = "email"
JWT_AUTH_AUDIENCE = "superset"
JWT_AUTH_ISSUER = "superset"

# Настройки кэширования
CACHE_CONFIG = {
    'CACHE_TYPE': 'redis',
    'CACHE_DEFAULT_TIMEOUT': 300,
    'CACHE_KEY_PREFIX': 'superset_',
    'CACHE_REDIS_HOST': 'localhost',
    'CACHE_REDIS_PORT': 6379,
    'CACHE_REDIS_DB': 1,
}

# Настройки для результатов запросов
RESULTS_BACKEND = CACHE_CONFIG

# Настройки Celery для асинхронных задач
class CeleryConfig:
    BROKER_URL = 'redis://localhost:6379/0'
    CELERY_IMPORTS = ('superset.sql_lab', )
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
    CELERY_ANNOTATIONS = {'tasks.add': {'rate_limit': '10/s'}}

CELERY_CONFIG = CeleryConfig 