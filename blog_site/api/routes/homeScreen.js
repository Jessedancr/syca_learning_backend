import express from "express";

/**
 * Home router for handling home-related routes.
 */
const homeRouter = express.Router();

/**
 * GET /home
 * Retrieves all user posts and renders the home screen.
 */
homeRouter.get("/home", async (req, res) => {
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
 * GET /home/create
 * Renders the create post screen.
 */
homeRouter.get("/home/create", (req, res) => {
	res.render("create");
});

// homeRouter.get("/delete", async (req, res) => {
// 	const collection = await req.db.collection("userPosts");
// 	await collection.deleteMany();
// 	res.send("deleted successfully");
// });

export default homeRouter;
