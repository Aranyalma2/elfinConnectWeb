const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

const bcrypt = require("bcrypt");

chai.use(chaiHttp);

// Import the middleware functions
const { isLoggedIn, isLoggedInAdmin, login, logout } = require("../../middleware/auth/authMW");

describe("Auth Middleware Tests", () => {
	describe("isLoggedIn", () => {
		it("should return a function", () => {
			expect(isLoggedIn).to.be.a("function");
		});

		it("logedIn is true", () => {
			const req = {
				session: {
					logedIn: true,
					user: "testuser",
				},
			};
			const res = {
				locals: { user: "" },
			};
			const next = () => {};
			isLoggedIn()(req, res, next);
			expect(res.locals.user).to.equal("testuser");
		});

		it("logedIn is undefined", () => {
			const req = {
				session: {},
			};
			const res = {
				redirect: (url) => {
					expect(url).to.equal("/login");
				},
			};
			isLoggedIn()(req, res, () => {});
		});

		it("logedIn is false", () => {
			const req = {
				session: {
					logedIn: false,
				},
			};
			const res = {
				redirect: (url) => {
					expect(url).to.equal("/login");
				},
			};
			isLoggedIn()(req, res, () => {});
		});
	});
	describe("isLoggedInAdmin", () => {
		it("should return a function", () => {
			expect(isLoggedInAdmin).to.be.a("function");
		});

		it("logedIn and admin are true", () => {
			const req = {
				session: {
					logedIn: true,
					user: {
						username: "testuser",
						admin: true,
					},
				},
			};
			const res = {
				locals: { user: "" },
			};
			const next = () => {};
			isLoggedInAdmin()(req, res, next);
			expect(res.locals.user).to.deep.equal({ username: "testuser", admin: true });
		});

		it("logedIn is undefined", () => {
			const req = {
				session: {},
			};
			const res = {
				locals: { texts: { loginWarning_MissingAdminPermission: "Missing Admin Permission" } },
				redirect: (url) => {
					expect(url).to.equal("/login");
				},
			};
			isLoggedInAdmin()(req, res, () => {});
			expect(req.session.loginwaring).to.equal("Missing Admin Permission");
		});

		it("logedIn is false", () => {
			const req = {
				session: {
					logedIn: false,
				},
			};
			const res = {
				locals: { texts: { loginWarning_MissingAdminPermission: "Missing Admin Permission" } },
				redirect: (url) => {
					expect(url).to.equal("/login");
				},
			};
			isLoggedInAdmin()(req, res, () => {});
			expect(req.session.loginwaring).to.equal("Missing Admin Permission");
		});

		it("logedIn is true, admin is undefined", () => {
			const req = {
				session: {
					logedIn: true,
					user: {
						username: "testuser",
					},
				},
			};
			const res = {
				locals: { texts: { loginWarning_MissingAdminPermission: "Missing Admin Permission" } },
				redirect: (url) => {
					expect(url).to.equal("/login");
				},
			};
			isLoggedInAdmin()(req, res, () => {});
			expect(req.session.loginwaring).to.equal("Missing Admin Permission");
		});

		it("logedIn is true, admin is false", () => {
			const req = {
				session: {
					logedIn: true,
					user: {
						username: "testuser",
						admin: false,
					},
				},
			};
			const res = {
				locals: { texts: { loginWarning_MissingAdminPermission: "Missing Admin Permission" } },
				redirect: (url) => {
					expect(url).to.equal("/login");
				},
			};
			isLoggedInAdmin()(req, res, () => {});
			expect(req.session.loginwaring).to.equal("Missing Admin Permission");
		});
	});

	describe("login", () => {
		it("should return a function", () => {
			expect(login).to.be.a("function");
		});

		it("loginwaring is defined, no username and password", () => {
			const mockUserScheme = {};

			const req = {
				session: {
					loginwaring: "testwarning",
				},
				body: {},
			};
			const res = {
				locals: {},
			};
			login({ User: mockUserScheme })(req, res, () => {});
			expect(res.locals.warning).to.equal("testwarning");
			expect(req.session.loginwaring).to.equal(undefined);
		});

		it("loginwaring is undefined, no username and password", () => {
			const mockUserScheme = {};

			const req = {
				session: {},
				body: {},
			};
			const res = {
				locals: {},
			};
			login({ User: mockUserScheme })(req, res, (err) => {
				expect(err).to.equal(undefined);
			});
			expect(res.locals.warning).to.equal(undefined);
			expect(req.session.loginwaring).to.equal(undefined);
		});

		it("loginwaring is undefined, username and password, and password match, admin profile", async () => {
			const mockUserScheme = {
				findOne: (username) => {
					return new Promise((resolve, reject) => {
						resolve({ username: "testuser", password: bcrypt.hashSync("testpassword", 10), admin: true });
					});
				},
			};

			const req = {
				session: {
					loginwaring: undefined,
					logedIn: false,
					save: (cb) => {
						cb();
					},
				},
				body: {
					username: "testuser",
					password: "testpassword",
				},
			};
			const res = {
				locals: {},
				redirect: (url) => {
					expect(url).to.equal("/home");
				},
			};
			await login({ User: mockUserScheme })(req, res, (err) => {
				expect(err).to.equal(undefined);
			});
			expect(req.session.logedIn).to.equal(true);
			expect(req.session.user.username).to.equal("testuser");
			expect(req.session.user.admin).to.equal(true);
		});

		it("loginwaring is undefined, username and password, and password match, normal profile", async () => {
			const mockUserScheme = {
				findOne: (username) => {
					return new Promise((resolve, reject) => {
						resolve({ username: "testuser", password: bcrypt.hashSync("testpassword", 10), admin: false });
					});
				},
			};

			const req = {
				session: {
					loginwaring: undefined,
					logedIn: false,
					save: (cb) => {
						cb();
					},
				},
				body: {
					username: "testuser",
					password: "testpassword",
				},
			};
			const res = {
				locals: {},
				redirect: (url) => {
					expect(url).to.equal("/home");
				},
			};
			await login({ User: mockUserScheme })(req, res, (err) => {
				expect(err).to.equal(undefined);
			});
			expect(req.session.logedIn).to.equal(true);
			expect(req.session.user.username).to.equal("testuser");
			expect(req.session.user.admin).to.equal(false);
		});

		it("loginwaring is undefined, but user missing", async () => {
			const mockUserScheme = {
				findOne: (username) => {
					return new Promise((resolve, reject) => {
						resolve(undefined);
					});
				},
			};

			const req = {
				session: {
					loginwaring: undefined,
				},
				body: {
					username: "testuser",
					password: "testpassword",
				},
			};
			const res = {
				locals: { texts: { loginWarning_InvalidUserOrPass: "Invalid User or Password" } },
			};
			await login({ User: mockUserScheme })(req, res, (err) => {
				expect(err).to.equal(undefined);
			});
			expect(req.session.logedIn).to.equal(undefined);
			expect(req.session.user).to.equal(undefined);
			expect(res.locals.error).to.equal("Invalid User or Password");
		});

		it("loginwaring is undefined, username and password, and password match, but error", async () => {
			const mockUserScheme = {
				findOne: (username) => {
					return new Promise((resolve, reject) => {
						reject("mock error");
					});
				},
			};

			const req = {
				session: {
					loginwaring: undefined,
				},
				body: {
					username: "testuser",
					password: "testpassword",
				},
			};
			const res = {
				locals: {},
			};

			await login({ User: mockUserScheme })(req, res, (err) => {
				expect(err).to.equal("mock error");
			});
			expect(req.session.logedIn).to.equal(undefined);
			expect(req.session.user).to.equal(undefined);
		});
	});

	describe("logout", () => {
		it("should return a function", () => {
			expect(logout).to.be.a("function");
		});

		it("Logout the user, no error", () => {
			const req = {
				session: {
					destroy: (cb) => {
						cb();
					},
				},
			};
			const res = {
				redirect: (url) => {
					expect(url).to.equal("/");
				},
			};
			logout()(req, res, () => {});
		});
	});
});
