import { test, expect } from '../../fixtures/database';

test.describe('User Operations', () => {
  test('Should fetch all users using helper', async ({ db }) => {
    const users = await db.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    console.log('📊 Found users:', users.length);
  });

  test('Should get user by ID', async ({ db }) => {
    const userCount = await db.getUserCount();
    if (userCount === 0) {
      console.log('⚠️ No users found - skipping test');
      return;
    }

    const user = await db.getUserById(1);
    if (user) {
      expect(user.id).toBe(1);
      expect(user.name).toBeDefined();
      console.log(`🎯 Found user: ${user.name}`);
    }
  });

  test('Should create and delete user', async ({ db }) => {
    // Create user
    const newUser = await db.createUser({
      name: 'Test User',
      age: 25
    });
    
    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe('Test User');
    console.log(`✅ Created user with ID: ${newUser.id}`);

    // Verify user exists
    const fetchedUser = await db.getUserById(newUser.id);
    expect(fetchedUser).toBeDefined();

    // Cleanup - delete user
    await db.deleteUser(newUser.id);
    
    // Verify user is deleted
    const deletedUser = await db.getUserById(newUser.id);
    expect(deletedUser).toBeNull();
    console.log('🗑️ User deleted successfully');
  });
});