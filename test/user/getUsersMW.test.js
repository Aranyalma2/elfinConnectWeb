const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

// Import middleware
const loadUsersMiddleware = require("../../middleware/user/getUsersMW");

// Mock the User model
const mockUserModel = {
	find: () => {
		// Mock the find method to return a Promise with an empty array
		return Promise.resolve([]);
	},
};

// Use chai-http to simulate HTTP requests
chai.use(chaiHttp);

describe("Load Users Middleware Tests", () => {
	it("should load users and save them to res.locals.users", (done) => {
		// Mocking the necessary objects
		const req = {};
		const res = { locals: {} };

		// Inject the mock User model into the middleware
		const middleware = loadUsersMiddleware({
			User: mockUserModel,
		});

		middleware(req, res, (err) => {
			// Assert that users are loaded and saved to res.locals.users
			expect(res.locals.users).to.be.an("array");
			expect(res.locals.users).to.have.lengthOf(0);

			// Assert that next() is called
			expect(err).to.be.undefined;
			done();
		});
	});

	it("should handle errors and call next with the error", (done) => {
		// Mocking the necessary objects
		const req = {};
		const res = { locals: {} };

		// Inject a mock User model that rejects the find Promise
		const mockUserModelWithError = {
			find: () => {
				return Promise.reject(new Error("Mocked error"));
			},
		};

		// Inject the mock User model into the middleware
		const middleware = loadUsersMiddleware({
			User: mockUserModelWithError,
		});

		middleware(req, res, (err) => {
			// Assert that next() is called with an error
			expect(err).to.be.an("error");
			expect(err.message).to.equal("Mocked error");
			done();
		});
	});
});
