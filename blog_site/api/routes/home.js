import express from "express";
import { ObjectId } from "mongodb";
const home = express.Router();

/**
 * ROUTE DISPLAYING THE VIEW ONLY HOME PAGE
 * This route renders the home screen with a list of all user posts.
 * @example
 * GET / => renders homeScreen template with user posts
 */
home.get("/", async (req, res) => {
	try {
		const collection = req.db.collection("userPosts");
		const data = await collection.find().toArray();
		res.render("homeScreen", { session: req.session, data });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error fetching posts");
	}
});

/**
 * THIS ROUTE HANDLES POSTING TO THE BLOG SITE
 * This route creates a new post with the provided title and content, and associates it with the current user.
 * @param {string} postTitle - The title of the post
 * @param {string} postContent - The content of the post
 * @example
 * POST / => creates a new post with title "Hello World" and content "This is my first post"
 */
home.post("/", async (req, res) => {
	const { postTitle, postContent } = req.body;
	const { id } = req.session.user;
	console.log(req.session);

	const collection = await req.db.collection("userPosts");
	if (postTitle && postContent) {
		await collection.insertOne({ postTitle, postContent, id });
	}

	res.redirect("/");
});


/**
 * LOGOUT ROUTE
 * This route destroys the current user session and redirects to the home page.
 * @example
 * GET /logout => logs out the current user and redirects to /
 */
home.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(500).send("Error loggin out");
		}
		res.redirect("/");
	});
});

/**
 * ROUTE TO VIEW A POST
 * This route renders a single post with the provided ID.
 * @param {string} postid - The ID of the post to view
 * @example
 * GET /post/1234567890abcdef => renders the post with ID 1234567890abcdef
 */
home.get("/post/:postid", async (req, res) => {
	try {
		const _id = new ObjectId(req.params.postid); // Convert to ObjectId
		const collection = await req.db.collection("userPosts");
		const post = await collection.findOne({ _id });
		res.render("post", { post });
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

export default home;
