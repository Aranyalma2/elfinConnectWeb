const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = chai;

// Import middleware
const getUserAttributesMW = require("../../middleware/user/getUserAttributesMW");

// Mock the User model
const mockUserModel = {
	findOne: (query) => {
		// Mock the findOne method to return a Promise with a user object
		if (query.username && query.username.$eq === "mockedUser") {
			return Promise.resolve({
				uuid: "mockedUUID",
			});
		} else {
			return Promise.resolve(null);
		}
	},
};

// Use chai-http to simulate HTTP requests
chai.use(chaiHttp);

describe("Get User Attributes Middleware Tests", () => {
	it("should load user and set user properties in res.locals", (done) => {
		// Mocking the necessary objects
		const req = {
			session: {
				user: {
					username: "mockedUser",
				},
			},
		};
		const res = { locals: { user: {} } };

		// Inject the mock User model into the middleware
		const middleware = getUserAttributesMW({
			User: mockUserModel,
		});

		middleware(req, res, (err) => {
			// Assert that user properties are set in res.locals.user
			expect(res.locals.user.uuid).to.equal("mockedUUID");
			expect(res.locals.user.elfinHeathbeatMSG).to.equal(
				"beat;mockedUUID;%MAC;%HOST;0",
			);
			expect(res.locals.user.elfindataMSG).to.equal(
				"data;mockedUUID;%MAC;%HOST;0;",
			);

			// Assert that next() is called
			expect(err).to.be.undefined;
			done();
		});
	});

	it("should handle invalid user and call next", (done) => {
		// Mocking the necessary objects
		const req = {
			session: {
				user: {
					username: "nonexistentUser",
				},
			},
		};
		const res = { locals: { user: {} } };

		// Inject the mock User model into the middleware
		const middleware = getUserAttributesMW({
			User: mockUserModel,
		});

		middleware(req, res, (err) => {
			// Assert that user properties are not modified
			expect(res.locals.user.uuid).to.be.undefined;
			expect(res.locals.user.elfinHeathbeatMSG).to.be.undefined;
			expect(res.locals.user.elfindataMSG).to.be.undefined;

			// Assert that next() is called
			expect(err).to.be.undefined;
			done();
		});
	});

	it("should handle missing user on req.session.user and call next", (done) => {
		// Mocking the necessary objects
		const req = {
			session: {},
		};
		const res = { locals: {} };

		// Inject the mock User model into the middleware
		const middleware = getUserAttributesMW({
			User: mockUserModel,
		});

		middleware(req, res, (err) => {
			// Assert that user properties are not modified
			expect(res.locals.user).to.be.undefined;

			// Assert that next() is called
			expect(err).to.be.undefined;
			done();
		});
	});
});
