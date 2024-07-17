import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
const app = express();
const port = 8080;
dotenv.config();

// CONNECTING TO MONGODB
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
client.connect().then(() => console.log("Connected to Mongo DB"));

// Passing DB and collections name to variables
const db = client.db("users");
const historyCollection = db.collection("history");

app.use(bodyParser.urlencoded({ extended: true })); // To parse bodies from HTML forms
app.use(bodyParser.json());
app.use(express.static("public"));
app.use((req, res, next) => {
	req.db = client.db("users");
	next();
}); // Middleware to attach DB to all request bodies

// USER SESSION MIDDLEWARE CONFIG
app.use(
	session({
		secret: process.env.SESSION_SECRET_KEY,
		resave: false,
		saveUninitialized: true,
		store: MongoStore.create({
			client: client,
			dbName: "users",
			collectionName: "history",
		}),
		cookie: { secure: false },
	}),
);

let usersList = [];
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
		res.render("convert", { conversion, options });
	} else if (conversionType === "M to Cm") {
		conversion = numberInput * 100;
		res.render("convert", { conversion, options });
	} else if (conversionType === "KG to lbs") {
		conversion = numberInput * 2.20462;
		res.render("convert", { conversion, options });
	} else if (conversionType === "inch to Cm") {
		conversion = numberInput * 2.54;
		res.render("convert", { conversion, options });
	}

	// STORE CONVERSION HISTORY IN DB
	historyCollection.insertOne({
		conversionType,
		numberInput,
		conversion,
	});
});

app.get("/history", async (req, res) => {
	const conversionHistory = await historyCollection.find().toArray();
	console.log("From /history:", conversionHistory);
	res.render("history", { history: conversionHistory });
});

app.get("/signup", async (req, res) => {
	console.log("/signup by GET has been hit");
	res.render("signup");
});
app.post("/signup", async (req, res) => {
	console.log("/signup by POST has been hit");
	const newUser = req.body;
	try {
		if (newUser.username && newUser.password) {
			usersList.push(newUser);

			// Add new user to DB
			const usersCollection = await req.db.collection("converter_users");
			const insertUser = await usersCollection.insertOne(newUser);
			console.log("New User", insertUser);
			res.render("on_signup");
		}
	} catch (error) {
		console.log(error);
	}
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
