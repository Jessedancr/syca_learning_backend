import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
const app = express();
const port = 3000;

app.use(morgan("dev"));
const searches = [];
app.use(bodyParser.urlencoded({ extended: true })); // Middleware for parsing urlencoded bodies(HTML forms)
app.use(express.static("public")); // Middleware for serving static files like CSS stylings
app.set("view engine", "ejs"); // Setting the view engine to ejs

app.get("/", (req, res) => {
	res.send("H O M E P A G E");
});
app.get("/google", (req, res) => {
	res.render("google");
});
app.post("/search", (req, res) => {
	const textFieldValue = req.body.searchQuery;
	const startTime = Date.now();

	// Simulate timecheck
	setTimeout(() => {
		const endTime = Date.now();
		const searchTime = endTime - startTime;
		searches.push({ Search: textFieldValue, searchTime });
		// console.log(`From /Searches ${JSON.stringify(searches)}`);
		res.render("search", { textFieldValue });
	}, 0);
});
app.get("/logs", (req, res) => {
	// console.log(`From /logs ${JSON.stringify(searches)}`);
	res.render("logs", { searches });
});
app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});
