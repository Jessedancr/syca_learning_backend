import express from "express";
const app = express();
const port = 8080;

app.set("view engine", "ejs"); // Setting the view or template engine

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/tribute", (req, res) => {
	const targaryen = {
		words: "Fire and Blood",
		members: ["Daenerys Targaryen: Emilia Clarke", "Jon Snow: Kit Harrignton"],
	};
	const stark = {
		words: "Winter is Coming",
		members: [
			"Ned Stark: Sean Bean",
			"Catelyn Stark: Michelle Fairley",
			"Robb Stark: Richard Madden",
			"Sansa Stark: Sophie Turner",
			"Arya Stark: Maisie Williams",
		],
	};
	const lannister = {
		words: "Hear me Roar",
		members: [
			"Tywin Lannister: Charles Dance",
			"Cersei Lannister: Lena Headey",
			"Tyrion Lannister: Peter Dinklage",
			"Jamie Lannister: Nikolaj Coster-Waldau",
		],
	};

	res.render("tribute", { targaryen, stark, lannister });
});
app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});
