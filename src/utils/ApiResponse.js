// Define a class named ApiResponse to structure the response format for successful operations
class ApiResponse {
  // Constructor function for initializing an instance of ApiResponse
  constructor(
    // HTTP status code for the response
    statusCode,
    // Data payload to be included in the response
    data,
    // Message describing the success of the operation (default: "Success")
    message = "Success"
  ) {
    // Set properties for ApiResponse based on provided parameters
    this.statusCode = statusCode; // HTTP status code
    this.data = data; // Data payload
    this.message = message; // Success message
    this.success = statusCode < 400; // Flag indicating whether the operation was successful
  }
}

// Export the ApiResponse class for use in other parts of the application
export { ApiResponse };
