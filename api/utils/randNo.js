// Function to generate a 6-digit random number
function generateUnique6DigitNumber() {
    // Generate a random number between 100000 (inclusive) and 1000000 (exclusive)
    const random = Math.random() * 900000 + 100000;
    // Round down to the nearest integer and return
    return Math.floor(random);
}

// Generate a 6-digit random number
const randomNumber = generateUnique6DigitNumber();

export {randomNumber};