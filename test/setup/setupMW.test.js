const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

// Import middleware
const setupMiddleware = require('../../middleware/setup/setupMW');

// Use chai-http to simulate HTTP requests
chai.use(chaiHttp);

describe('Setup Middleware Tests', () => {
  it('should call next() and set admin paramter, if no users on res.locals.user', (done) => {
    // Mocking the necessary objects
    const req = { body: {} };
    const res = { locals: { users: [] } };

    setupMiddleware()(req, res, (err) => {
      // Assert that admin property is added to the request body
      expect(req.body.admin).to.equal(true);

      // Assert that next() is called
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should redirect to /login if any user exists on res.locals.users', (done) => {
    // Mocking the necessary objects
    const req = {};
    // Mock a response object with a redirect function
    const res = {
      locals: { users: [{ testuser1: "testuser1" }] },

      redirect: (url) => {
        // Assert that redirect URL is /login
        expect(url).to.equal('/login');
        done();
      },
    };

    setupMiddleware()(req, res, (err) => {
      // Assert that next() is not called
      expect(err).to.not.be.undefined;
    });
  });
});
