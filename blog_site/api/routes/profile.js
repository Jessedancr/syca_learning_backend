import express from "express";
const profileRouter = express.Router();
import { ObjectId } from "mongodb";

/**
 * GET /profile
 * Retrieves the user's profile page with their posts.
 * Requires a valid user session.
 */
profileRouter.get("/profile", async (req, res) => {
	try {
		if (!req.session.user) {
			return res.send("Unauthorised Access Please Login or Signup");
		}
		const { id } = req.session.user;
		const collection = await req.db.collection("userPosts");
		const posts = await collection.find({ id }).toArray();
		return res.render("profile", { session: req.session, posts });
	} catch (error) {
		console.log(error);
		return res.send(error);
	}
});

/**
 * DELETE /profile/post/:postid/delete
 * Deletes a post by its ID
 * Requires a valid user session and a post ID in the URL parameter.
 */
profileRouter.post("/profile/post/:postid/delete", async (req, res) => {
	try {
		const _id = new ObjectId(req.params.postid);
		const collection = await req.db.collection("userPosts");
		await collection.deleteOne({ _id });
		return res.redirect("/profile");
	} catch (error) {
		console.log(error);
		return res.send(error);
	}
});

/**
 * GET /profile/post/:postid/edit
 * Retrieves a post by its ID for editing
 * Requires a valid user session and a post ID in the URL parameter.
 */
profileRouter.get("/profile/post/:postid/edit", async (req, res) => {
	console.log("Profile edit on get has been hit");
	try {
		const _id = new ObjectId(req.params.postid);
		const collection = await req.db.collection("userPosts");
		const post = await collection.findOne({ _id });
		if (!post) {
			res.status(404).send("No post found");
		}
		return res.render("edit", { post });
	} catch (error) {
		console.log(error);
		res.send(error);
	}
});

/**
 * POST /profile/post/:postid/edit
 * Updates a post by its ID
 * Requires a valid user session, a post ID in the URL parameter, and post details in the request body.
 */
profileRouter.post("/profile/post/:postid/edit", async (req, res) => {
	try {
		const _id = new ObjectId(req.params.postid);
		let { postTitle, postContent } = req.body;
		console.log(req.body);
		const collection = await req.db.collection("userPosts");
		await collection.updateOne({ _id }, { $set: { postTitle, postContent } });
		return res.redirect("/profile");
	} catch (error) {
		//console.log(error);
		return res.send(error);
	}
});

export default profileRouter;
