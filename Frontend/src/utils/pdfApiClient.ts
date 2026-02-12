import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 30000,
});

export const uploadPdf = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // ✅ FIX: DO NOT set Content-Type header for FormData
    // Axios will automatically set it with the correct boundary
    const response = await API.post('/pdf/upload', formData);

    if (!response.data.text) {
      throw new Error('No text extracted from PDF');
    }
    return response;
  } catch (error: any) {
    // ✅ FIX: Better error handling
    if (error.response) {
      // Backend returned error
      console.error('PDF upload error:', error.response.data);
      throw new Error(error.response.data.detail || error.response.data.message || 'Failed to upload PDF');
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server:', error.request);
      throw new Error('No response from server. Make sure PDF backend is running on http://localhost:8000');
    } else {
      // Error in request setup
      console.error('Error:', error.message);
      throw error;
    }
  }
};

export const askQuestion = (context: string, question: string) => {
  return API.post('/ai/ask', { context, question });
};

export default API;