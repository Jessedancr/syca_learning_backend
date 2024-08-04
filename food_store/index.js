import bodyParser from "body-parser";
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("home_page");
});

// GET ROUTE TO DISPLAY THE UI
app.get("/store", (req, res) => {
	const foods = [
		"Jollof rice",
		"Fried rice",
		"Bread and Ewa Agoyin",
		"Semo and Egusi",
		"Amala and Ewedu",
		"Groceries with groundut",
		"Pizza",
		"Shawarma"
	];
	res.render("store", { foods });
});

// POST ROUTE TO HANDLE FORM SUBMISSION
app.post("/order", (req, res) => {
	const { name, email, food } = req.body; // Destructuring to extract these props from the request body
	const message = `Hello ${name},\n\nYou have ordered: ${food}\n\nThank you for your order!`;

	// NODEMAILER CONFIGS
	const transporter = nodemailer.createTransport({
		host: process.env.TRANSPORTER_HOST, // This specifies the SMTP server
		port: 465, // Port number for SSL
		secure: true,
		auth: {
			user: process.env.TRANSPORTER_USER,
			pass: process.env.TRANSPORTER_PASSWORD,
		}, // Authentication credentials - Email and app password of sender
	});

	const mailOptions = {
		from: "jesse4grace@gmail.com",
		to: email,
		subject: "Your Order Confirmation",
		text: message,
	};

	// sendMail funtion sends the mail using the defined mail options
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		}
		console.log("Email sent: " + info.response);
		res.render("order_received", { email });
	});
});

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});
