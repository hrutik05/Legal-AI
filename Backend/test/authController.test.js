import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';

process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

const { signup, login, forgotPassword, resetPassword } = await import('../src/controllers/authController.js');

function mockResponse() {
  return {
    statusCode: 200,
    payload: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    }
  };
}

function mockRequest(body = {}, params = {}, query = {}) {
  return { body, params, query };
}

async function withUserMocks(mocks, run) {
  const originalFindOne = User.findOne;
  const originalSave = User.prototype.save;

  if (mocks.findOne) User.findOne = mocks.findOne;
  if (mocks.save) User.prototype.save = mocks.save;

  try {
    await run();
  } finally {
    User.findOne = originalFindOne;
    User.prototype.save = originalSave;
  }
}

test('signup rejects missing or invalid fields', async () => {
  await withUserMocks({}, async () => {
    const res = mockResponse();

    await signup(mockRequest({ fullName: '', email: 'bad', phone: '123', password: 'weak' }), res);

    assert.equal(res.statusCode, 400);
    assert.match(res.payload.error, /Full name/i);
  });
});

test('signup rejects duplicate email', async () => {
  await withUserMocks({
    findOne: async () => ({ email: 'user@example.com' })
  }, async () => {
    const res = mockResponse();

    await signup(mockRequest({
      fullName: 'Test User',
      email: 'USER@example.com',
      phone: '9876543210',
      password: 'Password1'
    }), res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.payload.error, 'Email already in use');
  });
});

test('signup creates a user and returns token', async () => {
  let savedUser;

  await withUserMocks({
    findOne: async () => null,
    save: async function save() {
      savedUser = this;
      return this;
    }
  }, async () => {
    const res = mockResponse();

    await signup(mockRequest({
      fullName: ' Test User ',
      email: 'USER@example.com',
      phone: ' 9876543210 ',
      password: 'Password1'
    }), res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.payload.user.fullName, 'Test User');
    assert.equal(res.payload.user.email, 'user@example.com');
    assert.equal(res.payload.user.phone, '9876543210');
    assert.ok(res.payload.token);
    assert.notEqual(savedUser.password, 'Password1');
  });
});

test('login rejects missing credentials', async () => {
  await withUserMocks({}, async () => {
    const res = mockResponse();

    await login(mockRequest({ email: 'user@example.com' }), res);

    assert.equal(res.statusCode, 400);
    assert.equal(res.payload.error, 'Email and password are required');
  });
});

test('login rejects unknown email', async () => {
  await withUserMocks({
    findOne: async () => null
  }, async () => {
    const res = mockResponse();

    await login(mockRequest({ email: 'none@example.com', password: 'Password1' }), res);

    assert.equal(res.statusCode, 401);
    assert.equal(res.payload.error, 'Invalid credentials');
  });
});

test('login rejects wrong password', async () => {
  const hashedPassword = await bcrypt.hash('Password1', 10);

  await withUserMocks({
    findOne: async () => ({
      _id: '507f1f77bcf86cd799439011',
      fullName: 'Test User',
      email: 'user@example.com',
      phone: '9876543210',
      password: hashedPassword
    })
  }, async () => {
    const res = mockResponse();

    await login(mockRequest({ email: 'user@example.com', password: 'WrongPass1' }), res);

    assert.equal(res.statusCode, 401);
    assert.equal(res.payload.error, 'Invalid credentials');
  });
});

test('login returns user and token for valid credentials', async () => {
  const hashedPassword = await bcrypt.hash('Password1', 10);

  await withUserMocks({
    findOne: async () => ({
      _id: '507f1f77bcf86cd799439011',
      fullName: 'Test User',
      email: 'user@example.com',
      phone: '9876543210',
      password: hashedPassword
    })
  }, async () => {
    const res = mockResponse();

    await login(mockRequest({ email: 'USER@example.com', password: 'Password1' }), res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.user.email, 'user@example.com');
    assert.ok(res.payload.token);
  });
});

test('forgot password rejects invalid email', async () => {
  const res = mockResponse();

  await forgotPassword(mockRequest({ email: 'invalid-email' }), res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.error, 'Valid email is required');
});

test('reset password rejects mismatched passwords', async () => {
  const res = mockResponse();

  await resetPassword(mockRequest({
    token: 'token',
    password: 'Password1',
    passwordConfirm: 'Password2'
  }), res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.error, 'Passwords do not match');
});
