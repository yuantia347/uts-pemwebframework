import axios from "axios";

const BASE_URL = "https://webfmsi.singapoly.com";

// Untuk GET data
export const getData = async (endpoint) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`);
  return response.data.datas || [];
};

// Untuk POST data (misal kirim form)
export const sendData = async (endpoint, data) => {
  const isFormData = data instanceof FormData;

  const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
    headers: isFormData ? {} : {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

// Untuk DELETE data
export const deleteData = async (endpoint) => {
  const response = await axios.delete(`${BASE_URL}${endpoint}`);
  return response.data;
};
