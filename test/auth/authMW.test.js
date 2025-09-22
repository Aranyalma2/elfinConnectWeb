const chai = require("chai");
const chaiHttp = require("chai-http").default;
const expect = chai.expect;
const bcrypt = require("bcrypt");

chai.use(chaiHttp);

// Import the middleware functions
const { isLoggedIn, isLoggedInAdmin, login, logout } = require("../../middleware/auth/authMW");

// Default mock User model (can override per test)
const mockUserModel = {
	findById: (id) => Promise.resolve({ _id: id, username: "mockuser", admin: false }),
	findOne: ({ username }) => Promise.resolve(undefined),
};

describe("Auth Middleware Tests", () => {
	describe("isLoggedIn", () => {
		it("should return a function", () => {
			expect(isLoggedIn).to.be.a("function");
		});

		it("logedIn is true, user found", (done) => {
			const req = {
				session: {
					logedIn: true,
					user: { _id: "123" },
				},
			};
			const res = { locals: {} };

			const User = {
				findById: (id) => Promise.resolve({ _id: id, username: "testuser" }),
			};

			const middleware = isLoggedIn({ User });
			middleware(req, res, (err) => {
				expect(res.locals.user).to.deep.equal({ _id: "123", username: "testuser" });
				expect(err).to.be.undefined;
				done();
			});
		});

		it("logedIn is undefined", () => {
			const req = { session: {} };
			const res = {
				redirect: (url) => expect(url).to.equal("/login"),
			};
			isLoggedIn({ User: mockUserModel })(req, res, () => {});
		});

		it("logedIn is false", () => {
			const req = { session: { logedIn: false } };
			const res = {
				redirect: (url) => expect(url).to.equal("/login"),
			};
			isLoggedIn({ User: mockUserModel })(req, res, () => {});
		});
	});

	describe("isLoggedInAdmin", () => {
		it("logedIn true, admin true", (done) => {
			const req = {
				session: {
					logedIn: true,
					user: { _id: "321" },
				},
			};
			const res = { locals: {} };

			const User = {
				findById: () => Promise.resolve({ _id: "321", username: "adminuser", admin: true }),
			};

			isLoggedInAdmin({ User })(req, res, (err) => {
				expect(res.locals.user.admin).to.equal(true);
				expect(err).to.be.undefined;
				done();
			});
		});

		it("logedIn true, admin false", (done) => {
			const req = {
				session: { logedIn: true, user: { _id: "321" } },
			};
			const res = {
				locals: { texts: { loginWarning_MissingAdminPermission: "Missing Admin Permission" } },
				redirect: (url) => {
					expect(url).to.equal("/login");
					expect(req.session.loginwaring).to.equal("Missing Admin Permission");
					done();
				},
			};
			const User = {
				findById: () => Promise.resolve({ _id: "321", username: "normaluser", admin: false }),
			};

			isLoggedInAdmin({ User })(req, res, () => {});
		});

		it("logedIn undefined", () => {
			const req = { session: {} };
			const res = {
				locals: { texts: { loginWarning_MissingAdminPermission: "Missing Admin Permission" } },
				redirect: (url) => expect(url).to.equal("/login"),
			};
			isLoggedInAdmin({ User: mockUserModel })(req, res, () => {});
		});
	});

	describe("login", () => {
		it("login warning shown, no credentials", () => {
			const req = { session: { loginwaring: "warn" }, body: {} };
			const res = { locals: {} };
			login({ User: mockUserModel })(req, res, () => {});
			expect(res.locals.warning).to.equal("warn");
			expect(req.session.loginwaring).to.equal(undefined);
		});

		it("invalid credentials", async () => {
			const req = {
				session: {},
				body: { username: "nouser", password: "wrong" },
			};
			const res = {
				locals: { texts: { loginWarning_InvalidUserOrPass: "Invalid User or Password" } },
			};

			const User = {
				findOne: () => Promise.resolve(undefined),
			};

			await login({ User })(req, res, (err) => expect(err).to.be.undefined);
			expect(res.locals.error).to.equal("Invalid User or Password");
		});
	});

	describe("logout", () => {
		it("destroys session and redirects", () => {
			const req = { session: { destroy: (cb) => cb() } };
			const res = { redirect: (url) => expect(url).to.equal("/") };
			logout({ User: mockUserModel })(req, res, () => {});
		});
	});
});
