const axios = require('axios');
axios.post('http://localhost:5000/api/register', {
  name: 'Test User',
  phone: '9999999999',
  email: 'test@example.com',
  dob: '1990-01-01'
})
  .then(res => {
    console.log('status', res.status);
    console.log(JSON.stringify(res.data, null, 2));
  })
  .catch(err => {
    if (err.response) {
      console.log('error status', err.response.status);
      console.log(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  });
