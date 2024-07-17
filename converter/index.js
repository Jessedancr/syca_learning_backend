import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
const app = express();
const port = 8080;

// CONNECTING TO MONGODB
const uri =
	"mongodb+srv://jessedancr:MightyGod%401@converter.szml5xk.mongodb.net/?retryWrites=true&w=majority&appName=converter";
const client = new MongoClient(uri);
client.connect().then(() => console.log("Connected to Mongo DB"));

app.use(bodyParser.urlencoded({ extended: true })); // To parse bodies from HTML forms
app.use(bodyParser.json());
app.use(express.static("public"));
app.use((req, res, next) => {
	req.db = client.db("users");
	next();
}); // Middleware to attach DB to all request bodies

let users = [];
let history = [];
const options = ["°C to °F", "M to Cm", "KG to lbs", "inch to Cm"];
let conversion;

app.set("view engine", "ejs");
app.get("/", (req, res) => {
	res.send("H O M E P A G E");
});

app.get("/convert", (req, res) => {
	res.render("convert", { options, conversion });
});

app.post("/convert", (req, res) => {
	console.log("Request body: ", req.body);
	console.log("Properties on Req body ", Object.keys(req.body));

	const conversionType = req.body.conversionType;
	const numberInput = parseFloat(req.body.numberInput);

	if (conversionType === "°C to °F") {
		conversion = (numberInput * 9) / 5 + 32;
		history.push(conversion);
		res.render("convert", { conversion, options });
	} else if (conversionType === "M to Cm") {
		conversion = numberInput * 100;
		history.push(conversion);
		res.render("convert", { conversion, options });
	} else if (conversionType === "KG to lbs") {
		conversion = numberInput * 2.20462;
		history.push(conversion);
		res.render("convert", { conversion, options });
	} else if (conversionType === "inch to Cm") {
		conversion = numberInput * 2.54;
		history.push(conversion);
		res.render("convert", { conversion, options });
	}
	console.log(history);
});

app.get("/history", (req, res) => {
	res.render("history");
});

app.get("/signup", async (req, res) => {
	const newUser = req.body;
	try {
		if (newUser.username && newUser.password) {
			users.push(newUser);

			// Add new user to DB
			const collection = await req.db.collection("converter_users");
			const insertUser = await collection.insertOne(newUser);
			console.log("New User", insertUser);
		}
	} catch (error) {
		console.log(error);
	}
	res.render("signup", { newUser });
});

app.get("/login", async (req, res) => {
	res.render("login");
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const collection = await req.db.collection("converter_users");
		const user = await collection.findOne({ username, password });
		if (user) {
			console.log("Logged in as", user);
			res.render("convert", { options, conversion });
		} else {
			res.send("INVALID USER");
		}
	} catch (error) {
		console.log(error);
	}
});
app.listen(port, (req, res) => {
	console.log(`Server started on http://localhost:${port}`);
});
