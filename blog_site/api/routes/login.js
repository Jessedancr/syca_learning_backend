import express from "express";
import bcrypt from "bcrypt";

/**
 * Login router module
 * Handles Login related routes and logic
 */
const loginRouter = express.Router();

/**
 * GET /login 
 * Renders the login screen
 */
loginRouter.get("/login", (req, res) => {
	res.render("loginScreen");
});


/**
 * POST /login
 * Handles login authentication
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to authenticate
 * @example
 */
loginRouter.post("/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		if (username && password) {
			const collection = await req.db.collection("users");
			const user = await collection.findOne({ username });
			const hashedPass = await bcrypt.compare(password, user.hashedPass);
			const userPostsCollection = req.db.collection("userPosts");
			await userPostsCollection.find().toArray();

			if (user) {
				req.session.user = { username: user.username, id: user._id };
			}
			if (!hashedPass) {
				console.log("Wrong password");
				return res.send("Wrong password");
			}
			console.log("Logged in as: ", req.session.user);
			return res.redirect("/home");
		}
	} catch (error) {
		console.log(error);
	}
});

export default loginRouter;
