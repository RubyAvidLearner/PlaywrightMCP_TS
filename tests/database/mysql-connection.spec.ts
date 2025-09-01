import { test, expect } from '@playwright/test';
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'alex',
  password: '1234',
  database: 'user_schema',
  port: 3306
};

// User interface for type safety
interface User {
  id: number;
  name: string;
  age: number;
}

test.describe('MySQL Database Connection Tests', () => {
  let connection: mysql.Connection;

  // Setup database connection before all tests
  test.beforeAll(async () => {
    try {
      connection = await mysql.createConnection(dbConfig);
      console.log('✅ Connected to MySQL database successfully');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  });

  // Close database connection after all tests
  test.afterAll(async () => {
    if (connection) {
      await connection.end();
      console.log('🔒 Database connection closed');
    }
  });

  test('Should connect to database and fetch all users', async () => {
    // Query to get all users from the database
    const [rows] = await connection.execute('SELECT * FROM users');
    const users = rows as User[];

    // Basic assertions
    expect(Array.isArray(users)).toBe(true);
    console.log('📊 Found users:', users.length);
    
    // Log users data for verification
    users.forEach(user => {
      console.log(`👤 User: ${user.name}, Age: ${user.age}, ID: ${user.id}`);
    });

    // Verify user data structure if users exist
    if (users.length > 0) {
      const firstUser = users[0];
      expect(firstUser).toHaveProperty('id');
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('age');
      expect(typeof firstUser.id).toBe('number');
      expect(typeof firstUser.name).toBe('string');
      expect(typeof firstUser.age).toBe('number');
    }
  });

  test('Should fetch a specific user by ID', async () => {
    // First, check if any users exist
    const [allUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
    const count = (allUsers as any[])[0].count;

    if (count === 0) {
      console.log('⚠️ No users found in database - skipping specific user test');
      return;
    }

    // Get user with ID 1
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [1]);
    const users = rows as User[];

    if (users.length > 0) {
      const user = users[0];
      expect(user.id).toBe(1);
      expect(user.name).toBeDefined();
      expect(user.age).toBeDefined();
      console.log(`🎯 Found user with ID 1: ${user.name}, Age: ${user.age}`);
    } else {
      console.log('⚠️ No user found with ID 1');
    }
  });

  test('Should handle database errors gracefully', async () => {
    // Test with invalid query to check error handling
    try {
      await connection.execute('SELECT * FROM non_existing_table');
      // Should not reach this line
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.code).toBe('ER_NO_SUCH_TABLE');
      console.log('✅ Error handling works correctly:', error.message);
    }
  });

  test('Should count total number of users', async () => {
    const [rows] = await connection.execute('SELECT COUNT(*) as total FROM users');
    const result = rows as any[];
    const totalUsers = result[0].total;

    expect(typeof totalUsers).toBe('number');
    expect(totalUsers).toBeGreaterThanOrEqual(0);
    console.log(`📈 Total users in database: ${totalUsers}`);
  });
});