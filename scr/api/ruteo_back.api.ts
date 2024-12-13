// api.js
import axios from 'axios';
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
const apiMapBox=import.meta.env.VITE_API_SEARCH_MAP_BOX;
const tokenMapBoxSearch=import.meta.env.VITE_TOKEN_SEARCH_MAP_BOX;
const HERE_API_KEY = import.meta.env.VITE_HERE_API_KEY;
export const HERE_MAPS_ROUTING_API_KEY = import.meta.env.VITE_HERE_MAPS_ROUTING_API_KEY;

const geo_back_api = axios.create({
  baseURL: apiEndpoint,  // Cambia esta URL por la de tu API
  headers: {
    'Content-Type': 'application/json', 
  },
});
export const api_map_box = axios.create({
  baseURL: apiMapBox,
  params:{
    country:'pe',
    limit:10,
    proximity:'-77.03959766279655,-12.05425443434001',
    language:'es', 
    access_token:tokenMapBoxSearch,
  }, 
});

export const api_here = axios.create({
  baseURL: 'https://router.hereapi.com/v8/routes', 
  timeout: 10000,
});


api_here.interceptors.request.use(
  (config: any) => {
      config.params = config.params || {};
      config.params['apiKey'] = HERE_API_KEY; 
      return config;
  },
  (error: any) => Promise.reject(error)
);



export default geo_back_api;