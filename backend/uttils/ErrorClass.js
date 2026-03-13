// utils/ErrorResponse.js

class ErrorResponse extends Error {
  /**
   * 
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default 500)
   * @param {Error|null} cause - Original error (optional)
   */
  constructor(message, statusCode = 500, cause = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.cause = cause; // store original error for debugging/logging

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
