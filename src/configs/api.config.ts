import axios from 'axios';

import environment from './env.config';

const Api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;
