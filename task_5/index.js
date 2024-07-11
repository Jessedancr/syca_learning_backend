import express from "express";
const app = express();
const port = 8080;

app.get("/", (req, res) => {
	res.send("H O M E P A G E");
});

app.get("/port", (req, res) => {
	res.send(`Script is running on ${port}`);
});

app.get("/fibonacci", (req, res) => {
	let fib = [0, 1];
	for (let i = 2; i <= 100; i++) {
		fib[i] = fib[i - 1] + fib[i - 2];
		fib.push(fib[i]);
	}
	res.send(fib);
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
