// src/api.js
import axios from "axios";

const BASE_URL = "https://webfmsi.singapoly.com";

// GET data
export const getData = async (endpoint) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`);
  return response.data.datas || [];
};

// POST data
export const sendData = async (endpoint, data) => {
  const isFormData = data instanceof FormData;

  const headers = isFormData
    ? {} // Let axios handle multipart/form-data correctly
    : {
        "Content-Type": "application/x-www-form-urlencoded",
      };

  const payload = isFormData ? data : new URLSearchParams(data).toString();

  const response = await axios.post(`${BASE_URL}${endpoint}`, payload, {
    headers,
  });

  return response.data;
};

// PUT data (untuk edit/update)
export const updateData = async (endpoint, data) => {
  const isFormData = data instanceof FormData;

  const headers = isFormData
    ? {} // Biar axios handle FormData
    : {
        "Content-Type": "application/x-www-form-urlencoded",
      };

  const payload = isFormData ? data : new URLSearchParams(data).toString();

  const response = await axios.post(`${BASE_URL}${endpoint}`, payload, {
    headers,
  });

  return response.data;
};



// DELETE data
export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


