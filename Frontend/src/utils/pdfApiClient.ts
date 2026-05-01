import axios from 'axios';
import type { AxiosError } from 'axios';
import type { PdfAnalysis } from '../types';

const API = axios.create({
  baseURL: 'https://legal-ai-pdf-backend.onrender.com',
  timeout: 60000, // increase to 60 sec in case PDF context is large
});

export interface SummarizeResponse {
  summary: string | null;
  analysis: PdfAnalysis | null;
  error?: string;
}

interface BackendErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
}

function getAxiosErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<BackendErrorResponse>;
  if (axios.isAxiosError(axiosError)) {
    if (axiosError.response) {
      return axiosError.response.data?.detail || axiosError.response.data?.message || axiosError.response.data?.error || fallback;
    }
    if (axiosError.request) {
      return 'No response from PDF backend';
    }
  }
  return error instanceof Error ? error.message : fallback;
}

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
  } catch (error: unknown) {
    // ✅ FIX: Better error handling
    if (axios.isAxiosError<BackendErrorResponse>(error) && error.response) {
      // Backend returned error
      console.error('PDF upload error:', error.response.data);
      throw new Error(getAxiosErrorMessage(error, 'Failed to upload PDF'));
    } else if (axios.isAxiosError(error) && error.request) {
      // Request made but no response
      console.error('No response from server:', error.request);
      throw new Error('No response from server. Make sure PDF backend is running on https://legal-ai-pdf-backend.onrender.com');
    } else {
      // Error in request setup
      console.error('Error:', error instanceof Error ? error.message : error);
      throw error;
    }
  }
};

export const askQuestion = async (context: string, question: string) => {
  try {
    const response = await API.post('/ai/ask', { context, question });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError<BackendErrorResponse>(error) && error.response) {
      console.error('askQuestion backend error:', error.response.data);
      throw new Error(getAxiosErrorMessage(error, 'Backend error'));
    } else if (axios.isAxiosError(error) && error.request) {
      console.error('askQuestion no response:', error.request);
      throw new Error('No response from PDF backend');
    } else {
      console.error('askQuestion error:', error instanceof Error ? error.message : error);
      throw new Error(error instanceof Error ? error.message : 'Backend error');
    }
  }
};

export const summarizePdf = async (context: string) => {
  try {
    const response = await API.post<SummarizeResponse>('/ai/summarize', { context });
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError<BackendErrorResponse>(error) && error.response) {
      console.error('summarizePdf backend error:', error.response.data);
      throw new Error(getAxiosErrorMessage(error, 'Backend error'));
    } else if (axios.isAxiosError(error) && error.request) {
      console.error('summarizePdf no response:', error.request);
      throw new Error('No response from PDF backend');
    } else {
      console.error('summarizePdf error:', error instanceof Error ? error.message : error);
      throw new Error(error instanceof Error ? error.message : 'Backend error');
    }
  }
};

export default API;
