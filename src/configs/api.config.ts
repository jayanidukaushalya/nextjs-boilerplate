import axios from 'axios';
// import { environment } from './env.config';

const Api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;
