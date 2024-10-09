import axios from 'axios';
import { createConcatHashedSignature } from '../assets/signatureHashing.js';

export default ({ Vue }) => {
  // Set the base URL explicitly
  const apiUrl = 'https://api.petbacker.com/v5'; // Set the base URL as required

  // Log the base URL for debugging
  console.log('Base URL:', apiUrl);

  // Create the Axios instance with the desired base URL
  Vue.prototype.$axios = axios.create({
    baseURL: apiUrl, // Set the base URL directly
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add interceptors or any other configuration as needed
  axios.interceptors.request.use((config) => {
    // Log the config URL for debugging
    console.log('Request URL:', config.url);

    // Add the signature header conditionally
    if (!config.url || !config.url.includes('k=13674c3b66275a11')) {
      const sig = createConcatHashedSignature(config.url);
      config.headers['X-Signature'] = sig;
    }
    return config;
  });
};
