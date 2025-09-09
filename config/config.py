"""
AutoHire AI - Configuration
Environment variables and application settings
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class."""
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'autohire_ai_secret_key_2025'
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    
    # Server Configuration
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    ALLOWED_EXTENSIONS = {'pdf'}
    
    # Database Configuration (for future use)
    DATABASE_URL = os.environ.get('DATABASE_URL')
    SQLALCHEMY_DATABASE_URI = DATABASE_URL or 'sqlite:///autohire.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Security Configuration
    SESSION_COOKIE_SECURE = os.environ.get('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # CORS Configuration
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'logs/autohire.log')
    
    # AI Model Configuration
    AI_MODEL_PATH = os.environ.get('AI_MODEL_PATH', 'models/')
    AI_CONFIDENCE_THRESHOLD = float(os.environ.get('AI_CONFIDENCE_THRESHOLD', 0.7))
    
    # Job Matching Configuration
    MAX_JOB_MATCHES = int(os.environ.get('MAX_JOB_MATCHES', 10))
    JOB_MATCH_THRESHOLD = float(os.environ.get('JOB_MATCH_THRESHOLD', 0.6))
    
    # Resume Analysis Configuration
    MAX_RESUMES_PER_USER = int(os.environ.get('MAX_RESUMES_PER_USER', 3))
    RESUME_ANALYSIS_TIMEOUT = int(os.environ.get('RESUME_ANALYSIS_TIMEOUT', 30))
    
    # Performance Configuration
    CACHE_TYPE = os.environ.get('CACHE_TYPE', 'simple')
    CACHE_DEFAULT_TIMEOUT = int(os.environ.get('CACHE_DEFAULT_TIMEOUT', 300))
    
    # External API Configuration (for future use)
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    LINKEDIN_API_KEY = os.environ.get('LINKEDIN_API_KEY')
    INDEED_API_KEY = os.environ.get('INDEED_API_KEY')

class DevelopmentConfig(Config):
    """Development configuration."""
    
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    
    # Development-specific settings
    TEMPLATES_AUTO_RELOAD = True
    SEND_FILE_MAX_AGE_DEFAULT = 0

class ProductionConfig(Config):
    """Production configuration."""
    
    DEBUG = False
    LOG_LEVEL = 'WARNING'
    
    # Production-specific settings
    SESSION_COOKIE_SECURE = True
    TEMPLATES_AUTO_RELOAD = False
    
    # Security headers
    SECURITY_HEADERS = {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block'
    }

class TestingConfig(Config):
    """Testing configuration."""
    
    TESTING = True
    DEBUG = True
    LOG_LEVEL = 'DEBUG'
    
    # Use in-memory database for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    
    # Disable CSRF protection for testing
    WTF_CSRF_ENABLED = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config(config_name=None):
    """Get configuration class by name."""
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')
    
    return config.get(config_name, config['default'])

def init_app(app, config_name=None):
    """Initialize Flask app with configuration."""
    config_class = get_config(config_name)
    app.config.from_object(config_class)
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Ensure logs folder exists
    log_dir = os.path.dirname(app.config['LOG_FILE'])
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)
    
    return app
