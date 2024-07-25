import express from "express";
import { nanoid } from "nanoid";
const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlStore = {}; // Object to store the urls

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/shorten", (req, res) => {
	const originalUrl = req.body.url;
	const id = nanoid(6); // Generates a unique 6 didgit ID which is the urls shortened version
	urlStore[id] = originalUrl; // This adds a key:value pair to the urlStore object
	const shortUrl = `${req.protocol}://${req.headers.host}/${id}`; // Constructing the short URL using some props in the req object
	console.log("Short URL: ", shortUrl);

	res.render("result", { shortUrl });
});

// Endpoint to get the full url when short url is clicked
app.get("/:id", (req, res) => {
	const id = req.params.id;
	const originalUrl = urlStore[id];
	if (originalUrl) {
		res.redirect(originalUrl);
	} else {
		res.send("URL not found");
	}
});

app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});
