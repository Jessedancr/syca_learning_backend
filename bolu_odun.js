/**FUNCTION TO CHECK IF A STRING
 * CONTAINS WHITESPACES OR SPECIAL CHARACTERS
 */

function inputName(name) {
	// RegExp to check if string contains whitespace or special characters
	specialChar = /[^a-zA-Z0-9]/;

	if (specialChar.test(name)) {
		console.log("Please remove all spaces or special characters");
	} else if (name === "Bolu" || name === "Odun") {
		console.log(`Welcome back ${name}`);
	} else {
		console.log(`It is nice to meet you ${name}`);
	}
}

inputName("Jessedancr");