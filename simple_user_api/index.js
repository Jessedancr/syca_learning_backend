import express, { json } from "express";
import fetch from "node-fetch";

const app = express();
const port = 8080;

app.use(json()); // Middleware
let users = [];

// FUNCTION TO CALL THE EXTERNAL API
const callApi = async () => {
	try {
		const response = await fetch("https://jsonplaceholder.typicode.com/users");
		const parsedData = await response.json();
		
		// Looping through the data and extracting needed keys
		users = parsedData.map((user) => ({
			id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
		}));
	} catch {
		(err) => {
			console.log(`Error fetching data: ${err}`);
		};
	}
};

callApi();

app.get("/", (req, res) => {
	res.send("H O M E S C R E E N");
});

// ENDPOINT TO GET ALL THE USERS
app.get("/users", (req, res) => {
	res.json(users);
});

// ENDPOINT TO GET AN ARRAY OF A SPECIFIED KEY
app.get("/:key", (req, res) => {
	const key = req.params.key;
	if (key in users[0]) {
		const result = users.map((user) => user[key]);
		res.json(result);
	} else {
		res.send({ message: "Key not found" });
	}
});

// ENDPOINT TO DELETE LAST ITEM IN THE ARRAY
app.delete("/delete", (req, res) => {
	if (users.length > 0) {
		users.pop();
		res.json(users);
	} else {
		res.send({ message: "Can't delete from an empty array" });
	}
});

// ENDPOINT TO DELETE ALL ITEMS IN ARRAY
app.delete("/deleteall", (req, res) => {
	users = [];
	res.json({ message: "All users deleted" });
});

// ENDPOINT TO CREATE NEW USER
app.post("/newuser", (req, res) => {
	const newuser = req.body;
	if (newuser.name && newuser.username && newuser.email) {
		const userID = users.length > 0 ? users[users.length - 1].id + 1 : 1;
		newuser.id = userID;
		users.push(newuser);
		res.json(newuser);
	} else {
		res.json({message: 'Invalid request'})
	}
});

// Starting the api server
app.listen(port, () => {
	console.log(`server started on http://localhost:${port}`);
});
export default app;
