import dotenv from "dotenv";
import express, { json } from "express";
import fetch from "node-fetch";
import { MongoClient, ObjectId } from "mongodb";
dotenv.config(); // Configuring dotenv to load environment variables from .env file
const app = express();
const PORT = 3000;

// Connect to Mongo DB
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
client.connect().then(() => console.log("Connected to Mongo DB"));

// MIDDLEWARES
app.use(json()); // Middleware to parse JSON bodies
app.use((req, res, next) => {
	req.db = client.db("task_9");
	next();
}); // Middleware to attach DB to request body

let users = [];

// FUNCTION TO FETCH DATA FROM EXTERNAL API
const callApi = async () => {
	try {
		const response = await fetch("http://jsonplaceholder.typicode.com/users");
		const data = await response.json();
		users = data.map((user) => ({
			id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
		}));
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
};

// FETCH USER DATA INITIALLY
callApi();

app.get("/populate", async (req, res) => {
	try {
		const collection = await req.db.collection("users");
		const insertUsers = await collection.insertMany(users);
		res.json(insertUsers);
		console.log(insertUsers);
	} catch (error) {
		console.log(error);
		res.json(error);
	}
});

app.get("/", (req, res) => {
	res.send("H O M E S C R E E N");
});

// ENDPOINT TO GET ALL USERS
app.get("/users", (req, res) => {
	res.json(users);
});

// ENDPOINT TO GET SPECIFIC USER PROPS
app.get("/:key", (req, res) => {
	const key = req.params.key;

	if (key in users[0]) {
		const result = users.map((user) => user[key]);
		res.json(result);
	} else {
		res.json({ message: "Invalid key" });
	}
});

// ENDPOINT TO DELETE THE LAST USER
app.delete("/delete", (req, res) => {
	if (users.length > 0) {
		users.pop();
		res.json({ message: "Last user deleted" });
	} else {
		res.json({ message: "No users to delete, can't delete from empty array" });
	}
});

// ENDPOINT TO DELETE ALL USERS
app.delete("/deleteall", (req, res) => {
	users = [];
	res.json({ message: "All users deleted" });
});

// ENDPOINT TO ADD NEW USER
app.post("/newuser", (req, res) => {
	const newUser = req.body;
	if (newUser.name && newUser.username && newUser.email) {
		const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
		newUser.id = newId;
		users.push(newUser);
		res.json(newUser);
	} else {
		res.json({ message: "Invalid user data" });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
