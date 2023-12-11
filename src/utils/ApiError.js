// Define a custom error class named ApiError that extends the built-in Error class
class ApiError extends Error {
  // Constructor function for initializing an instance of ApiError
  constructor(
    // Status code for the HTTP response (default: 500 - Internal Server Error)
    statusCode,
    // Message describing the error (default: "Something Went Wrong!!!")
    message = "Something Went Wrong!!!",
    // Array of error details or validation errors (default: empty array)
    errors = [],
    // Stack trace information for debugging (default: "")
    stack = ""
  ) {
    // Call the constructor of the parent Error class with the provided message
    super(message);

    // Initialize properties specific to ApiError
    this.statusCode = statusCode; // HTTP status code for the error
    this.data = null; // Additional data related to the error (default: null)
    this.message = message; // Error message
    this.success = false; // Flag indicating whether the operation was successful (default: false)
    this.errors = errors; // Array of error details or validation errors

    // Set the stack trace information if provided, otherwise capture the stack trace
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Export the ApiError class for use in other parts of the application
export { ApiError };
