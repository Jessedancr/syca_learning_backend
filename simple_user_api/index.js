import express, { json } from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 8080;

app.use(json()); //Middleware

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
