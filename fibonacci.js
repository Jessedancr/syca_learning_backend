function fibonacci(num) {
	let fib = [0, 1];
	for (i = 2; i <= num; i++) {
		fib[i] = fib[i - 1] + fib[i - 2];
        fib.push(fib[i])
	}
    console.log(fib);
	return fib[num];
}

console.log(fibonacci(100));

