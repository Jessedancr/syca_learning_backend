/**FUNCTION THAT TAKES IN TWO INT PARAMS
 * FIRST PARAM (YEAR) IS A YEAR, SECOND IS A NUMBER (NUM)
 * NUM IS THE NUMBER OF LEAP YEARS AFTER THE 'YEAR' PARAM
 * THE FUNCTION PRINTS AN ARRAY OF THE FIRST 'N' LEAP YEARS AFTER 'YEAR'
 */
function leapYear(year, num) {
	listYears = [];
	if (year % 4 === 0) {
		for (x = 0; x < num; x++) {
			year += 4;
			listYears.push(year); // Appending the year to empty list created above
		}
		console.log(listYears);
	} else{
        console.log('This is not a leap year!')
    }
}

leapYear(2024, 3);
