import express from "express";
import bcrypt from "bcrypt";

/**
 * Sign up router for handling user signup requests
 */
const signupRouter = express.Router();

/**
 * GET /signup
 * Renders the signup screen.
 */
signupRouter.get("/signup", (req, res) => {
	res.render("signupScreen");
});

/**
 * POST /signup
 * Handles user signup requests.
 *
 * @param {Object} req.body - Request body containing user details.
 * @param {string} req.body.email - User email address.
 * @param {string} req.body.username - User username.
 * @param {string} req.body.password - User password.
 */
signupRouter.post("/signup", async (req, res) => {
	const { email, username, password } = req.body;
	try {
		if (email && username && password) {
			/**
			 * Hashes the user password using bcrypt.
			 * @param {string} password - User password.
			 * @param {number} saltRounds - Salt rounds for hashing.
			 * @returns {Promise<string>} - Hashed password.
			 */
			const hashedPass = await bcrypt.hash(password, 10);
			const collection = await req.db.collection("users");
			const result = await collection.insertOne({
				email,
				username,
				hashedPass,
			});

			/**
			 * Fetches the newly created user from the database.
			 * @param {ObjectId} result.insertedId - ID of the newly created user.
			 * @returns {Promise<Document>} - Newly created user document.
			 *
			 * Sets the user session.
			 * @param {Object} req.session - Request session object.
			 * @param {string} req.session.user.username - User username.
			 * @param {ObjectId} req.session.user.id - User ID.
			 */
			const newUser = await collection.findOne({ _id: result.insertedId });
			req.session.user = { username: newUser.username, id: newUser._id };
			console.log("New User inserted: ", req.session.user);
			res.redirect("home");
		}
	} catch (error) {
		console.log(error);
	}
});
export default signupRouter;
