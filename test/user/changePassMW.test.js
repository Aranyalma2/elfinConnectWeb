const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const bcrypt = require('bcrypt');

// Import middleware
const changePasswordMiddleware = require('../../middleware/user/changePassMW');

// Mock the User model
const mockUserModel = {
  updateOne: (query, update) => {
    // Mock the updateOne method to return a Promise with a matchedCount property
    return Promise.resolve({ matchedCount: 1 });
  },
};

// Use chai-http to simulate HTTP requests
chai.use(chaiHttp);

describe('Change Password Middleware Tests', () => {
  it('should change password and set passwordChangeError to false', (done) => {
    // Mocking the necessary objects
    const req = {
      body: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      },
    };
    const res = { locals: { user: { username: 'testUser', password: bcrypt.hashSync('oldPassword', 10) } } };

    // Inject the mock User model into the middleware
    const middleware = changePasswordMiddleware({
      User: mockUserModel,
    });

    middleware(req, res, (err) => {
      // Assert that passwordChangeError is set to false
      expect(res.locals.passwordChangeError).to.be.false;

      // Assert that next() is called
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should handle invalid passwords and set passwordChangeError to true', (done) => {
    // Mocking the necessary objects
    const req = {
      body: {
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      },
    };
    const res = { locals: { user: { username: 'testUser', password: bcrypt.hashSync('oldPassword', 10) } } };

    // Inject the mock User model into the middleware
    const middleware = changePasswordMiddleware({
      User: mockUserModel,
    });

    middleware(req, res, (err) => {
      // Assert that passwordChangeError is set to true
      expect(res.locals.passwordChangeError).to.be.true;

      // Assert that next() is called
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should handle missing or mismatched passwords and call next', (done) => {
    // Mocking the necessary objects
    const req = {
      body: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'wrongPassword',
      },
    };
    const res = { locals: { user: { username: 'testUser', password: bcrypt.hashSync('oldPassword', 10) } } };

    // Inject the mock User model into the middleware
    const middleware = changePasswordMiddleware({
      User: mockUserModel,
    });

    middleware(req, res, (err) => {
      // Assert that passwordChangeError is not modified
      expect(res.locals.passwordChangeError).to.be.true;

      // Assert that next() is called
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should handle undefined user and call next', (done) => {
    // Mocking the necessary objects
    const req = {
      body: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      },
    };
    const res = { locals: {} };

    // Inject the mock User model into the middleware
    const middleware = changePasswordMiddleware({
      User: mockUserModel,
    });

    middleware(req, res, (err) => {
      // Assert that passwordChangeError is not modified
      expect(res.locals.passwordChangeError).to.be.true;

      // Assert that next() is called
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should handle unsuccessful database update and call next', (done) => {
    // Mocking the necessary objects
    const req = {
      body: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      },
    };
    const res = { locals: { user: { username: 'testUser', password: bcrypt.hashSync('oldPassword', 10) } } };

    // Inject a mock User model that resolves with a matchedCount of 0
    const mockUserModelWithError = {
      updateOne: () => {
        return Promise.resolve({ matchedCount: 0 });
      },
    };

    // Inject the mock User model into the middleware
    const middleware = changePasswordMiddleware({
      User: mockUserModelWithError,
    });

    middleware(req, res, (err) => {
      // Assert that passwordChangeError is not modified
      expect(res.locals.passwordChangeError).to.be.true;

      // Assert that next() is called
      expect(err).to.be.undefined;
      done();
    });
  });
});
