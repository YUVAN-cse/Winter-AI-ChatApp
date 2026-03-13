class ApiResponse {
  constructor(message = 'Success', statusCode = 200, data = null) {
    this.success = true;
    this.message = message;
    this.statusCode = statusCode;
    if (data !== null) this.data = data;
  }
}

export default ApiResponse;


//   const response = new ApiResponse('User fetched successfully', 200, user);