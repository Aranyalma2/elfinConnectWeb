const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

// Import middleware
const registerUserMiddleware = require('../../middleware/user/registerUserMW');

// Mock the User model
class MockUserModel {
  constructor(attr) {
    this.uuid = attr.uuid;
    this.username = attr.username;
    this.password = attr.password;
    this.admin = attr.admin;
  }

  static findOne(query) {
    if (query.username && query.username.$eq === 'mockedUser') {
      return Promise.resolve({
        username: 'mockedUser',
      });
    } else {
      return Promise.resolve(null);
    }
  }

  save() {
    return Promise.resolve(this);
  }
}

// Mock the User model2 first run uuid is matching
class MockUserModel2 {
  constructor(attr) {
    this.uuid = attr.uuid;
    this.username = attr.username;
    this.password = attr.password;
    this.admin = attr.admin;
  }

  static runTimes = 0;

  static findOne(query) {
    if (query.username && query.username.$eq === 'mockedUser') {
      return Promise.resolve({
        username: 'mockedUser',
      });
    }else if(query.username && query.username.$eq !== 'mockedUser'){
      return Promise.resolve(null);
    } else if(this.runTimes === 0){
        this.runTimes += 1;
        return Promise.resolve([]);
    } else{
      return Promise.resolve(null);
    }
  }

  save() {
    return Promise.resolve(this);
  }
}

// Mock the User model2 reject save
class MockUserModel3 {
  constructor(attr) {
    this.uuid = attr.uuid;
    this.username = attr.username;
    this.password = attr.password;
    this.admin = attr.admin;
  }

  static findOne(query) {
    if (query.username && query.username.$eq === 'mockedUser') {
      return Promise.resolve({
        username: 'mockedUser',
      });
    } else{
      return Promise.resolve(null);
    }
  }

  save() {
    return Promise.reject(new Error('Mocked error'));
  }
}

// Use chai-http to simulate HTTP requests
chai.use(chaiHttp);

describe('Register User Middleware Tests', () => {
    it('should register a new user and set success message', (done) => {
    const req = {
      body: {
        username: 'newUser',
        password: 'newPassword',
      },
    };
    const res = { locals: { texts: { registerSucces_Created: 'User created successfully:' } } };

    // Inject the mock User model and crypto module into the middleware
    const middleware = registerUserMiddleware({
      User: MockUserModel,
    });

    middleware(req, res, (err) => {
      expect(res.locals.success).to.equal('User created successfully: newUser');
      expect(err).to.be.undefined;
      done();
    });
    });

    it('should register a new user with admin parameter and set success message', (done) => {
    const req = {
      body: {
        username: 'newUser',
        password: 'newPassword',
        admin: true,
      },
    };
    const res = { locals: { texts: { registerSucces_Created: 'User created successfully:' } } };

    // Inject the mock User model and crypto module into the middleware
    const middleware = registerUserMiddleware({
      User: MockUserModel,
    });

    middleware(req, res, (err) => {
      expect(res.locals.success).to.equal('User created successfully: newUser');
      expect(err).to.be.undefined;
      done();
    });
    });

    it('should register a new user and set success message, but first UUID generation create an existing UUID', (done) => {
    const req = {
      body: {
        username: 'newUser',
        password: 'newPassword',
      },
    };
    const res = { locals: { texts: { registerSucces_Created: 'User created successfully:' } } };

    // Inject the mock User model and crypto module into the middleware
    const middleware = registerUserMiddleware({
      User: MockUserModel2,

    });

    middleware(req, res, (err) => {
      expect(res.locals.success).to.equal('User created successfully: newUser');
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should registration save goes wrong', (done) => {
    const req = {
      body: {
        username: 'newUser',
        password: 'newPassword',
      },
    };
    const res = { locals: { texts: { registerFailed_UnknownFail: 'User creation falied' } } };

    // Inject the mock User model and crypto module into the middleware
    const middleware = registerUserMiddleware({
      User: MockUserModel3,
    });

    middleware(req, res, (err) => {
      expect(res.locals.error).to.equal('User creation falied');
      done();
    });
  });

  it('should handle existing username and set error message', (done) => {
    const req = {
      body: {
        username: 'mockedUser',
        password: 'newPassword',
      },
    };
    const res = { locals: { texts: { registerFailed_Exists: 'Username already exists:' } } };

    // Inject the mock User model and crypto module into the middleware
    const middleware = registerUserMiddleware({
      User: MockUserModel,
    });

    middleware(req, res, (err) => {
      expect(res.locals.error).to.equal('Username already exists: mockedUser');
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should handle missing username and call next', (done) => {
    const req = {
      body: {
        password: 'password',
      },
    };
    const res = { locals: { texts: {} } };

    // Inject the mock User model and crypto module into the middleware
    const middleware = registerUserMiddleware({
      User: MockUserModel,
    });

    middleware(req, res, (err) => {
      expect(res.locals.success).to.be.undefined;
      expect(res.locals.error).to.be.undefined;
      expect(err).to.be.undefined;
      done();
    });
  });

  it('should handle missing password and call next', (done) => {
    const req = {
      body: {
        username: 'user',
      },
    };
    const res = { locals: { texts: {} } };

    // Inject the mock User model and crypto module into the middleware
    const middleware = registerUserMiddleware({
      User: MockUserModel,
    });

    middleware(req, res, (err) => {
      expect(res.locals.success).to.be.undefined;
      expect(res.locals.error).to.be.undefined;
      expect(err).to.be.undefined;
      done();
    });
  });
});
