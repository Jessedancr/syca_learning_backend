function validate(email, password) {
	valid = {};
	validEmail = "@gmail.com";
	if (email.includes(validEmail)) {
        console.log('valid mail')
		valid.email = "True";
	}

	// TO VALIDATE PASSWORD
	validPassword = /[a-zaA-Z0-9]/; // This regex matches any chararcter that is here
	specialChar = /[^a-zA-Z0-9]/; // This regex matches any chararcter that is N O T here i.e Special characters
	if (
		validPassword.test(password) &&
		specialChar.test(password) &&
		password.length >= 8
	) {
		valid.password = "True";
		console.log("valid password");
		console.log(valid);
	} else {
		console.log("email and or password not valid");
	}
}

validate('jesse@gmail.com', 'AbcdefGhijk@1')


