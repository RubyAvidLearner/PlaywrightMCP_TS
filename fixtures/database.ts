/* eslint-disable */
import { test as base } from '@playwright/test';
import mysql from 'mysql2/promise';

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'alex',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'user_schema',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// Database helper class with common operations
export class DatabaseHelper {
  constructor(private connection: mysql.Connection) {}

  async getAllUsers(): Promise<User[]> {
    const [rows] = await this.connection.execute('SELECT * FROM users');
    return rows as User[];
  }

  async getUserById(id: number): Promise<User | null> {
    const [rows] = await this.connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    const users = rows as User[];
    return users[0] || null;
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const [result] = await this.connection.execute(
      'INSERT INTO users (name, age) VALUES (?, ?)',
      [userData.name, userData.age]
    );
    const insertId = (result as mysql.ResultSetHeader).insertId;
    return { id: insertId, ...userData };
  }

  async deleteUser(id: number): Promise<void> {
    await this.connection.execute('DELETE FROM users WHERE id = ?', [id]);
  }

  async getUserCount(): Promise<number> {
    const [rows] = await this.connection.execute(
      'SELECT COUNT(*) as total FROM users'
    );
    const result = rows as any[];
    return result[0].total;
  }

  // Raw query method for custom operations
  async query(sql: string, params?: any[]): Promise<any> {
    const [rows] = await this.connection.execute(sql, params);
    return rows;
  }
}

// Extend Playwright test with database fixture
export const test = base.extend<
  {
    db: DatabaseHelper;
  },
  {
    dbConnection: mysql.Connection;
  }
>({
  // Database connection fixture - shared across tests in same worker
  dbConnection: [
    async ({}, use) => {
      console.log('🔗 Setting up database connection...');
      const connection = await mysql.createConnection(dbConfig);
      await use(connection);
      console.log('🔒 Closing database connection...');
      await connection.end();
    },
    { scope: 'worker' },
  ],

  // Database helper fixture
  db: async ({ dbConnection }, use) => {
    const dbHelper = new DatabaseHelper(dbConnection);
    await use(dbHelper);
  },
});

export { expect } from '@playwright/test';
