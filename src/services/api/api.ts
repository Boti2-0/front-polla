import axios from 'axios';

const api = (baseURL) => {
  return axios.create({
    baseURL,
    timeout: 10000, 
    headers: {
      'Content-Type': 'application/json',
      "Accept": "*/*",
    },
  });
};

export default api;