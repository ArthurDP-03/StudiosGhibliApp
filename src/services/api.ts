import axios from 'axios';
import { AppConstants } from '../config/constants';

export const apiClient = axios.create({
  baseURL: AppConstants.API_BASE_URL,
  timeout: 30000, // 30s para acomodar o cold start do Render
  headers: {
    Accept: 'application/json',
  },
});
