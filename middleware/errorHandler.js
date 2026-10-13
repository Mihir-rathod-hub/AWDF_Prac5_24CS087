/**
 * Global Error Handling Middleware
 * Must have four parameters (err, req, res, next) to be identified by Express as an error handler.
 * Logs technical details to the terminal while safeguarding sensitive stack traces from API clients.
 */
function errorHandler(err, req, res, next) {
  // Log technical details and stack trace in the terminal for debugging
  console.error('[Internal Error Details]:', err);

  // Handle malformed JSON body errors thrown by express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload. Please ensure the request body contains valid JSON.'
    });
  }

  // Determine HTTP status code (defaults to 500)
  const statusCode = err.statusCode || err.status || 500;

  // Never expose raw internal exceptions or stack traces to API clients
  const clientMessage = statusCode === 500
    ? 'Internal Server Error'
    : (err.message || 'An unexpected error occurred.');

  return res.status(statusCode).json({
    success: false,
    message: clientMessage
  });
}

module.exports = errorHandler;
