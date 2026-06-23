import os

def get_db_config():
    """Get database configuration from environment variables"""
    return {
        'host': os.getenv('DB_HOST', 'database-1.cju88ymggwzm.ap-south-1.rds.amazonaws.com'),
        'port': int(os.getenv('DB_PORT', '5432')),
        'database': os.getenv('DB_NAME', 'postgres'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', 'Awsuserdbpassword')
    }

# Export the database configuration
DB_CONFIG = get_db_config()

# Print connection info (without password) for debugging
print(f"Database config loaded: host={DB_CONFIG['host']}, database={DB_CONFIG['database']}, user={DB_CONFIG['user']}")
