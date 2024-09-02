import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import fs from "fs";
import dotenv from "dotenv";
const app = express();
const port = 8080;
dotenv.config();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CONNECT TO MONGO DB
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
client.connect().then(() => console.log("Connected to MongoDB"));

app.use((req, res, next) => {
	req.db = client.db("picture-pool-admins");
	next();
}); // Attach DB to all request bodies

// SET UP THE FOLDER WHERE THE FILES WILL BE STORED AND GIVEN A UNIQUE NAME
const storage = multer.diskStorage({
	destination: (req, file, func) => {
		func(null, "public/uploads/");
	}, // This sets the destination folder of uploaded files to the 'uploads' folder
	filename: (req, file, func) => {
		const uniqueName = Date.now() + path.extname(file.originalname);
		console.log("File name: ", uniqueName);
		func(null, uniqueName);
	}, // This sets the filename to the date it was uploaded while concatenating that to the file extension
	// path.extname(file.originalname) => This extracts the file extension from the original filename
});

// This custom function allows only certain file types
const fileFilter = (req, file, func) => {
	// Regex to allow certain file types
	// 'file.originalname' is the actual name of the file uploaded
	// It is contained in the 'originalname' prop of the file object
	// Using the .test() function that comes with regex to check if the
	// file extension matches the specified regex pattern
	const allowedTypes = /jpeg|jpg|png|gif/;
	const filepath = path.extname(file.originalname).toLowerCase();
	const fileExt = allowedTypes.test(filepath);
	if (fileExt) {
		func(null, true);
	} else {
		func("Error: Images Only!");
	}
};

const upload = multer({ storage, fileFilter });
let uploadedFiles = [];
let message;
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.get("/", (req, res) => {
	console.log("File path: ", filename);
	console.log("Dir path: ", dirname);
	res.send("WELCOME TO IMAGE UPLOADER");
});
app.get("/upload", (req, res) => {
	res.render("upload", { message });
});

// SIGNUP ROUTES
app.get("/adsignup", (req, res) => {
	res.render("signup");
});
app.post("/on_adsignup", async (req, res) => {
	const newAdmin = req.body;
	try {
		if (newAdmin.username && newAdmin.email && newAdmin.password) {
			// Add Admin to DB
			const collection = await req.db.collection("admins");
			const insertAdmin = await collection.insertOne(newAdmin);
			console.log("New Admin: ", insertAdmin);
			res.send("Admin added successfully");
		}
	} catch (error) {
		console.log(error);
	}
});

// LOGIN ROUTES
app.get("/adlogin", (req, res) => {
	res.render("login");
});
app.post("/on_adlogin", async (req, res) => {
	try {
		const { username, password } = req.body;
		const collection = await req.db.collection("admins");
		const admin = await collection.findOne({ username, password });
		if (admin) {
			console.log("Logged in as: ", admin);
			res.render("upload", { message });
		} else {
			res.send("Unregistered user, please sign in");
		}
	} catch (error) {
		console.log(error);
	}
});
app.post("/upload", upload.single("image"), async (req, res) => {
	console.log(req.file);
	if (!req.file) {
		res.status(404).send("No file uploaded");
	} else {
		message = "File uploaded successfully";
		uploadedFiles.push({
			filename: req.file.filename,
			path: `/uploads/${req.file.filename}`,
		});

		const { filename, path } = req.file;
		const collection = await req.db.collection("uploads");
		await collection.insertOne({ filename, path });
		res.render("upload", { message });
	}
});

// DELETE ENDPOINT
app.get("/delete/:filename", async (req, res) => {
	const fileName = req.params.filename;
	const filePath = path.join(dirname, "public", "uploads", fileName); // Constructing the full path for the file
	fs.unlink(filePath, (error) => {
		if (error) {
			console.log(error);
		}
		uploadedFiles = uploadedFiles.filter((file) => file !== fileName);
		console.log(fileName, "has been deleted");
		res.status(200).send(`${fileName} has been deleted`);
	});
});

app.get("/home", (req, res) => {
	res.render("home", { files: uploadedFiles });
});

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});
