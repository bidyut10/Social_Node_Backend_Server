// Define a higher-order function to handle asynchronous try-catch blocks
const asyncTryCatchHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      // Execute the asynchronous request handler
      await requestHandler(req, res, next);
    } catch (error) {
      // Handle errors by sending an appropriate response with status code
      res.status(error.code || 500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

// Define a higher-order function to handle promises and catch any errors
const asyncPromiseHandler = (requestHandler) => {
  return (req, res, next) => {
    // Resolve the promise returned by the request handler and catch any errors
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

// Export the asynchronous try-catch handler and asynchronous promise handler
export { asyncTryCatchHandler, asyncPromiseHandler };
