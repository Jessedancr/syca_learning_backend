import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import session from "express-session";
import mongoStore from "connect-mongo";
import bodyParser from "body-parser";
import homeRouter from "./api/routes/homeScreen.js";
import loginRouter from "./api/routes/login.js";
import signupRouter from "./api/routes/signup.js";
import home from "./api/routes/home.js";
import profileRouter from "./api/routes/profile.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// CONNECT TO MONGO DB AND CREATE USER POSTS SCHEMA
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// USER POSTS SCHEMA
async function createUserPostsCollection(db) {
	/**
	 * Define the schema for the user posts collection.
	 * @type {Object}
	 */
	const collectionName = "userPosts";
	const schema = {
		bsonType: "object",
		required: ["postTitle", "postContent"],
		properties: {
			postTitle: {
				bsonType: "string",
				description: "Is required and must be a string",
			},
			postContent: {
				bsonType: "string",
				description: "Is required and must be a string",
			},
			imagePath: {
				bsonType: "string",
				description: "path to uploaded file if any",
			},
		},
	};

	try {
		/**
		 * Create the user posts collection with schema validation.
		 * validator{...} option to specify that I want to apply some validation rules to collection.
		 * $jsonSchema specifies which schema to use for the validation
		 */
		await db.createCollection(collectionName, {
			validator: {
				$jsonSchema: schema,
			},
		});
		console.log(`Collection ${collectionName} created with schema validation`);
	} catch (error) {
		if (error.codeName === "NamespaceExists") {
			console.log(`Collection name ${collectionName} already exists`);
		} else {
			console.log("Error creating collection: ", error);
		}
	}
}

client.connect().then(async () => {
	console.log("Connected to Mongo DB");
	const db = client.db("blog-site");
	await createUserPostsCollection(db);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use((req, res, next) => {
	req.db = client.db("blog-site");
	next();
}); // Middleware to attach DB to all request bodies

/**
 * Express session middleware configuration
 */
app.use(
	session({
		secret: process.env.SESSION_SECRET_KEY,
		resave: false,
		saveUninitialized: false,
		store: mongoStore.create({
			client: client,
			dbName: "blog-site",
			collectionName: "userSessions",
		}),
		cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
	}),
); // Session middleware
app.use((req, res, next) => {
	console.log(`Request received: ${req.method} ${req.url}`);
	next();
});

// ROUTES
app.use("/", home); // View only homepage
app.use("/", signupRouter);
app.use("/", loginRouter);
app.use("/", homeRouter);
app.use("/", profileRouter);

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});
