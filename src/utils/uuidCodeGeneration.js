// Import the 'uuid' library for generating unique identifiers
import { v4 as uuidv4 } from "uuid";

// Define an asynchronous function to generate a 5-digit code
const generate5DigitCode = async () => {
  try {
    // Generate a UUID using the 'uuid' library
    const uuid = await uuidv4();

    // Remove dashes and extract the first 5 characters to create a 5-digit code
    const fiveDigitCode = uuid.replace(/-/g, "").substring(0, 5);

    // Return the generated 5-digit code
    return fiveDigitCode;
  } catch (error) {
    // Return null in case of an error during the generation process
    return null;
  }
};

// Export the function for generating 5-digit codes
export { generate5DigitCode };
