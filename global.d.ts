/* eslint-disable */
declare global {
  // Test environment variables
  var TEST_ENV: 'development' | 'staging' | 'production';
  var API_BASE_URL: string;
  var DATA_SERVICE_URL: string;
  var AUTH_SERVICE_URL: string;
  var USER_SERVICE_URL: string;

  // Test user credentials
  var TEST_USERS: {
    admin: {
      email: string;
      password: string;
      role: 'admin';
    };
    user: {
      email: string;
      password: string;
      role: 'user';
    };
    guest: {
      email: string;
      password: string;
      role: 'guest';
    };
  };

  // Common test data
  var TEST_TIMEOUT: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
  };

  // Service endpoints
  var ENDPOINTS: {
    auth: {
      login: string;
      logout: string;
      register: string;
      refresh: string;
    };
    user: {
      profile: string;
      settings: string;
      preferences: string;
    };
    api: {
      health: string;
      version: string;
      status: string;
    };
    data: {
      users: string;
      products: string;
      orders: string;
    };
  };

  // Custom page objects (will be extended by services)
  interface CustomPageObjects {
    authPage: any;
    userPage: any;
    dashboardPage: any;
    apiClient: any;
  }

  interface User {
    id: number;
    name: string;
    age: number;
  }
}

export {};
