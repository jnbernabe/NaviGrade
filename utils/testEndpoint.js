const axios = require('axios');

const studentId = "65f07c78ef54e7acbac1a5eb"; // Replace this with the actual student ID

const url = `http://localhost:5050/estimate-grade/${studentId}`;

axios.get(url)
  .then(response => {
    console.log('Response:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });
