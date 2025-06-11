import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDataPublic = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const postDataPublic = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data; // ✅ ini mengembalikan .data
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteDataPrivate = async (url) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const addPlaylistToGroup = async (groupId, playlistData) => {
  try {
    return await postDataPublic(`/api/playlist/${groupId}`, playlistData); // ✅ return DI SINI
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchPlaylistById = async (id) => {
  try {
    const response = await getDataPublic(`/api/playlist/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};
