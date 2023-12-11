// Import the 'crypto-random-string' library
import cryptoRandomString from 'crypto-random-string';

// Define an asynchronous function to generate a random password
export const generateRandomPassword = async function () {
    const passwordLength = 12; // Set the desired length for the random password

    // Generate a random password using crypto-random-string
    const randomPassword = cryptoRandomString({ length: passwordLength });

    // Return the generated random password
    return randomPassword;
};
