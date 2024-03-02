// serverErrorService.js

export const handleServerError = (error) => {
  // Add your logic to handle server-side errors here
  console.error('Server-side error:', error);

  // Optionally, display the error to the user
  alert('An error occurred on the server. Please try again later.');
};

// clientErrorService.js

export const handleClientError = (error) => {
  // Add your logic to handle client-side errors here
  console.error('Client-side error:', error);

  // Optionally, display the error to the user
  alert('An error occurred. Please try again.');
};
