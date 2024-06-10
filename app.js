import express from "express";
const app = express();
const port = 8080;

app.get("/", (req, res) => {
	res.send("Home page");
});

app.get("/port", (req, res) => {
	res.send(`The script is running on port: ${port}`);
});

app.get("/fibonacci", (req, res) => {
	let fib = [0, 1];
	for (let i = 2; i <= 100; i++) {
		fib[i] = fib[i - 1] + fib[i - 2];
		fib.push(fib[i]);
	}
    res.send(fib)
});

app.listen(port, () => {
	console.log("Server started on Port", port);
});
