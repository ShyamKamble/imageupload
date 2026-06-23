#!/usr/bin/env python3
"""
Test script to verify database connection
Run this on EC2 to test if database is accessible
"""
import psycopg2
from db_config import DB_CONFIG

def test_connection():
    print("Testing database connection...")
    print(f"Host: {DB_CONFIG['host']}")
    print(f"Database: {DB_CONFIG['database']}")
    print(f"User: {DB_CONFIG['user']}")
    print(f"Port: {DB_CONFIG['port']}")
    print("-" * 50)
    
    try:
        # Try to connect
        conn = psycopg2.connect(**DB_CONFIG)
        print("✅ Connection successful!")
        
        # Test query
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ PostgreSQL version: {version[0]}")
        
        # List tables
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cursor.fetchall()
        print(f"✅ Tables in database: {[t[0] for t in tables]}")
        
        cursor.close()
        conn.close()
        print("\n✅ All tests passed!")
        return True
        
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible issues:")
        print("1. RDS instance is stopped - start it in AWS Console")
        print("2. Security group doesn't allow connection from EC2")
        print("3. Wrong password or credentials")
        print("4. Network/VPC configuration issue")
        return False
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_connection()
